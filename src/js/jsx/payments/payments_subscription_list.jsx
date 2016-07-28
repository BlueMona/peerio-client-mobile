(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionList = React.createClass({
        render: function () {
            var visible = this.props.items && this.props.items.length;
            return visible ? (
                    <div>
                        <p className="subhead">{this.props.title}</p>
                        {this.props.items.map( (s, i) => (
                            <Peerio.UI.PaymentsSubscriptionListItem subscription={s} key={i}/>))}
                    </div>
            ) : null;
        }
    });
}());
