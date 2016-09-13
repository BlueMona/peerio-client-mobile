(function () {
    'use strict';

    Peerio.UI.EnterConfirm = React.createClass({
        mixins:[Peerio.Navigation],

        componentDidMount: function () {
            var element = React.findDOMNode(this.refs.textInput);
            //TODO: looks like it works on ios but not android.
            element && element.focus();
        },

        cancel: function () {
            this.props.onCancel(this.props.address, this.refs.textInput.getDOMNode().value);
        },

        ok: function () {
            this.props.onPrompt(this.props.address, this.refs.textInput.getDOMNode().value);
        },
        //--- RENDER
        render: function () {
            return !this.props.visible ? null : (
                <div className="content-inline-dialog">
                    <div className="headling-md">
                        {t('address_confirmCodePrompt2')}
                    </div>
                    <div>
                        <input
                            className="txt-lrg text-center"
                            ref="textInput"
                            autoComplete="off" autoCorrect="off"
                            autoCapitalize="off" spellCheck="false">
                        </input>
                        <Peerio.UI.Tappable element="div" className="btn-safe"
                            onTap={this.ok}>
                            {t('button_confirm')}
                        </Peerio.UI.Tappable>
                        <Peerio.UI.Tappable element="div" className="btn-danger"
                            onTap={this.cancel}>
                            {t('button_cancel')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());
