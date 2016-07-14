(function () {
    'use strict';

    var MODE_DEFAULT = 0;
    var MODE_MESSAGE = 1;
    var MODE_GHOST = 2;

    Peerio.UI.GhostNew = React.createClass({
        mixins: [ReactRouter.Navigation],

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
                Peerio.Dispatcher.onBigGreenButton(this.processAction),
                Peerio.Dispatcher.onFilesUpdated(this.updateFiles),
                Peerio.Dispatcher.onContactsSelected(this.acceptContactSelection),
            ];

            this.list = [];
            this.actions = {};
            this.actions[MODE_DEFAULT] = () => false;
            this.actions[MODE_MESSAGE] = () => this.messageSend();
            this.actions[MODE_GHOST] = () => this.ghostSettings();

            var email = this.refs.email.getDOMNode();
            this.complete = new Awesomplete(email,
                                            {minChars: 1, maxItems: 3, list: this.list, item: this.completionItem});
            email.addEventListener('awesomplete-selectcomplete', e => this.tryAddFromInput(e.text.value.value));

            Peerio.ContactHelper.tryCheckPermission();

            Peerio.PhraseGenerator.getPassPhrase(Peerio.Config.defaultLocale, Peerio.Config.defaultWordCount)
                .then(phrase => this.state.ghost.useFilePassphrase(phrase));
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        setMode: function(mode) {
            if(this.state.mode == MODE_GHOST && this.state.ghost.files.length)
                return;

            if(this.state.attachments.length)
                return;

            mode != this.state.mode &&  
                Peerio.Action.showBigGreenButton(mode == MODE_GHOST ? 'ghost_new' : 'new_message');
            this.setState({mode: mode});

            this.list.splice(0, this.list.length);
        },

        processAction: function () {
            return this.actions[this.state.mode]();
        },

        messageSend: function () {
            if (!this.state.recipients.length)
                return Peerio.Action.showAlert({text: t('message_selectContacts')});

            if (this.state.sending) return;

            this.setState({sending: true});

            Peerio.Conversation()
                .reply(this.state.recipients, this.refs.message.getDOMNode().value,
                    this.state.attachments, this.refs.subject.getDOMNode().value)
                .then(this.goBack)
                .catch(err => {
                    Peerio.Action.showAlert({text: t('error_messageSend') + ' ' + err});
                    this.setState({sending: false});
                });
        },

        acceptFileSelection: function (selection) {
            this.setMode(MODE_MESSAGE);
            this.setState({attachments: selection});
        },

        openMessageFileSelect: function () {
            Peerio.Action.showFileSelect({preselected: this.state.attachments.slice()});
        },

        ghostSettings: function () {
            var subject = this.refs.subject.getDOMNode().value;
            var body = this.refs.message.getDOMNode().value;
            var recipients = this.state.recipients;
            var e = null;
            e = body ? e : t('ghost_enterBody');
            e = subject ? e : t('ghost_enterSubject');
            e = recipients.length ? e : t('ghost_enterRecipient');
            e = this.getGhostUploads().length ? t('ghost_waitUpload') : e;

            var paywall = Peerio.user.paywall ? Peerio.user.paywall.ghost : null;
            paywall = paywall[0] ? paywall[0] : null;
            e = paywall && paywall.limit && paywall.usage >= paywall.limit ? t('ghostOverQuota') : e;

            if(e) {
                Peerio.UI.Alert.show({text: e});
                return;
            }

            var g = this.state.ghost;
            g.body = body;
            g.recipients = recipients;
            g.subject = subject;

            Peerio.Drafts.Ghost = g;

            this.transitionTo('ghost_settings');
        },

        handleSubjectChange: function () {
            this.setState({subject: this.refs.subject.getDOMNode().value});
        },

        focusRecipient: function (e) {
            this.refs.email.getDOMNode().focus();
            e.preventDefault();
            return false;
        },

        shouldRemoveRecipient: function (r) {
            var i = this.state.recipients.indexOf(r);
            if(i == -1) return;
            this.state.recipients.splice(i, 1);
            this.setState({recipients: this.state.recipients});
            this.state.recipients.length || this.setMode(MODE_DEFAULT);
        },

        /**
         * Add a recipient to the state
         * @return  true if the recipient already exists or is successfully added
         *          false if the recipient could not be added
         */
        tryAdd: function (r) {
            // check if there's already the same recipient added
            if(this.state.recipients.indexOf(r) != -1) return true;

            // if there's a peerio user in contacts with that name
            var peerioUser = Peerio.user.contacts.dict[r];
            if(peerioUser) {
                this.setMode(MODE_MESSAGE);
            }

            // if look like an email
            var email = !peerioUser && Peerio.Helpers.isValidEmail(r);
            if(email) {
                // we should also tell user that he's about to send ghost, so
                this.setMode(MODE_GHOST);
            }

            if(!peerioUser && !email) {
                Peerio.UI.Alert.show({text: t('error_recipientFormat')})
                    .then(() => this.setState({email: ''}));
                return false;
            }

            this.state.recipients.push(r);
            this.setState({recipients: this.state.recipients});

            return true;
        },

        tryAddFromInput: function (r) {
            var current = r || this.refs.email.getDOMNode().value;
            current && current.length && this.tryAdd(current) && this.setState({email: ''});
        },

        recipientBlur: function () {
            this.tryAddFromInput();
        },

        handleEmailKeyDown: function (e) {
            var current = this.refs.email.getDOMNode().value;
            switch(e.keyCode) {
                // space, enter, comma, semicolon
                case 32: case 13: case 188: case 186:
                    this.tryAddFromInput();
                    e.preventDefault();
                    break;
                // backspace
                case 8: 
                    if(current.length) break;
                    if(this.state.recipients.length)
                        this.shouldRemoveRecipient(this.state.recipients[this.state.recipients.length - 1]);
                    e.preventDefault();
                    break;
            }
        },

        handleEmailChange: function () {
            var email = this.refs.email.getDOMNode().value.replace(/[ '",;/]/, '');
            this.setState({email: email});
            this.updateCompletionDebounce(email);
        },

        getInitialState: function () {

            return {
                ghost: Peerio.Ghost.create(),
                recipients: this.props.params.id ? [this.props.params.id] : [],
                mode: this.props.params.id ? MODE_MESSAGE : MODE_DEFAULT,
                attachments: []
            };
        },

        updateCompletionDebounce: function (search) {
            if(this.debounce) window.clearTimeout(this.debounce);
            this.debounce = window.setTimeout(() => {
                this.updateCompletion(search);
                this.debounce = null;
            }, 100);
        },

        lookupUserContacts: function (search) {
            return _.map(Peerio.Util.filterFirst(Peerio.user.contacts.arr, 
                                    c => c.fullNameAndUsername.toLowerCase().indexOf(search) != -1,
                                    5), c => c.username);
        },

        updateCompletion: function (search) {
            search = search.toLowerCase();
            Peerio.ContactHelper.findContaining(search)
                .then( result => {
                    this.list.splice(0, this.list.length);

                    // first add contacts from our peerio user list
                    this.state.mode != MODE_GHOST && this.lookupUserContacts(search)
                        .forEach(item =>
                                 this.state.recipients.indexOf(item) == -1 && 
                                 this.list.push({label: item, value: { value: item}}));

                    // then add contacts from our phone list
                    this.state.mode != MODE_MESSAGE && result.forEach( i => {
                        i.emails && i.emails.forEach( email => this.state.recipients.indexOf(email.value) == -1 && this.list.push({
                            label: email.value, 
                            value: {
                                isGhost: true,
                                value: email.value
                            }
                        }) );
                    });

                    this.complete.evaluate();
                })
                .catch( e => L.error(e) );
        },

        completionItem: function (suggestionText, userInput) {
            var r = document.createElement('li');
            r.innerHTML = Peerio.Util.interpolate(
                '<i class="{0}"></i><span>{1}</span>', 
                [suggestionText.value.isGhost ? 'ghost-dark' : 'peerio-dark',
                suggestionText.value.value.replace(userInput, '<mark>' + userInput + '</mark>')]);
            return r;
        },

        openContactSelect: function () {
            this.state.mode != MODE_GHOST && Peerio.Action.showContactSelect({preselected: this.state.recipients.slice()});
        },

        acceptContactSelection: function (selection) {
            selection.forEach(r => this.tryAdd(r));
        },

        addFile: function (file) {
            this.state.ghost.addFile(file);
            this.forceUpdate();
        },

        openGhostFileSelect: function () {
            // make sure we initialized the file passphrase
            if(!this.state.ghost.filePublicKey) return;
            Peerio.UI.Upload.show({ silent: true, onComplete: this.addFile, isGhost: true, ghostPublicKey: this.state.ghost.filePublicKey });
        },

        updateFiles: function () {
            this.forceUpdate();
        },

        detachFile: function (file) {
            if(this.state.mode == MODE_GHOST) {
                _.pull(this.state.ghost.files, file);
                this.forceUpdate();
                if(this.state.ghost.files.length == 0 && this.state.recipients == 0)
                    this.setMode(MODE_DEFAULT);
            } else {
                _.pull(this.state.attachments, file.id);
                this.setState({attachments: this.state.attachments});
                if(this.state.attachments.length == 0 && this.state.recipients == 0)
                    this.setMode(MODE_DEFAULT);
            }
        },

        getGhostUploads: function () {
            return Peerio.user.uploads.filter(i => i.isGhost);
        },

        render: function () {
            // added recipients should take the styling here, regardless if it's a peerio user or an email
            var r = this.state.recipients.map(username => {
                var c = Peerio.user.contacts.dict[username];
                var displayName = c && c.fullName || username;
                return (
                    <span className="name-selected" key={username}>
                        <span className="text-overflow">{displayName}</span>
                        <Peerio.UI.Tappable element="i" 
                                            className="material-icons" 
                                            onTap={this.shouldRemoveRecipient.bind(this, username)}>
                            cancel
                        </Peerio.UI.Tappable>
                    </span>
                );
            });


            var uploadNodes;
            var uploads = this.getGhostUploads();
            if (uploads.length > 0) {
                uploadNodes = [];
                uploads.forEach((file, i) => {
                    var u = file.uploadState;
                    if(!u) return;
                    uploadNodes.push(
                        <li className="list-item" key={i}>
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

            var attachedFiles = this.state.mode == MODE_GHOST ? this.state.ghost.files : this.state.attachments;

            return (
                <div className="content without-tab-bar">
                    <div id="new-message">
                        <div className="recipients" onMouseDown={this.focusRecipient}>
                            <div className="to">To</div>
                            <div className="names">{r}
                                <div className="open recipient-input">
                                    <input type="text"
                                       required="required"
                                       autoComplete="off"
                                       autoCorrect="off"
                                       autoCapitalize="off"
                                       id="email"
                                       ref="email"
                                       className="email"
                                       value={this.state.email}
                                       onBlur={this.recipientBlur}
                                       onKeyDown={this.handleEmailKeyDown}
                                       onChange={this.handleEmailChange}/>
                                </div>
                            </div>
                            <Peerio.UI.Tappable element="div" onTap={this.openContactSelect} className="add-btn">
                                {this.state.mode == MODE_GHOST ? 
                                <i className="ghost-dark"></i> : <i className="material-icons">person_add</i>}
                                <span className={'icon-counter' + (this.state.recipients.length ? '' : ' hide')}>{this.state.recipients.length}</span>
                            </Peerio.UI.Tappable>
                        </div>
                    {/*TODO refactor message inputs */}
                        <div className="subject-input">
                            <input type="text"
                                   autoComplete="off"
                                   ref="subject"
                                   value={this.state.subject}
                                   onChange={this.handleSubjectChange}
                                   className="subject"
                                   placeholder={t('subject')}/>

                            <Peerio.UI.Tappable 
                                className="attach-btn" 
                                onTap={this.state.mode == MODE_GHOST ? this.openGhostFileSelect : this.openMessageFileSelect}>
                                <i className="material-icons">image</i>
                                <span
                                    className={'icon-counter' + (attachedFiles.length ? '' : ' hide')}>{attachedFiles.length}</span>
                            </Peerio.UI.Tappable>
                        </div>
                        <ul className={uploads.length > 0 ? '': 'hide'}>
                            {uploadNodes}
                        </ul>
                        <ul className={'attached-files' + (attachedFiles.length ? '' : ' removed')}>
                            {attachedFiles.map((file, i) => {
                                file = file.name ? file : Peerio.user.files.dict[file];
                                return (
                                    <li className={'attached-file'}>
                                        {file.name}
                                        <Peerio.UI.Tappable element="i" key={i} className="material-icons"
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
