(function () {
    'use strict';

    Peerio.UI.GhostSettings = React.createClass({
        //  Confirm type should be triggered based on the To input.

        confirmGhost: function () {
            Peerio.UI.Confirm.show({
                // TODO Ghost should link to a description of what a Ghost is.
                // Do we have a custom confirm? Or some way to add a checkbox to the confirm? - paul
                text: 'This doesn\’t appear to be a Peerio user. Would you like to send a Ghost?',
                okText: 'Send Ghost'
            });
        },

        addContact: function () {
            Peerio.UI.Confirm.show({
                text: 'This user is not one of your contacts. Would you like to send them a friend request?',
                okText: 'Send Request'
            });
        },

        render: function () {
            return (
                  <div className="content without-tab-bar">
                        <div className="headline">{t('ghost_settings')}</div>
                        <ul>
                            <li className="subhead">{t('ghost_lifespan')}</li>
                            <li className="">
                                Destroy after
                                {/* I think the max time is 7 days. - paul */}
                                <input size="1" type="text" maxLength="1"/>
                                days.
                            </li>
                        </ul>

                        <ul>
                            <li className="subhead">{t('passphrase')}</li>
                            <li className="passphrase">
                                <div>passphrase goes here</div>
                                <Peerio.UI.Tappable element="i" onTap={this.copyContent}
                                                    className="material-icons">
                                    refresh
                                </Peerio.UI.Tappable>

                            </li>

                            <li>
                              <Peerio.UI.LanguageSelect />
                            </li>
                        </ul>
                  </div>
            );
        }


    });
}

());
