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

    Peerio.UI.Alert = React.createClass({
        statics: {
            show: function(params) {
                return new Promise( (resolve, reject) => {
                    params.onAccept = resolve;
                    Peerio.Action.showAlert(params);
                });
            }
        },

        getDefaultProps: function () {
            return {exclusive: true};
        },

        handleAction: function() {
            this.props.onClose();
            this.props.onAccept && this.props.onAccept();
        },

        render: function () {

            var btns = this.props.btns ||
                (<div>
                    <Peerio.UI.Tappable element="div" className="btn-safe"
                                        onTap={this.handleAction}>{t('button_ok')}</Peerio.UI.Tappable>
                </div>);

            var text = this.props.text || '';
            text = this.props.linkify ? <Peerio.UI.Linkify text={text} onOpen={Peerio.NativeAPI.openInBrowser}/> : text;

            return (
                <div className={classNames('modal', 'alert-wrapper', this.props.serviceClass)}>
                    <div className="alert">
                        <div className="alert-content">
                            <div className={'headline' + (!this.props.headline ? ' hide' : '')}>
                                {this.props.headline}
                            </div>
                            {this.props.icon ?
                                <div className='alert-icon flex-row flex-justify-center flex-align-center'><img src={this.props.icon} /></div> : null }
                            <p className="selectable-text">{text}</p>
                        </div>

                        <div className="alert-btns">
                            {btns}
                        </div>
                    </div>
                    <div className={classNames('dim-background', {'no-animation': this.props.noAnimation})}></div>
                </div>
            );
        }
    });

}());
