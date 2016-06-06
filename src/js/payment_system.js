var Peerio = this.Peerio || {};
Peerio.PaymentSystem = {};

Peerio.PaymentSystem.init = function () {
    'use strict';

    var api = Peerio.PaymentSystem = {};

    api.arePaymentsAvailable = function () {
        return (Peerio.runtime.platform === 'android') ||
            (Peerio.runtime.platform === 'browser');
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
            .then(() => Peerio.Helpers.waitUntil(30, api.loaded))
            .then(() => store.products.filter(p => p.type == store.PAID_SUBSCRIPTION && p.loaded));
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

    api.tryLoadSubscriptionStatus = function () {
        try {
            // TODO: implement loading the subscription status from the server (or it should be supplied via settings)
            return Peerio.TinyDB.getItem('subscription', Peerio.user.username)
                    .then(s => Peerio.user.subscription = {active: s, amount: 50 * 1024 * 1024 * 1024 });
        } catch (e) {
            return Promise.reject(e);
        }
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
                    approved: function (cb) { store.approved_cb = cb; }
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
                Peerio.UI.Confirm.show({text:id})
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
        p.inProgress = true;
        store.order(p.id);
    };

    if(store) {
        // we approve paid subscriptions automatically
        // only consummable products are approved on the store side
        store.when('product').approved( function (p) { 
            // p.finish(); 
            if(p.state == store.APPROVED) {
                // if(Peerio.user) 
                //     Peerio.TinyDB.saveItem('subscription', true, Peerio.user.username);
                // p.owned = true;
                // p.canPurchase = false;
                if(p.inProgress) {
                    if(Peerio.runtime.platform == 'ios') {
                        p.receipt = window.storekit.receiptForTransaction[p.transaction.id];
                        if(p.receipt) {
                            Peerio.user.registerMobilePurchaseApple(p.receipt)
                            .then( () => {
                                p.finish();
                                Peerio.Action.paymentProductUpdated(p); 
                            })
                            .catch( e => {
                                Peerio.UI.Alert.show( { text: 'Error registering mobile purchase. Please contact support' } );
                            });
                        }
                    }
                    p.inProgress = null;
                }
                Peerio.Action.paymentProductUpdated(p); 
            }
        });
        // api.loadProductsFromServer();
    }
};


