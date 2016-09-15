(function () {
    'use strict';

    Peerio.UI.SetupWizardPassphrase = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return {
                activeStep: 0,
                passphrase: Peerio.autoLogin.passphrase
            };
        },

        nextStep: function () {
            this.props.onSuccess();
        },

        render: function () {
            return (
                <div className="_setupWelcome">
                    <div>
                        <div className="headline">{t('yourPassphrase')}</div>
                    </div>
                    <div>
                        <p>
                            {t('infoAlertPassphraseMobile')}
                        </p>
                        <p className="txt-lrg">
                            {this.state.passphrase}
                        </p>
                    </div>
                    <div className="buttons">
                        <Peerio.UI.Tappable element='div' className="btn-safe"
                                            key={'next' + this.state.activeStep} onTap={this.nextStep}>
                            {t('ok')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());

