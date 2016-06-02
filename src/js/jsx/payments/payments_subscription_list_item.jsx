(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionListItem = React.createClass({
        render: function () {
            var s = this.props.subscription;
            return (
                  <li className="list-item">
                    <label>{t('payments_planName')}</label>
                    <div className="info-content">  {s.bonus} - {s.plan_name}</div>

                    <label>{t('payments_endDate')}</label>
                    <div className="info-content">{s.current_period_end}</div>

                    {/*<li>{t('payments_quota')}: {s.quota/1024/1024/1024}</li>*/}
                    {/*<li>{t('payments_status')}: {s.status}</li>*/}
                  </li>
            );
        }
    });
}());
