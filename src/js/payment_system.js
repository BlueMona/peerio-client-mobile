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
        return store.products.filter(s => s.loaded !== true).length === 0;
    },

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
            var resp = '[{"id":"pro_annual","android_id": "com.peerio.storage.50.yearly", "ios_id": "com.peerio.storage.yearly", "browser_id": "mock.yearly", "name":"Peerio Pro (annual)","description":"50Gb of additional files storage","interval":"year","amount":9999,"currency":"usd","interval_count":1,"bonus":"50G"},{"id":"pro_monthly", "android_id": "com.peerio.storage.50.monthly", "ios_id": "com.peerio.storage.monthly", "browser_id": "mock.monthly", "name":"Peerio Pro (monthly)","description":"50Gb of additional files storage","interval":"month","amount":999,"currency":"usd","interval_count":1,"bonus":"50G"}]';

            var server_data = JSON.parse(resp);
            server_data.forEach(i => store.register(api.parsers[Peerio.runtime.platform](i)));
        }
        return Promise.resolve(true)
        .then( () => store && store.refresh() );
    };

    if(Peerio.runtime.platform === 'browser') {
        window.store = {};
        store = window.store;
        // mock subscriptions
        store = { 
            products: [], 
            PAID_SUBSCRIPTION: 'paid subscription',
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
                    }, 1000);
                });
            },
            order: function (id) {
                Peerio.UI.Alert.show({text:id})
                .then( () => {
                    var p = store.products.filter( p => p.id == id )[0];
                    p.finish = function() {
                        p.canPurchase = false;
                        p.owned = true;
                    };
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

    if(store) {
        // we approve paid subscriptions automatically
        // only consummable products are approved on the store side
        store.when('product').approved( function (p) { 
            p.finish(); 
            Peerio.Action.paymentProductUpdated(p); 
        });
        // api.loadProductsFromServer();
    }
};


