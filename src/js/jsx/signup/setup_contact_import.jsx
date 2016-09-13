(function () {
    'use strict';

    Peerio.UI.SetupWizardContactImport = React.createClass({
        mixins: [Peerio.Navigation],

        getInitialState: function () {
            return {
            };
        },

        importContacts: function () {
            Peerio.UI.Confirm.show({text: t('contact_importWarning')})
            .then( () => {
                this.setState({ inProgress: true });
            });
        },

        doImportContacts: function () {
            Peerio.Action.bigGreenButton();
        },

        render: function () {
            return (
                <div className="_setupContactImport">
                    <div className="headline">{t('importContacts')}</div>
                    {!this.state.inProgress ? (<div>
                        <p className="centered-text">
			    {t('setup_importDescription')}
                        </p>
                        <div className="buttons">
                            <Peerio.UI.Tappable element="div" className="btn-primary" onTap={this.importContacts}>
			    <i className="material-icons">import_contacts</i>  {t('button_import')}
                            </Peerio.UI.Tappable>
                        </div>
                        </div>) : (<div>
                        <div className="buttons">
                            <Peerio.UI.Tappable element="div" className="btn-primary" onTap={this.doImportContacts}>
			    	<i className="material-icons">import_contacts</i>  {t('button_importWizard')}
                            </Peerio.UI.Tappable>
                        </div>
                        <Peerio.UI.AddContactImport hideTitle={true} onSuccess={this.props.onSuccess} />
                    </div>
                    )}
                </div>
            );
        },
    });

}());
