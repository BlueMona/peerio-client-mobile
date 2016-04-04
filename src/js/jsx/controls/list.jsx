(function () {
    'use strict';

    Peerio.UI.List = React.createClass({
        getInitialState: function () {
            return {};
        },

        getItems: function () {
            return this.props.items || [];
        },

        toggle: function () {
            var selected = !this.state.selectAll;
            this.props.select && this.getItems().forEach( i => this.props.select(i, selected) );
            this.setState({selectAll: selected});
        },

        render: function () {
            var items = this.getItems();
            var renderItems = items.map((i, index) =>
                this.props.element( i, index )
            );

            return (
                <ul className="list-view">
                    <Peerio.UI.Tappable
                        element="li"
                        className="list-item select-all"
                        onTap={this.toggle}>
                        <div className={'checkbox-input' + (this.state.selectAll ? ' checked': '')}>
                            <i className="material-icons"></i>
                        </div>
                        <div className="list-item-content">{this.props.selectAllText || 'Select all contacts'}</div>
                        </Peerio.UI.Tappable>
                    {renderItems}
                </ul>
            );
        },


    });
}());
