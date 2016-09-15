(function () {
    'use strict';

    var PIN_LENGTH = 6;

    Peerio.UI.PinInput = React.createClass({
        statics: {
            getPinLength: function () {
                return PIN_LENGTH;
            }
        },

        getInitialState: function () {
            return {
                pin: '',
                touchid: false,
                failNumber: 0
            };
        },

        getDefaultProps: function () {
            return {
                pinLength: PIN_LENGTH
            };
        },

        handleNumTap: function (num) {
            if (this.state.pin.length >= this.props.pinLength) {
                return;
            }
            this.setState({pin: this.state.pin + num}, () => {
                if (this.state.pin.length === this.props.pinLength) {
                    this.props.onEnterPin(this.state.pin, this.props.onClose, this.handleLoginFail);
                    this.setState({pin: '', inProgress: true});
                }
            });
        },

        handleLoginFail: function (errorText, callback) {
            if (this.state.failNumber > 1) {
                this.setState({failNumber: 0}, () => {
                    window.setTimeout(() => this.handleLoginFail(), 10000);
                });
                return;
            }
            this.refs.pinPad.getDOMNode().classList.add('shake');
            this.setState({failNumber: this.state.failNumber + 1, inProgress: false, errorText: errorText});
            window.setTimeout(() => {
                this.refs.pinPad.getDOMNode().classList.remove('shake');
                this.setState({ errorText: undefined });
                callback && callback();
            }, 1000);
        },

        renderTextButton: function (item) {
            return (
                <Peerio.UI.Tappable
                    tag="div"
                    className="btn"
                    onTap={this.state.inProgress ? null : item.handler}>
                    <div className="number-key-content">{item.text}</div>
                </Peerio.UI.Tappable>
            );
        },

        renderNumButton: function (num) {
            return (
                <Peerio.UI.Tappable
                    tag="div"
                    className="number-key"
                    onTap={this.state.inProgress ? null : this.handleNumTap.bind(this, num)}>
                    <div className="number-key-content">{num}</div>
                </Peerio.UI.Tappable>
            );
        },

        renderRow: function (nums) {
            return (
                <div className="flex-row flex-justify-center">
                    { nums.map((num) =>
                        num.text ? this.renderTextButton(num) : this.renderNumButton(num)) }
                </div>
            );
        },

        renderIndicators: function (activeLength, maxLength) {
            return (
                <div className="pin-code">
                    { Array.apply(null, new Array(activeLength)).map(() =>
                        <div className="pin-indicator active"></div>
                    )}

                    { Array.apply(null, new Array(maxLength - activeLength)).map(() =>
                        <div className="pin-indicator"></div>
                    )}
                </div>
            );
        },

        renderTouchID: function () {
            return this.props.hideTouchID ? null : (
                <Peerio.UI.Tappable
                    element="div"
                    className="btn flex-justify-center flex-col"
                    onTap={this.state.inProgress ? null : this.props.onTouchID}>
                    <i className="material-icons">fingerprint</i>
                </Peerio.UI.Tappable>
            );
        },

        deletePIN: function () {
            this.setState({
                pin: this.state.pin.slice(0, -1)
            });
        },

        renderPINDelete: function () {
            return (
                <Peerio.UI.Tappable
                    element="div"
                    className="btn flex-justify-center flex-col"
                    onTap={this.state.inProgress ? null : this.deletePIN}>
                    {t('button_delete')}
                </Peerio.UI.Tappable>
            );
        },

        renderProgress: function () {
            return (
                <Peerio.UI.TalkativeProgress enabled={true} showSpin={true} hideText={true}/>
            );
        },

        componentWillMount: function () {
            this.props.username && Peerio.UI.TouchId.hasTouchID(this.props.username)
                .then((value) => this.setState({touchid: !!value}));
            Peerio.NativeAPI.hideKeyboard();
        },

        render: function () {
            var footer = !this.props.hideNormalFooter ?
                    <div id="footer">
                        {this.props.hideChangeUser ? null : this.renderTextButton({
                            text: t('login_changeUserButton'),
                            handler: this.props.onChangeUser
                        })
                        }
                        { !this.props.hideTouchID && this.state.touchid && !this.state.pin.length ?
                            this.renderTouchID() :
                            this.state.pin.length ?
                                this.renderPINDelete() : null
                        }
                    </div> : null;

            var customFooter = this.props.showExitTitle ?
                    <div id="footer">
                        {
                            this.state.pin.length ?
                        this.renderPINDelete() : <div></div> }
                        {this.props.showExitTitle ? this.renderTextButton({
                            text: this.props.showExitTitle,
                            handler: () => {
                                this.props.onClose && this.props.onClose();
                                this.props.onExit && this.props.onExit();
                            }
                        }) : null}
                    </div> : null;
            return (
                <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, zIndex: 100, color: 'white' }}>
                    <div className="modal pin-pad" ref="pinPad">
                        <div className="headline-md text-center margin-small padding-small text-overflow">
                            {this.state.errorText || this.props.title || t('login_welcomeBack')} <strong>{this.props.firstname}</strong>
                        </div>
                        { this.state.inProgress ?
                            this.renderProgress() :
                        this.renderIndicators(this.state.pin.length, this.props.pinLength) }
                        {this.renderRow([1, 2, 3]) }
                    {this.renderRow([4, 5, 6]) }
                    {this.renderRow([7, 8, 9]) }
                    {this.renderRow([0]) }
                        {footer}
                        {customFooter}
                    </div>
                </div>
                );
        }
    });

}());
