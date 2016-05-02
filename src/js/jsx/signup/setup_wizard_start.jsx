(function () {
    'use strict';

    Peerio.UI.SetupWizardStart = React.createClass({
        mixins: [ReactRouter.Navigation],
        getInitialState: function () {
            return {
                activeStep: 0
            };
        },
        nextStep: function () {
            this.props.onSuccess();
        },

        render: function () {
            return (
                <div>
                    <div>
                        <div className="headline">{t('setup_startTitle')}</div>
                        <p>
                            {t('setup_startDescription')}
                        </p>
                        <p>
                            {t('setup_startDescription2')}
                        </p>
                    </div>
                    <div className="buttons">
                        <Peerio.UI.Tappable element='div' className="btn-safe"
                                            key={'next' + this.state.activeStep} onTap={this.nextStep}>
                            {t('button_getStarted')}
                        </Peerio.UI.Tappable>

                        <Peerio.UI.Tappable element='div' className='btn-primary'
                                            onTap={this.transitionTo.bind(this, 'messages')}>
                            {t('button_maybeLater')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());
