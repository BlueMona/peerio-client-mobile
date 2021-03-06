(function () {
    'use strict';

    Peerio.UI.AccountSettings = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return this.getSettings();
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated(() => {
                    this.setState({addresses: this.getAddresses()});
                })
            ];
        },

        componentWillUnmount: function () {
            this.updateName();
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        getSettings: function () {
            return {
                newAddressText: '',
                firstName: Peerio.user.firstName,
                lastName: Peerio.user.lastName,
                addresses: this.getAddresses()
            };
        },

        getAddresses: function () {
            var addresses = [];

            if (Peerio.user.addresses) {
                addresses = _.sortBy(Peerio.user.addresses, (addr) => addr.value);
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
            var name = event.target.value;
            Peerio.Helpers.isNameValid(name) && this.setState({firstName: name});
        },

        updateLastName: function (event) {
            var name = event.target.value;
            Peerio.Helpers.isNameValid(name) && this.setState({lastName: name});
        },

        clearAddressText: function () {
            this.setState({newAddressText: ''});
        },

        removeAddress: function (address, code) {
            this.setState({confirmationDialogVisible: false});

            Peerio.UI.Confirm.show({text: t('address_removeConfirm')})
                .then(() => {
                    this.clearAddressText();
                    Peerio.user.removeAddress(address)
                        .then(() => {
                            this.setState({addresses: this.getAddresses()});
                        });
                });
        },

        setPrimaryAddress: function (address) {
            Peerio.user.setPrimaryAddress(address);
        },

        deleteAccount: function () {
            Peerio.Action.showConfirm({
                headline: t('account_deleteTitle'),
                text: t('account_deleteConfirm'),
                onAccept: function () {
                    Peerio.user.closeAccount()
                        .then(() => Peerio.User.wipeLocalData(Peerio.user.username))
                        .then(() => {
                            Peerio.Action.showAlert({
                                text: t('account_deleted'),
                                onClose: function () {
                                    Peerio.NativeAPI.signOut();
                                }
                            });
                        });
                }
            });
        },

        render: function () {
            var addressHint = this.state.addresses.length > 1 ? (
                <div className="caption">
                    {t('address_makePrimary')}
                </div>
            ) : null;
            var addressItems = this.state.addresses.map(
                (address, index) =>
                    <Peerio.UI.AccountSettingsItem key={index} id={index}
                                                   data={address}
                                                   removeAddress={ this.removeAddress }
                                                   setPrimaryAddress={ this.setPrimaryAddress }/>);

            return (
                <div>
                    <div className="content without-tab-bar without-footer">
                        <div className="headline">{t('profile')}</div>
                        <div className="flex-col flex-justify-center">
                            <div className="input-group">
                                <label htmlFor="first-name">{t('firstName')}</label>
                                <input id="first-name"
                                       type="text"
                                       required="required"
                                       value={ this.state.firstName }
                                       onChange={ this.updateFirstName }
                                       onBlur={ this.updateFirstName }
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="last-name">{t('lastName')}</label>
                                <input id="last-name"
                                       type="text"
                                       required="required"
                                       value={ this.state.lastName }
                                       onChange={ this.updateLastName }
                                       onBlur={ this.updateLastName }
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="address">{t('addresses')}</label>
                                {addressHint}
                                {addressItems}
                                <Peerio.UI.AddAddress ref="addAddress"/>
                                <div className="caption">{t('address_phoneInvalid')}</div>
                            </div>
                            <div className="input-group">
                                <div className="info-label">{t('yourPublicKey')}</div>
                                <span className="text-mono col-8 col-first">{ Peerio.user.publicKey }</span>
                            </div>
                            <div className="buttons">
                                <Peerio.UI.Tappable className="btn-danger" onTap={ this.deleteAccount }>
                                    {t('button_deleteAccount')}
                                </Peerio.UI.Tappable>
                            </div>

                        </div>
                    </div>
                    <RouteHandler/>
                    <Peerio.UI.EnterConfirm
                        onPrompt={ this.confirmAddress }
                        onCancel={ this.removeAddress }
                        address={ this.state.newAddressText }
                        visible={ this.state.confirmationDialogVisible }/>
                </div>
            );
        }
    });

}());
