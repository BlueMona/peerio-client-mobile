var Peerio = this.Peerio || {};
Peerio.ContactHelper = {};

Peerio.ContactHelper.init = function () {
    'use strict';

    var api = Peerio.ContactHelper = {};

    if(Peerio.runtime.platform == 'browser') {
        var mockData = ([
            { id: 9, emails: [ {value: 'adamsandler@gmail.com'} ], name: { formatted: 'Adam Sandler' } },
            { id: 10, emails: [ 
                {value: 'arbenina@gmail.com'}, 
                {value: 'arbenina.d@gmail.com'}, 
                {value: 'diana@gmail.com'} 
            ], name: { formatted: 'Diana Arbenina' } },
            { id: 11, emails: [ {value: 'barbara@gmail.com'} ], name: { formatted: 'Barbara Streizand'} },
            { id: 12, emails: [ {value: 'contemporary@gmail.com'} ], name: { formatted: 'Nikolo Fidji'} },
            { id: 13, emails: [ {value: 'diplodoc@gmail.com'} ], name: { formatted: 'Big Dinosaur'} },
            { id: 14, emails: [ {value: 'donald@gmail.com'} ], name: { formatted: 'Ronald The Donald'} },
            { id: 15, emails: [ {value: 'emily@gmail.com'} ], name: { formatted: 'Emily Chickenson'} },
            { id: 16, emails: [ {value: 'esphire@gmail.com'} ], name: { formatted: 'Esphire Solomon'} },
            { id: 17, emails: [ {value: 'ezbytes@gmail.com'} ], name: { formatted: 'John Cena'} },
            { id: 18, emails: [ {value: 'fargo@gmail.com'} ], name: { formatted: 'Folkner James'} },
            { id: 19, emails: [ {value: 'george@gmail.com'} ], name: { formatted: 'Clooney George'} },
            { id: 20, emails: [ {value: 'hiawatha@gmail.com'} ], name: { formatted: 'Hiawatha Smith'} },
            { id: 21, emails: [ {value: 'indiana@gmail.com'} ], name: { formatted: 'Jones Indiana'} },
            { id: 22, emails: [ {value: 'jamesdeen@gmail.com'} ], name: { formatted: 'James Deen'} },
            { id: 23, emails: [ {value: 'kelly@gmail.com'} ], name: { formatted: 'Kelly Capfell'} },
            { id: 24, emails: [ {value: 'lemon@gmail.com'} ], name: { formatted: 'Rachel Lemon'} },
            { id: 25, emails: [ {value: 'miley@gmail.com'} ], name: { formatted: 'Cyrus Miley'} },
            { id: 26, emails: [ {value: 'mila@gmail.com'} ], name: { formatted: 'Jovovich Mila'} },
            { id: 27, emails: [ {value: 'niko@gmail.com'} ], name: { formatted: 'Niko Berutti'} },
            { id: 28, emails: [ {value: 'obara@gmail.com'} ], name: { formatted: 'Obara Snek'} },
            { id: 29, emails: [ {value: 'president@gmail.com'} ], name: { formatted: 'Barack Obama'} },
            { id: 30, emails: [ {value: 'ufo@gmail.com'} ], name: { formatted: 'Green Man'} },
        ]);

        navigator.contacts = {
            fieldType: {
                emails: 'emails',
                name: 'name',
                phoneNumbers: 'phoneNumbers'
            },
            find: function (fields, success, failure, options) {
                window.setTimeout(() => success(mockData), 100);
            }
        };

        window.ContactFindOptions = function () {
        };
    }

    api.findContaining = function (start) {
        if(api.forbidden) return Promise.resolve([]);
        var options = new ContactFindOptions();
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.emails];
        var requiredFields = [navigator.contacts.fieldType.emails];
        return new Promise((resolve, reject) => 
            navigator.contacts.find(requiredFields, resolve, reject, options));
    };

    api.tryCheckPermission = function () {
        if(!!api.enabled) return Promise.resolve(true);
        if(!!api.forbidden) return Promise.resolve(false);
        return api.findContaining('nonexistentstubaddress@stub.com')
            .then(r => {
                api.enabled = true;
                api.forbidden = false;
                return true;
            })
            .catch(e => {
                L.error(e);
                api.enabled = false;
                api.forbidden = true;
                return false;
            });
    };

    api.hasPermission = function () {
        return Promise.resolve(true);
    };
};
