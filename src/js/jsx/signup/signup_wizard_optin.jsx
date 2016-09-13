(function () {
    'use strict';

    Peerio.UI.SignupWizardOptIn = React.createClass({
        mixins: [Peerio.Navigation],

        handleDataOptIn: function (enable) {
            (enable ? Peerio.DataCollection.enable() : Peerio.DataCollection.disable())
                .then(() => {
                    this.props.handleNextStep();
                });

            Peerio.user && Peerio.user.enableDataCollection &&
                Peerio.user.enableDataCollection(enable);
        },

        render: function () {
            return (
                <div className="_setupOptIn">
                    <div className="headline">{t('signup_optInHeadline')}</div>
                    <p>{t('signup_optInDescription')}</p>
                    <p>
                        <Peerio.UI.Tappable
                            onTap={Peerio.NativeAPI.openInBrowser.bind(this, 'https://peerio.zendesk.com/hc/en-us/articles/203946145')}>
                            {t('signup_optInPolicy', null, {emphasis: segment => <b><u>{segment}</u></b>})}
                        </Peerio.UI.Tappable>
                    </p>
                    <p>{t('signup_optInDescription2')}</p>
                    <div className="buttons">
                        <Peerio.UI.Tappable
                            element="div"
                            className="btn-safe"
                            onTap={this.handleDataOptIn.bind(this, true)}>{t('button_yesIDo')}</Peerio.UI.Tappable>
                        <Peerio.UI.Tappable
                            element="div"
                            className="btn-primary"
                            onTap={this.handleDataOptIn.bind(this, false)}>{t('button_notRightNow')}</Peerio.UI.Tappable>
                    </div>
                </div>);
        }
    });

}());
