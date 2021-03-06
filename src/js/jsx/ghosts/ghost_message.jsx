(function () {
  'use strict';

    Peerio.UI.GhostMessage = React.createClass({
        mixins: [Peerio.Navigation],

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
                            recipients: g.recipients,
                            passphrase: g.passphrase,
                            message: g.message,
                            subject: g.subject,
                            files: g.files || [],
                            lifeSpanInSeconds: g.lifeSpanInSeconds,
                            expired: Peerio.Ghost.expired(g),
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
                      {this.state.recipients ? this.state.recipients.join(', ') : null}
                    </div>
                    <div className="conversation-info">
                        <div className="subject">
                            {this.state.subject}
                        </div>
                        <div className="counter">
                            {this.state.id && !this.state.expired ?
                                <Peerio.UI.Tappable element="i" onTap={this.shareLink}
                                                    className="material-icons flex-shrink-0">
                                    link
                                </Peerio.UI.Tappable> : null}
                        </div>
                        <div className="info">
                            <i className="material-icons">info_outline</i>
                        </div>

                    </div>
                </Peerio.UI.Tappable>
                <div className="content without-tab-bar without-footer flex-col ghost">
                  {this.state.expired ?
                      <div className="flex-row flex-align-center section-highlight flex-shrink-0">
                          <div className="flex-grow-1">
                              <span className="text-red txt-med">{t('ghost_expired') + ' ' + moment(this.state.expired).format('MMMM Do YYYY, h:mm:ss')}</span>
                          </div>
                      </div> :
                      <div>
                          <div className="flex-col flex-align-start section-highlight flex-shrink-0">
                              <label>{t('Passphrase')}</label>
                              <div className="flex-row txt-med flex-align-center">
                                  <div className="flex-grow-1">{this.state.passphrase}</div>
                                    <Peerio.UI.Tappable element="i" onTap={this.sharePassphrase}
                                                        className="material-icons flex-shrink-0">
                                        share
                                    </Peerio.UI.Tappable>
                              </div>
                          </div>
                          <p className="caption text-red" style={{marginBottom: '16px'}}>
                              {t('ghost_passphrase_share_helper')}
                          </p>
                      </div>}

                    <div className="flex-grow-1">
                        <ul className={'attached-files' + (this.state.files.length ? '' : ' removed')}>
                            {this.state.files.map((file, i) => {
                                return (
                                    <li className={'attached-file'}>
                                        <span>{ this.state.files.length ? file.name : null }</span>
                                    </li>);
                            })}
                        </ul>
                        <p>{this.state.message}</p>
                    </div>


                    {/*{this.state.id && !this.state.expired ?
                      <div>
                        <p>{t('ghost_passphrase_share_link')}</p>
                        <p className="flex-row caption">
                            <Peerio.UI.Linkify text={this.getLink()} suppressWarning={true}/>
                            <Peerio.UI.Tappable element="i" onTap={this.shareLink}
                                                className="material-icons flex-shrink-0">
                                share
                            </Peerio.UI.Tappable>
                        </p></div> : null}*/}
                </div>
              </div>
            );
        }
    });
}());
