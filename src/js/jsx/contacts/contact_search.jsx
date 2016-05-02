(function () {
    'use strict';

    Peerio.UI.AddContactSearch = React.createClass({
        mixins: [ReactRouter.Navigation],
        getInitialState: function () {
            return {searchString: this.props.params.id, searchResults: false};
        },
        selectedUsers: [],
        componentWillMount: function () {
            this.subscriptions = [Peerio.Dispatcher.onBigGreenButton(this.handleAddContact)];
        },
        componentDidMount: function () {
            this.handleSearchForContacts();
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        selectUserToAdd: function (item) {
        },
        handleSearchForContacts: function () {
            //reset state on new search
            var searchString = React.findDOMNode(this.refs.searchInput).value || this.state.searchString;
            this.selectedUsers = [];
            this.setState({
                searchResults: false,
                parsedSearchString: Peerio.Util.parseAddress(searchString),
                searchString: searchString
            }, this.searchForContacts);
        },
        searchForContacts: function () {
            //search by email or phone
            if (this.state.parsedSearchString) {
                var query = {id: 'search-query'};
                query[this.state.parsedSearchString.type] = this.state.parsedSearchString.value;
                Peerio.Net.addressLookup({addresses: [query]})
                    .bind(this)
                    .then(function (results) {
                        //assuming only one result based on exact address match.
                        this.setState({searchResults: results[0]});
                    })
                    .catch(function (e) {
                        this.setState({searchResults: []});
                    });
            } else {
                //search by username
                Peerio.Net.getPublicKey(this.state.searchString)
                    .bind(this)
                    .then(function (results) {
                        this.setState({searchResults: results});
                    })
                    .catch(function (e) {
                        this.setState({searchResults: []});
                    });
            }
        },
        inviteByEmail: function () {
            Peerio.Net.inviteByEmail(this.state.searchString)
                .then(() => Peerio.Action.showAlert({
                    text: t('contact_emailSent', {email: this.state.searchString})
                }))
                .catch((error) => {
                    L.error('Invite error. {0}', error);
                    Peerio.Action.showAlert({text: t('error_invite')});
                });
        },
        handleAddContact: function () {
            if (this.selectedUsers.length === 0) {
                return;
            }
            _.each(this.selectedUsers, function (username) {
                // TODO: this should be added to local contact list until server response
                Peerio.Contact(username).add();
            });

            this.transitionTo('contacts');
        },
        render: function () {

            var resultNode = <div className="spinner"></div>;
            var searchResults = this.state.searchResults;
            var searchString = this.state.parsedSearchString;

            if (searchResults === false) {
                resultNode = <div className="spinner"></div>;
            } else if (searchResults.username) { //assuming single search result
                resultNode = <Peerio.UI.ContactRequestTemplate 
                    username={this.state.searchResults.username}
                    item={this.state.searchResults}
                    select={(item, selected) => {
                        if (this.selectedUsers.indexOf(item.username) === -1) 
                            this.selectedUsers.push(item.username);
                        else
                            this.selectedUsers.splice(item.username, 1);
                    }}
                    isSelected={item => this.selectedUsers.indexOf(item.username) !== -1}
                    key={this.state.searchResults.id}/>;
            } else if (searchString && searchString.type === 'email') {
                resultNode = <div>
                    <p>{t('contact_addressNotFound', {address: this.state.searchString},
                        {emphasis: segment =><strong>{segment}</strong>})}
                    </p>

                    <p>{t('contact_invitePrompt')}</p>
                    <Peerio.UI.Tappable element="div" className="btn-md btn-safe" onTap={this.inviteByEmail}>
                        {t('contact_inviteSendButton')}
                    </Peerio.UI.Tappable>
                </div>;
            } else {
                resultNode = <p>{t('contact_nothingFound')}</p>;
            }

            return (
                <div className="content without-tab-bar">
                    <div className="flex-col flex-justify-start">
                        <div className="headline">{t('contact_search')}</div>
                        <div className="input-group">
                            {
                                // NOTE: maybe clear the search on a null return - paul
                            }
                            <input
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                type="search"
                                placeholder={t('contact_searchInputPlaceholder')}
                                ref="searchInput"/>
                        </div>
                        <div className="buttons">
                            <Peerio.UI.Tappable element="div" className="btn-safe" onTap={this.handleSearchForContacts}>
                                <i className="material-icons">search</i> {t('button_searchAgain')})
                            </Peerio.UI.Tappable>
                        </div>
                        <div className="list-view">
                            {resultNode}
                        </div>
                    </div>
                </div>);
        }
    });

}());
