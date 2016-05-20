(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionListItem = React.createClass({
        render: function () {
            var s = this.props.subscription;
            return (
                <div>
                    {t('payments_bonus')}: {s.bonus}, 
                    {t('payments_endDate')}: {s.current_period_end}, 
                    {t('payments_planName')}: {s.plan_name}, 
                    {t('payments_quota')}: {s.quota/1024/1024/1024}, 
                    {t('payments_status')}: {s.status}
                </div>
            );
        }
    });
}());

