(function () {
    'use strict';

    Peerio.UI.GhostShare = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                passphrase: Peerio.Drafts.Ghost.passphrase,
                recipients: Peerio.Drafts.Ghost.recipients,
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
                            recipients: g.recipients,
                            passphrase: g.passphrase,
                            message: g.message,
                            subject: g.subject,
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
            return 'https://ghost.peerio.com/?' + this.state.id;
        },

        sharePassphrase: function () {
            Peerio.NativeAPI.shareNativeDialog(this.state.passphrase);
        },

        shareLink: function () {
            Peerio.NativeAPI.shareNativeDialog(t('ghost_mobile_share'), t('ghost_mobile_share'), this.getLink() );
        },

        render: function () {
            var eStyles = this.state.has_conv ? null : {'top': 0, zIndex: 10};
            var eClasses = classNames({'content': true, 'without-tab-bar': true, 'flex-col': true});
            return (
                <div className={eClasses} style={eStyles}>
                    <div className="mode ghost-mode flex-grow-1">
                        <div className="headline">{t('ghost_mobile_share')}</div>
                        <p>{t('ghost_mobile_sent')} {this.state.recipients}</p>
                        <p>{t('ghost_mobile_sent_share')}</p>

                        {/* TODO: make look nice */}
                        <p>{this.state.subject}</p>
                        <p>{this.state.message}</p>
                        {/* TODO: make look nice */}

                        <div className="flex-col flex-align-start section-highlight">
                            <label>{t('Passphrase')}</label>
                            <div className="flex-row txt-med flex-align-center">
                                <div className="flex-grow-1">{this.state.passphrase}</div>
                                <Peerio.UI.Tappable element="i" onTap={this.sharePassphrase}
                                                    className="material-icons flex-shrink-0" >
                                    share
                                </Peerio.UI.Tappable>
                            </div>
                        </div>
                        <p className="caption text-red">{t('ghost_passphrase_share_helper')}</p>
                        <p>
                            <label>{t('ghost_passphrase_share_link')}</label>
                        </p>
                        {this.state.id ?
                        <p className="flex-row">
                            <span className="flex-shrink-1 text-overflow">
                                <Peerio.UI.Linkify text={this.getLink()} suppressWarning={true}/>
                            </span>
                            <Peerio.UI.Tappable element="i" onTap={this.shareLink}
                                                className="material-icons flex-shrink-0">
                                share
                            </Peerio.UI.Tappable>
                        </p> : null}
                    </div>
                </div>
            );
        }
    });
} ());
