(function () {
    'use strict';

    Peerio.UI.PaymentsViewSubscriptions = React.createClass({
        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated(this.forceUpdate.bind(this, null))
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        render: function () {
            return (
                <div className="content without-tab-bar without-footer flex-col _viewSubscriptions">
                    <div className="headline">{t('payments_viewSubscriptions')}</div>
                    <Peerio.UI.PaymentsSubscriptionList 
                        items={Peerio.user.getActiveSubscriptions()} 
                        title={t('payments_activeSubscriptions')}/>
                    <Peerio.UI.PaymentsSubscriptionList 
                        items={Peerio.user.getCanceledSubscriptions()} 
                        title={t('payments_canceledSubscriptions')}/>
                    <ul>
                        <li className="list-item">
                            <label>{t('payments_planInfo')}</label>
                            <div className="info-content">
                                <p>
                                    <Peerio.UI.Linkify suppressWarning={true} text={'https://peerio.zendesk.com/hc/en-us/articles/210426066'}/>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            );
        }
    });
}());
