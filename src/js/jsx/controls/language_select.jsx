(function () {
    'use strict';
    Peerio.UI.LanguageSelect = React.createClass({
        changeLocale: function (event) {
            Peerio.Translator.loadLocale(event.target.value);
        },

        render: function () {
            return (<select id="language-select"
                    onChange={this.changeLocale}>
                {
                    Peerio.Config.locales.map(l => <option value={l.code}>{l.name}</option>)
                }
            </select>);
        }
    })
}());
