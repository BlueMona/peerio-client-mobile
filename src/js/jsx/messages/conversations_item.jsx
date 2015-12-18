(function () {
    'use strict';

    /**
     * Message list item component
     */
    Peerio.UI.ConversationsItem = React.createClass({
        mixins: [ReactRouter.Navigation],

        getInitialState: function () {
            return {swiped: false};
        },
        closeSwipe: function () {
            this.setState({swiped: false});
        },
        openSwipe: function () {
            this.setState({swiped: true});
        },

        openConversation: function () {
            this.transitionTo('conversation', {id: this.props.item.id});
        },

        destroyConversation: function () {
            this.setState({destroyAnimation: true}, ()=> Peerio.Messages.removeConversation(this.props.item.id));
        },

        showDestroyDialog: function () {
            Peerio.Action.showConfirm({
                text: 'are you sure you want do delete this conversation? You will no longer receive messages or files within this conversation.',
                onAccept: this.destroyConversation
            });
        },
        render: function () {
            var conv = this.props.item;
            // building name to display for conversation item.
            // it should be in format "John Smith +3"
            // and it should not display current user's name,
            // unless he is the only one left in conversation

            if (!conv.username) {
                var displayName = '';
                for (var i = 0; i < conv.participants.length; i++) {
                    var username = conv.participants[i];
                    if (username === Peerio.user.username && conv.participants.length > 1) continue;
                    var contact = Peerio.user.contacts.dict[username];
                    displayName = (contact && contact.fullName) || '';
                    break;
                }
                if (conv.participants.length > 2) {
                    displayName += ' [+' + (conv.participants.length - 2) + ']';
                }
                conv.displayName = displayName;
                conv.username = username;
            }

            var cx = React.addons.classSet;
            var classes = cx({
                'list-item': true,
                'unread': conv.unread,
                'swiped': this.state.swiped,
                'list-item-animation-leave': this.state.destroyAnimation
            });
            //<React.addons.CSSTransitionGroup style={{width:'100%', display:'flex'}} transitionName="fade" transitionAppear={true}
            //                                 transitionAppearTimeout={250}>
            return (
                <Peerio.UI.Tappable element="div" onTap={this.openConversation} className={classes}>
                    <Peerio.UI.Swiper onSwipeLeft={this.openSwipe} onSwipeRight={this.closeSwipe}
                                      className="list-item-swipe-wrapper">

                        <div className="list-item-thumb">
                            {conv.hasFiles ?
                                (<div className="icon-with-label">
                                    <i className={'fa fa-paperclip attachment'}></i>
                                </div>)
                                : null}
                        </div>

                        <div className="list-item-content">
                            <div className="list-item-sup">{conv.username}</div>
                            {conv.displayName && <div className="list-item-title">{conv.displayName}</div>}
                            <div className="list-item-description">{conv.subject}</div>
                        </div>

                        <div className="list-item-content text-right">
                            <div className="list-item-description">
                                {Date.currentYear == conv.lastMoment.year() ? conv.lastMoment.format('MMM D') : conv.lastMoment.format('MMM D, YYYY')}
                            </div>
                            <div className="list-item-description">
                                {conv.lastMoment.format('h:mm a')}
                            </div>
                        </div>

                        <div className="list-item-forward">
                            <i className="fa fa-chevron-right"></i>
                        </div>

                        <Peerio.UI.Tappable className="list-item-swipe-content" onTap={this.showDestroyDialog}>
                            <i className="fa fa-trash-o"></i>
                        </Peerio.UI.Tappable>

                    </Peerio.UI.Swiper>
                </Peerio.UI.Tappable>

            );
        }
    });

}());
