(function () {
    'use strict';

    Peerio.UI.EnterCoupon = React.createClass({
        mixins: [Peerio.UI.AutoFocusMixin],

        redeemCoupon: function () {
            var coupon = this.refs.textEdit.getDOMNode().value;
            Peerio.user.redeemCouponCode(coupon)
            .then( () => {
                return Peerio.UI.Alert.show({text: 'The coupon is successfully activated!'});
            })
            .then( () => { this.props.onSuccess && this.props.onSuccess(coupon); } )
            .catch( (error) => {
                L.error(error);
                Peerio.UI.Alert.show({text: 'Sorry, the coupon doesn\'t seem to be valid'});
            });
        },

        render: function () {
           return (
               <div className="content without-tab-bar flex-col flex-justify-start without-footer">
               <div className="headline">Redeem Coupon</div>
                  <div className="input-group">
                      <label htmlFor="coupon">If you have a promotional code, please enter it below.</label>
                      <div className="flex-row flex-align-center">
                          <input type="text" placeholder="enter coupon code" ref="textEdit" spellCheck="false" autoComplete="off" id="coupon"/>
                          <Peerio.UI.Tappable className="btn-primary" onTap={ this.redeemCoupon }>
                             redeem
                          </Peerio.UI.Tappable>
                      </div>
                  </div>
               </div>
            );
        },
    });

}());
