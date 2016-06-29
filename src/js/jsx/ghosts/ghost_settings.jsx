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

        updatePassphrase: function (phrase) {
            this.setState({passphrase: phrase});
        },

        render: function () {
            return (
                  <div className="content without-tab-bar">
                        <div className="headline">{t('ghost_mobile_settings')}</div>
                        <ul>
                            <li className="subhead">{t('ghost_lifespan')}</li>
                            <li className="">
                                <span>
                                Destroy after
                                </span>
                                {/* I think the max time is 7 days. - paul */}
                                <input size="1" type="text" maxLength="1" value={this.state.days}/>
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
