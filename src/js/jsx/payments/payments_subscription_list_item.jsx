(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionListItem = React.createClass({
        render: function () {
            var s = this.props.subscription;
            return (
                  <li className="list-item">
                    <label>{t('payments_planName')}</label>
                    <div className="info-content">{s.plan_name}</div>
                      {s.bonus.file ? 
                          <div>
                            <label>{t('payments_extraStorage')}</label>
                            <div className="info-content">{s.bonus.file.limit/1024/1024/1024}GB</div>
                          </div> : null}

                      {s.bonus.ghost ? 
                          <div>
                            <label>{t('payments_ghostLimitMonthly')}</label>
                            <div className="info-content">{s.bonus.ghost.limit === null ? t('payments_unlimited') : s.bonus.ghost.limit}</div>
                          </div> : null}

                    <label>{t('payments_endDate')}</label>
                    <div className="info-content">{new Date(s.current_period_end).toLocaleDateString(Peerio.Translator.locale)}</div>

                    {/*<li>{t('payments_quota')}: {s.quota/1024/1024/1024}</li>*/}
                    {/*<li>{t('payments_status')}: {s.status}</li>*/}
                  </li>
            );
        }
    });
}());
