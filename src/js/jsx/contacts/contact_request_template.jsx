//Each item handles it own 'selected' state individually to avoid looping through
//all contacts on each tap. Contacts are selected by reaching into the parent
//component with a props.onTap function.

(function () {
  'use strict';

Peerio.UI.ContactRequestTemplate = React.createClass({
  toggleSelection: function(){
    this.props.isSelected = !this.props.isSelected;
    this.props.selected[this.props.username] = this.props.isSelected;
    this.forceUpdate();
  },
  render: function(){
    var name;
    var publicKey = this.props.publicKey;
    if (this.props.name) {
      name = <div className="list-item-title">
                {this.props.name} &bull; <span className="text-mono p-blue-dark-15">{this.props.username}</span>
             </div>;
    } else {
      name = <div className="list-item-title">
                {this.props.username}
                <div className="text-mono p-blue-dark-15">{publicKey}</div>
              </div>;
    }
    return <Peerio.UI.Tappable element="li" className='list-item' onTap={this.toggleSelection}>

      <div className={'checkbox-input' + (this.props.selected[this.props.username] ? ' checked': '')}>
        <i className="material-icons"></i>
      </div>

      {name}

    </Peerio.UI.Tappable>;
  }
});


}());
