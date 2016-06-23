(function () {
    'use strict';

    Peerio.UI.GhostShare = React.createClass({
        render: function () {
            return (
                <div className="content without-tab-bar">
                      <div className="headline">{t('ghost_share')}</div>
                      <p>{t('ghost_sent')} + ghostRecipient</p>
                      <p>{t('ghost_passphrase_share')}</p>

                      <label>{t(passphrase)}</label>
                      {/* generated passphrase goes */}

                      <Peerio.UI.Tappable element="i" onTap={this.shareEverything}
                                          className="material-icons">
                          share
                      </Peerio.UI.Tappable>

                      <div className="caption">
                            {t('ghost_passphrase_share_helper')}
                      </div>
                      <p>{t('ghost_passphrase_share_link')}</p>

                      <div className="flex-row">
                          {/* link */}
                          <Peerio.UI.Tappable element="i" onTap={this.shareEverything}
                                              className="material-icons">
                              share
                          </Peerio.UI.Tappable>
                      </div>
                </div>
            );
        }
    });
} ());
