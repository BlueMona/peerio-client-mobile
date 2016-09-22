(function () {
    'use strict';

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    Peerio.UI.SetupWizard = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return {
                activeStep: 0
            };
        },

        componentWillMount: function () {
            this.steps = [
                Peerio.UI.SetupWizardContactImport
            ];

            Peerio.UI.TouchId.isFeatureAvailable()
                .then(value => {
                    value && this.steps.splice(3, 0, Peerio.UI.SetupWizardTouchID);
                });
        },

        handleNextStep: function () {
            Peerio.NativeAPI.hideKeyboard();
            if (this.state.activeStep >= this.steps.length - 1) {
                this.transitionTo('messages');
                return;
            }
            this.setState({activeStep: this.state.activeStep + 1});
        },

        handlePreviousStep: function () {
            Peerio.NativeAPI.hideKeyboard();
            this.setState({activeStep: this.state.activeStep - 1});
        },

        render: function () {
            var currentStep = React.createElement(
                this.steps[this.state.activeStep], {
                    key: 'step' + this.state.activeStep,
                    onSuccess: this.handleNextStep,
                    handleNextStep: this.handleNextStep
                });
            var button = (
                <div className={classNames(
                    'flex-row flex-shrink-0',
                    this.state.activeStep === 0  ?
                        ' flex-justify-end' : ' flex-justify-between',
                    this.state.activeStep < 0 ?
                        ' hide' : ''
                )}>
                    <Peerio.UI.Tappable
                        element='div'
                        className={classNames(
                            'btn-back', {'hide': this.state.activeStep < 2}
                        )}
                        onTap={this.handlePreviousStep}>
                        <i className="material-icons">chevron_left</i>
                        {t('button_back')}
                    </Peerio.UI.Tappable>
                    <Peerio.UI.Tappable
                        element="div"
                        className="btn"
                        key={'next' + this.state.activeStep} onTap={this.handleNextStep}>
                        {t(this.state.activeStep !== this.steps.length - 1 ? 'button_skip' : 'button_finish')}
                    </Peerio.UI.Tappable>
                </div>
            );
            var progressBarSteps = [];

            for (var i = 0; i < this.steps.length; i++) {
                var activeClass = (i === this.state.activeStep) ? 'active progress-bar-step' : 'progress-bar-step';
                progressBarSteps.push(<div className={activeClass}></div>);
            }

            return (
                <div className="content-wrapper-signup flex-col">
                    <ReactCSSTransitionGroup
                        className="flex-grow-1 flex-shrink-1 _setupWizard"
                        style={{overflow:'auto'}}
                        transitionName="animate"
                        transitionEnterTimeout={1000} transitionLeaveTimeout={200}>
                        <div key={'cont'+this.state.activeStep}>
                            {currentStep}
                        </div>
                    </ReactCSSTransitionGroup>
                    {button}
                </div>
            );
        }
    });

}());
