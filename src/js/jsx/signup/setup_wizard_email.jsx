(function () {
    'use strict';

    Peerio.UI.SetupWizardEmail = React.createClass({
        render: function () {
            return (
                <div>
                    <div className="headline">{t('setup_contactInfoTitle')}</div>
                    <p>{t('setup_contactInfoDescription')}</p>
                    <div className="input-group">
                        <label htmlFor="address">{t('setup_emailOrPhone')}</label>
                        <Peerio.UI.AddAddress {...this.props} autoFocus={true} focusDelay={1000}/>
                    </div>
                </div>
            );
        }
    });

}());
