(function () {
  'use strict';


  Peerio.UI.ContactView = React.createClass({
    componentWillMount: function () {
      this.contact = Peerio.user.contacts[this.props.params.id];
     },
    handleAccept: function () {
      //Peerio.Data.acceptContact(this.props.username);
    },
    handleReject: function () {
     // Peerio.Data.rejectContact(this.props.username).catch();
    },
    handleRemove: function () {
      if (!confirm('Are you sure you want to remove ' + this.props.username
        + ' from contacts? You will not be able to message and share files with this contact after removal.')) return;

      //Peerio.Data.removeContact(this.props.username)
       // .then(Peerio.Action.navigateBack);
    },
    render: function () {
      var buttonNode = null, pendingNode = null;
      if (this.contact.responsePending) {
        pendingNode = <div className="pending"><i className="fa fa-spinner fa-pulse"></i> waiting for server response...</div>;
      } else if (!this.contact.isMe) {
        buttonNode = (
          <div>
            { this.contact.isRequest && this.contact.isReceivedRequest ? <div className="btn btn-safe" onTouchEnd={this.handleAccept}>Accept contact request</div> : null }
            { this.contact.isRequest && this.contact.isReceivedRequest ? <div className="btn btn-danger" onTouchEnd={this.handleReject}>Reject contact request</div>
              : <div className="btn btn-danger" onTouchEnd={this.handleRemove}>Remove contact</div>}
          </div>);
      }
      //// TODO: replace onTouchEnd with globalTapHandler mixin. these buttons need tap event, because scroll is a possibility
      return (
        <div className="content-padded contact-view">

          <div className="col-2 col-first">
            <Peerio.UI.Avatar size="big" username={this.contact.username} className="contact-view-avatar"/>
          </div>
          <div className="col-10">
            <span className="headline">{this.contact.fullName}</span>
            <span className="subhead-inline">{this.contact.username} { this.contact.isMe ? '(You)' : ''}</span>
          </div>
          <hr className="col-12"/>

          <div className="info-blocks">

            <div className="info-block">
              <div className="info-label">Public Key</div>
              <div className="text-mono">{this.contact.publicKey}</div>
            </div>

            <div className="info-block">
              <div className="info-label">State:</div>
              <div className="col-12 info-content">{ this.contact.isMe ? 'This is you!' :
                (this.contact.isRequest ? 'Pending: ' + (this.contact.isRecievedRequest ? 'you received request.' : 'you sent request')
                  : 'Established contact')}</div>
            </div>

            <div className="info-block">
              <div className="info-label">Primary address:</div>
              <div className="col-12 info-content">{this.contact.primaryAddress || 'N/A'}</div>
            </div>

          </div>

          {pendingNode || buttonNode}

        </div>
      );

    }
  });

}());

