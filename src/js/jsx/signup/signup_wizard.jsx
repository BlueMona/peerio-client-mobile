(function () {
    'use strict';

    var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

    Peerio.UI.SignupWizard = React.createClass({
        mixins: [Peerio.Navigation],

        doSignup: function () {

            this.setState({activeStep: this.steps.length - 1});
            Peerio.UI.justRegistered = true;
            Peerio.Auth.signup(this.data.name.username,
                this.data.pass.passphrase,
                this.data.name.firstName,
                this.data.name.lastName)
                .then(() => {
                    Peerio.Translator.forceLocaleOnLogin = true;
                    //todo: terrible, transfer this through router
                    Peerio.autoLogin = {
                        username: this.data.name.username,
                        passphrase: this.data.pass.passphrase
                    };

                    this.transitionTo('root');
                })
                .catch((error) => {
                    Peerio.Action.showAlert({text: t('error_creatingAccount') + ' ' + error});
                    this.setState(this.getInitialState);
                });
        },

        getInitialState: function () {
            return {
                activeStep: 0
            };
        },

        componentWillMount: function () {
            Peerio.DataCollection.Signup.startSignup();
            this.data = {};
            this.steps = [
                Peerio.UI.SignupWizardName,
                Peerio.UI.SignupWizardPin,
                Peerio.UI.SignupWizardSpinner
            ];
        },

        handleNextStep: function (data) {
            Peerio.NativeAPI.hideKeyboard();
            if (data) _.extend(this.data, data);
            if (this.state.activeStep >= this.steps.length - 1) {
                return;
            }
            this.setState({activeStep: this.state.activeStep + 1});
            if (data && data.signup) {
                this.doSignup();
            }
        },

        handlePreviousStep: function () {
            Peerio.NativeAPI.hideKeyboard();
            if (this.state.activeStep >= 1)
                this.setState({activeStep: --this.state.activeStep});
            else
                this.transitionTo('/');
        },

        render: function () {

            var activeStep = this.state.activeStep;
            var currentStep = React.createElement(this.steps[activeStep], {
                key: 'step' + activeStep,
                handleNextStep: (data) => this.handleNextStep(data),
                handlePreviousStep: (data) => this.handlePreviousStep(data),
                data: this.data
            });
            var progressBarSteps = [];

            for (var i = 0; i < this.steps.length; i++) {
                var activeClass = (i === activeStep) ? 'active progress-bar-step' : 'progress-bar-step';
                progressBarSteps.push(<div className={activeClass} key={'div' + i}></div>);
            }

            var nextPrevFooter = this.state.activeStep < this.steps.length - 1 ?
                <div className={classNames(
                    'flex-row',
                    this.state.activeStep < 1 ?
                        ' flex-justify-end' : ' flex-justify-between'
                )}>
                    <Peerio.UI.Tappable
                        element='div'
                        className={classNames(
                            'btn-back', {'hide': this.state.activeStep < 1}
                        )}
                        onTap={this.handlePreviousStep}>
                        <i className="material-icons">chevron_left</i>
                        {t('button_back')}
                    </Peerio.UI.Tappable>
                    <Peerio.UI.Tappable
                        element="div"
                        className="btn"
                        onTap={this.transitionTo.bind(this,'login')}>
                        {t('button_exit')}
                    </Peerio.UI.Tappable>
                </div>
                : null;
            return (
                <div>
                    <div className="content-wrapper-signup flex-grow-1 flex-col">
                        <div className="signup-form flex-col flex-grow-1">
                            <div transitionName="animate" className="flex-shrink-0 flex-grow-1">
                                {currentStep}
                            </div>
                            {nextPrevFooter}
                        </div>
                    </div>
                    <RouteHandler passphrase={this.state.passphrase} doSignup={this.doSignup}/>
                </div>
            );
        }
    });

}());
