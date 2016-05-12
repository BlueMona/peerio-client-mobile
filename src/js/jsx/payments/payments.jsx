(function () {
    'use strict';

    Peerio.UI.Payments = React.createClass({
        mixins: [ReactRouter.Navigation],
        getInitialState: function () {
            return {subscriptions: []};
        },
        componentDidMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onPaymentProductUpdated(this.handleUpdate.bind(this))];
            Peerio.PaymentSystem.getAllSubscriptions()
                 .then(s => this.setState({ 'subscriptions': s }))
                 .catch(e => this.setState({ 'error': t('paymentsLoadingError') }));
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        handleUpdate: function (p) {
            this.forceUpdate();
            L.info(p);
        },

        handleOrder: function (p) {
            var forceSubscriptions = PeerioDebug && PeerioDebug.forceSubscriptions;
            if(!forceSubscriptions && (!p.canPurchase || this.hasSubscriptions())) return;
            store.order(p.id);
        },
        hasSubscriptions: function () {
            return this.state.subscriptions.filter( s => s.owned ).length > 0;
        },
        //--- RENDER
        render: function () {
            // if the user has at least one subscription, we shouldn't allow him to subscribe more
            // TODO: check if user has subscriptions from other sources (on server)
            var alreadySubscribed = this.hasSubscriptions();
            var subscriptions =
                                                             <div className="flex-col flex-grow-1">
                                                                {/*<p>{i.description}</p>*/}
                                                                <div className="flex-grow-1">
                                                                  <div className="section-highlight">
                                                                    <div className="headline text-center">50GB - <strong>$99.99/year</strong></div>
                                                                    <div className="text-center">or 9.99/month</div>
                                                                </div>
                                                                  <p className="flex-row flex-align-center">
                                                                    <i className="material-icons">add</i>
                                                                    Full features of basic plan
                                                                  </p>
                                                                  <p className="flex-row flex-align-center">
                                                                    <i className="material-icons">add</i>
                                                                    Priority email support
                                                                  </p>
                                                                </div>
                                                                <div className="buttons">
                                                                  {this.state.subscriptions.map( i =>
                                                                      <Peerio.UI.Tappable
                                                                          element="div"
                                                                          className={alreadySubscribed || !i.canPurchase ? 'btn-disabled' : 'btn-safe'}
                                                                          onTap={this.handleOrder.bind(this, i)}>
                                                                          {t('payments_buy') + ' ' + (i.alias ||  i.id)}
                                                                      </Peerio.UI.Tappable>)}
                                                                </div>
                                                             </div>;
            var loader = this.state.error ?
                <div>{this.state.error}</div> : <div>loader</div>;
            return (
                <div className="content without-tab-bar without-footer flex-col">
                    <div className="headline">{t('payments_title')}</div>
                    {alreadySubscribed ?
                        <p>{t('payments_hasSubscription')}</p> : null}

                    { this.state.subscriptions && this.state.subscriptions.length ?
                        subscriptions : loader
                    }

                </div>
            );
        }
    });

}());
