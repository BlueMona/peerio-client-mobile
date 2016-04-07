(function () {
    'use strict';

    Peerio.UI.AddAddress = React.createClass({

        mixins: [Peerio.UI.AutoFocusMixin],

        getInitialState: function () {
            return {};
        },

        addNewAddress: function () {
            var newAddress = this.refs.textEdit.getDOMNode().value;

            if (!Peerio.Helpers.isValidEmail(newAddress)
                && !Peerio.Helpers.isValidPhone(newAddress))
                return Peerio.UI.Alert.show({text: t('error_addressFormat')});

            if (Peerio.Helpers.isValidPhone(newAddress)) {
                newAddress = Peerio.Helpers.reformatPhone(newAddress);
            }
           
            Peerio.user.validateAddress(newAddress)
                .then((response) => {
                    L.info(response);
                    // if server said address is ok to add
                    if (response) {
                        Peerio.user.addAddress(newAddress)
                            .then(() => {
                                var addAndEnter = () => {
                                    return Peerio.UI.Prompt.show({
                                            text: t('address_confirmCodePrompt'),
                                            inputType: 'numeric'
                                        })
                                        .then((code) => Peerio.user.confirmAddress(newAddress, code))
                                        .then(() => Peerio.UI.Alert.show({text: t('address_authorized')}))
                                        .then(() => {
                                            return this.props.onSuccess && this.props.onSuccess(newAddress);
                                        })
                                        .catch((error) => {
                                            L.error(error);
                                            if (error && error.code) {
                                                if (error.code === 406) {
                                                    return Peerio.UI.Confirm.show({text: t('address_conformCodeError')})
                                                        .then(() => addAndEnter());
                                                }
                                                else {
                                                    Peerio.Action.showAlert({text: t('address_addingError')});
                                                }
                                            }
                                            return Promise.reject(error);
                                        });
                                };
                                return addAndEnter()
                                    .catch((error) => {
                                        Peerio.user.removeAddress(newAddress);
                                    });
                            });
                    } else {
                        Peerio.UI.Alert.show({text: t('address_taken')});
                    }
                });
        },

        render: function () {
            return (
                <div>
                    <div className="flex-row flex-align-center">
                        <input type="text" placeholder={t('setup_emailOrPhone')} id="address"
                               ref="textEdit"/>

                        <Peerio.UI.Tappable className="btn-primary" onTap={ this.addNewAddress }>
                            {t('button_add')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());
