'use strict';

var raf = require('raf');
var configure = require('./configure');
var promptLink = require('./promptLink');
var promptRender = require('./promptRender');
var fireEvent = require('./fireEvent');
var cache;

function draw (cb) {
  if (!cache) {
    cache = promptRender({
      id: 'pmk-image-prompt',
      title: 'Insert Image',
      description: 'Type or paste the url to your image',
      placeholder: 'http://example.com/public/doge.png "optional title"'
    });
    init(cache, cb);
  }
  if (cache.up) {
    cache.up.warning.classList.remove('pmk-warning-show');
  }
  cache.dialog.classList.add('pmk-prompt-open');
  raf(focus);
  return cache.dialog;
}

function focus () {
  cache.input.focus();
}

function init (dom, cb) {
  promptLink.init(dom, cb);

  if (configure.imageUploads) {
    arrangeImageUpload(dom);
  }
}

function arrangeImageUpload (dom) {
  var up = promptRender.uploads(dom);
  var dragClass = 'pmk-prompt-upload-dragging';

  document.body.addEventListener('dragenter', dragging);
  document.body.addEventListener('dragend', dragstop);

  up.input.addEventListener('change', handleChange, false);
  up.upload.addEventListener('dragover', handleDragOver, false);
  up.upload.addEventListener('drop', handleFileSelect, false);

  function handleChange (e) {
    e.stopPropagation();
    e.preventDefault();
    go(e.target.files);
  }

  function handleDragOver (e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();
    go(e.dataTransfer.files);
  }

  function valid (files) {
    var mime = /^image\//i, i, file;

    up.warning.classList.remove('pmk-warning-show');

    if (!files.length) {
      warn();
      return;
    }
    for (i = 0; i < files.length; i++) {
      file = files[i];

      if (mime.test(file.type)) {
        return file;
      }
    }
    warn();
  }

  function warn (message) {
    up.warning.classList.add('pmk-warning-show');
  }

  function dragging () {
    up.upload.classList.add(dragClass);
  }

  function dragstop () {
    up.upload.classList.remove(dragClass);
  }

  function go (files) {
    var file = valid(files);
    console.log(file);
    up.upload.classList.add('pmk-prompt-uploading');

    setTimeout(function () {
      up.upload.classList.remove('pmk-prompt-uploading');
    }, 8000);
  }
}

module.exports = {
  draw: draw
};
