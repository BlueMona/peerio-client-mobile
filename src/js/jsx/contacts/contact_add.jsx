(function () {
  'use strict';

Peerio.UI.AddContact = React.createClass({
  mixins: [ReactRouter.Navigation],

  componentWillMount: function() {
      Peerio.user.getInviteCode()
      .then( (code) => {
          code && code.inviteCode && this.setState( { inviteCode: code.inviteCode } );
      });
  },

  getInitialState: function() {
      return {
          searchString: '',
      };
  },

  goToSearch: function(){
    this.transitionTo('add_contact_search', {id:this.state.searchString});
  },

  updateSearchString: function(e){
    this.setState({searchString: e.target.value});
  },

  render: function(){
    var searchButton = (this.state.searchString.length === 0) ?
        <div className="btn-disabled"><i className="material-icons">search</i> Search</div>
      :<Peerio.UI.Tappable element="div" className="btn-safe" onTap={this.goToSearch}>
      <i className="material-icons">search</i> Search
    </Peerio.UI.Tappable>;
    return  (<div className="content without-tab-bar without-footer">
      <div className="flex-col flex-justify-start">
        <div className="headline">Add Contact</div>
        <div  className="input-group">
          <label>Search</label>
          <input type="text" onChange={this.updateSearchString} placeholder="username, email or phone" value={this.state.searchString}/>
        </div>

        <div className="buttons">
            {searchButton}
        </div>
        <p className="line-across">or</p>
          <p className="centered-text">
            Import contacts from your phone.
          </p>
          <div className="buttons">
            <Peerio.UI.Tappable element="div" className="btn-primary" onTap={this.transitionTo.bind(this, 'add_contact_import')}>
              <i className="material-icons">import_contacts</i>  Import
            </Peerio.UI.Tappable>
          </div>
          </div>
          <div id="footer" className={'footer-light' + (!this.state.inviteCode ? ' hide' : '')}>Your Invite Code<strong className="margin-small"> {this.state.inviteCode}</strong>
            {/* TODO: get content for info alert */}
            <Peerio.UI.Tappable element="i" className="material-icons">info_outline</Peerio.UI.Tappable>
          </div>
        </div>);
  }
});

}());
