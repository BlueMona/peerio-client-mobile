(function () {
    'use strict';

    Peerio.UI.AccountSettings = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return this.getSettings(); 
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated(() => {
                    this.setState( { addresses: this.getAddresses() } );
                }),
//                Peerio.Dispatcher.onTwoFactorAuthReject( this.resetSettings.bind(this) ),
                Peerio.Dispatcher.onTwoFactorAuthRequested(this.handle2FA),
                Peerio.Dispatcher.onTwoFactorAuthResend(this.handle2FAResend)

            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        handle2FA: function(resolve, reject) {
            this.resolve2FA = resolve;
            this.reject2FA = reject;
            L.info('2fa requested');
            this.transitionTo('account_settings_2fa_prompt');
        },

        handle2FAResend: function() {
            L.info('2fa resend requested');
            this.resolve2FA('succesfully entered 2fa code');
        },


        getSettings: function() {
            return {
                newAddressText: '',
                firstName: Peerio.user.firstName,
                lastName: Peerio.user.lastName,
                addresses: this.getAddresses()
            };
        },

        getAddresses: function () {
            var addresses = [];

            if (Peerio.user.settings.addresses) {
                for (i of Peerio.user.settings.addresses) {
                    if (i) {
                        i.isPrimary ? addresses.unshift(i) : addresses.push(i);
                    }
                }
            }
            return addresses;
        },
        updateName: function () {
            this.doUpdateName = this.doUpdateName || _.throttle(function () {
                    return Peerio.user.setName(this.state.firstName, this.state.lastName);
                }, 1000);
            this.doUpdateName();
        },

        updateFirstName: function (event) {
            this.setState({firstName: event.target.value});
            this.updateName();
        },

        updateLastName: function (event) {
            this.setState({lastName: event.target.value});
            this.updateName();
        },

        onAddressChange: function (event) {
            this.setState({newAddressText: event.target.value});
        },

        clearAddressText: function() {
            this.setState({newAddressText: ''});
        },

        confirmAddress: function (address, code) {
            var self = this;
            this.clearAddressText();
            Peerio.user.confirmAddress(address, code)
                .then(() => {
                    self.setState({addresses: self.getAddresses()});
                    Peerio.Action.showAlert({text: 'Address authorized'});
                })
                .catch(() => {
                    Peerio.Action.showAlert({text: 'Error authorizing address'});
                    this.removeAddress(address, code);
                });
        },

        removeAddress: function (address, code) {
            var self = this;
            this.clearAddressText();
            Peerio.user.removeAddress(address)
                .then(() => {
                    self.setState({addresses: self.getAddresses()});
                    // prevent alert from showing when prompt is used as cancel
                    if(!code) Peerio.Action.showAlert({text: 'Address removed'});
                });
        },

        setPrimaryAddress: function (address) {
            Peerio.user.setPrimaryAddress(address);
        },
        
        confirm2FA: function(address) {
            this.setState({newAddressText: address});
            this.addNewAddress(true);
        },

        addNewAddress: function (skip2FA) {
            //TODO: valid email or phone number.
            var newAddress = this.state.newAddressText;
            var emailRegex = new RegExp(/^([\w+-]+(?:\.[\w+-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
            var phoneRegex = new RegExp(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/i);
            var self = this;
            if (emailRegex.test(newAddress) || phoneRegex.test(newAddress)) {
                if(!skip2FA && Peerio.user.settings.twoFactorAuth) {
                    return this.transitionTo('/app/settings/account/2fa');
                }
                Peerio.user.validateAddress(newAddress)
                    .then((response) => {
                        response ?
                        Peerio.user.addAddress(newAddress).then(function () {
                            self.setState({addresses: self.getAddresses()});
                            self.transitionTo('enter_confirm');
                        }) 
                        :  Peerio.Action.showAlert({text: 'Sorry, that address is already taken'});
                    });
            } else {
                Peerio.Action.showAlert({text: 'Sorry, that doesn\'t look like a valid email or phone number.'});
            }

        },

        deleteAccount: function () {
            Peerio.Action.showConfirm({
                headline: 'Delete account',
                text: 'Are you sure you want to delete account?',
                onAccept: function () {
                    Peerio.user.closeAccount().then(function () {
                        Peerio.Action.showAlert({
                            text: 'Account deleted. Signing out.',
                            onClose: function (code) {
                                Peerio.NativeAPI.signOut();
                            }
                        });
                    });
                }
            });
        },

        render: function () {
            var deleteAccountStyle = { 'margin-top': '2em'};
            return (
                <div>
                <div className="without-tab-bar content-padded rectangular flex-col">
                    <div className="flex-col-1">
                        <div className="text-input-group">
                            <label className="text-input-label" htmlFor="first-name">First Name</label>
                            <input className="text-input"
                                   id="first-name"
                                   type="text"
                                   required="required"
                                   value={this.state.firstName}
                                   onChange={this.updateFirstName}
                                   onBlur={this.updateFirstName}
                            />
                        </div>
                        <div className="text-input-group">
                            <label className="text-input-label rectangular" htmlFor="first-name">Last Name</label>
                            <input className="text-input rectangular"
                                   id="last-name"
                                   type="text"
                                   required="required"
                                   value={this.state.lastName}
                                   onChange={this.updateLastName}
                                   onBlur={this.updateLastName}
                            />
                        </div>
                        <div className="text-input-group">
                            <div className="info-label">Addresses</div>
                            <div className="col-8">&nbsp;</div>
                            <div className="subhead-inline col-2">primary</div>
                            <div className="subhead-inline col-2">remove</div>
                            { this.state.addresses.map((address, index) =>
                        <Peerio.UI.AccountSettingsItem key={index} id={index}
                                                       data={address}
                                                       removeAddress={this.removeAddress}
                                                       setPrimaryAddress={this.setPrimaryAddress}/>) }
                            <div>
                                <div className="col-8">
                                    <input type="text" className="text-input" placeholder="add phone or email"
                                           onChange={this.onAddressChange} value={this.state.newAddressText}/>
                                </div>
                                <div className="col-4 text-center">
                                    <Peerio.UI.Tappable className="btn-sm" onTap={this.addNewAddress}>
                                        add
                                    </Peerio.UI.Tappable>
                                </div>
                            </div>
                        </div>
                        <div className="text-input-group">
                            <div className="info-label">Your public key:</div>
                            <span className="text-mono">{Peerio.user.publicKey}</span>
                        </div>
                        <div className="text-input-group">
                            <div className="info-label">Delete your account</div>
                            <Peerio.UI.Tappable className="btn-link btn-danger" onTap={this.deleteAccount}>delete your
                                account</Peerio.UI.Tappable>
                        </div>
                    </div>
                </div>
                <RouteHandler/>
                </div>
            );
        }
    });

}());
