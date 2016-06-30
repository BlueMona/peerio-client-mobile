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
            var draft = Peerio.Drafts.Ghost;
            var g = api.create();
            g.subject = draft.subject;
            g.recipient = draft.email;
            g.body = draft.body;
            g.days = draft.days;
            g.usePassphrase(draft.passphrase)
                .then(() => api.send(g))
                .then(() => {
                    draft.id = g.id;
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
                                <span>
                                    Destroy after
                                </span>
                                <div className="input-select">
                                    <select ref="days" value={this.state.days} onChange={this.setDays}>
                                        {[1,2,3,4,5,6,7].map(i => <option value={i}>{i}</option>)}
                                    </select>
                                </div>
                                days.
                            </li>
                        </ul>
                        <Peerio.UI.PassphraseGenerator callback={this.updatePassphrase}/>
                  </div>
            );
        }


    });
}

());
