(function () {
  'use strict';

  Peerio.UI.FileView = React.createClass({
    mixins: [ReactRouter.Navigation],
    componentWillMount: function () {
      this.subscription = [
        Peerio.Dispatcher.onFilesUpdated(this.forceUpdate.bind(this, null))
      ];
    },
    componentWillUnmount: function () {
      Peerio.Dispatcher.unsubscribe(this.subscription);
    },
    handleOpen: function () {
      Peerio.FileSystem.openFileWithOS(Peerio.Files.cache[this.props.params.id])
        .catch(function (err) {
          alert('Failed to open file. ' + err);
        });
    },
    handleDownload: function () {
      Peerio.Files.download(Peerio.Files.cache[this.props.params.id]);
    },
    handleRemoveLocal: function () {
      Peerio.Action.showConfirm({
        headline: 'Remove file from this device?',
        text: 'This file will be deleted from your device and cloud, but will still be available to users who you have shared it with.',
        onAccept: Peerio.Files.deleteFromCache.bind(this, this.props.params.id)
      });
    },
    handleRemove: function () {
      Peerio.Action.showConfirm({
        headline: 'Remove this file?',
        text: 'This file will be deleted from your device and cloud, but will still be available to users who you have shared it with.',
        onAccept: Peerio.Files.delete.bind(this, this.props.params.id)
      });
    },
    handleNuke: function () {
      Peerio.Action.showConfirm({
        headline: 'Destroy file completely?',
        text: 'This file will be deleted from your device, cloud and from the clouds of other users who you have shared it with.',
        onAccept: Peerio.Files.nuke.bind(this, this.props.params.id)
      });
    },
    render: function () {
      var H = Peerio.Helpers;
      var file = Peerio.Files.cache[this.props.params.id];
      if (!file) {
        this.goBack();
        return null;
      }

      if (!file.icon) file.icon = 'list-item-thumb file-type fa fa-' + H.getFileIconByName(file.name) + (file.cached ? ' cached' : '');
      if (!file.humanSize) file.humanSize = H.bytesToSize(file.size);

      var sender = file.sender ? (<div className="info-row">
        <div className="info-label">Sent to you by</div>
        <div className="info-content">{file.sender}</div>
      </div>) : null;
      var downloadStateNode = null, buttonsNode = null;
      if (file.downloadState) {
        var ds = file.downloadState;
        downloadStateNode = (<div className="info-banner">{ds.stateName}&nbsp;{ds.percent}</div>);
      } else {
        buttonsNode = (
          <div>
            {file.cached ? <div className="btn btn-safe" onTouchEnd={this.handleOpen}>Open</div>
              : <div className="btn-md btn-safe" onTouchEnd={this.handleDownload}><i
              className="fa fa-cloud-download">&nbsp;</i>Download</div>}

            {file.cached ?
              <div className="btn btn-danger" onTouchEnd={this.handleRemoveLocal}><i
                className="fa fa-trash-o"></i>&nbsp;Remove from this device</div> : null }

            {file.cached ?
              <div className="btn btn-danger" onTouchEnd={this.handleRemove}>Remove from this device and your
                cloud</div>
              : <div className="btn btn-danger" onTouchEnd={this.handleRemove}>Remove from your cloud</div>}

            {file.creator === Peerio.user.username ?
              <div className="btn btn-danger" onTouchEnd={this.handleNuke}>Unshare and remove from all
                clouds</div> : null }
          </div>);
      }

      // TODO: replace onTouchEnd with globalTapHandler mixin. these buttons need tap event, because scroll is a possibility

      return (
        <div className="content-padded">
          <div className="head">
            <div className="col-1 col-first">
              <i className={'file-type fa fa-' + file.icon}></i>
            </div>
            <div className="col-11">
              <span className="headline-md">
                {file.name}
              </span>
            </div>
          </div>

          <hr className="col-12"/>

          <div className="info-table">
            <div className="info-row">
              <div className="info-label">File Name</div>
              <div className="info-content">{file.name}</div>
            </div>

            <div className="info-row">
              <div className="info-label">File Size</div>
              <div className="info-content">{file.humanSize}</div>
            </div>

            <div className="info-row">
              <div className="info-label">File Type</div>
              <div className="info-content">{Peerio.Helpers.getFileTypeByName(file.name)}</div>
            </div>

            <div className="info-row">
              <div className="info-label">Location</div>
              <div className="info-content">{file.cached ? 'On this device and in the cloud' : 'In the cloud'}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Owner</div>
              <div className="info-content">{file.creator === Peerio.user.username ? 'You' : file.creator}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Uploaded at</div>
              <div className="info-content">{new Date(file.timestamp).toLocaleString()}</div>
            </div>

            {sender}

          </div>

          {downloadStateNode || buttonsNode}

        </div>
      );

    }
  });

}());
