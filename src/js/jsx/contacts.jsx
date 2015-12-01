(function () {
    'use strict';

    Peerio.UI.Contacts = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        componentDidMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onBigGreenButton(this.handleAddContact),
                Peerio.Dispatcher.onContactsUpdated(this.forceUpdate.bind(this, null))
            ];
            if (this.getQuery().trigger) {
                this.replaceWith('contacts');
                this.handleAddContact();
            }
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        //addContactCallback: function (name) {
        //  Peerio.Contacts.addContact(name);
        //  //TODO: add success/fail alert.
        //},
        handleAddContact: function () {
            //add contact prompt
            //Peerio.Action.showPrompt({headline: 'Add Contact',
            //  text: 'Please enter username of the contact you want to add',
            //  onAccept: this.addContactCallback
            //});
            //Transition to add/import contact screen.
            this.transitionTo('add_contact');
        },
        openContactView: function (id) {
            this.transitionTo('contact', {id: id});
        },
        getContactNode: function (item, receivedRequest, sentRequest) {
            return (
                <Peerio.UI.Tappable element="li" className="list-item"
                                    onTap={this.openContactView.bind(this, item.username)} key={item.username}>
                    <div className="list-item-thumb">
                        <Peerio.UI.Avatar username={item.username}/>
                    </div>
                    <div className="list-item-content">
                        <div className="list-item-title">{item.fullName}</div>
                        <div className="list-item-description">{item.username} { item.isMe ? '(You)' : ''}</div>
                        { receivedRequest ? <i className="fa fa-user-plus status"></i> : null }
                        { sentRequest ? <i className="fa fa-paper-plane-o status"></i> : null }
                    </div>
                    <div className="list-item-forward">
                        <i className="fa fa-chevron-right"></i>
                    </div>
                </Peerio.UI.Tappable>);
        },
        render: function () {
            var inRequests = Peerio.user.receivedContactRequests.arr.map(item => this.getContactNode(item, true));
            var outRequests = Peerio.user.sentContactRequests.arr.map(item => this.getContactNode(item, false, true));
            var contacts = Peerio.user.contacts.arr.map(item => this.getContactNode(item));

            if (contacts.length === 1 && outRequests === 0 && inRequests === 0) {
                var intro_content = <div className="content-intro" key="intro">
                    <h1 className="headline-lrg">Peerio Contacts</h1>

                    <p>Add a contact to send your first message.Click the button below to get started.</p>
                    <Peerio.UI.Tappable element="div" className="btn-md" onTap={this.handleAddContact}>
                        <i className="fa fa-pencil"></i>&nbsp;Add a contact
                    </Peerio.UI.Tappable>
                    <img src="media/img/contacts.png"/>
                </div>;
                contacts.push(intro_content);
            }
            //todo: by order, username
            return (
                <div className="content" id="contact-list">
                    <ul className="list-view">
                        {inRequests}
                        {contacts}
                        {outRequests}
                    </ul>
                </div>
            );
        }
    });

}());

