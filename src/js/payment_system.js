var Peerio = this.Peerio || {};
Peerio.PaymentSystem = {};

Peerio.PaymentSystem.init = function () {
    'use strict';

    var api = Peerio.PaymentSystem = {};

    api.arePaymentsAvailable = function () {
        return false;
    };

    api.hasSubscription = function () {
        // if the user has at least one subscription
        // he shouldn't be able to purchase more before cancelling
        // TODO: explain it to the user in the friendly way

        return api.getOwnedSubscriptions().length > 0;
    };

    api.loaded = function() {
        return store.products.filter(s => s.id != 'application data' && s.loaded !== true).length === 0;
    };

    api.getOwnedSubscriptions = function () {
        return api.getAllSubscriptions().filter(p => p.owned);
    };

    api.getAllSubscriptions = function () {
        return api.loadProductsFromServer()
            // .then(() => Peerio.Helpers.waitUntil(30, api.loaded))
            .then(() => store.products.filter(p => p.type == store.PAID_SUBSCRIPTION));
    };

    api.parsers = [];

    api.parsers['ios'] = p => { return { id: p.ios_id, type: store.PAID_SUBSCRIPTION }; };
    api.parsers['browser'] = p => { return { id: p.browser_id, alias: p.name, type: store.PAID_SUBSCRIPTION, description: p.description }; };
    api.parsers['android'] = p => { return { id: p.android_id, alias: p.name, type: store.PAID_SUBSCRIPTION }; };

    api.loadProductsFromServer = function () {
        if(store.products.length == 0) {
            // TODO: load from https://hocuspocus.peerio.com/paid_plan/list
            var resp = '[{"id":"pro_annual","android_id": "com.peerio.storage.50.yearly", "ios_id": "com.peerio.storage.50.yearly", "browser_id": "com.peerio.storage.50.yearly", "name":"Peerio Pro (annual)","description":"50Gb of additional files storage","interval":"year","amount":9999,"currency":"usd","interval_count":1,"bonus":"50G"},{"id":"pro_monthly", "android_id": "com.peerio.storage.50.monthly", "ios_id": "com.peerio.storage.50.monthly", "browser_id": "com.peerio.storage.50.monthly", "name":"Peerio Pro (monthly)","description":"50Gb of additional files storage","interval":"month","amount":999,"currency":"usd","interval_count":1,"bonus":"50G"}]';

            var server_data = JSON.parse(resp);
            server_data.forEach(i => store.register(api.parsers[Peerio.runtime.platform](i)));
            store && store.refresh();
        }
        return Promise.resolve(true);
    };

    api.tryLoad = function () {
        try {
            return api.loadProductsFromServer();
        } catch (e) {
            return Promise.reject(e);
        }
    };

    if(Peerio.runtime.platform === 'browser') {
        window.store = {};
        store = window.store;
        // mock subscriptions
        store = { 
            products: [], 
            PAID_SUBSCRIPTION: 'paid subscription',
            APPROVED: 'approved',
            when: function () {
                return {
                    approved: function (cb) { store.approved_cb = cb; },
                    cancelled: function (cb) { store.cancelled_cb = cb; },
                    error: function (cb) { store.error_cb = cb; }
                };
            },
            refresh: function () {
                store.products.forEach(p => { 
                    window.setTimeout( () => {
                        p.loaded = true;
                        p.canPurchase = true;
                        p.title = p.id;
                        p.finish = function () {
                            L.info('loaded product: ' + p.id);
                        };
                        store.approved_cb && store.approved_cb(p);
                    }, 500);
                });
            },
            order: function (id) {
                Peerio.UI.Confirm.show({
                    text:id,
                    serviceClass: '_paymentConfirm'
                })
                .then( () => {
                    var p = store.products.filter( p => p.id == id )[0];
                    p.state = store.APPROVED;
                    // p.finish = function() {
                    //     p.canPurchase = false;
                    //     p.owned = true;
                    // };
                    store.approved_cb && store.approved_cb(p);
                });
            }
        };

        store.register = function (p) {
            var existing = store.products.filter(s => s.id === p.id);
            if(existing.length) return;
            store.products.push(p);
        };
    }

    api.startOrder = function (p) {
        p.cancelled = null;
        p.error = null;
        p.receipt = null;
        p.inProgress = true;
        store.order(p.id);
    };

    api.process = {};
    api.process.approved = {};

    api.process.approved.ios = function (p) {
        p.receipt = window.storekit.receiptForTransaction[p.transaction.id];
        if(p.receipt) {
            return Peerio.user.registerMobilePurchaseApple(p.receipt);
        }
        return Promise.reject('no receipt found on the product');
    };

    api.process.approved.android = function (p) {
        if(p.transaction) {
            p.receipt = p.transaction.receipt;
            return Peerio.user.registerMobilePurchaseAndroid(
                p.transaction.receipt, 
                p.transaction.purchaseToken,
                p.transaction.signature);
        }
        return Promise.reject('no transaction found on the product');
    };

    api.process.approved.browser = function (p) {
        p.receipt = p.id;
        return Promise.resolve(true);
    };

    /*    if(store) {
        store.when('product').cancelled( function (p) { 
            p.cancelled = true;
            Peerio.Action.paymentProductCancelled(p); 
        });

        store.when('product').error( function (p) { 
            p.error = true;
            Peerio.Action.paymentProductError(p); 
        });

        store.when('product').approved( function (p) { 
            if(p.state == store.APPROVED) {
                if(p.inProgress) {
                    api.process.approved[Peerio.runtime.platform](p)
                        .then( () => {
                            p.finish();
                            Peerio.Action.paymentProductUpdated(p); 
                        })
                        .catch( e => {
                            L.error(e);
                            p.errorText = t('payments_operationErrorRemote');
                            Peerio.Action.paymentProductError(p); 
                        });

                    p.inProgress = null;
                } else {
                    Peerio.Action.paymentProductUpdated(p); 
                }
            }
        });
    }
        */
};


