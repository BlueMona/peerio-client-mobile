(function () {
    'use strict';

    /**
     * Message list item component
     */
    Peerio.UI.ConversationsPlaceholder = React.createClass({
        mixins: [Peerio.Navigation],
        render: function () {
            return (
                <div className='content list-view'>
                    <div className="content-intro">
                        <img className="peerio-logo" src="media/img/peerio-logo-light.png"/>
                        <div className="headline">{t('setup_startTitle')}</div>
                        <p>{t('conversation_emptyList')}</p>
                      <img src="media/img/paper-plane.png" className="paper-plane-padding"/>
                    </div>
                </div>
            );
        }
    });

}());
