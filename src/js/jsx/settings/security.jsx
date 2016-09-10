(function () {
    'use strict';

    Peerio.UI.Security = React.createClass({
        mixins:[ReactRouter.Navigation],

        //--- RENDER
        render: function () {
            return (
                <div className="content without-tab-bar without-footer">
                    <Peerio.UI.ShowPassphrase />
                    <Peerio.UI.Settings2FA />
                </div>
            );
        }
    });

}());
