(function () {
    'use strict';

    Peerio.UI.SetupWizardCoupon = React.createClass({
        render: function () {
           return (
               <Peerio.UI.EnterCoupon {...this.props} autoFocus={true} focusDelay={1000}/>
            );
        }
    });

}());
