(function () {
    'use strict';

    Peerio.UI.SignupWizardOptIn = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
            };
        },

        handleDataOptIn: function (enable) {
            (enable ? Peerio.DataCollection.enable() : Peerio.DataCollection.disable())
            .then( () => {
                this.props.handleNextStep();
            });
            Peerio.user && Peerio.user.enableDataCollection &&
                Peerio.user.enableDataCollection(enable);
        },

        render: function () {
            return (
                <div className="animate-enter">
                    <div className="headline">Want to aid usability research?</div>
                    <p>You can opt-in for anonymous data collection. This allows Peerio to collect non-identifying and non-content information to share with researchers and improve Peerio.<Peerio.UI.Tappable onTap={Peerio.NativeAPI.openInBrowser.bind(this, 'https://peerio.zendesk.com/hc/en-us/articles/203946145')}><b><u>Tap here</u></b> to learn which data we collect.</Peerio.UI.Tappable></p>
                    <p>If you opt-in, we will add 25MB to your account everyday as thanks for your contribution.</p>
                    <div className="buttons">
                        <Peerio.UI.Tappable 
                            element="div" 
                            className="btn-primary" 
                            onTap={this.handleDataOptIn.bind(this, false)}>Not right now</Peerio.UI.Tappable>
                        <Peerio.UI.Tappable 
                            element="div" 
                            className="btn-safe" 
                            onTap={this.handleDataOptIn.bind(this, true)}>Yes, I do</Peerio.UI.Tappable>
                    </div>
                </div>);
        },
    });

}());
