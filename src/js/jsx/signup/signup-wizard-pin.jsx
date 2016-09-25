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
                onEnterPin: this.enterNewPin,
                onExit: this.props.skippable ? this.skip.bind(this) : null,
                showExitTitle: this.props.skippable ? t('skip') : t('button_back'),
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

        enterNewPin: function (pin, onClose, onError) {
            onClose();
            this.pin = pin;
            this.askNewPinConfirm();
        },

        enterNewPinConfirm: function (pin, onClose, onError) {
            if (pin !== this.pin) {
                window.setTimeout(() => onError(
                    t('passcode_tryagain'),
                    () => {
                        onClose();
                        this.askNewPin();
                    }
                ), 0);
                return;
            }

            onClose();

            var username = this.props.data ? this.props.data.name.username : Peerio.user.username;
            var passphrase = (Peerio.user && Peerio.user.passphrase) || this.state.passphrase;
            Peerio.Auth.savePinnedPassphrase(username, pin, passphrase)
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

        createPin: function (pin) {
            if(!Peerio.Util.pinEntropyCheck(pin))
                window.setTimeout(() => this.refs.createPin.handleLoginFail(t('passcode_simple')), 0);
            else
                this.setState({ confirm: true, pin: pin });
        },

        confirmPin: function (pin) {
            if(this.state.pin != pin)
                window.setTimeout(() => {
                    this.refs.confirmPin.handleLoginFail(
                        t('passcode_tryagain'),
                        () => this.setState({ confirm: false })
                    );
                }, 0);
            else {
                var username = this.props.data ? this.props.data.name.username : Peerio.user.username;
                var passphrase = (Peerio.user && Peerio.user.passphrase) || this.state.passphrase;
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

