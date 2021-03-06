/**
 * Footer bar
 */
(function () {
    'use strict';

    Peerio.UI.Footer = React.createClass({
        mixins: [Peerio.Navigation, ReactRouter.State, Peerio.UI.Mixins.RouteTools],

        getInitialState: function () {
            return {greenButtonIsVisible: true};
        },

        buildActions: function(){
            // route name: { button text, button action }
            // default action is Peerio.Action.bigGreenButton
            this.setState({mainButtonActions : {
                messages: {
                    name: t('button_composeMessage'),
                    action: this.transitionTo.bind(this, 'ghost_new'),
                    icon: 'edit'
                },
                files: {name: t('button_uploadFile'), action: Peerio.Action.showFileUpload, icon: 'cloud_upload'},
                contacts: {name: t('button_addContact'), icon: 'person_add'},
                contact: {name: t('button_sendMessage'), icon: 'edit'},
                add_contact_import: {name: t('button_importContacts'), icon: 'person_add'},
                add_contact_search: {name: t('button_addSelectedContact'), icon: 'person_add'},
                new_message: {name: t('button_send'), icon: 'send'},
                conversation: {name: t('button_send'), icon: 'send'},
                ghost_new: {name: t('prepare_ghost'), icon: 'send'},
                ghost_settings: {name: t('ghost_mobile_share'), icon: 'send'},
                ghost_share: {name: t('ghost_toMessageList'), icon: 'send'}
            }});
        },

        componentWillMount: function () {
            this.buildActions();

            this.subscriptions = [
                Peerio.Dispatcher.onHideBigGreenButton(()=>this.setState({greenButtonIsVisible: false})),
                Peerio.Dispatcher.onShowBigGreenButton((custom_text, custom_icon) => {
                    if(custom_text || custom_icon) {
                        var mainButtonActions = this.state.mainButtonActions;
                        var route = mainButtonActions[this.getRouteName()];
                        if(custom_text) route.name = custom_text;
                        if(custom_icon) route.icon = custom_icon;
                        mainButtonActions[this.getRouteName] = route;
                        this.setState({mainButtonActions: mainButtonActions});
                    }
                    this.setState({
                        greenButtonIsVisible: true,
                    });
                }),
                Peerio.Dispatcher.onLocaleChanged(this.buildActions)
            ];
        },

        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscriptions);
        },

        //--- RENDER
        render: function () {
          // TODO change greenButton var to something more discriptive. ie primaryActionBtn. This would match changes to styling.
          // TODO add changes for ghost? s
            var greenButton = this.state.greenButtonIsVisible ? this.state.mainButtonActions[this.getRouteName()] : null;
            if (greenButton)
                greenButton = (
                    <Peerio.UI.Tappable id="greenButton" element="div" className="btn-primary-action"
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
