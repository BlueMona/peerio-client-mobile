(function () {
    'use strict';

    // Main component, entry point for React app
    Peerio.UI.Conversation = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        //----- REACT EVENTS
        getInitialState: function () {
            return {
                // unsent attachments to the message that will be sent next, if user taps "send"
                attachments: [],
                conversation: null,
                sending: false,
                empty: true,
                removed: null
            };
        },
        componentWillMount: function () {
            Peerio.Conversation(this.props.params.id)
                .load()
                .then(c => this.setState({conversation: c}, this.disableIfLastParticipant)) //todo, also call disable on conv update
                .catch(err => {
                    Peerio.Action.showAlert({text: t('error_loadingConversation')});
                    L.error('Failed to load conversation. {0}', err);
                    this.goBack();
                });
        },
        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(this.reply),
                Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
                Peerio.Dispatcher.onConversationsUpdated(this.handleConversationsUpdated),
                Peerio.Dispatcher.onKeyboardDidShow(() => {
                    if (!this.keyboardHack) {
                        window.setTimeout(() => this.refs.reply.getDOMNode().blur(), 0);
                        window.setTimeout(() => this.refs.reply.getDOMNode().focus(), 0);
                        this.keyboardHack = true;
                    }
                    window.setTimeout(() => {
                        this.keyboardHack = null;
                    }, 1000);
                    this.refs.content.scrollToBottom();
                })
            ];

            // to update relative timestamps
            this.renderInterval = window.setInterval(this.forceUpdate.bind(this), 20000);
            //this.markAsRead();
        },
        componentWillUnmount: function () {
            window.clearInterval(this.renderInterval);
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        componentDidUpdate: function () {
            if (this.state.conversation) this.markAsRead();
        },
        //----- CUSTOM FN
        markAsRead: _.throttle(function () {
            var item = this.refs.content && this.refs.content.getLastItem();
            if (!item) return;

            this.state.conversation.markAsRead(item.seqID);
        }, 1000),
        handleConversationsUpdated: function (data) {
            if (data.updated && (data.updated.length === 0 || data.updated.indexOf(this.props.params.id) != -1)) {
                this.state.conversation.loadReadPositions()
                    .then(()=>this.refs.content.loadNextPage(true));
//                this.refs.content.refresh(()=>this.scrollToBottom());
            }
            if (data.deleted) {
                if (data.deleted.length && data.deleted.indexOf(this.props.params.id) != -1)
                    this.goBack();
                else
                    Peerio.Conversation(this.props.params.id).load().catch(err => this.goBack());
            }
        },

        openFileSelect: function () {
            Peerio.NativeAPI.hideKeyboard();
            Peerio.Action.showFileSelect({preselected: this.state.attachments.slice()});
        },

        fileShared: function (file) {
            this.forceUpdate();
        },

        acceptFileSelection: function (selection) {
            this.setState({attachments: selection}, this.onTextChanged);
        },

        sendAck: function () {
            this.reply(true);
        },

        sendReply: function () {
            this.reply(false);
        },
        reply: function (ack) {
            var body, files;
            if (ack) {
                body = Peerio.ACK_MSG;
                files = [];
            } else {
                var node = this.refs.reply.getDOMNode();
                if (node.value.isEmpty()) return;
                body = node.value;
                files = this.state.attachments;
            }
            this.setState({sending: true});
            this.state.conversation.reply(this.state.conversation.participants, body, files)
                .then((msg) => {
                    if (msg.failed && msg.failed.length) {
                        Peerio.UI.Alert.show({
                            text: t('error_messageDelivery') + ' ' + msg.failed.join(', ')
                        });
                    }
                    if (!ack) {
                        node.value = '';
                        this.setState({attachments: []});
                    }
                })
                .catch(err => {
                    L.error("Failed to send message. {0}", err);
                    Peerio.Action.showAlert({text: t('error_messageSend') + ' ' + (err || '')})
                })
                .finally(()=> {
                    this.setState({sending: false}, this.onTextChanged);
                });
        },
        // grows textarea height with content up to max-height css property value
        // or shrinks down to 1 line
        onTextChanged: function () {
            var node = this.refs.reply.getDOMNode();
            node.style.height = node.scrollHeight + 'px';
            if (node.value.isEmpty() && this.state.attachments.length === 0) {
                if (!this.state.empty) this.setState({empty: true})
            } else {
                if (this.state.empty) this.setState({empty: false});
            }
        },
        scrollToBottom: function () {
            if (!this.refs.content) return;
            var contentNode = this.refs.content.getDOMNode();
            setTimeout(function () {
//                contentNode.scrollTop = contentNode.scrollHeight;
                TweenLite.to(contentNode, .3, {scrollTo: {y: contentNode.scrollHeight}});
            }, 200);
        },
        disableIfLastParticipant: function () {
            // If I'm the only one who has left in this conversation
            if (this.state.conversation.participants.length === 0) {
                // But there were other people before
                if (this.state.conversation.exParticipantsArr.length > 0) {
                    // then disable reply
                    this.setState({
                        textEntryDisabled: true,
                        placeholderText: t('conversation_noParticipants')
                    });
                } else {
                    // otherwise just inform user that this was never shared with anyone
                    this.setState({placeholderText: t('conversation_withSelf')});
                }
            }
            else {
                // normal case
                this.setState({placeholderText: 'message_typePrompt'});
            }
        },

        getPrevPage: function (lastItem, pageSize) {
            var lastSeqID = lastItem ? lastItem.seqID : Number.MAX_SAFE_INTEGER;

            return Peerio.Conversation.getNextMessagesPage(this.props.params.id, lastSeqID, pageSize);
        },

        getPage: function (lastItem, pageSize) {
            var lastSeqID = lastItem ? lastItem.seqID : 0;
            return Peerio.Conversation.getPrevMessagesPage(this.props.params.id, lastSeqID, pageSize);
        },

        getItemsRange: function (from, to) {
            // here from and to must be reversed
            return Peerio.Conversation.getMessagesRange(this.props.params.id, to, from);
        },

        detachFile: function (id) {
            this.setState({removed: id});
            var index = this.state.attachments.indexOf(id);

            setTimeout(() => {
                if (index != -1) {
                    this.state.attachments.splice(index, 1);
                    this.setState({attachments: this.state.attachments}, this.onTextChanged);
                    this.setState({removed: null});
                }
            }, 350);
        },

        //----- RENDER
        render: function () {
            // todo: loading state
            if (!this.state.conversation) return <Peerio.UI.FullViewSpinner/>;
            var conversation = this.state.conversation;

            // note: reply has fixed positioning and should not be nested in .content,
            // this causes unwanted scroll when typing into text box
            //TODO: textarea onfocus was set to scrollToBottom but was triggered on every element focus 0_0
            return (
                <div>
                    <Peerio.UI.ConversationHead conversation={conversation}/>
                    <Peerio.UI.VScroll
                        onGetPage={this.getPage}
                        onGetPrevPage={this.getPrevPage}
                        onGetItemsRange={this.getItemsRange}
                        itemKeyName='id'
                        itemComponent={Peerio.UI.Message}
                        itemParentData={conversation}
                        className="content with-reply-box without-tab-bar conversation"
                        ref="content"
                        key="content"
                        reverse="true"
                    />

                    <div id="reply">
                        <ul className={'attached-files' + (this.state.attachments.length ? '' : ' removed')}>
                            {
                                this.state.attachments.map(id => {
                                    var file = Peerio.user.files.dict[id];

                                    return (
                                        <li className={'attached-file' + (this.state.removed === id ? ' removed':'')}>
                                            { this.state.attachments.length ? file.name : null }
                                            <Peerio.UI.Tappable element="i" ref="{id}" className="material-icons"
                                                                onTap={this.detachFile.bind(this, id)}>
                                                highlight_off
                                            </Peerio.UI.Tappable>
                                        </li>);
                                })
                            }

                        </ul>

                        <Peerio.UI.Tappable element="div" className="reply-attach" onTap={this.openFileSelect}>
                            <i className="material-icons">attach_file</i>
                            <div className={'icon-counter' + (this.state.attachments.length ? '' : ' none')}>
                                {this.state.attachments.length || ''}
                            </div>
                        </Peerio.UI.Tappable>
                        <textarea
                            className={this.state.textEntryDisabled ?  'reply-input placeholder-warning':'reply-input'}
                            rows="1" ref="reply" placeholder={this.state.placeholderText}
                            onChange={this.onTextChanged}
                            disabled={this.state.textEntryDisabled}/>

                        { !this.state.empty ?
                            <Peerio.UI.Tappable element="div" className="reply-send" onTap={this.sendReply}>
                                <i className="material-icons">send</i>
                            </Peerio.UI.Tappable> :

                            <Peerio.UI.Tappable element="div" className="reply-ack" onTap={this.sendAck}>
                                <i className="material-icons">thumb_up</i>
                            </Peerio.UI.Tappable>
                        }


                        {this.state.sending ? (<div id="reply-overlay"></div>) : null}
                    </div>
                </div>
            );
        }
    });
}());
