(function () {
  'use strict';

  Peerio.UI.NewMessage = React.createClass({
    mixins:[ReactRouter.Navigation],
    //--- REACT EVENTS
    getInitialState: function () {
      return {recipients: [], attachments: []};
    },
    componentDidMount: function () {
      this.subscriptions = [
        Peerio.Dispatcher.onFilesSelected(this.acceptFileSelection),
        Peerio.Dispatcher.onContactsSelected(this.acceptContactSelection),
        Peerio.Dispatcher.onBigGreenButton(this.send)
      ];
    },
    componentWillUnmount: function () {
      Peerio.Dispatcher.unsubscribe(this.subscriptions);
    },
    //--- CUSTOM FN
    send: function () {
      //todo validation
      Peerio.Messages.sendMessage(this.state.recipients, this.refs.subject.getDOMNode().value,
        this.refs.message.getDOMNode().value, this.state.attachments);

      this.goBack();
    },
    openContactSelect: function () {
      Peerio.Action.showContactSelect({preselected: this.state.recipients.slice()});
    },
    acceptContactSelection: function (selection) {
      this.setState({recipients: selection});
    },
    openFileSelect: function () {
      Peerio.Action.showFileSelect({preselected: this.state.attachments.slice()});
    },
    acceptFileSelection: function (selection) {
      this.setState({attachments: selection});
    },

    //--- RENDER
    render: function () {
      var r = this.state.recipients.map(function (username) {
        var c = Peerio.user.contacts[username];
        return <span key={username}>{c.fullName} ({username});</span>;
      });
      return (
        <div className="content without-tab-bar">
          <div id="new-message">
            <div className="recipients" onTouchEnd={this.openContactSelect}>
              <div className="to">To:</div>
              <div className="names">{r}</div>
              <div className="add-btn">
                <i className="fa fa-list"></i>
                <span
                  className={'icon-counter' + (this.state.recipients.length ? '' : ' hide')}>{this.state.recipients.length}</span>
              </div>
            </div>
            <input type="text" ref="subject" className="subject" placeholder="Subject"/>

            <div className="attach-btn" onTouchEnd={this.openFileSelect}>
              <i className="fa fa-paperclip"></i>
              <span
                className={'icon-counter' + (this.state.attachments.length ? '' : ' hide')}>{this.state.attachments.length}</span>
            </div>
            <textarea ref="message" className="message" placeholder="Type your message"></textarea>
          </div>
        </div>
      );
    }
  });

}());