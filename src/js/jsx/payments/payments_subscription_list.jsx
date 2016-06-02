(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionList = React.createClass({
        render: function () {
            var visible = this.props.items && this.props.items.length;
            return visible ? (
                    <ul className="flex-list">
                        <li className="subhead">{this.props.title}</li>
                        {this.props.items.map( (s, i) => (
                            <Peerio.UI.PaymentsSubscriptionListItem subscription={s} key={i}/>))}
                    </ul>
            ) : null;
        }
    });
}());
