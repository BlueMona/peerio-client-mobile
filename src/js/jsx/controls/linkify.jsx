/**
 * Detects links and converts them to clickable spans
 */
(function () {
    'use strict';

    Peerio.UI.Linkify = React.createClass({
        shouldComponentUpdate: function (nextProps, nextState) {
            return nextProps.text !== this.props.text;
        },
        open: function (href) {
            var action = this.props.onOpen || Peerio.NativeAPI.openInBrowser;
            var p = this.props.suppressWarning ? Promise.resolve(true) :
                Peerio.UI.Confirm.show({text: t('openLinkWarning')});
            return p.then(() => action(href))
                .catch(e => L.error(e));
        },
        render: function () {
            this.text = this.props.text;
            var nodes = linkify.tokenize(this.text).map((token, i) => {
                if (token.isLink)
                    return <Peerio.UI.Tappable
                        key={i}
                        element="a"
                        className="message-link"
                        onTap={this.open.bind(this, token.toHref())}>{token.toString()}</Peerio.UI.Tappable>;
                else
                    return <span key={i}>{token.toString()}</span>;
            });
            return (
                <span>
                    {nodes}
                </span>
            );
        }
    });

}());
