(function () {
    'use strict';

    Peerio.UI.AddContactImport = React.createClass({
        mixins: [ReactRouter.Navigation],
        getInitialState: function () {
            return {
                deviceContacts: [],
                availableContacts: [],
                selectAll: false,
                inProgress: true
            };
        },

        componentWillMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onBigGreenButton(this.addOrInviteContacts)];
            this.inviteAddresses = {};
            this.requestContacts = {};
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        componentDidMount: function () {
            if(!navigator.contacts) return;
            var options = new ContactFindOptions();
            options.multiple = true;
            options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.phoneNumbers];

            var requiredFields = [navigator.contacts.fieldType.emails, navigator.contacts.fieldType.phoneNumbers];
            var deviceImportSuccess = this.deviceImportSuccess;
            var deviceImportFailure = this.deviceImportFailure;
            navigator.contacts.find(requiredFields, deviceImportSuccess, deviceImportFailure, options);
        },

        deviceImportFailure: function () {
            Peerio.Action.showAlert({text: t('contact_permissionMissing')});
        },

        deviceImportSuccess: function (contacts) {
            contacts = Peerio.Util.filterDeviceContacts(contacts);
            this.searchForPeerioUsers(contacts);

        },

        searchForPeerioUsers: function (contacts) {
            this.setState({inProgress: true});
            var addressChunks = _.chunk(Peerio.Util.parseAddressesForLookup(contacts), 50);
            //index contacts by ID to merge with foundUsers.
            contacts = contacts.filter(i => i.emails.length);
            contacts = _.keyBy(contacts, 'id');
            var importPromise = Promise.resolve(true);
            var foundUsers = [];
            addressChunks.forEach( addressChunk => {
                var searchAddresses = {addresses: addressChunk};
                importPromise = importPromise
                .then( () => Peerio.Net.addressLookup(searchAddresses))
                .then( (returnData) => {
                    returnData.forEach(i => i.username && foundUsers.push(i));
                })
                .catch( (e) => L.error('error importing') );
            });

            importPromise = importPromise
                .then( () => {
                    foundUsers = _.keyBy(foundUsers, 'id');
                    contacts = _.merge(contacts, foundUsers);
                    this.setState({availableContacts: contacts});
                })
                .then( () => new Promise( function(resolve, reject) {
                    window.setTimeout(resolve, 100);
                }) );

            importPromise.finally( () => {
                this.setState({inProgress: false});
            });
        },

        addOrInviteContacts: function () {
            var usersToAddInvite = { add: [], invite: [] };

            for(var key in this.requestContacts) {
                usersToAddInvite.add.push({ username: this.requestContacts[key].username });
            }

            for(var key in this.inviteAddresses) {
                usersToAddInvite.invite.push({ email: this.inviteAddresses[key].value });
            }

            if (usersToAddInvite.add.length === 0) delete usersToAddInvite.add;
            if (usersToAddInvite.invite.length === 0) delete usersToAddInvite.invite;

            (usersToAddInvite.add || usersToAddInvite.invite)
            && Peerio.Net.addOrInviteContacts(usersToAddInvite)
            .bind(this)
            .then(function (a) {
                this.props.onSuccess ?
                    this.props.onSuccess() : this.transitionTo('contacts');
            });
        },

        render: function () {
            var requestItems = [];
            var inviteItems = [];
            _.forOwn(this.state.availableContacts, (contact, contactID) => {
                if (contact.username) {
                    requestItems.push(contact);
                } else if (contact.emails.length) {
                    inviteItems.push(contact);
                }

            });

            if (this.state.inProgress) {
                return (
                    <div className="content without-tab-bar">
                        { this.props.hideTitle ? null :
                            <div className="headline">{t('contact_import')}</div> }
                            <div className="peerio-loader"></div>
                        </div>);
            }

            var selectContactRequest = (item, select) => {
                if(select)
                    this.requestContacts[item.username] = item;
                else
                    delete this.requestContacts[item.username];
            };

            var selectInviteAddress = (item, select) => {
                if(item.emails)
                    item.emails.forEach( email => selectInviteAddress(email, select) );
                else
                    if(select)
                        this.inviteAddresses[item.value] = item;
                else
                    delete this.inviteAddresses[item.value];
            };

            return (
                <div className="content without-tab-bar">
                    { this.props.hideTitle ? null :
                        <div className="headline">Contact Import</div> }
                        <div className="headline-divider">{t('contact_importFriends')}</div>
                        { requestItems.length === 0 ? (<p>{t('noMatchesFound')}</p>) : (
                            <Peerio.UI.List
                                selectAllText={t('importContactsSelectAll')}
                                items={requestItems}
                                select={selectContactRequest}
                                element={ (contact, index) => (
                                    <Peerio.UI.ContactRequestTemplate
                                        item={contact}
                                        name={contact.name}
                                        username={contact.username}
                                        key={index}
                                        select={selectContactRequest}
                                        isSelected={ item => !!this.requestContacts[item.username] }
                                    />
                                    )}/>)
                        }
                        <div className="headline-divider">{t('contact_importInvite')}</div>
                        { inviteItems.length === 0 ? (<p>{t('contact_noContactsFound')}</p>) : (
                            <Peerio.UI.List
                                selectAllText={t('importContactsSelectAll')}
                                items={inviteItems}
                                select={selectInviteAddress}
                                element={ (contact, index) => (
                                    <Peerio.UI.ContactInviteTemplate
                                        item={contact}
                                        name={contact.name}
                                        emails={contact.emails}
                                        key={index}
                                        isSelected={ email => !!this.inviteAddresses[email.value] }
                                        select={selectInviteAddress}
                                    />
                                    )}/>)
                        }
                    </div>);
        }
    });
}());
