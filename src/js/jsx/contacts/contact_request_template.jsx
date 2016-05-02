(function () {
    'use strict';

    Peerio.UI.ContactRequestTemplate = React.createClass({
        toggleSelection: function(){
            var selected = !this.props.isSelected(this.props.item);
            this.props.select(this.props.item, selected);
            this.forceUpdate();
        },

        render: function(){
            var name;
            var publicKey = this.props.publicKey;
            if (this.props.name) {
                name = <div className="list-item-content">
                    {this.props.name} &bull; <span className="text-mono p-blue-dark-15">{this.props.username}</span>
                </div>;
            } else {
                name = <div className="list-item-content">
                    {this.props.username}
                    <div className="text-mono p-blue-dark-15">{publicKey}</div>
                </div>;
            }
            return (
                <Peerio.UI.Tappable element="li" className='list-item' onTap={this.toggleSelection}>
                    <div className={'checkbox-input' + (this.props.isSelected(this.props.item) ? ' checked': '')}>
                        <i className="material-icons"></i>
                    </div>
                    {name}
                </Peerio.UI.Tappable>
            );
        }
    });


}());
