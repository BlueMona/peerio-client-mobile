(function () {
    'use strict';

    Peerio.UI.PaymentsSubscriptionList = React.createClass({
        render: function () {
            return (
                <div>
                    <p>{this.props.title}</p>
                    {this.props.items.map( (s, i) => (
                        <Peerio.UI.PaymentsSubscriptionListItem subscription={s} key={i}/>
                    ))}
                </div>
            );
        }
    });
}());

