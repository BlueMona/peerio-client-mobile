(function () {
    'use strict';

    Peerio.UI.Contacts = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State],
        componentDidMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onBigGreenButton(this.handleAddContact),
                Peerio.Dispatcher.onSettingsUpdated(this.forceUpdate.bind(this, null)),
                Peerio.Dispatcher.onContactsUpdated(this.forceUpdate.bind(this, null)),
                Peerio.Dispatcher.onUnreadStateChanged(this.handleUnreadStateChange.bind(this, null))
            ];
            if (this.getQuery().trigger) {
                this.replaceWith('contacts');
                this.handleAddContact();
            }

            this.handleUnreadStateChange();
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        handleUnreadStateChange: function () {
            if (!Peerio.user.unreadState.contacts) return;

            window.setTimeout(()=> {
                if (this.isMounted() && Peerio.user.unreadState.contacts)
                    Peerio.user.setContactsUnreadState(false);
            }, 2000);

        },
        handleAddContact: function () {
            this.transitionTo('add_contact');
        },
        openContactView: function (id) {
            this.transitionTo('contact', {id: id});
        },
        getContactNode: function (item, receivedRequest, sentRequest) {
            var tag = item.isMe && t('contact_youTag')
                || sentRequest && t('contact_invitedTag')
                || receivedRequest && t('contact_requestsTag')
                || null;
            if (tag) tag = '(' + tag + ')';

            return (
                <Peerio.UI.Tappable element="li" className="list-item"
                                    onTap={this.openContactView.bind(this, item.username)} key={item.username}>
                    <Peerio.UI.Avatar username={item.username}/>

                    <div className="list-item-content">
                        <div className="list-item-title">{item.fullName}</div>
                        <div
                            className="list-item-description">{item.username} {tag}</div>
                        { receivedRequest ? <i className="material-icons status">person_add</i> : null }
                    </div>
                    <i className="material-icons">chevron_right</i>
                </Peerio.UI.Tappable>);
        },
        render: function () {
            var inRequests = Peerio.user.receivedContactRequests.arr.map(item => this.getContactNode(item, true));
            var outRequests = Peerio.user.sentContactRequests.arr.map(item => this.getContactNode(item, false, true));
            var contacts = Peerio.user.contacts.arr
                .filter(c => !c.isDeleted).map(item => this.getContactNode(item));

            if ((contacts.length + outRequests + inRequests) === 1) {
                var intro_content = <div className="content-intro" key="intro">
                    <div className="headline">{t('contact_listTitle')}</div>
                    <p>{t('contact_listEmpty')}</p>
                    <Peerio.UI.Tappable element="div" className="btn-md" onTap={this.handleAddContact}>
                        <i className="material-icons">person_add</i> {t('button_addContact')}
                    </Peerio.UI.Tappable>
                    <img src="media/img/contacts.png"/>
                </div>;
                contacts.push(intro_content);
            }
            //TODO: by order, username
            return (
                <div className="content essential filter-animate" id="contact-list">
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
