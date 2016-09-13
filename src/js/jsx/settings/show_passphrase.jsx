(function () {
    'use strict';

    Peerio.UI.ShowPassphrase = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return {
            };
        },

        askPin: function () {
            Peerio.Action.askPin({
                onEnterPin: this.showPassphrase,
                showExitTitle: t('button_back'),
                title: t('passphrase_enterpin'),
                hideNormalFooter: true
            });
        },

        showPassphrase: function (pin, onClose) {
            onClose();
            Peerio.Auth.getSavedKeys(Peerio.user.username, pin)
                .then(k => {
                    if (k === true ) throw "pin is wrong";
                    if (!k.isCustomKey) {
                        Peerio.UI.Alert.show({ text: t('passphrase_notset')});
                    } else {
                        Peerio.UI.Alert.show({ text: k.secretKey });
                    }
                })
                .catch(e => {
                    L.error(e);
                    Peerio.UI.Alert.show({ text: t('passphrase_wrongpin')});
                });
        },

        //--- RENDER
        render: function () {
            var pinUI = '';
            var header = !!this.props.hideHeader ? null : (
                <div className="headline-md">{t('passphrase_show_title')}</div>
            );

            var ui =
                <div className="buttons">
                    <Peerio.UI.Tappable
                        element="div"
                        className="btn-danger"
                        onTap={this.askPin}>{t('passphrase_show')}</Peerio.UI.Tappable>
                </div>;

            ui = this.state.askPin ? askPinUI : ui;

            return (
                <div>
                    {header}
                    <div>
                        {ui}
                    </div>
                </div>

            );
        }
    });

}());

