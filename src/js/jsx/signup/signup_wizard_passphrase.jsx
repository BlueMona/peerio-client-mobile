(function () {
    'use strict';

    Peerio.UI.SignupWizardPassphrase = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return this.props.data.pass
                || {
                    passphrase: '',
                    passphrase_reentered: '',
                    passphrase_valid: false
                };
        },

        componentDidMount: function () {
            if (!this.state.passphrase) this.generatePassphrase();
        },

        generatePassphrase: function () {
            if (!this.trackedGeneration) {
                this.trackedGeneration = true;
            } else {
                Peerio.DataCollection.Signup.generatePassphrase();
            }

            Peerio.PhraseGenerator.getPassPhrase(this.refs.lang.getDOMNode().value, this.refs.wordCount.getDOMNode().value)
                .then(function (phrase) {
                    this.setState({passphrase: phrase});
                }.bind(this));
        },

        handleNextStep: function () {
            this.props.handleNextStep({pass: this.state});
        },

        render: function () {
            var localeNodes = Object.keys(Peerio.Config.dictLocales).map(l => <option value={l}>{Peerio.Config.dictLocales[l]}</option>);
            var locale = Peerio.Config.dictLocales[Peerio.Translator.locale] ? Peerio.Translator.locale : 'en';
            return (
                <fieldset key={'signup-step-1'}>
                    <div className="headline">{t('yourPassphrase')}</div>
                    <Peerio.UI.TrackSubState name="passphrase"/>

                    <p className='info'>{t('signup_passphraseDescription', null, {emphasis: segment => <strong>{segment}</strong>})}</p>

                    <p className="txt-lrg">
                        {this.state.passphrase}
                    </p>
                    <div className="flex-row">
                        <div className="input-group flex-grow-1">
                            <label htmlFor="lang">{t('language')}</label>
                            <select ref="lang" id="lang" onChange={this.generatePassphrase} value={locale}>
                                {localeNodes}
                            </select>

                        </div>

                        <div className="input-group">
                            <label htmlFor="wordCount">{t('length')}</label>
                            <select ref="wordCount" id="wordCount" onChange={this.generatePassphrase}>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="8">7</option>
                                <option value="8">8</option>
                                <option value="8">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                    </div>
                    <div className="buttons">
                        <Peerio.UI.Tappable element='div' className="btn-safe" onTap={this.handleNextStep}>{t('signup_acceptPassphrase')}</Peerio.UI.Tappable>
                        <Peerio.UI.Tappable element='div' className="btn-primary" onTap={this.generatePassphrase}>{t('signup_nextPassphrase')}</Peerio.UI.Tappable>
                    </div>
                </fieldset>);
        }
    });
}());
