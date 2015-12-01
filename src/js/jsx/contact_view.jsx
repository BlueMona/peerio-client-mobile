(function () {
    'use strict';


    Peerio.UI.ContactView = React.createClass({
        mixins: [ReactRouter.Navigation],
        componentWillMount: function () {
            this.contact = Peerio.user.contacts.dict[this.props.params.id];
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(this.startConversationWithContact),
                Peerio.Dispatcher.onContactsUpdated(this.forceUpdate.bind(this, null))];
        },
        startConversationWithContact: function () {
            this.transitionTo('new_message', {id: this.contact.username});
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        handleAccept: function () {
            // TODO: there is probably a better way to invoke loading contacts
            this.contact.accept().then(function() {
                Peerio.user.loadContacts();
            });


        },
        handleReject: function () {
            // TODO: there is probably a better way to invoke loading contacts
            this.contact.reject().then(function() {
                Peerio.user.loadContacts();
            });
        },
        removeContactAndGoBack: function (username) {
            this.contact.isRequest ? this.contact.cancelRequest() : this.contact.remove();
            this.goBack();
        },
        handleRemove: function () {
            if (!this.contact.isRequest) {
                Peerio.Action.showConfirm({
                    headline: 'Remove Contact?',
                    text: 'Are you sure you want to remove ' + this.contact.username +
                    ' from contacts? You will not be able to message and share files with this contact after removal.',
                    onAccept: this.removeContactAndGoBack.bind(this, this.contact.username)
                });
            } else this.removeContactAndGoBack(this.contact.username);
        },
        render: function () {
            this.contact = Peerio.user.contacts.dict[this.props.params.id]
                || Peerio.user.receivedContactRequests.dict[this.props.params.id]
                || Peerio.user.sentContactRequests.dict[this.props.params.id];
            if(!this.contact) {
                this.goBack();
                return null;
            }
            var buttonNode = null, pendingNode = null;
            if (this.contact.responsePending) {
                pendingNode =
                    <div className="pending"><i className="fa fa-spinner fa-pulse"></i> waiting for server response...
                    </div>;
            } else if (!this.contact.isMe) {
                buttonNode = (
                    <div>
                        { this.contact.isRequest && this.contact.isReceivedRequest ?
                            <Peerio.UI.Tappable element="div" className="btn-md btn-safe" onTap={this.handleAccept}>Accept
                                contact request</Peerio.UI.Tappable> : null }
                        { this.contact.isRequest && this.contact.isReceivedRequest ?
                            <Peerio.UI.Tappable element="div" className="btn-md btn-danger" onTap={this.handleReject}>Reject
                                contact request</Peerio.UI.Tappable>
                            : <Peerio.UI.Tappable element="div" className="btn-md btn-danger" onTap={this.handleRemove}>Remove
                            contact</Peerio.UI.Tappable>}
                    </div>);
            }
            return (
                <div className="content-padded contact-view">

                    <div className="col-2 col-first">
                        <Peerio.UI.Avatar size="big" username={this.contact.username} className="contact-view-avatar"/>
                    </div>
                    <div className="col-10">
                        <span className="headline">{this.contact.fullName}</span>
                        <span
                            className="subhead-inline">{this.contact.username} { this.contact.isMe ? '(You)' : ''}</span>
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

