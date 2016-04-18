/**
 * Footer bar
 */
(function () {
    'use strict';

    Peerio.UI.Footer = React.createClass({
        mixins: [ReactRouter.Navigation, ReactRouter.State, Peerio.UI.Mixins.RouteTools],
        getInitialState: function () {
            return {greenButtonIsVisible: true};
        },
        buildActions: function(){
            // route name: { button text, button action }
            // default action is Peerio.Action.bigGreenButton
            this.setState({mainButtonActions : {
                messages: {
                    name: t('button_composeMessage'),
                    action: this.transitionTo.bind(this, 'new_message'),
                    icon: 'edit'
                },
                files: {name: t('button_uploadFile'), action: Peerio.Action.showFileUpload, icon: 'cloud_upload'},
                contacts: {name: t('button_addContact'), icon: 'person_add'},
                contact: {name: t('button_sendMessage'), icon: 'edit'},
                add_contact_import: {name: t('button_importContacts'), icon: 'person_add'},
                add_contact_search: {name: t('button_addSelectedContact'), icon: 'person_add'},
                new_message: {name: t('button_send'), icon: 'send'},
                conversation: {name: t('button_send'), icon: 'send'}
            }});
        },
        componentWillMount: function () {
            this.buildActions();

            this.subscriptions = [
                Peerio.Dispatcher.onHideBigGreenButton(()=>this.setState({greenButtonIsVisible: false})),
                Peerio.Dispatcher.onShowBigGreenButton(()=>this.setState({greenButtonIsVisible: true})),
                Peerio.Dispatcher.onLocaleChanged(this.buildActions)
            ];
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },
        //--- RENDER
        render: function () {
            var greenButton = this.state.greenButtonIsVisible ? this.state.mainButtonActions[this.getRouteName()] : null;
            if (greenButton)
                greenButton = (
                    <Peerio.UI.Tappable id="greenButton" element="div" className="btn-global-action"
                                        onTap={greenButton.action || Peerio.Action.bigGreenButton}>
                        <i className="material-icons">{greenButton.icon}</i> {greenButton.name}
                    </Peerio.UI.Tappable>);

            return (
                <div id="footer">
                    {greenButton}
                </div>
            );
        }
    });

}());
