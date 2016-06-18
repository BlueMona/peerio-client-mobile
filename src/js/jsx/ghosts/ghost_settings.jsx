(function () {
    'use strict';

    Peerio.UI.NewGhost = React.createClass({
        //  Confirms should be triggered based on the To input.

        confirmGhost: function () {
            Peerio.UI.Confirm.show({
                // TODO Ghost should link to a description of what a Ghost is.
                // Do we have a custom confirm? Or some what to add a checkbox to the confirm.
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
                                <input />
                                days.
                            </li>
                        </ul>

                        <ul>
                            <li className="subhead">{t('passphrase')}</li>
                            <li className="passphrase">
                                <div>passphrase goes here</div>
                                <Peerio.UI.Tappable element="i" onTap={this.copyContent}
                                                    className="material-icons">
                                    content_copy
                                </Peerio.UI.Tappable>
                                <Peerio.UI.Tappable element="i" onTap={this.shareEverything}
                                                    className="material-icons">
                                    share
                                </Peerio.UI.Tappable>
                            </li>
                        </ul>
                  </div>
            );
        }


    });
}

());
