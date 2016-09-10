(function () {
    'use strict';

    Peerio.UI.SignupWizardPin = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return this.props.data && this.props.data.pass
            || {
                confirm: false
            };
        },

        componentWillMount: function () {
            this.generatePassphrase();
        },

        wordCount: 5,

        generatePassphrase: function () {
            Peerio.DataCollection.Signup.generatePassphrase();
            Peerio.PhraseGenerator.getPassPhrase(
                Peerio.Translator.locale, this.wordCount)
                    .then(function (phrase) {
                        this.setState({passphrase: phrase});
                    }.bind(this));
        },

        createPin: function (pin) {
            if(!Peerio.Util.pinEntropyCheck(pin))
                window.setTimeout(() => this.refs.createPin.handleLoginFail(t('passcode_simple')), 0);
            else
                this.setState({ confirm: true, pin: pin });
        },

        confirmPin: function (pin) {
            if(this.state.pin != pin)
                window.setTimeout(() => this.refs.confirmPin.handleLoginFail(t('passcode_tryagain')), 0);
            else {
                var username = this.props.data ? this.props.data.name.username : Peerio.user.username;
                var passphrase = Peerio.user.passphrase || this.state.passphrase;
                Peerio.Auth.savePinnedPassphrase(username, this.state.pin, passphrase)
                .then(this.handleNextStep);
            }
        },

        tryAgain: function () {
            this.setState({ confirm: false, pin: undefined });
        },

        exit: function () {
            this.props.handlePreviousStep && this.props.handlePreviousStep();
        },

        handleNextStep: function () {
            this.props.onClose && this.props.onClose();
            this.props.handleNextStep && this.props.handleNextStep({pass: this.state, signup: true});
        },

        render: function () {
            var enterPin = this.state.confirm ? 
                <Peerio.UI.PinInput
                    ref="confirmPin"
                    onEnterPin={this.confirmPin}
                    onExit={this.tryAgain}
                    hideNormalFooter={true}
                    showExitTitle={t('button_back')}
                    key="confirm"
                    title={t('passcode_confirm')} /> :
                <Peerio.UI.PinInput
                    ref="createPin"
                    onEnterPin={this.createPin}
                    onExit={this.exit}
                    hideNormalFooter={true}
                    showExitTitle={t('button_back')}
                    key="enter"
                    title={t('passcode_enter')} />;
            return (
                <fieldset key={'signup-step-pin'}>
                    {enterPin}
                </fieldset>);
        }
    });
}());

