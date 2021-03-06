(function () {
    'use strict';

    Peerio.UI.AddContact = React.createClass({
        mixins: [Peerio.Navigation],

        statics: {
            importContactsWarning: function() {
                return Peerio.UI.Confirm.show({text: t('contact_importWarning')});
            }
        },

        getInitialState: function() {
            return {
                searchString: ''
            };
        },

        goToSearch: function() {
            this.state.searchString && this.transitionTo('add_contact_search', {id:this.state.searchString});
        },

        updateSearchString: function(e) {
            this.setState({searchString: e.target.value});
        },

        importContacts: function() {
            Peerio.UI.AddContact.importContactsWarning()
                .then( () => {
                    this.transitionTo('add_contact_import');
                });
        },

        render: function(){
            var searchButton = 
                <Peerio.UI.Tappable element="div" 
                                    className={classNames('flex-shrink-0', this.state.searchString ? 'btn-safe' : 'btn-disabled')}
                                    onTap={this.goToSearch}>
                    {t('button_search')}
                </Peerio.UI.Tappable>;
    return  (<div className="content without-tab-bar without-footer">
        <div className="flex-col flex-justify-start">
            <div className="headline">{t('addContact')}</div>
            <div  className="input-group">
                <label htmlFor="search">{t('contact_searchTitle')}</label>
                <div className="flex-row flex-align-center">
                    <input type="text"
                           className="lowercase"
                           autoComplete="off"
                           autoCorrect="off"
                           autoCapitalize="off"
                           spellCheck="false"
                           onChange={this.updateSearchString}
                           placeholder={t('contact_searchPlaceholder')}
                           value={this.state.searchString}
                           id="search"/>
                    {searchButton}
                </div>
            </div>
            <p className="line-across">{t('or')}</p>
            <p className="centered-text">
                {t('contact_importTitle')}
            </p>
            <div className="buttons">
                <Peerio.UI.Tappable element="div" className="btn-primary" onTap={this.importContacts}>
                    <i className="material-icons">import_contacts</i>  {t('button_import')}
                </Peerio.UI.Tappable>
            </div>
        </div>
        </div>);
        }
    });

}());
