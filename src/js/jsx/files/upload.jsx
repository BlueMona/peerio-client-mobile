(function () {
    'use strict';

    Peerio.UI.Upload = React.createClass({
        statics: {
            show: function(params) {
                return new Promise( (resolve, reject) => {
                    params.onAccept = resolve;
                    params.onReject = reject;
                    Peerio.Action.showFileUpload(params);
                });
            },

            upload: function(fileInfo) {
            }
        },

        handleTakePicture: function (camera) {
            Peerio.NativeAPI.takePicture(camera)
                .then(this.confirmFileSize)
                .then(this.promptForFileName)
                .then( fileInfo => {
                    fileInfo.isGhost = this.props.isGhost;
                    fileInfo.ghostPublicKey = this.props.ghostPublicKey;
                    return Peerio.user.uploadFile(fileInfo)
                        .then(file => {
                            this.props.onComplete && this.props.onComplete(file);
                            return Peerio.Action.showAlert({text: t('file_uploadComplete')});
                        })
                        .then(this.props.resolve)
                        .catch(e => {
                            var message = e;
                            if(e && e.code === 413)
                                message = t('file_uploadStorageExceeded');
                            Peerio.Action.showAlert({text: t('file_uploadFailed') + ' ' + message });
                            this.props.reject(e);
                        });
                })
                // this catch handles user cancel on confirm/prompt
                .catch((e)=> {
                    L.error(e);
                    this.props.reject(e);
                })
                .finally(() => {
                    if (camera) Peerio.NativeAPI.cleanupCamera();
                });
            this.props.onClose();
        },

        promptForFileName: function (fileUrl) {
            var fileExtension = Peerio.Helpers.getFileExtension(fileUrl);
            fileExtension = fileExtension ? fileExtension : 'jpg';
            var fileName = Peerio.Helpers.getFileNameWithoutExtension(fileUrl);
            return Peerio.UI.Prompt.show({
                    text: t('file_namePrompt'),
                    promptValue: fileName,
                    minLength: 1
                })
                .then((fileName) => {
                    return {
                        fileUrl: fileUrl,
                        fileName: fileName + '.' + fileExtension
                    };
                });
        },

        confirmFileSize: function (fileUrl) {
            return Peerio.FileSystem.plugin.getByURL(fileUrl)
                .then(Peerio.FileSystem.plugin.getFileProperties)
                .then(file => {
                    if (file.size / 1024 / 1024 < 100) return fileUrl;
                    return new Promise((resolve, reject) => {
                        Peerio.Action.showConfirm({
                            headline: t('file_sizeWarningTitle'),
                            text: t('file_sizeWarningTextUpload'),
                            onAccept: ()=>resolve(fileUrl),
                            onReject: reject
                        });
                    });
                });

        },

        render: function () {
            return (
                <div className="modal item-select flex-col flex-justify-center">
                    <div className="buttons">
                        <Peerio.UI.Tappable element="div" onTap={this.handleTakePicture} className="btn-primary">
                            <i className="material-icons">photo_library</i> {t('file_pickFromLibrary')}
                        </Peerio.UI.Tappable>
                        <Peerio.UI.Tappable element="div" onTap={this.handleTakePicture.bind(this,true)}
                                            className="btn-primary"> {t('file_takePicture')}
                            <i className="material-icons">photo_camera</i>
                        </Peerio.UI.Tappable>
                        <Peerio.UI.Tappable element="div" onTap={this.props.onClose} className="btn-dark">
                            <i className="material-icons">close</i> {t('button_cancel')}
                        </Peerio.UI.Tappable>
                    </div>
                </div>
            );
        }
    });

}());
