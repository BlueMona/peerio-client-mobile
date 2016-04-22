(function () {
    'use strict';
    Peerio.UI.LanguageSelect = React.createClass({
        changeLocale: function (event) {
            Peerio.Translator.loadLocale(event.target.value);
        },
        // TODO refactor this to a generic select
        render: function () {
            return (
                <div className="input-select">
                      <select id="language-select"
                          onChange={this.changeLocale}>
                          {
                              Peerio.Config.locales.map(l => <option value={l.code}>{l.name}</option>)
                          }
                      </select>
                      <i className="material-icons">arrow_drop_down</i>
              </div>
          );
        }
    })
}());
