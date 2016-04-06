(function () {
    'use strict';
    // Main component for app in authenticated state
    Peerio.UI.App = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State, Peerio.UI.Mixins.RouteTools],
        componentWillMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onHardBackButton(this.handleHardwareBack),
                Peerio.Dispatcher.onTransitionTo(this.handleTransition),
                Peerio.Dispatcher.onResume(this.handleResume),
                Peerio.Dispatcher.onAuthenticated(this.checkTOS),
                Peerio.Dispatcher.onSettingsUpdated(this.checkTOS)
            ];
        },
        componentDidMount: function () {
            this.checkTOS();
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        checkTOS: function () {
            setTimeout(()=> {
                if (this.tosRequested || Peerio.user.settings.acceptedLatestTOS) return;
                this.tosRequested = true;

                Peerio.UI.Confirm.show({
                        headline: t('tosUpdateRequestTitle'),
                        text: <Peerio.UI.Tappable element="a" style={{textDecoration: 'underline'}}
                                                  onTap={this.handleTOSRead}>
                            t('tosUpdateRequestText')
                        </Peerio.UI.Tappable>,
                        okText: t('button_accept'),
                        cancelText: t('button_reject')
                    })
                    .then(()=> {
                        Peerio.user.acceptTOS();
                    })
                    .catch(()=> {
                        Peerio.NativeAPI.signOut();
                    })
                    .finally(()=> this.tosRequested = false);
            }, 2000);
        },
        handleTOSRead: function () {
            Peerio.NativeAPI.openInBrowser('https://github.com/PeerioTechnologies/peerio-documentation/blob/master/Terms_of_Use.md');
        },
        handleHardwareBack: function () {
            if (this.isAppRoot()) return;
            this.goBack();
        },
        handleResume: function () {
            Peerio.NativeAPI.clearPushBadge();
        },
        // hack to allow out of router context components to navigate
        handleTransition: function () {
            this.transitionTo.apply(this, arguments);
        },
        render: function () {
            return (
                <div>
                    <Peerio.UI.NavBar/>
                    <Peerio.UI.SideBar/>
                    <RouteHandler/>
                    <Peerio.UI.Footer/>
                </div>
            );
        }
    });

}());
