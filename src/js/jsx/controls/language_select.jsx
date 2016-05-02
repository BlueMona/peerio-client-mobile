(function () {
    'use strict';
    Peerio.UI.LanguageSelect = React.createClass({
        changeLocale: function (event) {
            var locale = event.target.value;
            Peerio.Translator.loadLocale(locale);
            Peerio.Helpers.savePreferredLocale(locale);
    
            if(Peerio.user)
                Peerio.user.setLocale(locale);
            else
                Peerio.Translator.forceLocaleOnLogin = true;
        },
        // TODO refactor this to a generic select
        render: function () {
            return (
                <div className="input-select">
                      <select id="language-select"
                          onChange={this.changeLocale}>
                          {
                              Peerio.Config.locales.map(l => l.code === Peerio.Translator.locale ?
                              <option value={l.code} selected>{l.name}</option> :
                              <option value={l.code} >{l.name}</option>)
                          }
                      </select>
                      <i className="material-icons">arrow_drop_down</i>
              </div>
          );
        }
    });
}());
