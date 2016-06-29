(function () {
    'use strict';

    Peerio.UI.GhostSettings = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {
                days: Peerio.Drafts.Ghost.days || 2
            };
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(this.share)
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        share: function () {
            _.assign(Peerio.Drafts.Ghost, this.state);
            this.replaceWith('ghost_share');
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
                                <div>
                                    Destroy after
                                    {/* I think the max time is 7 days. - paul */}
                                    <input size="1" type="text" maxLength="1" value={this.state.days} style={{width: 'inherit', margin: '0 4px', textAlign: 'center'}}/>
                                    days.
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
