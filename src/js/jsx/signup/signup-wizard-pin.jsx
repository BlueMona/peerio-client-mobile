(function () {
    'use strict';

    Peerio.UI.SignupWizardPin = React.createClass({
        getInitialState: function () {
            return this.props.data && this.props.data.pass
            || {
                confirm: false
            };
        },

        componentWillMount: function () {
            this.generatePassphrase();
        },

        componentDidMount: function () {
            this.askNewPin();
        },

        skip: function () {
            Peerio.TinyDB.saveItem('skipPin', true, Peerio.user.username);
        },

        askNewPin: function () {
            Peerio.Action.askPin({
                onConfirmPin: this.enterNewPinConfirm,
                onExit: this.props.skippable ? this.skip.bind(this) : null,
                showExitTitle: this.props.skippable ? t('skip') : t('button_back'),
                title: t('passphrase_enternewpin'),
                confirmTitle: t('passphrase_confirmnewpin'),
                errorTitle: t('passcode_tryagain'),
                hideTouchID: true,
                hideChangeUser: true,
                confirm: true,
                entropyCheck: true
            });
        },

        enterNewPinConfirm: function (pin, onClose) {
            var username = this.props.data ? this.props.data.name.username : Peerio.user.username;
            var passphrase = (Peerio.user && Peerio.user.passphrase) || this.state.passphrase;
            Peerio.Auth.savePinnedPassphrase(username, pin, passphrase)
                .then(onClose)
                .then(this.handleNextStep);
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

        exit: function () {
            this.props.handlePreviousStep && this.props.handlePreviousStep();
        },

        handleNextStep: function () {
            this.props.onClose && this.props.onClose();
            this.props.handleNextStep && this.props.handleNextStep({pass: this.state, signup: true});
        },

        handlePreviousStep: function () {
            this.props.handlePreviousStep && this.props.handlePreviousStep();
        },

        render: function () {
            return (
                <fieldset key={'signup-step-pin'}>
                </fieldset>);
        }
    });
}());

