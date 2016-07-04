(function () {
    'use strict';

    Peerio.UI.Payments = React.createClass({
        mixins: [ReactRouter.Navigation],
        getInitialState: function () {
            return {
                availableSubscriptions: []
            };
        },
        componentDidMount: function () {
            var api = Peerio.PaymentSystem;
            api.tryLoad()
                .then(api.getAllSubscriptions)
                .then(s => this.setState({ availableSubscriptions: s }))
                .catch(e => {
                    L.error(e);
                    this.setState({ error: t('payments_loadingError') });
                })
                .finally(() => {
                    this.subscriptions = [
                        Peerio.Dispatcher.onPaymentProductUpdated(p => this.handleUpdate(p)),
                        Peerio.Dispatcher.onPaymentProductError(p => this.handleError(p)),
                        Peerio.Dispatcher.onPaymentProductCancelled(p => this.handleCancelled(p)),
                        Peerio.Dispatcher.onSettingsUpdated(this.forceUpdate.bind(this, null))
                    ];
                });
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        handleCancelled: function (p) {
            this.setState({inProgress: false, error: t('payments_operationCancelled')});
        },

        handleError: function (p) {
            this.setState({inProgress: false, error: p.errorText || t('payments_operationErrorNative')});
        },

        handleUpdate: function (p) {
            if(p.cancelled || p.error || p.receipt)
                this.setState({inProgress: false});
            this.forceUpdate();
            if(p.receipt)
                this.transitionTo('messages');
        },

        handleOrder: function (p) {
            var forceSubscriptions = window.PeerioDebug && PeerioDebug.forceSubscriptions;
            if(!forceSubscriptions && (/* !p.canPurchase || */ this.hasActiveSubscriptions())) return;
            this.setState({inProgress: true});
            // redraw the payment view so that it shows loader
            window.setTimeout( () => Peerio.PaymentSystem.startOrder(p), 1000 );
        },

        handleViewSubscriptions: function () {
            this.transitionTo('payments_view_subscriptions');
        },

        hasActiveSubscriptions: function () {
            return Peerio.user.getActiveSubscriptions().length;
        },

        hasCanceledSubscriptions: function () {
            return Peerio.user.getCanceledSubscriptions().length;
        },
        //--- RENDER
        render: function () {
            // if the user has at least one subscription, we shouldn't allow him to subscribe more
            // TODO: check if user has subscriptions from other sources (on server)
            // TODO: added content to peerio-copy
            var alreadySubscribed = this.hasActiveSubscriptions();
            var availableSubscriptions =  (
                <div className="flex-col flex-grow-1">
                    {/*<p>{i.description}</p>*/}
                    <div className="flex-grow-1">
                        <div className="section-highlight">
                            <div>Peerio <strong>Pro</strong></div>
                            <div style={{fontSize: '20px', lineHeight: '1.5', marginTop: '8px'}}><strong>50GB</strong> - $99.99/year</div>
                            <div className="">or 9.99/month</div>
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
                    <div className="buttons row">
                        {this.state.availableSubscriptions.map( i => (
                            <Peerio.UI.Tappable
                                id={i.id}
                                key={i.id}
                                element="div"
                                className={alreadySubscribed ? 'btn-disabled' : 'btn-safe'}
                                onTap={this.handleOrder.bind(this, i)}>
                                {t('payments_' + i.id)}
                            </Peerio.UI.Tappable>))}
                    </div>
                </div>
            );
            var loader = this.state.error ?
                <div className="input-group">{this.state.error}</div> :
                <div className="list-item loader-item flex-row flex-align-center flex-justify-center"><span className="fa fa-circle-o-notch fa-spin"></span></div>;
            return (
                <div className="content without-tab-bar without-footer flex-col _purchaseContent">
                    <div className="headline">{t('payments_title')}</div>
                    {this.hasActiveSubscriptions() || this.hasCanceledSubscriptions() ?
                            <p>
                                {this.hasActiveSubscriptions() ? t('payments_hasSubscription') : t('payments_hasCanceledSubscription')}
                                <Peerio.UI.Tappable
                                    element="div"
                                    className='btn-safe'
                                    onTap={this.handleViewSubscriptions}>
                                    {t('payments_viewSubscriptions')}
                                </Peerio.UI.Tappable>
                            </p> : null}


                    { !this.state.error && !this.state.inProgress && this.state.availableSubscriptions && this.state.availableSubscriptions.length ?
                        availableSubscriptions : loader
                    }
                </div>
            );
        }
    });
}());
