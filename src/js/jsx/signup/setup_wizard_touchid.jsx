(function () {
    'use strict';

    Peerio.UI.SetupWizardTouchID = React.createClass({

        getInitialState: function(){
          return {};
        },

        componentWillMount: function () {
            Peerio.UI.TouchId.setUserSeenOffer();
            Peerio.NativeAPI.isForcefulFingerprintEnabled()
                .then(value => this.setState({fingerPrintWarning: value}));
        },

        enableTouchID: function () {
            Peerio.UI.TouchId.setUserSeenBubble()
                .then(() => Peerio.UI.TouchId.enableTouchId())
                .finally(() => this.props.onSuccess());
        },

        render: function () {
            return (
                <div className="animate-enter">
                    <div className="headline">{t('setup_touchTitle')}</div>
                    <p>{t('setup_touchDescription')}</p>
                    { this.state.fingerPrintWarning ? (<p>{t('setup_touchWarning')}</p>) : null }
                    <div className="buttons">
                        <Peerio.UI.Tappable element="div" className="btn-safe"
                            onTap={this.enableTouchID}>{t('button_enable')}</Peerio.UI.Tappable>
                    </div>
                </div>);
        }
    });

}());
