(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionListItem = React.createClass({
        render: function () {
            var s = this.props.subscription;
            return (
                    <ul className="flex-list">
                        <li>
                            <label>{t('payments_planName')}</label>
                            <div className="info-content">{s.plan_name}</div>
                        </li>
                        {s.bonus.file ?
                            <li>
                                <label>{t('payments_extraStorage')}</label>
                                <div className="info-content">{s.bonus.file.limit/1024/1024/1024}GB</div>
                            </li> : null}

                          {s.bonus.ghost ?
                              <li>
                                  <label>{t('payments_ghostLimitMonthly')}</label>
                                  <div className="info-content">{s.bonus.ghost.limit === null ? t('payments_unlimited') : s.bonus.ghost.limit}</div>
                              </li> : null}
                        {/* .list-item to seperate subscriptions */}
                        <li className="list-item">
                            <label>{t('payments_endDate')}</label>
                            <div className="info-content">{new Date(s.current_period_end).toLocaleDateString(Peerio.Translator.locale)}</div>
                        </li>
                        {/*<li>{t('payments_quota')}: {s.quota/1024/1024/1024}</li>*/}
                        {/*<li>{t('payments_status')}: {s.status}</li>*/}
                    </ul>
            );
        }
    });
}());
