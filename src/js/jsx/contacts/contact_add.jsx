(function () {
  'use strict';

Peerio.UI.AddContact = React.createClass({
  mixins: [ReactRouter.Navigation],
  getInitialState: function(){
    return {searchString: ''};
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
    return  (<div className="content without-tab-bar">
      <div className="flex-col flex-justify-start">
        <div className="headline">Add Contact</div>
        <div  className="input-group">
          <input type="text" onChange={this.updateSearchString} placeholder="Search by username, email or phone" value={this.state.searchString}/>
        </div>
        {
        /*TODO: address layout issues when using buttons wrapper class here
        currently buttons overlap other content when wrapped in buttons class
        */
        }
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
        </div>);
  }
});

}());
