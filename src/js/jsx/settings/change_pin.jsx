(function () {
    'use strict';

    Peerio.UI.ChangePin = React.createClass({
        mixins: [Peerio.Navigation],

        componentDidMount: function () {
            Peerio.Auth.hasPinnedPassphrase(Peerio.user.username)
                .then(val => {
                    this.setState({ available: val });
                });
        },

        getInitialState: function () {
            return {
                available: false,
                inProgress: false
            };
        },

        askPin: function () {
            Peerio.Action.askPin({
                onEnterPin: this.confirmPin,
                showExitTitle: t('button_back'),
                title: t('passphrase_enterpin'),
                hideTouchID: true,
                hideChangeUser: true
            });
        },

        askNewPin: function () {
            Peerio.Action.askPin({
                onEnterPin: this.enterNewPin,
                showExitTitle: t('button_back'),
                title: t('passphrase_enternewpin'),
                hideTouchID: true,
                hideChangeUser: true
            });
        },

        askNewPinConfirm: function () {
            Peerio.Action.askPin({
                onEnterPin: this.enterNewPinConfirm,
                showExitTitle: t('button_back'),
                title: t('passphrase_confirmnewpin'),
                hideTouchID: true,
                hideChangeUser: true
            });
        },


        confirmPin: function (pin, onClose) {
            onClose();
            Peerio.Auth.getSavedKeys(Peerio.user.username, pin)
                .then(k => {
                    if (k === true ) throw "pin is wrong";
                    if (!k.isCustomKey) {
                        Peerio.UI.Alert.show({ text: t('passphrase_notset')});
                    } else {
                        this.passphrase = k.secretKey;
                        this.askNewPin();
                    }
                })
                .catch(e => {
                    L.error(e);
                    Peerio.UI.Alert.show({ text: t('passphrase_wrongpin')});
                });
        },

        enterNewPin: function (pin, onClose) {
            onClose();
            this.pin = pin;
            this.askNewPinConfirm();
        },

        enterNewPinConfirm: function (pin, onClose) {
            onClose();
            if (pin !== this.pin) {
                Peerio.UI.Alert.show({ text: t('passphrase_wrongpin')});
                return;
            }

            Peerio.UI.Alert.show({ text: t('success')});

            Peerio.Auth.savePinnedPassphrase(Peerio.user.username, pin, this.passphrase)
                .then(this.handleNextStep);
        },

        //--- RENDER
        render: function () {
            var pinUI = '';
            var header = !!this.props.hideHeader ? null : (
                <div className="headline-md">{t('peerioPINForThisDevice')}</div>
            );

            var ui =
                <div className="buttons">
                    <Peerio.UI.Tappable
                        element="div"
                        className="btn-danger"
                        onTap={this.askPin}>{t('enterNewPIN')}</Peerio.UI.Tappable>
                </div>;

            ui = this.state.askPin ? askPinUI : ui;

            var control = this.state.available ? (
                <div>
                    {header}
                    <div>
                        {ui}
                    </div>
                </div>
            ) : null;

            return control;
        }
    });
}());
