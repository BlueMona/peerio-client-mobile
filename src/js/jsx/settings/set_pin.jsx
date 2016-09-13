(function () {
    'use strict';

    var PIN_LENGTH = 6;

    Peerio.UI.SetPin = React.createClass({
        mixins: [Peerio.Navigation, Peerio.UI.AutoFocusMixin],

        getInitialState: function () {
            return {
                inProgress: false,
                newPin: null
            };
        },

        removePinModal: function () {
            Peerio.user.removePIN()
                .catch(err =>L.error('Failed to remove passcode. {0}', err))
                .finally(()=>this.forceUpdate());
        },
        removePIN: function () {
            Peerio.Action.showConfirm({
                headline: t('passcode_remove'),
                text: t('passcode_removeConfirm'),
                onAccept: this.removePinModal
            });
        },

        pinIsSane: function () {
            return this.state.newPin && this.state.newPin.length === PIN_LENGTH
                && Peerio.user.pinEntropyCheck(this.state.newPin);
        },

        newPinChange: function (event) {
            if (event.target.value.length > Peerio.UI.PinInput.getPinLength()) return;
            this.setState({newPin: event.target.value});
        },

        setDevicePin: function () {
            var newPin = this.state.newPin;
            if (!newPin) return;
            var self = this;
            self.setState({inProgress: true});
            Peerio.user.setPIN(newPin)
                .then(() => {
                    if (this.props.onSuccess) this.props.onSuccess();
                })
                .catch(err=> L.error('Failed to set passcode. {0}', err))
                .finally(function () {
                    self.setState({inProgress: false});
                });
        },
        //--- RENDER
        render: function () {
            var pinUI = '';
            var header = !!this.props.hideHeader ? null : (
                <div className="headline-md">{t('passcode_title')}</div>
            );
            var pinIsSane = this.pinIsSane();
            var message = t('passcode_tooSimple');
            if (!this.state.newPin)
                message = t('passcode_notDistinct');
            else if (this.state.newPin.length && this.state.newPin.length != PIN_LENGTH)
                message = t('passcode_tooShort', {number:PIN_LENGTH - this.state.newPin.length});
            else if (pinIsSane)  message = t('passcode_ok');

            var setPinButton = !this.state.inProgress && pinIsSane ? (

                <Peerio.UI.Tappable
                    element="div"
                    className="btn-safe"
                    onTap={this.setDevicePin}>{t('setup_passcodeTitle')}</Peerio.UI.Tappable>

            ) : null;
            if (Peerio.user.PINIsSet) {
                pinUI =
                    (<div className="buttons">
                        <Peerio.UI.Tappable
                            element="div"
                            className="btn-danger"
                            onTap={this.removePIN}>{t('passcode_removeTitle')}</Peerio.UI.Tappable>
                    </div>);
            } else if (!this.state.inProgress) {
                pinUI =
                    (<div>
                            <div className="input-group flex-col flex-justify-center">
                                <label htmlFor="passcode">
                                    {t('passcode_restriction')}
                                </label>
                                <input className="text-center"
                                       type="number" required="required" ref="textEdit"
                                       data-password="yes"
                                       placeholder={t('passcode_inputPlaceholder')}
                                       pattern="[0-9]*"
                                       value={this.state.newPin}
                                       inputmode="numeric"
                                       onChange={this.newPinChange}
                                       id="passcode"/>
                                <p className="info-small text-center"><b>{message}</b></p>
                            </div>
                            <div className="buttons">
                                {setPinButton}
                            </div>
                        </div>
                    );
            }

            return (
                <div className="_setPin">
                    {header}
                    <Peerio.UI.TalkativeProgress
                        enabled={this.state.inProgress}
                        showSpin="true" />
                    {pinUI}
                </div>

            );
        }
    });

}());
