/**
 * Topmost navigation bar
 */
(function () {
    'use strict';

    Peerio.UI.NavBar = React.createClass({
        mixins: [Peerio.Navigation, ReactRouter.State, Peerio.UI.Mixins.RouteTools],

        //--- REACT EVENTS
        getInitialState: function () {
            return {
                socketConnected: Peerio.AppState.connected, // red/green connection status. when false, 'loading' is ignored
                loading: Peerio.AppState.loading, //shows loading indicator animation
                outOfSync: Peerio.AppState.outOfSync
            };
        },

        componentWillMount: function () {
            this.tickPeerioDownTimer = window.setInterval(() => this.tickIsPeerioDown(), 2000);
            var d = Peerio.Dispatcher;
            var fn = Peerio.Helpers.getStateUpdaterFn;
            this.subscrIDs = [
                d.onConnected(fn(this, {socketConnected: true})),
                d.onConnected(() => this.cancelIsPeerioDown()),
                d.onDisconnected(fn(this, {socketConnected: false})),
                d.onLoading(fn(this, {loading: true})),
                d.onLoadingDone(fn(this, {loading: false})),
                d.onOutOfSync(fn(this, null, {outOfSync: 0}))];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscrIDs);
            this.subscrIDs = null;
            this.cancelIsPeerioDown();
            if(this.tickPeerioDownTimer) {
                window.clearInterval(this.tickPeerioDownTimer);
                this.tickPeerioDownTimer = null;
            }
        },

        handleSidebarToggle: function () {
            Peerio.Action.sidebarToggle();
        },

        tickIsPeerioDown: function () {
            if(!navigator.onLine || this.state.socketConnected) {
                this.cancelIsPeerioDown();
                return;
            }
            if(window.isPeerioDownTimer) return;
            window.isPeerioDownTimer = window.setTimeout(() => {
                this.cancelAnimation();
                this.animateIsPeerioDownTimer =
                    window.setInterval(() => this.animateIsPeerioDown(), 2000);
                window.isPeerioDownTimer = null;
            }, 5000);
        },

        cancelAnimation: function () {
            this.counter = 0;
            if(this.animateIsPeerioDownTimer) {
                window.clearInterval(this.animateIsPeerioDownTimer);
                this.animateIsPeerioDownTimer = null;
            }
        },

        cancelIsPeerioDown: function () {
            if(this.isPeerioDownTimer) {
                window.clearTimeout(this.isPeerioDownTimer);
                this.isPeerioDownTimer = null;
            }
            this.cancelAnimation();
            this.setState({connectingText: null});
        },

        animateIsPeerioDown: function () {
            var texts = [t('server_isDown'), t('server_isDown1')];
            this.setState({connectingText: texts[this.counter++ % 2]});
        },

        checkIsPeerioDown: function () {
            Peerio.NativeAPI.openInBrowser('https://status.peerio.com');
        },

        //--- RENDER
        render: function () {
            var connectionClass;
            if (this.state.socketConnected)
                connectionClass = this.state.outOfSync ? 'out-of-sync'
                    : this.state.loading ? 'loading' : 'connected';

            return (
                <div id="navbar" className="flex-row flex-align-center">
                    {
                        this.isAppRoot() ?
                            <div id="sidemenu-toggle" ref="toggle" onTouchStart={this.handleSidebarToggle}>
                                <i className="material-icons">menu</i>
                            </div>
                            : <Peerio.UI.Tappable element="i" id="global-back" onTap={this.goBack}
                                                  className="material-icons">arrow_back
                        </Peerio.UI.Tappable>

                    }

                    <div className="logo" onTouchStart={devmode.summon}>
                        <img src="media/img/peerio-short-logo-white.png" className="peerio-logo"/>
                    </div>
                    {/* not sure why but the spacer doesn't work correcly on iOS
                     TODO: replace table with floats
                     */}

                    <div id="app-lock">
                        {
                            this.state.outOfSync ?
                                <Peerio.UI.Tappable onTap={Peerio.user.reSync} element="i" className="material-icons">
                                    sync
                                </Peerio.UI.Tappable>
                                :
                            <Peerio.UI.Tappable element="i" onTap={this.transitionTo.bind(this, 'ghost_new')} className="material-icons">
                                edit
                            </Peerio.UI.Tappable>
                        }
                    </div>

                    <div id="connection-status"
                         className={'flex-row flex-justify-center flex-align-center ' + connectionClass}>
                        <div>{this.state.outOfSync ? t('outOfSync') : ''}</div>
                        <div className="margin-small">{this.state.outOfSync && !this.state.socketConnected ? '•' : ''}</div>
                        <div><Peerio.UI.Tappable onTap={this.checkIsPeerioDown}>{this.state.socketConnected ? '' : this.state.connectingText || t('connecting')}</Peerio.UI.Tappable></div>
                    </div>
                </div>
            );
        }
    });

}());
