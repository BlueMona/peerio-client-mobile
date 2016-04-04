(function () {
    'use strict';

    Peerio.UI.SignupWizardTOS = React.createClass({

        handleNextStep: function () {
            this.props.handleNextStep({name: this.state});
        },

        handleTOS: function () {
            Peerio.NativeAPI.openInBrowser('https://github.com/PeerioTechnologies/peerio-documentation/blob/master/Terms_of_Use.md')
        },

        render: function () {
            return (
                <div style={{marginTop: '160px'}}>
                    <div className="headline">{t('signup_TOSRequestTitle')}</div>
                    <p>
                        {t('signup_TOSRequestText', null, {
                            tosLink: link => <Peerio.UI.Tappable element="a"
                                                                 style={{textDecoration: 'underline', color: '#fff'}}
                                                                 onTap={this.handleTOS}>{link}</Peerio.UI.Tappable>
                        })}

                        
                    </p>
                    <div className="buttons">
                        <Peerio.UI.Tappable
                            element='div'
                            className="btn-safe"
                            onTap={this.handleNextStep}>
                            {t('agreeButton')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });
}());
