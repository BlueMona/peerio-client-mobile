Peerio.UI.NotFound = React.createClass({render: function () {return (<div>Route not found</div>);}});

Peerio.UI.Routes = (
  <Route name='root' path='/' handler={Peerio.UI.Root}>
    <DefaultRoute handler={Peerio.UI.Login}/>
    <NotFoundRoute handler={Peerio.UI.NotFound}/>
    <Route name="signup" path="signup" handler={Peerio.UI.Signup}/>
    <Route name="app" path="app" handler={Peerio.UI.App}>

      <Route name='tabs' handler={Peerio.UI.Tabs}>
        <Route name='messages' handler={Peerio.UI.Messages}/>
        <Route name='files' handler={Peerio.UI.Files}/>
        <Route name='contacts' handler={Peerio.UI.Contacts}/>

      </Route>

      <Route name="conversation" path="/app/conversation/:id" handler={Peerio.UI.Conversation}/>
      <Route name='conversation_info' path="/app/conversation/:id/info" handler={Peerio.UI.ConversationInfo}/>

      <Route name="file" path="/app/file/:id" handler={Peerio.UI.FileView} />
      <Route name="contact" path="/app/contact/:id" handler={Peerio.UI.ContactView} />
      <Route name="new_message" path="/app/new_message" handler={Peerio.UI.NewMessage} />

      <Route name="account_settings" path="/app/settings/account" handler={Peerio.UI.AccountSettings} />
      <Route name="preference_settings" path="/app/settings/preferences" handler={Peerio.UI.PreferenceSettings} />

      <Route name='contact_import' path="/app/contact_import" handler={Peerio.UI.ContactImport}/>
      <Route name="contact_import_search" path="/app/contact_import/search/:id" handler={Peerio.UI.ContactImportSearch}/>


    </Route>
  </Route>
);


