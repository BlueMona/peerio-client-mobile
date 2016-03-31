(function () {
  'use strict';

  Peerio.UI.SignupWizardTOS = React.createClass({

      handleNextStep: function () {
          this.props.handleNextStep({ name: this.state });
      },

      handleTOS: function () {
          console.log('TOS!');
          Peerio.NativeAPI.openInBrowser('https://github.com/PeerioTechnologies/peerio-documentation/blob/master/Terms_of_Use.md')
      },

      render: function () {
          return (
              <div style={{marginTop: '160px'}}>
                  <p>By signing up for a Peerio account, you agree to our <Peerio.UI.Tappable element="a" style={{textDecoration: 'underline', color: '#fff'}} onTap={this.handleTOS}>terms of use</Peerio.UI.Tappable>.</p>
                  <div className="buttons">
                       <Peerio.UI.Tappable
                          element='div'
                          className="btn-safe"
                          onTap={this.handleNextStep}>
                          I agree
                        </Peerio.UI.Tappable>
                  </div>
              </div>
          );
      }
  });
}());
