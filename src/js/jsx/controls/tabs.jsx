(function () {
    'use strict';

    // Main component, entry point for React app
    Peerio.UI.Tabs = React.createClass({
        componentDidMount: function () {
            if (Peerio.autoLogin ) {
                Peerio.autoLogin = null;
            }
        },

        render: function () {
            return (
                <div>
                    <Peerio.UI.TabBar/>
                    <RouteHandler/>
                </div>
            );
        }
    });

}());
