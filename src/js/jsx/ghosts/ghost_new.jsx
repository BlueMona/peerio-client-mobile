(function () {
    'use strict';

    Peerio.UI.GhostNew = React.createClass({
        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
                Peerio.Dispatcher.onBigGreenButton(this.send)
            ];
        },

        send: function () {
            var subject = this.refs.subject.getDOMNode().value;
            var body = this.refs.message.getDOMNode().value;
            var email = this.refs.email.getDOMNode().value;
            if(!subject || !body || !email) return;


        },

        getInitialState: function () {
            return {
                attachments: []
            };
        },

        render: function () {
            return (
                <div className="content without-tab-bar">
                    <div id="new-message">
                        <div className="subject-inputs">
                            <input type="text" ref="email" className="email" placeholder={t('email')}/>
                    </div>

                    {/*TODO refactor message inputs */}
                        <div className="subject-inputs">
                            <input type="text" ref="subject" className="subject" placeholder={t('subject')}/>

                            <Peerio.UI.Tappable className="attach-btn" onTap={this.openFileSelect}>
                                <i className="material-icons">attach_file</i>
                                <span
                                    className={'icon-counter' + (this.state.attachments.length ? '' : ' hide')}>{this.state.attachments.length}</span>
                            </Peerio.UI.Tappable>
                </div>
                <ul className={'attached-files' + (this.state.attachments.length ? '' : ' removed')}>
                    {this.state.attachments.map(id => {
                        var file = Peerio.user.files.dict[id];

                        return (<li className={'attached-file' + (this.state.removed === id ? ' removed':'')}>
                    { this.state.attachments.length ? file.name : null }
                            <Peerio.UI.Tappable element="i" ref="{id}" className="material-icons"
                                                onTap={this.detachFile.bind(this, id)}>
                                highlight_off
                            </Peerio.UI.Tappable>
                </li>);
                    })
                    }

                </ul>
                <textarea ref="message" className="message" placeholder={t('message_typePrompt')}></textarea>
                      </div>
                  </div>
            );
        }


    });
}

());
