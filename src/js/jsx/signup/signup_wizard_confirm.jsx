(function () {
    'use strict';

    Peerio.UI.SignupWizardConfirm = React.createClass({
        getInitialState: function () {
            return {
                passphrase_valid: false,
                passphrase: this.props.data.pass.passphrase
            };
        },

        componentDidMount: function () {
            var element = React.findDOMNode(this.refs.passPhraseInput);
            element.focus(); //TODO: looks like it works on ios but not android.
        },

        validatePassPhrase: function () {
            Peerio.DataCollection.startTimePoint('signup_enterpassphrase');
            var passphrase_confirmed = event.target.value === this.state.passphrase;
            var passphrase_alert = event.target.value.length && !passphrase_confirmed;
            this.setState({
                passphrase_valid: passphrase_confirmed,
                passphrase_alert: passphrase_alert
            });
        },

        createAccount: function () {
                Peerio.DataCollection.endTimePoint('signup_enterpassphrase');
                this.props.handleNextStep({signup: true});
        },

        handlePreviousStep: function () {
            this.props.handlePreviousStep();
        },
        //--- RENDER
        render: function () {
            var createPassPhrase = this.state.passphrase_valid ?
                (<Peerio.UI.Tappable element="div" className="btn-safe"
                    onTap={this.createAccount}>
                    {t('signup_confirmCreateButton')}
                </Peerio.UI.Tappable>) : null;
            var passphraseMsg = this.state.passphrase_alert ? t('error_passphraseNotMatching') : null;

            return (
                <div>
                    <div className="headline">{t('signup_enterPassphrase')}</div>
                    <div className="textarea-wrapper">
                        <textarea
                            className="border-none"
                            ref="passPhraseInput"
                            autoFocus="true" autoComplete="off" autoCorrect="off"
                            autoCapitalize="off" spellCheck="false"
                            onChange={this.validatePassPhrase}>
                        </textarea>
                    </div>
                    <p className="info-small text-center red-bold">{passphraseMsg}</p>
                    <div className="buttons">
                        {createPassPhrase}
                        <Peerio.UI.Tappable element="div" className="btn-primary"
                            onTap={this.handlePreviousStep}>
                            {t('signup_showPassphrase')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());
