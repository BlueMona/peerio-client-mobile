(function () {
    'use strict';

    Peerio.UI.EnterCoupon = React.createClass({
        mixins: [Peerio.UI.AutoFocusMixin],

        redeemCoupon: function () {
            var coupon = this.refs.textEdit.getDOMNode().value;
            Peerio.user.redeemCouponCode(coupon)
            .then( () => {
                return Peerio.UI.Alert.show({text: t('coupon_activated')});
            })
            .then( () => { this.props.onSuccess && this.props.onSuccess(coupon); } )
            .catch( (error) => {
                L.error(error);
                Peerio.UI.Alert.show({text: t('coupon_invalid')});
            });
        },

        render: function () {
           return (
               <div className="content without-tab-bar flex-col flex-justify-start without-footer">
               <div className="headline">{t('redeemCoupon')}</div>
                  <div className="input-group">
                      <label htmlFor="coupon">{t('coupon_prompt')}</label>
                      <div className="flex-row flex-align-center">
                          <input type="text" placeholder={t('enterCouponCode')} ref="textEdit" spellCheck="false" autoComplete="off" id="coupon"/>
                          <Peerio.UI.Tappable className="btn-primary" onTap={ this.redeemCoupon }>
                              {t('button_redeem')}
                          </Peerio.UI.Tappable>
                      </div>
                  </div>
               </div>
            );
        }
    });

}());
