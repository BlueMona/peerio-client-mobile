(function () {
    'use strict';

    Peerio.UI.Settings2FA = React.createClass({
        mixins:[ReactRouter.Navigation],

        getInitialState: function() {
            return {
                code: '',
                isEnabled2FA: false,
                // used for the two step disabling 2FA process
                disable2FA: false,
                authyCode: '',
                message: ''
            };
        },

        updateFromSettings: function() {
            this.setState({ isEnabled2FA: Peerio.user.settings.twoFactorAuth, message: '' });
        },

        componentWillMount: function () {
            var self = this;
            this.updateFromSettings();
            if(!Peerio.user.settings.twoFactorAuth) this.startEnable2FA();
        },

        componentDidUpdate: function(prevProps, prevState) {
            if(!this.state.isEnabled2FA && prevState.isEnabled2FA)  {
                this.startEnable2FA();
            }
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated(this.updateFromSettings.bind(this, null))
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        onChangeAuthy: function () {
            var currentCode = this.state.authyCode;
            if( event.target.value.match(/^[0-9]*$/i) ) {
                currentCode = event.target.value;
            }

            this.setState({
                authyCode: currentCode
            });

            if(currentCode.length == 6) {
                this.state.disable2FA ?
                    this.disable2FA(currentCode) : this.enable2FA(currentCode);
            }
        },

        startEnable2FA: function() {
            (!Peerio.user.addresses || Peerio.user.addresses.length == 0)
            && Peerio.UI.Confirm.show({
                text: t('2fa_addressRequired'),
                cancelText: t('button_IUnderstand'),
                okText: t('button_addAddress')
            })
            .then(() => this.transitionTo('account_settings'))
            .catch(() => true);

            if(!this.state.isEnabled2FA) {
                /* trying to get a new code right away */
                Peerio.Net.setUp2FA().then((response) => {
                    L.info(response);
                    var secret = response.secret;
                    this.setState( { code: secret, message: '' } );
                });
            }
        },

        enable2FA: function(currentCode) {
            Peerio.Net.confirm2FA(currentCode)
            .then( (response) => {
                this.setState({message: ''});
                this.goBack();
            })
            .catch( (reject) => {
                this.setState({message: t('2fa_invalid')});
            })
            .finally( () => {
                this.setState({ authyCode: '' });
            });
        },

        disable2FA: function(currentCode) {
            Peerio.Net.validate2FA( currentCode, Peerio.user.username, Peerio.user.publicKey )
            .then( () => {
                Peerio.Net.updateSettings( { twoFactorAuth: false } ).then( () => {
                });
            })
            .catch( (reject) => {
                this.setState({message: t('2fa_invalid')});
            })
            .finally( () => {
                this.goBack();
                this.setState({ authyCode: '' });
            });
        },

        startDisable2FA: function() {
            this.setState({
                disable2FA: true,
                message: ''
            });
        },

        onCopy: function () {
            this.setState({clipboardSuccess: true});
        },

        //--- RENDER
        render: function () {
            var pasteMessage = this.state.clipboardSuccess ? t('2fa_clipboard') : t('2fa_manualCopy');

                return (
<<<<<<< HEAD
                    <div>
                        <div className="headline-md">Two Factor Authentication (2FA)</div>
=======
                    <div className="content no-scroll-hack without-tab-bar flex-col without-footer">
                        <div className="headline-md">{t('2fa')}</div>
>>>>>>> master
                        { this.state.isEnabled2FA ? (
                            <div className="buttons">
                              <Peerio.UI.Tappable element="div" className="btn-danger"
                                  onTap={this.startDisable2FA}>
                                  {t('2fa_disable')}
                              </Peerio.UI.Tappable>
                            </div>
                            ) : (
                            <div className="input-group">
                                <label htmlFor="generatedCode">
                                    {pasteMessage}
                                </label>
                                {this.state.code ? (
                                    <input className="text-center"
                                        ref="generatedCode"
                                        id="generatedCode"
                                        autoComplete="off" autoCorrect="off"
                                        autoCapitalize="off" spellCheck="false"
                                        value={this.state.code} readOnly="true"/>
                                    ) : (
                                    <div className="text-center">
                                        <i className="fa fa-circle-o-notch fa-spin"></i>
                                    </div>)}
                                    <div className="text-center">
                                        <Peerio.UI.CopyButton onCopy={this.onCopy} copy={this.state.code}/>
                                    </div>
                            </div>)} { this.state.disable2FA || !this.state.isEnabled2FA ? (
                            <div className="input-group">
                                <label htmlFor="authenticatorCode">
                                    {t('2fa_prompt')}
                                </label>
                                <input
                                    className="text-center"
                                    ref="authenticatorCode"
                                    id="authenticatorCode"
                                    autoComplete="off" autoCorrect="off"
                                    autoCapitalize="off" spellCheck="false"
                                    onChange={this.onChangeAuthy}
                                    value={this.state.authyCode}/>
                            </div>) : null }
                            <p className="caption text-red">
                                {this.state.message}
                            </p>
                    </div>
                );
        }
    });

}());
