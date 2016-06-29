(function () {
    'use strict';
    Peerio.UI.PassphraseGenerator = React.createClass({
        getInitialState: function () {
            return {};
        },

        componentDidMount: function () {
            this.generatePassphrase();
        },

        generatePassphrase: function () {
            var wordCount = 5;
            Peerio.PhraseGenerator.getPassPhrase(this.refs.lang.getDOMNode().value, wordCount)
                .then(function (phrase) {
                    this.setState({passphrase: phrase});
                    this.props.callback && this.props.callback(phrase);
                }.bind(this));
        },

        showDropdown: function () {
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('mousedown', true, true, window);
            this.refs.lang.getDOMNode().dispatchEvent(event);
        },

        // TODO refactor this to a generic select
        render: function () {
            var localeNodes = Object.keys(Peerio.Config.dictLocales).map(l => <option value={l}>{Peerio.Config.dictLocales[l]}</option>);
            return (
                <ul>
                    <li className="subhead">{t('passphrase')}</li>
                    <li className="passphrase">
                        <div>{this.state.passphrase}</div>
                        <Peerio.UI.Tappable element="i" onTap={this.generatePassphrase}
                                            className="material-icons">
                            refresh
                        </Peerio.UI.Tappable>

                    </li>
                    <li>
                        <div className="input-select">
                            <select ref="lang"
                                    id="language-select"
                                    onChange={this.generatePassphrase}>
                                {localeNodes}
                            </select>
                            <Peerio.UI.Tappable tag="i"
                                                className="material-icons"
                                                onTap={this.showDropdown}>
                                arrow_drop_down
                            </Peerio.UI.Tappable>
                        </div>
                    </li>
                </ul>
            );
        }
    });
}());
