(function () {
    'use strict';

    Peerio.UI.SetupWizardPin = React.createClass({
        render: function () {
            return (
                <div className="_setupPin">
                    <div className="headline">{t('setup_passcodeTitle')}</div>
                    <p>{t('setup_passcodeDescription', null, {emphasis: segment => <strong>{segment}</strong>})}</p>
                    <Peerio.UI.SetPin hideHeader={true} {...this.props} autoFocus={true} focusDelay={1000}/>
                </div>
            );
        }
    });

}());
