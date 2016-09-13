(function () {
    'use strict';

    Peerio.UI.FileView = React.createClass({
        mixins: [Peerio.Navigation],
        componentWillMount: function () {
            this.subscription = [
                Peerio.Dispatcher.onFilesUpdated(this.forceUpdate.bind(this, null))
            ];
        },
        componentWillUnmount: function () {
            Peerio.Dispatcher.unsubscribe(this.subscription);
        },
        handleOpen: function () {
            Peerio.FileSystem.openFileWithOS(Peerio.user.files.dict[this.props.params.id])
                .catch(function (err) {
                    L.error('Failed to open file', err);
                });
        },
        handleDownload: function () {
            var file = Peerio.user.files.dict[this.props.params.id];
            if (file.size / 1024 / 1024 > 100) {

                Peerio.Action.showConfirm({
                    headline: t('file_sizeWarningTitle'),
                    text: t('file_sizeWarningTextDownload'),
                    onAccept: ()=>this.doDownload(file)
                });
            } else this.doDownload(file);
        },
        doDownload: function (file) {
            file.download()
                .catch((error) => {
                    Peerio.Action.showAlert({text: t('error_fileDownload')+' ' + error});
                });
        },
        handleRemoveLocal: function () {
            Peerio.Action.showConfirm({
                headline: t('file_removeLocalConfirmTitle'),
                text: t('file_removeLocalConfirmText'),
                onAccept: ()=>Peerio.user.files.dict[this.props.params.id].deleteFromCache()
            });
        },
        handleRemove: function () {
            Peerio.Action.showConfirm({
                headline: t('file_removeConfirmTitle'),
                text: t('file_removeConfirmText'),
                onAccept: ()=>Peerio.user.files.dict[this.props.params.id].remove()
            });
        },
        handleNuke: function () {
            Peerio.Action.showConfirm({
                headline: t('file_nukeConfirmTitle'),
                text: t('file_nukeConfirmText'),
                onAccept: ()=>Peerio.user.files.dict[this.props.params.id].nuke()
            });
        },
        render: function () {
            var H = Peerio.Helpers;
            var file = Peerio.user.files.dict[this.props.params.id];
            if (!file) {
                this.goBack();
                return null;
            }

            if (!file.icon) file.icon = 'list-item-thumb file-type fa fa-' + H.getFileIconByName(file.name) + (file.cached ? ' cached' : '');
            if (!file.humanSize) file.humanSize = H.bytesToSize(file.size);

            var sender = file.sender ? (
              <li>
                <label>{t('file_sharedBy')}</label>
                <div className="info-content">{file.sender}</div>
              </li>) : null;
            var downloadStateNode = null, buttonsNode = null;
            if (file.downloadState) {
                var ds = file.downloadState;
                downloadStateNode = (<div className="info-banner">{t(ds.stateName)} {ds.percent}</div>);
            } else {
                buttonsNode = (
                    <div className="buttons">
                      {file.cached ? <Peerio.UI.Tappable className="btn-safe" element="div" onTap={this.handleOpen}>{t('button_open')}</Peerio.UI.Tappable>
                    : <Peerio.UI.Tappable className="btn-safe" element="div" onTap={this.handleDownload}>
                    <i className="material-icons">cloud_download</i>{t('button_download')}</Peerio.UI.Tappable>}

                        {file.cached ?
                            <Peerio.UI.Tappable className="btn-danger" element="div" onTap={this.handleRemoveLocal}><i
                                className="material-icons">delete</i>{t('file_removeLocalButton')}</Peerio.UI.Tappable> : null }

                        {file.cached ?
                            <Peerio.UI.Tappable className="btn-danger" element="div" onTap={this.handleRemove}>{t('file_removeLocalAndCloudButton')}</Peerio.UI.Tappable>
                            :
                            <Peerio.UI.Tappable className="btn-danger" element="div" onTap={this.handleRemove}>{t('file_removeCloudButton')}</Peerio.UI.Tappable>}

                        {file.creator === Peerio.user.username ?
                            <Peerio.UI.Tappable className="btn-danger" element="div" onTap={this.handleNuke}>{t('file_nukeButton')}</Peerio.UI.Tappable> : null }
                    </div>);
            }

            return (
                <div className="content without-tab-bar without-footer">
                    <ul>
                        <li>
                            <i className={'file-type fa fa-' + file.icon}></i>
                            <div className="headline-md">
                              {file.name}

                            </div>
                        </li>
                    </ul>
                    <ul className="flex-list">
                        <li>
                            <label>{t('fileName')}</label>
                            <div className="info-content">{file.name}</div>
                        </li>
                        <li>
                            <label>{t('fileSize')}</label>
                            <div className="info-content">{file.humanSize}</div>
                        </li>

                        <li>
                            <label>{t('fileType')}</label>
                            <div className="info-content">{Peerio.Helpers.getFileTypeByName(file.name)}</div>
                        </li>

                        <li>
                            <label>{t('location')}</label>
                            <div
                                className="info-content">{file.cached ? t('file_locationLocal') : t('file_locationCloud')}</div>
                        </li>
                        <li>
                            <label>{t('owner')}</label>
                            <div className="info-content">
                                {file.creator === Peerio.user.username ? t('you') : file.creator}
                            </div>
                        </li>
                        <li>
                            <label>{t('file_uploadedAt')}</label>
                            <div className="info-content">{new Date(file.timestamp).toLocaleString()}</div>
                          </li>

                        {sender}

                    </ul>

                    {downloadStateNode || buttonsNode}

                </div>
            );

        }
    });

}());
