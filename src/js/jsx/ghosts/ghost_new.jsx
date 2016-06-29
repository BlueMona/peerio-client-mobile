(function () {
    'use strict';

    Peerio.UI.GhostNew = React.createClass({
        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
                Peerio.Dispatcher.onBigGreenButton(this.send)
            ];

            this.list = [];
            this.complete = new Awesomplete(this.refs.email.getDOMNode(), 
                                            {minChars: 1, maxItems: 3, list: this.list});
        },

        send: function () {
            var subject = this.refs.subject.getDOMNode().value;
            var body = this.refs.message.getDOMNode().value;
            var email = this.refs.email.getDOMNode().value;
            if(!subject || !body || !email) return;
        },

        handleEmailChange: function () {
            var email = this.refs.email.getDOMNode().value.replace(/[ '",;/]/, '');
            this.setState({email: email});
            this.updateCompletionDebounce(email);
        },

        getInitialState: function () {
            return {
                attachments: [],
                email: ''
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

        render: function () {
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
                                   className="subject" 
                                   placeholder={t('subject')}/>

                            <Peerio.UI.Tappable className="attach-btn" onTap={this.openFileSelect}>
                                <i className="material-icons">attach_file</i>
                                <span
                                    className={'icon-counter' + (this.state.attachments.length ? '' : ' hide')}>{this.state.attachments.length}</span>
                            </Peerio.UI.Tappable>
                        </div>
                        <ul className={'attached-files' + (this.state.attachments.length ? '' : ' removed')}>
                            {this.state.attachments.map(id => {
                                var file = Peerio.user.files.dict[id];
                                return (
                                    <li className={'attached-file' + (this.state.removed === id ? ' removed':'')}>
                                        { this.state.attachments.length ? file.name : null }
                                        <Peerio.UI.Tappable element="i" ref="{id}" className="material-icons"
                                                            onTap={this.detachFile.bind(this, id)}>
                                            highlight_off
                                        </Peerio.UI.Tappable>
                                    </li>);
                            })}
                        </ul>
                        <textarea ref="message" className="message" placeholder={t('message_typePrompt')}></textarea>
                    </div>
                </div>
            );
        }
    });
}
());
