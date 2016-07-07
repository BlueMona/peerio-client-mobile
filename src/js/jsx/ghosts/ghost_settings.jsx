(function () {
    'use strict';

    Peerio.UI.GhostSettings = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                days: Peerio.Drafts.Ghost.days || 2
            };
        },

        on: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(this.share)
            ];
        },

        off: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        componentDidMount: function () {
            this.on();
        },

        componentWillUnmount: function () {
            this.off();
        },

        share: function () {
            // to prevent user from double-tapping
            this.off();
            _.assign(Peerio.Drafts.Ghost, this.state);

            var api = Peerio.Ghost;
            var g = Peerio.Drafts.Ghost;
            g.days = this.state.days;
            g.usePassphrase(this.state.passphrase)
                .then(() => api.send(g))
                .then(() => {
                    L.info('all good');
                    this.replaceWith('ghost_share');
                })
                .catch(e => {
                    Peerio.UI.Alert.show({text: 'Error sending Ghost. Please contact support'});
                    L.error(e);
                });
        },

        setDays: function () {
            var v = this.refs.days.getDOMNode().value;
            this.setState({days: v});
        },

        updatePassphrase: function (phrase) {
            this.setState({passphrase: phrase});
        },

        render: function () {
            return (
                  <div className="content without-tab-bar">
                        <div className="headline">{t('ghost_mobile_settings')}</div>
                        <ul>
                            <li className="flex-col flex-align-start">
                                <label>{t('ghost_lifespan')}</label>
                                <div className="flex-row flex-align-center">
                                    {t('ghost_destroyAfter')}
                                    <div className="input-select" style={{margin: '0 8px', width: 'inherit'}}>
                                        <select ref="days" value={this.state.days} onChange={this.setDays}>
                                            {[1,2,3,4,5,6,7].map(i => <option value={i}>{i}</option>)}
                                        </select>

                                        <Peerio.UI.Tappable tag="i"
                                                            className="material-icons"
                                                            onTap={this.showDropdown}>
                                            arrow_drop_down
                                        </Peerio.UI.Tappable>
                                    </div>
                                    {t('ghost_days')}
                                </div>

                            </li>
                        </ul>
                        <Peerio.UI.PassphraseGenerator callback={this.updatePassphrase}/>
                  </div>
            );
        }


    });
}

());
