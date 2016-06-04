/**
 * Google AdWords conversion helper
 * ------------------------------------------------------
 */
var Peerio = this.Peerio || {};
Peerio.GoogleConversion = Peerio.GoogleConversion || {};

Peerio.GoogleConversion.init = function () {
    'use strict';

    var api = Peerio.GoogleConversion;

    api.getIDFA = function () {
        if(Peerio.runtime.platform != 'ios') {
            L.info('No Apple advertising plugin for this platform. Returning mock');
            return Promise.resolve('8880ea97-db86-4e10-a10f-4e71461ab8f9');
        }
        if(!window.plugins.AppleAdvertising) throw 'Plugin AppleAdvertising not found';
        return new Promise( (resolve, reject) => {
            window.plugins.AppleAdvertising.getIDFA(resolve, reject);
        });
    };

    api.testIDFA = function () {
        api.getIDFA()
        .then(i => Peerio.UI.Alert.show({ text: i, serviceClass: '_googleConversion' }));
    };

    api.trackInstall = function () {
        if (api.subscription) {
            Peerio.Dispatcher.unsubscribe(api.subscription);
            delete api.subscription;
        }
        api.getIDFA()
        .then(i => { 
            L.info('Track install ' + i);
            api.idfa = i;
            return Peerio.Net.trackAppleInstall(i);
        })
        .then(() => {
            api.idfa_sent = true;
            L.info('idfa sent successfully');
        });
    };

    if (Peerio.runtime.platform == 'ios' && Peerio.runtime.firstRun)
        api.subscription = Peerio.Dispatcher.onConnected(api.trackInstall);

};
