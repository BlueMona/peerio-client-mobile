/**
 * This is a custom alert component, which is a test of how React portals work.
 *
 * This to universal alert/prompt/confirm component,
 * it communicates through Peerio Actions and allows multiple alerts
 * active at the same time.
 *
 * Using it as a normal (non-portal) React component is not a good idea
 * because it creates strange problems with z-index on iOS WebView,
 * and it will be hard to layer multiple alerts properly.
 *
 */

(function () {
    'use strict';

    Peerio.UI.Confirm = React.createClass({
        statics: {
            show: function(params) {
                return new Promise( (resolve, reject) => {
                    params.onAccept = resolve;
                    params.onReject = reject;
                    Peerio.Action.showConfirm(params);
                });
            }
        },

        render: function () {

            var btns = this.props.btns ||
                    <div>
                        <Peerio.UI.Tappable element="div" className="btn-danger" onTap={this.handleCancel}>Cancel</Peerio.UI.Tappable>
                        <Peerio.UI.Tappable element="div" className="btn-safe" onTap={this.handleAction}>OK</Peerio.UI.Tappable>
                    </div>;

            var text = this.props.text || 'confirm text';

            return (
                <div>
                    <div className="modal alert-wrapper">
                        <div className="alert">

                            <div className="alert-content">
                                <div className="headline-lrg" style={{display: !this.props.headline ? 'none' : null}}>
                                    {this.props.headline}
                                </div>
                                <p>{text}</p>
                            </div>
                            <div className="alert-btns">
                                {btns}
                            </div>
                        </div>
                    </div>
                    <div className="dim-background"></div>
                </div>
            );
        },
        handleAction: function () {
            this.props.onClose();
            this.props.onAccept && this.props.onAccept();
        },
        handleCancel: function(){
            this.props.onClose();
            this.props.onReject && this.props.onReject();
        }
    });


}());
