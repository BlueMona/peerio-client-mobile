(function () {

    Peerio.UI.PreferenceSettings = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return this.getSettings();
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated(this.resetSettings.bind(this, null)),
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        resetSettings: function () {
            this.setState(this.getSettings());
        },

        getSettings: function () {
            return {
                notifyNewContact: Peerio.user.settings.receiveContactNotifications,
                notifyNewMessage: Peerio.user.settings.receiveMessageNotifications,
                notifyContactRequest: Peerio.user.settings.receiveContactRequestNotifications,
                dataCollectionOptIn: Peerio.user.settings.dataCollectionOptIn
            };
        },

        setDevicePin: function () {
            Peerio.Action.transitionTo('set_pin', null, {});
        },

        doUpdateNotificationSettings: function () {
            this.doUpdate = this.doUpdate || _.throttle(function () {
                    return Peerio.user.setNotifications(
                        this.state.notifyNewMessage,
                        this.state.notifyNewContact,
                        this.state.notifyContactRequest)
                        .catch(err => {
                            L.error('Settings save failed. {0}', err);
                            Peerio.Action.showAlert({text: t('settings_saveFailed')});
                            this.resetSettings();
                        });
                }, 1000);
            this.doUpdate();
        },

        setNotifyNewContact: function () {
            this.setState({notifyNewContact: !this.state.notifyNewContact});
            this.doUpdateNotificationSettings();
        },

        setNotifyNewMessage: function () {
            this.setState({notifyNewMessage: !this.state.notifyNewMessage});
            this.doUpdateNotificationSettings();
        },

        setNotifyNewContactRequest: function () {
            this.setState({notifyContactRequest: !this.state.notifyContactRequest});
            this.doUpdateNotificationSettings();
        },

        setDataCollection: function () {
            Peerio.user.enableDataCollection(!this.state.dataCollectionOptIn);
        },

        showDataCollectionInfo: function () {
            Peerio.Action.showAlert({
                text: t('settings_optIn')
            });
        },

        changeLocale: function (event) {
            Peerio.Translator.loadLocale(event.target.value);
        },

        render: function () {
            return (
                <div className="content without-tab-bar without-footer">
                    <div className="headline">{t('preferences')}</div>

                    <ul>
                        <li className="subhead">Language</li>
                        <li>
                          <select id="language-select" className="select-input"
                                  onChange={this.changeLocale}>
                              {
                                  Peerio.Config.locales.map(l => <option value={l.code}>{l.name}</option>)
                              }
                          </select>
                        </li>

                        <li className="subhead">{t('notifications')}</li>
                        <Peerio.UI.Tappable key='notify-new-message'
                                            element="li"
                                            onTap={this.setNotifyNewMessage}>
                            <div className={'checkbox-input' + (this.state.notifyNewMessage ? ' checked': '')}>
                                <i className="material-icons"></i>
                            </div>

                            <div>{t('notifications_whenNewMessage')}</div>
                        </Peerio.UI.Tappable>

                        <Peerio.UI.Tappable key='notify-new-contact'
                                            element="li"
                                            onTap={this.setNotifyNewContact}>
                            <div className={'checkbox-input' + (this.state.notifyNewContact ? ' checked': '')}>
                                <i className="material-icons"></i>
                            </div>
                            <div>{t('notifications_whenNewContactRequest')}</div>
                        </Peerio.UI.Tappable>

                        <Peerio.UI.Tappable key='notify-new-contact-request'
                                            element="li"
                                            onTap={this.setNotifyNewContactRequest}>

                            <div className={'checkbox-input' + (this.state.notifyContactRequest ? ' checked': '')}>
                                <i className="material-icons"></i>
                            </div>
                            <div>{t('notifications_whenInviteAccepted')}</div>
                        </Peerio.UI.Tappable>

                        <li className="caption" style={{height:'64px'}}>{t('notifications_note')}</li>
                    </ul>
                    <Peerio.UI.TouchId/>

                    <ul>
                        <li className="subhead">{t('optIns')}</li>
                        <Peerio.UI.Tappable
                            key='data-collection-optin'
                            onTap={this.setDataCollection}
                            element="li">
                            <div className={'checkbox-input' + (this.state.dataCollectionOptIn ? ' checked': '')}>
                                <i className="material-icons"></i>
                            </div>
                            <div>{t('optIns_dataCollection')}</div>
                            <Peerio.UI.Tappable element="i" onTap={this.showDataCollectionInfo}
                                                className="material-icons">
                                info_outline
                            </Peerio.UI.Tappable>
                        </Peerio.UI.Tappable>
                    </ul>
                    <RouteHandler/>
                </div>
            );
        }
    });

}());
