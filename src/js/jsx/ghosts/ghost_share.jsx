(function () {
    'use strict';

    Peerio.UI.GhostShare = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                passphrase: Peerio.Drafts.Ghost.passphrase,
                email: Peerio.Drafts.Ghost.email,
                id: Peerio.Drafts.Ghost.id,
            };
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(() => this.transitionTo('messages'))
            ];

            Peerio.Drafts.Ghost = {};
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
                    <p>{t('ghost_mobile_sent')} {this.state.email}</p>
                    <p>{t('ghost_mobile_sent_share')}</p>

                    <p><label>{t('Passphrase')}</label></p>
                    <div className="flex-row" style={{'font-weight': 'bold', 'background': '#EFEFEF', 'line-height': '2em', 'padding': '0.5em'}}>
                        <div style={{'width': '80%', 'text-align': 'center'}}>
                        {this.state.passphrase}
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
                            {'https://ghost.peerio.com/g/' + this.state.id}
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
