/**
 * Login Screen Component
 *
 */
(function () {
    'use strict';

    Peerio.UI.Index = React.createClass({
        mixins: [Peerio.Navigation],
        componentDidMount: function () {
            this.replaceWith('/login');
       },
        //--- RENDER
        render: function () {
            return (
                <div className="page-wrapper-login">
                </div>
            );
        }
    });

}());
