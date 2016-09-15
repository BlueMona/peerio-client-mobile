/**
 * Login Screen Component
 *
 */
(function () {
    'use strict';

    Peerio.UI.Login = React.createClass({
        mixins: [Peerio.Navigation],
        //--- CONSTANTS
        // scalable passphrase font settings
        maxFontSize: 2,
        minFontSize: 1.3,
        // font scaling factor
        factor: 8,
        //--- REACT EVENTS
        getInitialState: function () {
            return {
                passphraseVisible: false,
                waitingForLogin: false,
                loginError: false,
                isPin: false,
                username: window.PeerioDebug ? window.PeerioDebug.user : ''
            };
        },
        componentWillMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onPause(this.cleanPassphrase)];
            // self-unsubscribing handler
            Peerio.Dispatcher.onAuthenticated(this.postAuth);

            if (!Peerio.autoLogin) {
                Peerio.Auth.getSavedLogin()
                    .then((data) => {
                        Peerio.TinyDB.getItem('prevent_saved_login')
                            .then(prevent => {
                                if (prevent) return true;
                                this.setState({savedLogin: data});
                                this.invokeTouchID(data);
                                data && data.username && Peerio.Auth.getPinForUser(data.username)
                                    .then((pin) => {
                                        this.setState({isPin: !!pin});
                                    });
                            })
                            .finally(() => Peerio.TinyDB.removeItem('prevent_saved_login'));
                    });
            }
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        componentDidMount: function () {
            // we assume that autoLogin was set by
            // signup function. we want to show setup wizard
            // if it is true
            this.nextRoute = Peerio.autoLogin ? 'setup_wizard' : 'messages';
            this.enableDataOptIn = !!(Peerio.autoLogin && Peerio.DataCollection.isEnabled());
            this.trackSuccessfulSignup = !!Peerio.autoLogin;
            if (Peerio.autoLogin) {
                var autoLogin = Peerio.autoLogin;
                // clean autologin in tabs
                this.refs.username.getDOMNode().value = autoLogin.username;
                this.refs.passphrase.getDOMNode().value = autoLogin.passphrase;
                this.handleSubmit();
            }
        },

        cleanPassphrase: function () {
            this.refs.passphrase.getDOMNode().value = '';
        },

        postAuth: function () {
            Peerio.Dispatcher.unsubscribe(this.postAuth);

            Peerio.NativeAPI.enablePushNotifications()
                .catch(error => L.error('Error enabling push notifications. {0}', error))
                .finally(() => Peerio.NativeAPI.clearPushBadge());

            this.enableDataOptIn && Peerio.user.enableDataCollection(this.enableDataOptIn)
                .then(() => {
                    this.trackSuccessfulSignup && Peerio.DataCollection.Signup.successfulSignup();
                });

            Peerio.DataCollection.flushDelayedTracking();

            Peerio.NativeAPI.getCountryCode().then((code) => {
                Peerio.DataCollection.trackCountry(code);
            });
        },

        handleLoginSuccess: function () {
            if(!Peerio.user.PINIsSet && this.afterLogin) {
                Peerio.user.passphrase = this.afterLogin;
                Peerio.TinyDB.getItem('skipPin', Peerio.user.username)
                    .then(val =>
                          !val && Peerio.Action.forcePin());
            }
            Peerio.user.isMe = true;
            Peerio.Auth.saveLogin(Peerio.user.username, Peerio.user.firstName);

            Peerio.Helpers.checkFileSystemEncryption();

            this.transitionTo(this.nextRoute);
        },

        handleLoginFail: function (error, systemPin) {
            this.setState({waitingForLogin: false});

            // if the account was deleted

            if (error && error.code === 488) {
                Peerio.User.wipeLocalData(Peerio.user.username);
                error.message = t('error_accountDeleted');
            }

            // if we got a 2FA request
            if (error && error.code === 424) {
                console.log('Handling 2FA');
                return;
            }

            if (error && error.code === 411) {
                // probably user touch id pin is corrupted
                if (systemPin) {
                    L.error('Login failed. It seems your Peerio TouchID is corrupted.');
                    // TODO: we expect Peerio.user.username to have meaningful value
                    Peerio.user && Peerio.user.username &&
                    Peerio.UI.TouchId.clearKeyPair();
                }
            }

            if (error && error.code === 404) {
                // should override it as "bad credentials"
                // maybe this should be done at server side
                error.message = t('error_badCredentials');

            }

            // maybe user entered wrong pin, so allow him
            // to enter a passphrase

            if (this.state.isPin) {
                return this.refs.pin.handleLoginFail();
            }
            // this.setState( { isPin: false } );
            var msg = '';
            if (error) {
                if (is.string(error)) msg = error;
                else if (error.message) msg = error.message;
            }
            Peerio.Action.showAlert({text: t('error_loginFailed') + ' ' + msg});
        },
        // show/hide passphrase
        handlePassphraseShowTap: function () {
            this.setState({passphraseVisible: !this.state.passphraseVisible}, function () {
                var node = this.refs.passphrase.getDOMNode();
                if (!this.state.passphraseVisible) node.style.fontSize = '';
                this.handlePassphraseChange();
            });
        },
        // scale passphrase font
        handlePassphraseChange: function () {
            Peerio.DataCollection.startTimePoint('login_enter_passphrase');
            if (!this.state.passphraseVisible) return;

            var element = this.refs.passphrase.getDOMNode();
            var width = element.offsetWidth;
            element.style.fontSize = Math.max(
                    Math.min(width / (element.value.length * this.factor), this.maxFontSize),
                    this.minFontSize) + 'rem';
        },

        invokeTouchID: function (data) {
            data && data.username && Peerio.UI.TouchId.hasTouchID(data.username)
                .then((hasTouchID) => {
                    if (hasTouchID) {
                        Peerio.UI.TouchId.getSystemPin(data.username)
                            .then((systemPin) => {
                                this.setState({isPin: false});
                                this.handleSubmit(null, null, systemPin);
                            });
                    }
                });
        },

        handlePinChangeUser: function () {
            this.setState({isPin: false}, () => {
                this.setState({savedLogin: null});
            });
        },

        handlePinTouchID: function () {
            this.invokeTouchID(this.state.savedLogin);
        },

        handlePinEnter: function (pin) {
            // this.setState( { isPin: false } );
            this.handleSubmit(null, pin);
        },

        // initiate login
        handleSubmit: function (e, passOrPin, systemPin) {
            Peerio.DataCollection.endTimePoint('login_enter_passphrase');
            if (e) e.preventDefault();

            if (this.state.waitingForLogin) return;

            // getting username, if not provided
            var userNode = this.refs.username ? this.refs.username.getDOMNode() : null;
            userNode && userNode.blur();
            // getting passphrase, if not provided in the args
            var passNode = this.refs.passphrase ? this.refs.passphrase.getDOMNode() : null;
            passNode && passNode.blur();

            if (passNode && passNode.value) {
                this.afterLogin = passNode.value;
            }

            var userValue = userNode ? userNode.value : this.state.savedLogin.username;
            var passValue = passNode ? passNode.value : passOrPin;
            passValue = systemPin ? systemPin : passValue;
            // hiding software keyboard
            Peerio.NativeAPI.hideKeyboard();

            // if username is empty, show user an alert
            if (!userValue || !userValue.length) {
                Peerio.UI.Alert.show({text: t('error_emptyUsername')});
                return;
            }

            userValue = userValue.toLowerCase();

            Peerio.user = Peerio.User.create(userValue);
            Peerio.NativeAPI.preventSleep();

            this.setState({waitingForLogin: true});
            Peerio.user.login(passValue, !!systemPin)
                .then(this.handleLoginSuccess)
                .catch(error => {
                    this.handleLoginFail(error, systemPin);
                })
                .finally(Peerio.NativeAPI.allowSleep);
        },
        // change focus to passphrase input on enter
        handleKeyDownLogin: function (e) {
            if (e.key === 'Enter') {
                this.refs.passphrase.getDOMNode().focus();
                e.preventDefault();
            }
        },

        // change focus to passphrase input on enter
        handleUsernameChange: function (e) {
            var value = this.refs.username.getDOMNode().value;
            (!value || Peerio.Helpers.isValidUsername(value)) && this.setState({username: value.toLowerCase()});
        },

        // submit form on enter
        handleKeyDownPass: function (e) {
            if (e.key === 'Enter') this.handleSubmit();
        },
        clearLogin: function () {
            this.setState({savedLogin: null});
            Peerio.Auth.clearSavedLogin();
        },
        changeLocale: function (event) {
            Peerio.Translator.loadLocale(event.target.value);
        },
        //--- RENDER
        render: function () {
            var eyeIcon = this.state.passphraseVisible ? 'visibility_off' : 'visibility';
            var debugPassword = window.PeerioDebug ? window.PeerioDebug.pass : '';
            var passInputType = this.state.passphraseVisible ? 'text' : 'password';

            var passInput = /* !window.PeerioDebug && */ this.state.isPin ? (
                <Peerio.UI.PinInput
                    ref="pin"
                    username={this.state.savedLogin.username}
                    firstname={this.state.savedLogin.firstName}
                    onEnterPin={this.handlePinEnter}
                    onChangeUser={this.handlePinChangeUser}
                    onTouchID={this.handlePinTouchID}
                />
            ) : (
                <Peerio.UI.PasswordInput
                    id="password"
                    ref="passphrase"
                    key="passphrase"
                    type={passInputType}
                    defaultValue={debugPassword}
                    onChange={this.handlePassphraseChange}
                    onKeyDown={this.handleKeyDownPass}
                />
            );

            return (
                <div>
                    <RouteHandler manual={true}/>
                    <div className="page-wrapper-login">

                        <div className="content-wrapper-login">
                            <div className="app-version">{t('version')}: {Peerio.runtime.version}</div>
                            <img className="logo" src="media/img/peerio-logo-white.png" alt="Peerio"
                                 onTouchEnd={devmode.summon}/>

                            <form className="loginForm" onSubmit={this.handleSubmit}>
                                {this.state.savedLogin
                                    ?
                                    (<Peerio.UI.Tappable ref="savedLogin" element="div" className="saved-login"
                                                         onTap={this.clearLogin}>
                                        <div className="headline-md text-overflow">{t('login_welcomeBack')}
                                            <strong> {this.state.savedLogin.firstName || this.state.savedLogin.username}</strong>
                                        </div>

                                        <div className="caption">{t('login_forgetUsername')}</div>
                                    </Peerio.UI.Tappable>)
                                    :
                                    (<div className="login-input">
                                        <div className="input-group">
                                            <label htmlFor="username">{t('username')}</label>
                                            <input value={this.state.username}
                                                   id="username" ref="username"
                                                   type="text" maxLength="16"
                                                   className="lowercase"
                                                   autoComplete="off"
                                                   autoCorrect="off"
                                                   autoCapitalize="off"
                                                   spellCheck="false"
                                                   onKeyDown={this.handleKeyDownLogin}
                                                   onChange={this.handleUsernameChange}
                                            />
                                        </div>
                                    </div>)
                                }
                                <div className="login-input">
                                    <div className="input-group">
                                        <label htmlFor="password">
                                            {this.state.isPin ? t('passcode') : t('login_passphraseOrPasscode')}
                                        </label>
                                        <div className="input-control">
                                            {passInput}
                                            <Peerio.UI.Tappable onTap={this.handlePassphraseShowTap} element="i"
                                                                className='flex-shrink-0 material-icons'> {eyeIcon}
                                            </Peerio.UI.Tappable>
                                        </div>
                                    </div>
                                </div>
                                <div id="login-process-state">
                                    <Peerio.UI.TalkativeProgress
                                        enabled={this.state.waitingForLogin}/>
                                </div>
                                <div className="buttons">
                                    <Peerio.UI.Tappable element="div" ref="loginBtn" className="btn-safe"
                                                        onTap={this.handleSubmit}>
                                        {this.state.waitingForLogin ?
                                            <i className="fa fa-circle-o-notch fa-spin"></i> : t('login_loginButton')}
                                    </Peerio.UI.Tappable>

                                    {this.state.waitingForLogin
                                        ? null
                                        : (<Peerio.UI.Tappable element="div" className="btn-primary"
                                                               onTap={this.transitionTo.bind(this,'signup')}>
                                        {t('login_signUpButton')}
                                    </Peerio.UI.Tappable>)}

                                    <Peerio.UI.LanguageSelect />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    });

}());
