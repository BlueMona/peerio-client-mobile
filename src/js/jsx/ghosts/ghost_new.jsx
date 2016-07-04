(function () {
    'use strict';

    Peerio.UI.GhostNew = React.createClass({
        mixins: [ReactRouter.Navigation],
        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
                Peerio.Dispatcher.onBigGreenButton(this.settings),
                Peerio.Dispatcher.onFilesUpdated(this.updateFiles),
            ];

            this.list = [];
            var email = this.refs.email.getDOMNode();
            this.complete = new Awesomplete(email,
                                            {minChars: 1, maxItems: 3, list: this.list});
            email.addEventListener('awesomplete-selectcomplete', e => this.setState({email: e.text.value}));
            Peerio.ContactHelper.tryCheckPermission();
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        settings: function () {
            var subject = this.refs.subject.getDOMNode().value;
            var body = this.refs.message.getDOMNode().value;
            var email = this.refs.email.getDOMNode().value;
            var e = null;
            e = body ? e : t('ghost_enterBody');
            e = subject ? e : t('ghost_enterSubject');
            e = email ? e : t('ghost_enterRecipient');
            
            if(e) {
                Peerio.UI.Alert.show({text: e});
                return;
            }

            Peerio.Drafts.Ghost = {
                subject: subject,
                body: body,
                email: email,
                files: this.state.attachments
            };

            this.transitionTo('ghost_settings');
        },

        handleSubjectChange: function () {
            this.setState({subject: this.refs.subject.getDOMNode().value});
        },

        handleEmailChange: function () {
            var email = this.refs.email.getDOMNode().value.replace(/[ '",;/]/, '');
            this.setState({email: email});
            this.updateCompletionDebounce(email);
        },

        getInitialState: function () {
            return {
                attachments: []
            };
        },

        updateCompletionDebounce: function (email) {
            if(this.debounce) window.clearTimeout(this.debounce);
            this.debounce = window.setTimeout(() => {
                this.updateCompletion(email);
                this.debounce = null;
            }, 100);
        },

        updateCompletion: function (email) {
            Peerio.ContactHelper.findContaining(email)
                .then( result => {
                    this.list.splice(0, this.list.length);
                    result.forEach( i => {
                        i.emails && i.emails.forEach( email => this.list.push(email.value) );
                    });
                    this.complete.evaluate();
                })
                .catch( e => L.error(e) );
        },

        addFile: function (file) {
            this.state.attachments.push(file);
            this.setState({attachments: this.state.attachments});
        },

        openFileSelect: function () {
            Peerio.UI.Upload.show({ onComplete: this.addFile, isGhost: true });
        },

        updateFiles: function () {
            this.forceUpdate();
        },

        detachFile: function (file) {
            _.pull(this.state.attachments, file);
            this.setState({attachments: this.state.attachments});
        },

        render: function () {
            var uploadNodes;
            var uploads = Peerio.user.uploads.filter(i => i.isGhost);
            if (uploads.length > 0) {
                uploadNodes = [];
                uploads.forEach(file => {
                    var u = file.uploadState;
                    if(!u) return;
                    uploadNodes.push(
                        <li className="list-item">
                            <i className="list-item-thumb file-type material-icons">cloud_upload</i>
                            <div className="list-item-content">
                                <div className="list-item-title">
                                    {t(u.stateName)}&nbsp;{u.totalChunks ? Math.round(u.currentChunk * 100/u.totalChunks) + '%' : ''} <i className="fa fa-circle-o-notch fa-spin"></i>
                                </div>
                                <div className="list-item-description">{file.name}</div>
                            </div>
                        </li>);
                });
            }

            return (
                <div className="content without-tab-bar">
                    <div id="new-message">
                        <div className="subject-inputs">
                            <input type="text"
                                   required="required"
                                   autoComplete="off"
                                   autoCorrect="off"
                                   autoCapitalize="off"
                                   id="email"
                                   ref="email"
                                   className="email"
                                   placeholder={t('email')}
                                   value={this.state.email}
                                   onChange={this.handleEmailChange}/>
                        </div>
                    {/*TODO refactor message inputs */}
                        <div className="subject-inputs">
                            <input type="text"
                                   autoComplete="off"
                                   ref="subject"
                                   value={this.state.subject}
                                   onChange={this.handleSubjectChange}
                                   className="subject"
                                   placeholder={t('subject')}/>

                            <Peerio.UI.Tappable className="attach-btn" onTap={this.openFileSelect}>
                                <i className="material-icons">image</i>
                                <span
                                    className={'icon-counter' + (this.state.attachments.length ? '' : ' hide')}>{this.state.attachments.length}</span>
                            </Peerio.UI.Tappable>
                        </div>
                        <ul>
                            {uploadNodes}
                        </ul>
                        <ul className={'' + (this.state.attachments.length ? '' : ' removed')}>
                            {this.state.attachments.map(file => {
                                return (
                                    <li className={'attached-file' + (this.state.removed === file.id ? ' removed':'')}>
                                        { this.state.attachments.length ? file.name : null }
                                        <Peerio.UI.Tappable element="i" ref={file.id} className="material-icons"
                                                            onTap={this.detachFile.bind(this, file)}>
                                            highlight_off
                                        </Peerio.UI.Tappable>
                                    </li>);
                            })}
                        </ul>
                        <textarea ref="message" className="message" placeholder={t('message_typePrompt')}>{this.state.body}</textarea>
                    </div>
                </div>
            );
        }
    });
}
());
