'use strict';

function configure (opts) {
  var o = opts || {};
  if (o.imageUploads) {
    if (typeof o.imageUploads === 'string') {
      configure.imageUploads = {
        method: 'PUT',
        url: o.imageUploads
      };
    } else {
      configure.imageUploads = o.imageUploads;
    }
  }
}

module.exports = configure;