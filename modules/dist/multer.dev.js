"use strict";

var multer = require('multer');

var fs = require('fs-extra');

var _require = require('uuid'),
    v4 = _require.v4;

var moment = require('moment');

var path = require('path');

var imgExt = ['jpg', 'jpeg', 'png', 'gif'];
var allowExt = [].concat(imgExt, ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'hwp', 'md', 'zip']);

var destCb = function destCb(req, res, cb) {
  var folder = path.join(__dirname, '../uploads', moment().format('YYMMDD_HH'));
  fs.ensureDirSync(folder);
  cb(null, folder);
};

var fileCb = function fileCb(req, file, cb) {
  var ext = path.extname(file.originalname); //.jpg

  var name = moment().format('YYMMDD_HH') + '-' + v4() + ext;
  cb(null, name);
};

var storage = multer.diskStorage({
  destination: destCb,
  filename: fileCb
});
var limits = {
  fileSize: 10240000
};

var fileFilter = function fileFilter(req, file, cb) {
  // .Jpg->Jpg->jpg
  var ext = path.extname(file.originalname).substr(1).toLowerCase();

  if (allowExt.includes(ext)) {
    cb(null, true);
  } else {
    req.banExt = ext;
    cb(null, false);
  }
};

var upload = multer({
  storage: storage,
  limits: limits,
  fileFilter: fileFilter
});
module.exports = {
  upload: upload,
  imgExt: imgExt,
  allowExt: allowExt
};