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
                Peerio.Dispatcher.onSettingsUpdated(this.checkTOS),
                Peerio.Dispatcher.onSettingsUpdated(this.checkClientVersion)
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
                        exclusive: true,
                        headline: t('tosUpdateRequestTitle'),
                        text: <Peerio.UI.Tappable element="a" style={{textDecoration: 'underline'}}
                                                  onTap={this.handleTOSRead}>
                            {t('tosUpdateRequestText')}
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

        checkClientVersion: function () {
            var version = Peerio.user.latestClientVersions && Peerio.user.latestClientVersions.mobile;
            version = version || '0.0.0';
            var currentVersion = Peerio.runtime.version;
            if(!semver.valid(version) || !semver.valid(currentVersion)) {
                L.error('Invalid user client version provided: ' + version + ' ' + currentVersion);
                return;
            }

            var GHOST_MILESTONE = '2.5.7'; 

            if(semver.compare(currentVersion, version) > 0) {
                // we got the newer version run for the first time
                // time for some action!
                if(semver.compare(currentVersion, GHOST_MILESTONE) >= 0)
                    Peerio.UI.Alert.show({text: t('ghostOnboardText', {}, {'ghostLink': s => 
                        <Peerio.UI.Tappable element="a" style={{textDecoration: 'underline'}}
                        onTap={this.handleGhostLink}>{s}</Peerio.UI.Tappable>}), headline: t('ghostOnboardTitle')});
                Peerio.user.updateMobileClientVersion(currentVersion);
            }
        },

        handleTOSRead: function () {
            Peerio.NativeAPI.openInBrowser('https://github.com/PeerioTechnologies/peerio-documentation/blob/master/Terms_of_Use.md');
        },

        handleGhostLink: function () {
            Peerio.NativeAPI.openInBrowser('https://blog.peerio.com/ghost-encrypt-anything-to-anyone-2bb65d5dd2bd');
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
