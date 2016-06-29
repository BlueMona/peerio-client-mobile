(function () {
    'use strict';

    Peerio.UI.GhostShare = React.createClass({
        mixins: [ReactRouter.Navigation],

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(() => this.transitionTo('messages'))
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        shareEverything: function () {
        },

        render: function () {
            return (
                <div className="content without-tab-bar" style={{'top': 0, zIndex: 10}}>
                    <div className="headline">{t('ghost_mobile_share')}</div>
                    <p>{t('ghost_mobile_sent')} {Peerio.Drafts.Ghost.email}</p>
                    <p>{t('ghost_mobile_sent_share')}</p>

                    <p><label>{t('Passphrase')}</label></p>
                    <div className="flex-row" style={{'font-weight': 'bold', 'background': '#EFEFEF', 'line-height': '3em', 'padding': '1em'}}>
                        <div style={{'width': '80%', 'text-align': 'center'}}>
                        {Peerio.Drafts.Ghost.passphrase}
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.shareEverything}
                                            className="material-icons">
                            share
                        </Peerio.UI.Tappable>
                    </div>
                    <p>
                        <small>
                        {t('ghost_passphrase_share_helper')}
                        </small>
                    </p>
                    <p>{t('ghost_passphrase_share_link')}</p>


                    <div className="flex-row" style={{'font-size': '80%', 'line-height': '1em', 'padding': '1em'}}>
                        <div style={{'width': '80%', 'text-align': 'center'}}>
                            https://ghost.peerio.com/g/u73i-908a
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.shareEverything}
                                            className="material-icons">
                            share
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });
} ());
