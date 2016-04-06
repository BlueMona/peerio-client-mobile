(function () {
    'use strict';

    Peerio.UI.TalkativeProgress = React.createClass({
        getInitialState: function () {
            return {
                progressMsg: ''
            };
        },

        progressMessages: [
            'making sun shine brighter...',
            'getting Daenerys closer to Westeros...',
            'calculating the width of a unicorn hair...',
            '42!',
            'processing ciphertext...',
            'some unparallelizable code...',
            'mathing...',
            'taking a quick break...',
            'are those new shoes?',
            'you\'re looking sharp!',
            'that haircut is algebraic!',
            'I think you would like my friend Alice...',
            'I think you would like my friend Bob...',
            'turing test passed...',
            'herding cats...',
            'calculating last digit of pi...',
            'poking Schrödinger\'s cat...',
            'turning keys...',
            'correcting battery staples...',
            'Yo dawg, I heard you like logging in'
        ],

        fallbackProgressMessages: [
            'Never gonna give you up',
            'Never gonna let you down',
            'Never gonna run around and desert you',
            'Never gonna make you cry',
            'Never gonna say goodbye',
            'Never gonna tell a lie and hurt you'
        ],

        updateProgressMessage: function () {
            var list = Peerio.Translator.locale === 'en' ?  this.progressMessages : this.fallbackProgressMessages;
            var ind = Math.floor(Math.random() * list.length);
            this.setState({progressMsg: list[ind]});
        },
        startProgress: function () {
            this.updateProgressMessage();
            if (this.progressInterval) {
                this.stopProgress();
            }
            this.progressInterval = window.setInterval(this.updateProgressMessage, 1800);
        },
        stopProgress: function () {
            window.clearInterval(this.progressInterval);
            this.progressInterval = null;
        },
        componentWillReceiveProps: function (nextProps) {
            if (nextProps.enabled) {
                this.startProgress();
            } else {
                this.stopProgress();
            }
        },
        componentWillUnmount: function () {
            this.stopProgress();
        },
        render: function () {
            return (
                this.props.enabled ?
                    <div className="text-center">
                        {!this.props.hideText ?
                            <div>{this.state.progressMsg}</div>
                            : null}
                        {this.props.showSpin ?
                            <div><i className="fa fa-circle-o-notch fa-spin"></i></div>
                            : null}
                    </div> : null
            );
        }
    });

}());
