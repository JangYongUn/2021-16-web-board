"use strict";

var express = require('express');

var moment = require('moment');

var path = require('path');

var fs = require('fs-extra');

var ip = require('request-ip');

var _require = require('../modules/multer'),
    upload = _require.upload,
    imgExt = _require.imgExt;

var _require2 = require('../modules/mysql-pool'),
    pool = _require2.pool,
    sql = _require2.sqlGen;

var _require3 = require('../modules/util'),
    err = _require3.err,
    alert = _require3.alert,
    extName = _require3.extName,
    srcPath = _require3.srcPath,
    realPath = _require3.realPath;

var pagers = require('../modules/pager');

var _require4 = require('../modules/auth'),
    isUser = _require4.isUser,
    isGuest = _require4.isGuest;

var router = express.Router();
var pugs = {
  css: 'gallery',
  js: 'gallery',
  title: 'Express Gallery',
  tinyKey: process.env.TINY_KEY,
  headerTitle: 'Node/Express를 활용한 갤러리'
};
router.get('/create', isUser, function (req, res, next) {});
module.exports = router;