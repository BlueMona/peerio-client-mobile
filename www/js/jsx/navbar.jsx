/**
 * Topmost navigation bar
 */
(function () {
  'use strict';

  Peerio.UI.NavBar = React.createClass({
    mixins: [ReactRouter.Navigation],

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
      this.subscrIds = [d.onSocketConnect(fn(this, {socketConnected: true})),
        d.onSocketDisconnect(fn(this, {socketConnected: false})),
        d.onLoading(fn(this, {loading: true})),
        d.onLoadingDone(fn(this, {loading: false}))];
    },
    componentWillUnmount: function () {
      Peerio.Dispatcher.unsubscribe(this.subscrIds);
      this.subscrIds = null;
    },
    handleSidebarToggle: function(){
      Peerio.Action.sidebarToggle()
    },
    //--- RENDER
    render: function () {
      var connectionClass;
      if (this.state.socketConnected)
        connectionClass = this.state.loading ? 'loading' : 'connected';

      return (
        <div id="navbar">
          <div id="sidemenu-toggle" ref="toggle" onTouchStart={this.handleSidebarToggle}>
            <i className="fa fa-bars"></i>
          </div>
          <div className="logo">
            <Peerio.UI.Tappable onTap={this.transitionTo.bind(this, 'messages')}>
              <img src="media/img/peerio-short-logo-white.png" className="peerio-logo"/>
            </Peerio.UI.Tappable>
          </div>
          <div id="search">
            <input id="search-keyword" type="text"/>
            <i id="search-button" className="fa fa-search"></i>
          </div>

            <div id="app-lock">
              <Peerio.UI.Tappable onTap={this.transitionTo.bind(this, 'new_message')}>
                <i className="fa fa-pencil-square-o"></i>
              </Peerio.UI.Tappable>
            </div>

          <div id="connection-status" className={connectionClass}></div>
        </div>
      );
    }
  });

}());
