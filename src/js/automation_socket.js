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
        var options = {
            maxReconnectInterval: 3,
            // maxReconnectAttempts: 10, // set this to block indefinite reconnecting
            automaticOpen: false
        };
        api.automationSocket = 
            new ReconnectingWebSocket(host, null, options);
        api.automationSocket.onmessage = function(data) {
            data = JSON.parse(data.data);
            console.log(data);
            var result = 'action_not_found';
            var el = null;
            switch(data.action) {
                case 'send_keys':
                    el = document.querySelector(data.selector);
                if(el) {
                    el.value += data.value;
                    Peerio.Helpers.simulateChange(el);
                    result = 'success'; 
                } else {
                    result = 'not_found';
                }
                break;
                case 'tap':
                    el = document.querySelector(data.selector);
                    if(el) {
                    Peerio.Helpers.simulateTouch(el);
                    result = 'success'; 
                    } else {
                        result = 'not_found';
                    }
                break;
                case 'find':
                    el = document.querySelector(data.selector);
                    if(el) {
                     result = 'success'; 
                    } else {
                        result = 'not_found';
                     }
                break;
                case 'text':
                    el = document.querySelector(data.selector);
                    if(el) {
                        result = el.textContent; 
                    } else {
                        result = 'not_found';
                    }
                break;

                case 'clear':
                    el = document.querySelector(data.selector);
                    if(el) {
                        el.value = '';
                        result = 'success'; 
                    } else {
                        result = 'not_found';
                    }
                    break;

                case 'reload':
                     window.location.reload();
                    return;
            }

            api.automationSocket.send(result);
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

    if(Peerio.AutomationEnabled === true)
        api.start('ws://localhost:8888/ws');
};

