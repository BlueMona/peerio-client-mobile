(function () {
    'use strict';


    Peerio.UI.ContactView = React.createClass({
        mixins: [Peerio.Navigation],
        componentWillMount: function () {
            this.subscriptions = [
                Peerio.Dispatcher.onBigGreenButton(this.startConversationWithContact),
                Peerio.Dispatcher.onContactsUpdated(this.forceUpdate.bind(this, null))];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
            Peerio.Action.showBigGreenButton();
        },

        startConversationWithContact: function () {
            this.transitionTo('ghost_new', {id: this.contact.username});
        },


        handleAccept: function () {
            this.contact.accept().catch(function (ex) {
                L.error('Failed to accept contact request. {0}', ex);
                Peerio.Action.showAlert({text: t('contact_acceptFail')});
            });

        },

        handleReject: function () {
            this.contact.reject().catch(function (ex) {
                L.error('Failed to reject contact request. {0}', ex);
                Peerio.Action.showAlert({text: t('contact_rejectFail')});
            });
        },

        removeContactAndGoBack: function () {
            (this.contact.isRequest ? this.contact.cancelRequest() : this.contact.remove())
                .then(()=> this.goBack())
                .catch(function (ex) {
                    L.error('Failed to remove contact. {0}', ex);
                    Peerio.Action.showAlert({text: t('contact_removeFail')});
                });
        },

        handleRemove: function () {
            // asking confirmation for established contacts only
            if (!this.contact.isRequest) {
                Peerio.Action.showConfirm({
                    headline: t('contact_removeConfirmTitle'),
                    text: t('contact_removeConfirmText', {username: this.contact.username}),
                    onAccept: this.removeContactAndGoBack
                });
            } else this.removeContactAndGoBack();
        },

        render: function () {
            this.contact = Peerio.user.contacts.dict[this.props.params.id]
                || Peerio.user.receivedContactRequests.dict[this.props.params.id]
                || Peerio.user.sentContactRequests.dict[this.props.params.id];

            if (!this.contact) {
                this.goBack();
                return null;
            }
            if (this.contact.isRequest)
                Peerio.Action.hideBigGreenButton();
            else
                Peerio.Action.showBigGreenButton();

            var buttons = [];

            if (!this.contact.isMe) {
                if (this.contact.isReceivedRequest) {
                    buttons.push(
                        <Peerio.UI.Tappable
                            key="acceptButton"
                            element="div"
                            className="btn-safe"
                            onTap={this.handleAccept}>
                            {t('contact_acceptRequestButton')}
                        </Peerio.UI.Tappable>,
                        <Peerio.UI.Tappable
                            key="rejectButton"
                            element="div"
                            className="btn-danger"
                            onTap={this.handleReject}>
                            {t('contact_rejectRequestButton')}
                        </Peerio.UI.Tappable>);

                } else buttons.push(
                    <Peerio.UI.Tappable
                        key="removeButton"
                        element="div"
                        className="btn-danger"
                        onTap={this.handleRemove}>
                        {t('contact_removeButton')}
                    </Peerio.UI.Tappable>);
            }

            var status = t('contact_statusEstablished');

            if (this.contact.isMe) {
                status = t('contact_statusIsSelf');
            } else if (this.contact.isReceivedRequest) {
                status = t('contact_statusRequestReceived');
            } else if (this.contact.isRequest) {
                status = t('contact_statusRequestSent');
            }


            return (
                <div className="content contact-view without-tab-bar">
                    <ul className="flex-list">
                        <li>
                            <div className="flex-row">
                                <Peerio.UI.Avatar size="big" username={this.contact.username}
                                                  className="contact-view-avatar"/>

                                <div className="flex-col">
                                    <div className="headline">{this.contact.fullName}</div>
                                    <div
                                        className="subhead-inline">{this.contact.username} { this.contact.isMe ? '(' + t('You') + ')' : ''}</div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <label>{t('publicKey')}</label>
                            <div className="text-mono width-full">{this.contact.publicKey}</div>
                        </li>

                        <li>
                            <label>{t('contactStatus')}</label>
                            <div>{status}</div>
                        </li>

                        <li>
                            <label>{t('contact_primaryAddress')}</label>
                            <div>{this.contact.address || t('n/a')}</div>
                        </li>

                    </ul>

                    <div className="buttons">
                        {buttons}
                    </div>

                </div>
            );

        }
    });

}());
