var Peerio = this.Peerio || {};

(function () {
    'use strict';
    var base = ReactRouter.Navigation;

    function applyHideKeyboard(fn) {
        return function () {
            var f = fn;
            Peerio.runtime && (Peerio.runtime.platform == 'ios') && Peerio.NativeAPI.hideKeyboard();
            f.apply(this, arguments);
        };
    }
    Peerio.Navigation = {
        contextTypes: base.contextTypes,
        makeHref: base.makeHref,
        makePath: base.makePath,
        replaceWith: applyHideKeyboard(base.replaceWith),
        goBack: applyHideKeyboard(base.goBack),
        transitionTo: applyHideKeyboard(base.transitionTo)
    };
}());
