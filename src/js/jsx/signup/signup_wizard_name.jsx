(function () {
    'use strict';

    Peerio.UI.SignupWizardName = React.createClass({
        mixins: [Peerio.Navigation, Peerio.UI.AutoFocusMixin],

        getDefaultProps: function() {
            return {
                autoFocus: true,
                focusNode: 'username',
                focusDelay: 1000
            };
        },

        componentDidMount: function () {
            window.PeerioDebug &&
                this.setState({ username: 't' + Date.now() }, this.validateUsername);
        },

        getInitialState: function () {
            return this.props.data.name
            || {
                usernameValid: null,
                username: '',
                auth_method: null,
                firstNameValid: true,
                firstName: '',
                lastNameValid: true,
                lastName: ''
            };
        },

        validateUsername: function () {
            var username = this.refs.username.getDOMNode().value;
            if(!username.trim().length) return this.setState({username: '', usernameValid: null});
            if(!Peerio.Helpers.isValidUsername(username)) return;
            username = username.toLowerCase();
            this.setState({username: username});
            this.serverValidateUsername = this.serverValidateUsername || _.debounce(() => {
                Peerio.Net.validateUsername(this.state.username)
                    .then( (valid) => {
                        this.setState({usernameValid: this.state.username.length ? valid : null});
                    })
                    .catch( () => {
                        this.setState({usernameValid: false});
                    });
            }, 500);
            this.serverValidateUsername();
        },

        validateFirstName: function () {
            var name = this.refs.firstName.getDOMNode().value;
            this.setState({
                firstNameValid: Peerio.Helpers.isNameValid(name),
                firstName: name
            });
        },

        validateLastName: function () {
            var name = this.refs.lastName.getDOMNode().value;
            this.setState({
                lastNameValid: Peerio.Helpers.isNameValid(name),
                lastName: name
            });
        },

        handleNextStep: function () {
            this.props.handleNextStep({ name: this.state });
        },

        render: function () {
            return (
                <fieldset key={'signup-step-0'} className="animate-enter">
                    <div className="headline">{t('basicInformation')}</div>
                    <Peerio.UI.TrackSubState name="basic"/>

                    <div className="input-group">{
                        (this.state.usernameValid === null || this.state.usernameValid === true)
                        ? <label htmlFor="user_name">{t('signup_desiredUsername')}</label>
                        : <label className="red-bold" htmlFor="user_name">{t('signup_wrongUsername')}</label>}
                        <input type="text" value={this.state.username} name="user_name"
                            id="user_name"
                            ref='username' required="required" autoComplete="off" autoCorrect="off" autoCapitalize="off"
                            spellCheck="false"
                            className="lowercase"
                            onChange={this.validateUsername}/>
                          <span className="caption light">{t('input_required')}</span>
                    </div>
                    <div className="input-group">{
                        (this.state.firstNameValid === null || this.state.firstNameValid === true)
                        ? <label htmlFor="user_first_name">{t('firstName')}</label>
                        : <label htmlFor="user_first_name" className="red-bold">{t('error_invalidName')}</label>
                        }
                        <input type="text" name="user_first_name" id="user_first_name"
                            value={this.state.firstName}
                            ref="firstName"
                            onChange={this.validateFirstName} autoComplete="off" autoCorrect="off" autoCapitalize="off"
                            spellCheck="false"/>
                    </div>
                    <div className="input-group">{
                        (this.state.lastNameValid === null || this.state.lastNameValid === true)
                        ? <label htmlFor="user_last_name">{t('lastName')}</label>
                        : <label htmlFor="user_last_name" className="red-bold">{t('error_invalidName')}</label>
                        }
                        <input type="text" name="user_last_name" id="user_last_name" ref="lastName"
                            value={this.state.lastName}
                            onChange={this.validateLastName} autoComplete="off" autoCorrect="off" autoCapitalize="off"
                            spellCheck="false"/>
                    </div>
                    <div className="input-group">{
                        (this.state.lastNameValid === null || this.state.lastNameValid === true)
                        ? <label htmlFor="email">{t('email')}</label>
                        : <label htmlFor="email" className="red-bold">{t('error_invalidEmail')}</label>
                        }
                        <input type="email" name="user_last_name" id="user_last_name" ref="lastName"
                            value={this.state.email}
                            onChange={this.validateEmail} autoComplete="off" autoCorrect="off" autoCapitalize="off"
                            spellCheck="false"/>
                    </div>

                    <p style={{marginBottom: '20px'}} className="caption light">{t('signup_TOSRequestText', null, {
                        tosLink: link => <Peerio.UI.Tappable element="a"
                                                             style={{textDecoration: 'underline', color: '#fff'}}
                                                             onTap={this.handleTOS}>{link}</Peerio.UI.Tappable>
                    })}</p>


                    <div className="buttons">{
                        this.state.usernameValid === true && this.state.firstNameValid && this.state.lastNameValid
                        ? <Peerio.UI.Tappable
                            element='div'
                            className="btn-safe"
                            onTap={this.handleNextStep}>
                            {t('button_continue')}</Peerio.UI.Tappable>
                        : null }
                    </div>
                </fieldset>
            );
        }
    });

}());
