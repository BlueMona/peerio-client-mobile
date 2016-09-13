(function () {
    'use strict';


    var shareSubject = 'Peerio';
    var shareLink = 'http://www.peerio.com/invite.html?code={0}';

    Peerio.UI.ShareCode = React.createClass({
        mixins:[Peerio.Navigation],

        getInitialState: function() {
            return { inviteCode: null };
        },

        componentWillMount: function() {
            Peerio.user.getInviteCode()
            .then( (code) => {
                code && code.inviteCode && this.setState( { inviteCode: code.inviteCode } );
            })
            .catch( () => {
                this.setState( { inviteCode: null } );
            });
        },

        invokeShare: function() {
            this.state.inviteCode && this.state.inviteCode.length &&
            Peerio.NativeAPI.shareNativeDialog(
                t('shareText', {code:this.state.inviteCode}),
                shareSubject,
                Peerio.Util.interpolate(shareLink, [this.state.inviteCode])
            );
        },

        onCopy: function () {
            this.setState({animateCopy: true});
            window.setTimeout( () => {
                this.setState({animateCopy: false});
            }, 2000);
        },

        render: function() {
            return (<div className="content without-tab-bar without-footer flex-col">
                <div className="headline">{t('getFreeStorage')}</div>
                <div className="section-highlight">
                    <div className={'flex-row flex-justify-center coupon' + (this.state.animateCopy ? '' : ' show')} >{this.state.inviteCode}</div>
                    <div className={'flex-row flex-justify-center copy p-green-dark-15' + (this.state.animateCopy ? ' show' : '')} >{t('copiedToClipboard')}</div>
                    <Peerio.UI.CopyButton onCopy={this.onCopy} copy={this.state.inviteCode}/>
                </div>
                <p className="flex-grow-1">{t('inviteNote')}</p>

                <div className="buttons">
                    <Peerio.UI.Tappable element="div" className="btn-safe" onTap={this.invokeShare}>
                        <i className="material-icons">share</i> {t('shareThisCode')}
                    </Peerio.UI.Tappable>
                </div>
            </div>);
        }
    });
})();
