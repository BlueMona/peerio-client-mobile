/**
 * DO NOT EDIT THIS FILE,
 * unless you are introducing a new debug property
 *
 * On development machines
 * 1. copy this file to repository root and name it debug.js
 * 2. fill the properties
 * 3. never add it to git or send to anyone unless you removed sensitive info from it
 *
 * This file is meant to be used on development machines only.
 * Development server has it's root configured in repository root rather then www folder
 * which allows it to request files from repository root so it can load <script scr='../debug.js'>
 *
 * On devices debug.js will 404, which is ok.
 *
 */

// just initializing the object
PeerioDebug = {};
// this will be typed into login form as default value
PeerioDebug.user = 't20160506204943';
PeerioDebug.pass = 'dan jackpot welfare gen rang';

PeerioDebug.server = 'wss://hocuspocus.peerio.com';

// PeerioDebug.logLevel = 3;

// test find and tap capabilities

PeerioDebug.AutomationEnabled = true;

PeerioDebug.afterStart = function() {
    Peerio.Helpers.sleep(2000)
    .then(() => Peerio.Helpers.simulateTouchSelector('.btn-safe'))
    .then(() => Peerio.Helpers.sleep(1000))
    .then(() => document.querySelector('.tab') ? true : Promise.reject('not loaded'))
    .then(() => window.location = '#/app/payments');
};
