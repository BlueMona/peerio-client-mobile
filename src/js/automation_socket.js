/**
 * Various helper functions that didn't fit anywhere else
 * ------------------------------------------------------
 */

var Peerio = this.Peerio || {};
Peerio.AutomationSocket = {};

Peerio.AutomationSocket.init = function () {
    'use strict';

    var api = Peerio.AutomationSocket = {};

    api.start = function (host) {
        if(Peerio.runtime.platform != 'browser') return;
        var options = {
            maxReconnectInterval: 3,
            // maxReconnectAttempts: 10, // set this to block indefinite reconnecting
            automaticOpen: false
        };
        api.automationSocket = 
            new ReconnectingWebSocket(host, null, options);

        api.automationActions = {
            ping: function (el, data) {
                data.result = 'pong';
            },
            send_keys: function (el, data) {
                el.value += data.value;
                Peerio.Helpers.simulateChange(el);
            },
            tap: function (el, data) {
                Peerio.Helpers.simulateTouch(el);
            },
            find: function (el) {
                if(!el) throw 'not_found';
            },
            text: function (el, data) {
                data.result = el.textContent;
            },
            clear: function (el) {
                el.value = '';
            },
            option: function (el, data) {
                el.value = data.value;
                Peerio.Helpers.simulateChange(el);
            },
            value: function (el, data) {
                data.result = el.value;
            },
            reload: function (el, data) {
                window.location.reload();
                data.suppressResult = true;
            },
            execute_script: function (el, data) {
                data.result = eval(data.script.replace(/^\s*return\s*/, ''));
            }
        };

        api.executeElement = function (data) {
            if(!_.has(api.automationActions, data.action))
                throw 'action_not_found';
            var el = data.selector ? document.querySelector(data.selector) : null;
            if(data.selector && !el)
                throw 'not_found';
            api.automationActions[data.action](el, data);
        };

        api.automationSocket.onmessage = function(data) {
            data = JSON.parse(data.data);
            console.log(data);
            var result = 'success';
            try {
                api.executeElement(data);
                result = typeof(data.result) != 'undefined' ? data.result : result;
            } catch(e) {
                result = e;
            }
            !data.suppressResult && api.automationSocket.send(result);
        };

        api.automationSocket.checkSend = function () {
            if(window.Peerio && Peerio.AppState && !Peerio.AppState.loading && Peerio.AppState.connected) {
                api.automationSocket.send('loaded');
                return;
            }
            window.setTimeout(api.automationSocket.checkSend, 1000);
        };

        api.automationSocket.onopen = function () {
            api.automationSocket.checkSend(); 
        };

        // making sure we don't spam console with connection failed messages
        var consoleLog = console.log;
        console.log = function(text) {
            if(text && _.isString(text) && text.indexOf(host) != -1) return;
            return consoleLog.apply(console, arguments);
        };

        api.automationSocket.open();
    };

    api.start('ws://localhost:8888/ws');
};

window.PeerioDebug && PeerioDebug.AutomationEnabled && Peerio.AutomationSocket.init();

