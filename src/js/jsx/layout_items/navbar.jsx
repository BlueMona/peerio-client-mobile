/**
 * Topmost navigation bar
 */
(function () {
  'use strict';

  Peerio.UI.NavBar = React.createClass({
    mixins: [ReactRouter.Navigation, ReactRouter.State, Peerio.UI.Mixins.RouteTools],

    //--- REACT EVENTS
    getInitialState: function () {
      return {
        socketConnected: true, // red/green connection status. when false, 'loading' is ignored
        loading: false //shows loading indicator animation
      };
    },
    componentWillMount: function () {
      var d = Peerio.Dispatcher;
      var fn = Peerio.Helpers.getStateUpdaterFn;
      this.subscrIDs = [d.onConnected(fn(this, {socketConnected: true})),
        d.onDisconnected(fn(this, {socketConnected: false})),
        d.onLoading(fn(this, {loading: true})),
        d.onLoadingDone(fn(this, {loading: false}))];
    },
    componentWillUnmount: function () {
      Peerio.Dispatcher.unsubscribe(this.subscrIDs);
      this.subscrIDs = null;
    },
    handleSidebarToggle: function(){
      Peerio.Action.sidebarToggle();
    },
    //--- RENDER
    render: function () {
      var connectionClass;
      if (this.state.socketConnected)
        connectionClass = this.state.loading ? 'loading' : 'connected';

      return (
        <div id="navbar" className="flex-row flex-align-center">
        {
          this.isAppRoot() ?
          <div id="sidemenu-toggle" ref="toggle" onTouchStart={this.handleSidebarToggle}>
            <i className="material-icons">menu</i>
          </div>
          :  <Peerio.UI.Tappable element="i" id="global-back" onTap={this.goBack}
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
              <Peerio.UI.Tappable onTap={this.transitionTo.bind(this, 'new_message')}>
                <i className="material-icons">edit</i>
              </Peerio.UI.Tappable>
            </div>

          <div id="connection-status" className={connectionClass}>{this.state.socketConnected?'':'connecting...'}</div>
        </div>
      );
    }
  });

}());
