/**
 * Login Screen Component
 *
 */
(function () {
  'use strict';

  Peerio.UI.Login = React.createClass({
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
        loginProgressMsg: ''
      };
    },
    componentWillMount: function () {
      Peerio.Dispatcher.onLoginSuccess(this.handleLoginSuccess);
      Peerio.Dispatcher.onLoginFail(this.handleLoginFail);
      //Peerio.Data.getLastLogin()
      //  .then(function (login, name) {
      //   this.setState({savedLogin: login});
      // }.bind(this)).catch(function () {
      //   this.setState({savedLogin: null});
      // }.bind(this));
    },
    componentWillUnmount: function () {
      Peerio.Dispatcher.unsubscribe(this.handleLoginProgress, this.handleLoginDone);
    },
    //--- CUSTOM FN
    progressMessages: [
      'greeting server...',
      'securing bits...',
      'checking bytes...',
      'hiding tracks...',
      'moving keys...',
      'increasing entropy...',
      'adding awesomeness...',
      'scaring NSA away...',
      'inventing algorithms...',
      'reading ciphertext...',
      'settling checksums...',
      'warming up...',
      'cooling down...'],
    updateProgressMessage: function () {
      var ind = Math.floor(Math.random() * this.progressMessages.length);
      this.setState({loginProgressMsg: this.progressMessages[ind]});
    },
    startProgress: function(){
      this.progressInterval = window.setInterval(this.updateProgressMessage, 1000);
    },
    stopProgress: function(){
      window.clearInterval(this.progressInterval);
    },
    handleLoginSuccess: function () {
      Peerio.Auth.saveLogin(Peerio.user.username, Peerio.user.firstName);
      this.stopProgress();
      //todo route
      console.log('success');
    },
    handleLoginFail: function (message) {
      this.stopProgress();
      this.setState({loginError: message||'Login failed.', waitingForLogin: false, loginProgressMsg: ''});
      console.log('fail');
    },
    // show/hide passphrase
    handlePassphraseShowTap: function (e) {
      this.setState({passphraseVisible: !this.state.passphraseVisible}, function () {
        var node = this.refs.passphrase.getDOMNode();
        if (!this.state.passphraseVisible) node.style.fontSize = '';
        this.handlePassphraseChange();
      });
      e.preventDefault();
    },
    // scale passphrase font
    handlePassphraseChange: function () {
      if (!this.state.passphraseVisible) return;

      var element = this.refs.passphrase.getDOMNode();
      var width = element.offsetWidth;
      element.style.fontSize = Math.max(
          Math.min(width / (element.value.length * this.factor), this.maxFontSize),
          this.minFontSize) + 'rem';
    },
    // initiate login
    handleSubmit: function (e) {
      if (e) e.preventDefault();

      if (this.state.waitingForLogin) return;
      this.setState({waitingForLogin: true});
      this.startProgress();
      // getting login from input or from previously saved data
      var userNode;
      if (this.state.savedLogin) {
        userNode = {value: this.state.savedLogin.login};
      } else {
        userNode = this.refs.username.getDOMNode();
        userNode.blur();
      }

      // getting passphrase
      var passNode = this.refs.passphrase.getDOMNode();
      passNode.blur();
      // hiding software keyboard
      Peerio.NativeAPI.hideKeyboard();
      // TODO validate input
      Peerio.Auth.login(userNode.value, passNode.value);
    },
    // change focus to passphrase input on enter
    handleKeyDownLogin: function (e) {
      if (e.key === 'Enter') {
        this.refs.passphrase.getDOMNode().focus();
        e.preventDefault();
      }
    },
    // submit form on enter
    handleKeyDownPass: function (e) {
      if (e.key === 'Enter') this.handleSubmit();
    },
    // close error alert
    handleAlertClose: function () {
      this.setState({loginError: false});
    },
    clearLogin: function () {
      this.setState({savedLogin: null});
      Peerio.Auth.clearSavedLogin();
    },
    //--- RENDER
    render: function () {
      var eyeIcon = 'fa-' + (this.state.passphraseVisible ? 'eye-slash' : 'eye');
      var debugUserName = window.PeerioDebug ? window.PeerioDebug.user : '';
      var debugPassword = window.PeerioDebug ? window.PeerioDebug.pass : '';
      var passInputType = this.state.passphraseVisible ? 'text' : 'password';

      return (
        <div id="login-screen" className="modal active">

          <Peerio.UI.Alert visible={!!this.state.loginError} onClose={this.handleAlertClose}>
            {this.state.loginError}
          </Peerio.UI.Alert>

          <div id="login-container">
            <div className="app-version">Peerio version: {Peerio.NativeAPI.getAppVersion()}</div>
            <img className="logo" src="media/img/peerio-logo-white.png" alt="Peerio"/>

            <form className="loginForm" onSubmit={this.handleSubmit}>
              {this.state.savedLogin
                ?
                (<div className="saved-login"
                      onTouchEnd={this.clearLogin}>{this.state.savedLogin.name || this.state.savedLogin.login}
                  <div className="note">Welcome back.
                    <br/>
                    Tap here to change or forget username.
                  </div>
                </div>)
                :
                (<div className="slim-input">
                  <input defaultValue={debugUserName} id="username" ref="username"
                         onKeyDown={this.handleKeyDownLogin} type="text" maxLength="16"
                         autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>

                  <div>
                    <label htmlFor="username">username</label>
                  </div>
                </div>)
              }
              <div id="passphrase-input" className="slim-input">
                <div>
                  <input defaultValue={debugPassword} id="password" ref="passphrase" key="passphrase"
                         type={passInputType} onChange={this.handlePassphraseChange} onKeyDown={this.handleKeyDownPass}
                         maxLength="256" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"/>
                  <label htmlFor="password">passphrase or pin</label>
                  <i onTouchEnd={this.handlePassphraseShowTap} className={'pull-right fa ' + eyeIcon}></i>
                </div>
              </div>
              <div id="login-process-state">{this.state.loginProgressMsg}</div>
              <button type="submit" ref="loginBtn" className="login-btn" onTouchEnd={this.handleSubmit}>
                {this.state.waitingForLogin ? <i className="fa fa-circle-o-notch fa-spin"></i> : 'login'}
              </button>
              <button type="button" className="signup-btn">sign up</button>
            </form>
          </div>
        </div>
      );
    }
  });

}());
