/**
 * Cordova/Native API wrapper
 * Allows us to abstract away platform api differences
 *
 * Before using this API you need to call Peerio.NativeAPI.initialize() after DeviceReady event.
 *
 */

var Peerio = this.Peerio || {};
Peerio.NativeAPI = {};

Peerio.NativeAPI.init = function () {
    'use strict';

    var api = Peerio.NativeAPI;
    delete Peerio.NativeAPI.init;

    var cordova = window.cordova;
    var initializers = {};

    //----- internal helpers
    function getGenericMsg(name) {
        return (name ? name + ': ' : '') + 'Native API not available';
    }

    function getFileApiGenericInitializer(name) {
        return function () {
            if (cordova && cordova.file) return;

            return Promise.reject.bind(null, getGenericMsg(name));
        };
    }

    /**
     * Opens url in inAppBrowser
     * @param url
     */
    api.openInBrowser = function (url) {
        cordova.InAppBrowser.open(url, '_system');
    };

    initializers.openInBrowser = function () {
        if (cordova && cordova.InAppBrowser) return;

        return window.open;
    };

    /**
     * Hide software keyboard
     */
    api.hideKeyboard = function () {
        Keyboard.hide();
    };

    initializers.hideKeyboard = function () {
        if (window.Keyboard && Keyboard.hide)
            return;

        return console.log.bind(console, getGenericMsg('hideKeyboard'));
    };

    /**
     * For IOS only. Hides "accessory bar" with "next", "previous" and "done" buttons.
     */
    api.hideKeyboardAccessoryBar = function () {
        Keyboard.hideFormAccessoryBar(true);
    };

    initializers.hideKeyboardAccessoryBar = function () {
        if (window.Keyboard && Keyboard.hideFormAccessoryBar)
            return;

        return console.log.bind(console, getGenericMsg('hideKeyboardAccessoryBar'));
    };
    /**
     *  When keyboard is open, shrinks the webview instead of viewport
     */
    api.shrinkViewOnKeyboardOpen = function () {
        Keyboard.shrinkView(true);
    };

    initializers.shrinkViewOnKeyboardOpen = function () {
        if (window.Keyboard && Keyboard.shrinkView)
            return;

        return console.log.bind(console, getGenericMsg('shrinkViewOnKeyboardOpen'));
    };

    /**
     * Get app version from config.xml
     * @param {function(string)} callback
     */
    api.getAppVersion = function () {
        return (window.AppVersion && AppVersion.version) || 'n/a';
    };

    /**
     * Takes picture from camera or photo library
     * @param {bool} camera - set true to take a new picture instead of picking from the library
     * @returns {Promise<string>} - file url
     */
    api.takePicture = function (camera) {
        return new Promise(function (resolve, reject) {
            navigator.camera.getPicture(resolve, reject,
                { // please, don't change properties without (re)reading docs on them first and testing result after
                    // yes, Anri, especially you!
                    sourceType: camera ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.ALLMEDIA,
                    cameraDirection: Camera.Direction.BACK,
                    allowEdit: false,
                    correctOrientation: true,
                    saveToPhotoAlbum: false,
                    quality: 90
                });
        });
    };

    api.enablePushNotifications = function () {
        console.log("enabling push notifications");
        var push = PushNotification.init({ 
         "ios": {"alert": "true", "badge": "true", "sound": "true"}} );
        push.on('registration', function(data) {
            console.log( "push notification reg.id: " + data.registrationId );
        });
        push.on('notification', function(data) {
            console.log( "push notification message: " + data.message );
            console.log( "push notification title: " + data.title );
            console.log( "push notification count: " + data.count );
        });

        push.on('error', function(e) {
            console.log( "push notification error: " + e.message );
        });
    };

    initializers.takePicture = function () {
        if (navigator.camera)
            return;

        return console.log.bind(console, getGenericMsg('takePicture'));
    };

    /**
     * Removes all temporary pictures taken with previous cordova camera plugin calls
     */
    api.cleanupCamera = function(){
        navigator.camera.cleanup();
    };

    initializers.cleanupCamera = function () {
        if (navigator.camera)
            return;

        return console.log.bind(console, getGenericMsg('cleanupCamera'));
    };

//--------------------------------------------------------------------------------------------------------------------
    _.forOwn(initializers, function (fn, name) {
        // if initializer returns alternative function
        // (usually a mock that is safe to call)
        // assign that function instead of original one
        var alterFn = fn();
        if (alterFn) api[name] = alterFn;
    });
    // cleaning memory
    initializers = null;
    //--------------------------------------------------------------------------------------------------------------------
};
