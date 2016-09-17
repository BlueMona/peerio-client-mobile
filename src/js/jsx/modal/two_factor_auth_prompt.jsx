(function () {
    'use strict';

    Peerio.UI.TwoFactorAuthPrompt = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return {
                authyCode: '',
                message: ''
            };
        },

        focusInput: function () {
            var element = React.findDOMNode(this.refs.authenticatorCode);
            element.focus();
        },

        componentWillMount: function () {
        },

        componentWillUnmount: function () {
            this.rejectOnUnmount && Peerio.Action.twoFactorAuthReject();
        },

        componentDidUpdate: function (prevProps, prevState) {
            this.focusInput();
        },

        componentDidMount: function () {
            this.rejectOnUnmount = true;
            this.focusInput();
        },

        componentDidUnmount: function () {
            Peerio.NativeAPI.hideKeyboard();
        },

        onChangeAuthy: function () {
            var currentCode = this.state.authyCode;
            if (event.target.value.match(/^[0-9]*$/i)) {
                currentCode = event.target.value;
            }

            this.setState({
                authyCode: currentCode
            });

            if (currentCode.length == 6) {
                Peerio.Net.validate2FA(currentCode, Peerio.user.username, Peerio.user.publicKey)
                    .then(() => {
                        this.rejectOnUnmount = false;
                        Peerio.Action.twoFactorAuthResend();
                        this.removeDialog();
                    })
                    .catch(() => {
                        this.setState({
                            authyCode: '',
                            message: t('2fa_invalid')
                        });
                    });
            }
        },

        removeDialog: function () {
            Peerio.Action.twoFactorAuthReject();
            this.goBack();
        },

        //--- RENDER
        render: function () {
            return (
                <div className="content-inline-dialog no-scroll-hack">
                    <div className="headline-md">{t('2fa_protectedOperation')}</div>
                    <div>
                        <div>
                            <p>

                            </p>
                            <div className="input-group">
                                <input
                                    className="txt-lrg text-center"
                                    ref="authenticatorCode"
                                    autoComplete="off" autoCorrect="off"
                                    autoCapitalize="off" spellCheck="false"
                                    onChange={this.onChangeAuthy}
                                    value={this.state.authyCode}/>
                            </div>
                        </div>
                        <p className="caption">
                            {this.state.message}
                        </p>
                        <div className="buttons">
                            <Peerio.UI.Tappable element="div" className="btn-danger"
                                                onTap={this.removeDialog}>
                                {t('button_cancel')}
                            </Peerio.UI.Tappable>
                        </div>
                    </div>
                </div>
            );
        }
    });

}());
