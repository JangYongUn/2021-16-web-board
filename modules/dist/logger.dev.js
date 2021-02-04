"use strict";

var morgan = require('morgan');

var rfs = require('rotating-file-stream');

var path = require('path');

var moment = require('moment');

var streamCommon = rfs.createStream(moment().format('YYYYMMDD') + '.log', {
  interval: "1d",
  path: path.join(__dirname, '../logs')
});
var streamCombined = rfs.createStream(moment().format('YYYYMMDD') + '_c.log', {
  interval: "1d",
  path: path.join(__dirname, '../logs')
});

module.exports = function (method) {
  if (method == 'common') return morgan(method, {
    stream: streamCommon
  });else return morgan(method, {
    stream: streamCombined
  });
};