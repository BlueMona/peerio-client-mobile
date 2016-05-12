(function () {
    'use strict';
    // Main component, entry point for React app
    Peerio.UI.Root = React.createClass({
        componentWillMount: function () {
            // TODO: fix plugin
            // text inputs and text areas lose focus after initial keyboard show
            // we have this bloody hack to fix it
            Peerio.Dispatcher.onKeyboardDidShow(() => {
                if (document.activeElement && !this.keyboardHack) {
                    var activeElement = document.activeElement;
                    window.setTimeout(() => activeElement.blur(), 0);
                    window.setTimeout(() => activeElement.focus(), 0);
                    this.keyboardHack = true;
                    window.setTimeout(() => {
                        this.keyboardHack = null;
                    }, 1000);
                }
            });

            Peerio.Dispatcher.onTwoFactorAuthRequested(this.handle2FA);

            Peerio.Dispatcher.onOnline(() => {
                L.info('ONLINE event received from Navigator. Connecting socket. ');
                Peerio.Socket.connect();
            });

            Peerio.Dispatcher.onOffline(() => {
                L.info('OFFLINE event received from Navigator. Connecting socket. ');
                Peerio.Socket.disconnect();
            });

            Peerio.Dispatcher.onKeyboardDidShow(function () {
                if (!document.activeElement)return;
                var el = document.activeElement;
                if (Peerio.Helpers.getParentWithClass(el, 'no-scroll-hack')) {
                    return;
                }
                el.scrollIntoView({block: 'start', behavior: 'smooth'});
                // ios hack to make input update and move cursor to the right position
                el.value = el.value;
            });

            // version check might already be done by now
            if (Peerio.runtime.expired) this.notifyOnUpdate(true);
            else if (Peerio.runtime.updateAvailable) this.notifyOnUpdate();

            Peerio.Dispatcher.onUpdateAvailable(this.notifyOnUpdate);

            Peerio.Dispatcher.onLocaleChanged(()=> this.forceUpdate());
            // no need to unsubscribe, this is the root component

            Peerio.Dispatcher.onSettingsUpdated(settings => {
                if(Peerio.Translator.forceLocaleOnLogin) {
                    Peerio.Translator.forceLocaleOnLogin = null;
                    Peerio.user.setLocale(Peerio.Translator.locale);
                }
                else if(Peerio.Translator.locale !== Peerio.user.settings.localeCode) {
                    var locale = Peerio.user.settings.localeCode;
                    Peerio.Translator.loadLocale(locale);
                    Peerio.Helpers.savePreferredLocale(locale);
                }
            });

            // TODO: remove mock when server responds well
            Peerio.Dispatcher.onPaymentProductUpdated( p => {
                if(!Peerio.user.subscription && p.owned) {
                    Peerio.user.subscription = { active: true, amount: 50 * 1024 * 1024 * 1024 };
                }
            });

            Peerio.Dispatcher.onServerWarning(warning => {
                Peerio.UI.Alert.show({ text: warning.msg, serviceClass: '_serverWarning' })
                    .then(() => Peerio.user.clearWarning(warning));
            });
        },
        notifyOnUpdate: function (expired) {
            var text = expired
                ? t('appUpdate_critical')
                : t('appUpdate_normal');

            Peerio.Action.showConfirm({
                headline: t('appUpdate_available'),
                text: text,
                onAccept: ()=>Peerio.NativeAPI.openInBrowser('https://peerio.com')
            });
        },

        handle2FA: function (resolve, reject, retry) {
            L.info('2fa requested');
            this.blurEssential(true);
            Peerio.UI.Prompt.show({
                    text: retry ? t('2fa_invalid') : t('2fa_prompt'),
                    inputType: 'numeric',
                    autoSubmitLength: 6,
                    minLength: 6,
                    cancelText: t('signOut')
                })
                .then((code) => {
                    L.info('2fa resend requested');
                    Peerio.Net.validate2FA(code, Peerio.user.username, Peerio.user.publicKey)
                        .then(resolve)
                        .catch(() => this.handle2FA(resolve, reject, true));
                })
                .catch(() => {
                    L.info('2fa rejected by user');
                    Peerio.NativeAPI.signOut();
                    reject({
                        code: 411, // any special code for user cancel?
                        message: '2FA authentication cancelled by user'
                    });
                })
                .finally(() => {
                    this.blurEssential(false);
                });
        },

        blurEssential: function (blur) {
            [].forEach.call(document.getElementsByClassName('essential'),
                i => {
                    blur ? i.classList.add('blur') :
                        i.classList.remove('blur');
                });
        },

        render: function () {
            return (
                <div>
                    <RouteHandler/>
                    <Peerio.UI.Portal/>
                </div>
            );
        }
    });

}());
