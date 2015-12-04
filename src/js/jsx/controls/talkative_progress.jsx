(function () {
    'use strict';

    Peerio.UI.TalkativeProgress = React.createClass({
        getInitialState: function () {
            var user = Peerio.user;
            return {
                progressMsg: ''
            };
        },

        progressMessages: [
            'do you like whiskey?',
            'making sun shine brighter...',
            'getting Daenerys closer to Westeros...',
            'calculating the width of a unicorn hair...',
            '42!',
            'are you gonna finish the dessert?',
            'processing ciphertext...',
            'some unparallelizable code...',
            'mathing...',
            'taking a quick break...',
            'are those new shoes?',
            '...',
            'you\'re looking sharp',
            'that\'s a gorgeous haircut',
            'I think you would like Alice...',
            'I think you would like Bob...',
            'turing test passed...',
            'herding cats...',
            'calculating last digit of pi...',
            'poking Schrödinger\'s cat...',
            'turning keys...',
            'correcting battery staples...'
        ],

        updateProgressMessage: function () {
            var ind = Math.floor(Math.random() * this.progressMessages.length);
            this.setState({progressMsg: this.progressMessages[ind]});
        },
        startProgress: function () {
            this.updateProgressMessage();
            if(this.progressInterval) {
                this.stopProgress();
            }
            this.progressInterval = window.setInterval(this.updateProgressMessage, 1800);
        },
        stopProgress: function () {
            window.clearInterval(this.progressInterval);
            this.progressInterval = null;
        },
        componentWillReceiveProps : function(nextProps) {
            if(nextProps.enabled) {
                this.startProgress();
            } else {
                this.stopProgress();
            }
        },
        componentWillUnmount : function() {
            this.stopProgress();
        },
        render: function () {
            return (
                    this.props.enabled ?
                    <div className="text-center">
                        <div>{this.state.progressMsg}</div>
                        {this.props.showSpin ?
                        <div><i className="fa fa-circle-o-notch fa-spin"></i></div>
                        : null}
                    </div> : null
            );
        }
    });

}());
