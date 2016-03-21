(function () {
    'use strict';

    Peerio.UI.SetupWizardContactImport = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
            };
        },

        importContacts: function() {
            Peerio.UI.Confirm.show({text: 'Your contact list will be shared with Peerio. This information is only used to help you find your contacts on Peerio and will be wiped immediately after importing. Would you like to proceed?'})
            .then( () => {
                this.transitionTo('add_contact_import');
            });
        },

        render: function () {
           return (
                <div>
                    <div className="headline">Import Contacts</div>
                      <p className="centered-text">
                        Find out which of your contacts is already using Peerio.
                      </p>
                      <div className="buttons">
                        <Peerio.UI.Tappable element="div" className="btn-primary" onTap={this.importContacts}>
                          <i className="material-icons">import_contacts</i>  Import
                        </Peerio.UI.Tappable>
                      </div>
                </div>
            );
        },
    });

}());
