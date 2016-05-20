(function () {
    'use strict';

    Peerio.UI.PaymentsViewSubscriptions = React.createClass({
        render: function () {
            return (
                <div className="content without-tab-bar without-footer flex-col">
                    <div className="headline">{t('payments_viewSubscriptions')}</div>
                    <Peerio.UI.PaymentsSubscriptionList 
                        items={Peerio.user.getActiveSubscriptions()} 
                        title={t('payments_activeSubscriptions')}/>
                    <Peerio.UI.PaymentsSubscriptionList 
                        items={Peerio.user.getCanceledSubscriptions()} 
                        title={t('payments_canceledSubscriptions')}/>
                </div>
            );
        }
    });
}());
