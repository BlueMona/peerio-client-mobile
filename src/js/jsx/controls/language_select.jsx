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

        showDropdown: function () {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('mousedown', true, true, window);
            this.refs.select.getDOMNode().dispatchEvent(event);
        },

        // TODO refactor this to a generic select
        render: function () {
            return (
                <div className="input-select">
                    <select ref="select"
                            id="language-select"
                            onChange={this.changeLocale}>
                        {
                            Peerio.Config.locales.map(l => l.code === Peerio.Translator.locale ?
                        <option value={l.code} selected>{l.name}</option> :
                        <option value={l.code} >{l.name}</option>)
                        }
                    </select>
                    <Peerio.UI.Tappable tag="i"
                                        className="material-icons"
                                        onTap={this.showDropdown}>
                        arrow_drop_down
                    </Peerio.UI.Tappable>
                </div>
            );
        }
    });
}());
