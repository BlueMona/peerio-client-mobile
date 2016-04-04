(function () {
    'use strict';

    Peerio.UI.ContactInviteTemplate = React.createClass({
        toggleSelection: function(email) {
            var selected = !this.props.isSelected(email);
            this.props.select(email, selected);
            this.forceUpdate();
        },
        render: function() {
            var emails = _.map(this.props.emails, (email) => {
                return (
                    <Peerio.UI.Tappable element="li" className="list-item" onTap={this.toggleSelection.bind(this, email)}>
                        <div className={'checkbox-input' + (this.props.isSelected(email) ? ' checked': '')}>
                            <i className="material-icons"></i>
                        </div>
                        <div className="list-item-content">{email.value}</div>
                    </Peerio.UI.Tappable>
                );
            });

            var name = this.props.name ? <div className="list-item-title selectable">{this.props.name}</div> : '' ;

            return (
                <li className='list-item'>
                    <div className="list-item-content">
                        {name}
                        <div className="list-item-description">
                            <ul className="nested-list">
                                {emails}
                            </ul>
                        </div>
                    </div>
                </li>
            );
        }
    });

}());
