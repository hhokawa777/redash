import template from './embed-image-dialog.html';

const EmbedImageDialog = {
  controller() {
    'ngInject';

    this.imageUrl = this.resolve.visualization.imageUrl;
  },
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&',
  },
  template,
};

export default function init(ngModule) {
  ngModule.component('embedImageDialog', EmbedImageDialog);
}

init.init = true;
