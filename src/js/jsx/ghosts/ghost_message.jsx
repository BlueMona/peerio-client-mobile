(function () {
  'use strict';

    Peerio.UI.GhostMessage = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                open: false,
                has_conv: this.props.params && this.props.params.id,
                files: []
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
                            message: g.message,
                            subject: g.subject,
                            files: g.files || [],
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

        toggle: function () {
            this.setState({open: !this.state.open});
        },

        render: function () {
            return (
              <div>
                <Peerio.UI.Tappable id="conversation-head" onTap={this.toggle}>
                    <div className={'participants' + (this.state.open ? ' open' : '')}>
                      {this.state.email}
                    </div>
                    <div className="conversation-info">
                        <div className="subject">
                            {this.state.subject}
                        </div>
                        {/*
                            currently used to left align subject,
                            future functionality could mimic messages once we allow users to send to multiple recipients
                        */}
                        <div className="counter"></div>
                        <div>
                          <i className="material-icons">info_outline</i>
                        </div>
                    </div>
                </Peerio.UI.Tappable>
                <div className="content without-tab-bar without-footer flex-col ghost">
                    <div className="flex-grow-1">
                        <ul className={'attached-files' + (this.state.files.length ? '' : ' removed')}>
                            {this.state.files.map((file, i) => {
                                return (
                                    <li className={'attached-file'}>
                                        { this.state.files.length ? file.name : null }
                                    </li>);
                            })}
                        </ul>
                        <p>{this.state.message}</p>
                    </div>

                    <p>
                      <label>{t('Passphrase')}</label>
                    </p>
                    <div className="flex-row flex-align-center section-highlight">
                        <div className="flex-grow-1">
                            {this.state.passphrase}
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.sharePassphrase}
                                            className="material-icons flex-shrink-0" >
                            share
                        </Peerio.UI.Tappable>
                    </div>
                    <p>
                        <small>
                        {t('ghost_passphrase_share_helper')}
                        </small>
                    </p>
                    <p>{t('ghost_passphrase_share_link')}</p>
                    {this.state.id ?
                    <div className="flex-row" style={{'font-size': '80%', 'line-height': '1em', 'padding': '1em'}}>
                        <div className="flex-shrink-1 text-overflow">
                            <a href={this.getLink()} target="_blank">{this.getLink()}</a>
                        </div>
                        <Peerio.UI.Tappable element="i" onTap={this.shareLink}
                                            className="material-icons flex-shrink-0">
                            share
                        </Peerio.UI.Tappable>
                    </div> : null}
                </div>
              </div>
            );
        }
    });
}());
