(function () {
    'use strict';

    Peerio.UI.GhostShare = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                passphrase: Peerio.Drafts.Ghost.passphrase,
                email: Peerio.Drafts.Ghost.email,
                id: Peerio.Drafts.Ghost.id,
                has_conv: this.props.params && this.props.params.id
            };
        },

        componentDidMount: function () {
            if(this.props.params && this.props.params.id) {
                Peerio.Conversation.getPrevMessagesPage(this.props.params.id, 0, 1)
                    .then(c => {
                        var g = JSON.parse(c[0].body);
                        this.setState({
                            email: g.recipient,
                            passphrase: g.passphrase,
                            id: g.id
                        });
                    })
                    .catch(err => {
                        Peerio.Action.showAlert({text: t('error_loadingConversation')});
                        L.error('Failed to load ghost. {0}', err);
                        this.goBack();
                    });
            }
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(() => this.transitionTo('messages'))
            ];

            Peerio.Drafts.Ghost = {};
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        getLink: function () {
            return 'https://ghost.peerio.com/g/' + this.state.id;
        },

        sharePassphrase: function () {
            Peerio.NativeAPI.shareNativeDialog(this.state.passphrase);
        },

        shareLink: function () {
            Peerio.NativeAPI.shareNativeDialog(t('ghost_mobile_share'), t('ghost_mobile_share'), this.getLink() );
        },

        render: function () {
            var eStyles = this.state.has_conv ? null : {'top': 0, zIndex: 10};
            var eClasses = classNames({'content': true, 'without-tab-bar': true});
            return (
                <div className={eClasses} style={eStyles}>
                    <div className="headline">{t('ghost_mobile_share')}</div>
                    <p>{t('ghost_mobile_sent')} {this.state.email}</p>
                    <p>{t('ghost_mobile_sent_share')}</p>

                    <p><label>{t('Passphrase')}</label></p>
                    <div className="flex-row" style={{'font-weight': 'bold', 'background': '#EFEFEF', 'line-height': '2em', 'padding': '0.5em'}}>
                        <div style={{'width': '80%', 'text-align': 'center'}}>
                        {this.state.passphrase}
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.sharePassphrase}
                                            className="material-icons">
                            share
                        </Peerio.UI.Tappable>
                    </div>
                    <p>
                        <small>
                        {t('ghost_passphrase_share_helper')}
                        </small>
                    </p>
                    {this.state.id ? 
                    <div className="flex-row" style={{'line-height': '1em', 'padding': '1em'}}>
                        <p>{t('ghost_passphrase_share_link')}</p>
                        <div style={{'font-size': '80%', 'width': '80%', 'text-align': 'center'}}>
                            {this.getLink()}
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.shareLink}
                                            className="material-icons">
                            share
                        </Peerio.UI.Tappable>
                    </div> : null}
                </div>
            );
        }
    });
} ());
