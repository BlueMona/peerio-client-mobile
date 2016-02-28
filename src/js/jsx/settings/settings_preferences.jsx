(function () {

    Peerio.UI.PreferenceSettings = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function(){
            return this.getSettings();
        },

        componentDidMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onSettingsUpdated( this.resetSettings.bind(this, null) ),
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        resetSettings: function() {
            this.setState(this.getSettings());
        },

        getSettings: function() {
            return {
                notifyNewContact: Peerio.user.settings.receiveContactNotifications,
                notifyNewMessage: Peerio.user.settings.receiveMessageNotifications,
                notifyContactRequest: Peerio.user.settings.receiveContactRequestNotifications,
                dataCollectionOptIn: Peerio.user.settings.dataCollectionOptIn
            };
        },

        setDevicePin: function() {
            Peerio.Action.transitionTo('set_pin', null, {});
        },

        doUpdateNotificationSettings: function(){
            this.doUpdate = this.doUpdate || _.throttle(function(){
                return Peerio.user.setNotifications(
                    this.state.notifyNewMessage,
                    this.state.notifyNewContact,
                    this.state.notifyContactRequest)
                .catch( (error) => {
                    Peerio.Action.showAlert({text: 'Save failed. ' + (error ? (' Error message: ' + (error.message ? error.message : error)) : '')});
                    this.resetSettings();
                });
            }, 1000);
            this.doUpdate();
        },

        setNotifyNewContact: function() {
            this.setState({notifyNewContact: !this.state.notifyNewContact});
            this.doUpdateNotificationSettings();
        },

        setNotifyNewMessage: function() {
            this.setState({notifyNewMessage: !this.state.notifyNewMessage});
            this.doUpdateNotificationSettings();
        },

        setNotifyNewContactRequest: function() {
            this.setState({notifyContactRequest: !this.state.notifyContactRequest});
            this.doUpdateNotificationSettings();
        },

        setDataCollection: function() {
            Peerio.user.enableDataCollection(!this.state.dataCollectionOptIn);
        },

        showDataCollectionInfo: function () {
          Peerio.Action.showAlert({
            text: 'By enabling anonymous data collection, we will collect non-identifying and non-content information to share with researchers and improve Peerio. \n We understand your data has value. When you opt in, we will add 25MB to your account everyday as thanks for your contribution.'
          });
        },

        render: function(){
            return (
                <div className="content without-tab-bar without-footer">
                  <div className="headline">Preferences</div>

                  <ul>
                    <li className="subhead">Notifications</li>
                    <Peerio.UI.Tappable key='notify-new-message'
                      element="li"
                    onTap={this.setNotifyNewMessage}>
                      <div className={'checkbox-input' + (this.state.notifyNewMessage ? ' checked': '')}>
                        <i className="material-icons"></i>
                      </div>

                      <div>You receive a new message</div>
                    </Peerio.UI.Tappable>

                    <Peerio.UI.Tappable key='notify-new-contact'
                      element="li"
                    onTap={this.setNotifyNewContact}>
                      <div className={'checkbox-input' + (this.state.notifyNewContact ? ' checked': '')}>
                        <i className="material-icons"></i>
                      </div>
                      <div>You receive a contact request</div>
                    </Peerio.UI.Tappable>

                    <Peerio.UI.Tappable key='notify-new-contact-request'
                      element="li"
                    onTap={this.setNotifyNewContactRequest}>

                      <div className={'checkbox-input' + (this.state.notifyContactRequest ? ' checked': '')}>
                        <i className="material-icons"></i>
                      </div>
                              <div>Your invite is accepted</div>
                        </Peerio.UI.Tappable>

                        <li className="caption" style={{height:'64px'}}>You will only recieve notifications on your primary address (email or phone).</li>
                    </ul>
                    <Peerio.UI.TouchId/>

                    <ul>
                        <li className="subhead">Opt-ins</li>
                        <Peerio.UI.Tappable 
                            key='data-collection-optin'
                            onTap={this.setDataCollection} 
                            element="li">
                            <div className={'checkbox-input' + (this.state.dataCollectionOptIn ? ' checked': '')}>
                                <i className="material-icons"></i>
                            </div>
                            <div>Data collection</div>
                            <Peerio.UI.Tappable element="i" onTap={this.showDataCollectionInfo} className="material-icons">
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
