"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var moment = require('moment');

var path = require('path');

var fs = require('fs-extra');

var _require = require('../modules/multer'),
    upload = _require.upload,
    imgExt = _require.imgExt;

var _require2 = require('../modules/mysql-pool'),
    pool = _require2.pool;

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
  css: 'board',
  js: 'board',
  title: 'Express Board',
  headerTitle: 'Node/Express를 활용한 게시판'
};
router.get('/download/:id', function _callee(req, res, next) {
  var sql, r, rs, filePath;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          sql = 'SELECT orifile, savefile FROM board WHERE id=' + req.params.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(pool.query(sql));

        case 4:
          r = _context.sent;
          rs = r[0][0]; // __dirname: d:\임덕규_수업\16.board\routes
          // ../uploads: d:\임덕규_수업\16.board\uploads\20210129_11\

          filePath = path.join(__dirname, '../uploads', rs.savefile.substr(0, 9), rs.savefile);
          res.download(filePath, rs.orifile);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          next(err(_context.t0.message));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get('/view/:id', function _callee2(req, res, next) {
  var sql, r, rs, file;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          sql = 'SELECT * FROM board WHERE id=' + req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(pool.query(sql));

        case 4:
          r = _context2.sent;
          rs = r[0][0];
          rs.created = moment(rs.created).format('YYYY-MM-DD');

          if (rs.savefile) {
            rs.filename = rs.orifile;
            rs.src = imgExt.includes(extName(rs.savefile)) ? srcPath(rs.savefile) : null;
          }

          res.render('board/view', _objectSpread({}, pugs, {
            rs: rs
          }));
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          next(err(_context2.t0.message));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get(['/', '/list'], function _callee3(req, res, next) {
  var sql, value, r, rs, pager;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          sql = 'SELECT count(*) FROM board';
          _context3.next = 4;
          return regeneratorRuntime.awrap(pool.query(sql));

        case 4:
          r = _context3.sent;
          pager = pagers(req.query.page || 1, r[0][0]['count(*)']);
          sql = 'SELECT * FROM board ORDER BY id DESC LIMIT ?, ?';
          value = [pager.startIdx, pager.listCnt];
          _context3.next = 10;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 10:
          r = _context3.sent;
          rs = r[0].map(function (v) {
            v.wdate = moment(v.wdate).format('YYYY-MM-DD');

            if (v.savefile) {
              var ext = path.extname(v.savefile).substr(1).toLowerCase();
              ext = ext == 'jpeg' ? 'jpg' : ext;
              ext = ext.substr(0, 3);
              v.icon = "/img/ext/".concat(ext, ".png");
            } else v.icon = '/img/empty.png';

            return v;
          });
          res.render('board/list', _objectSpread({}, pugs, {
            rs: rs,
            pager: pager
          }));
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          next(err(_context3.t0.message));

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.get('/create', isUser, function (req, res, next) {
  var pug = _objectSpread({}, pugs, {
    tinyKey: process.env.TINY_KEY
  });

  res.render('board/create', pugs);
});
router.post('/save', isUser, upload.single('upfile'), function _callee4(req, res, next) {
  var _req$body, title, content, writer, sql, value, r;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, title = _req$body.title, content = _req$body.content, writer = _req$body.writer;
          sql = 'INSERT INTO board SET title=?, content=?, writer=?, uid=?';
          value = [title, content, writer, req.session.user.id];

          if (!req.banExt) {
            _context4.next = 8;
            break;
          }

          res.send(alert("".concat(req.banExt, " \uD30C\uC77C\uC740 \uC5C5\uB85C\uB4DC \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.")));
          _context4.next = 13;
          break;

        case 8:
          if (req.file) {
            sql += ', orifile=?, savefile=?';
            value.push(req.file.originalname, req.file.filename);
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 11:
          r = _context4.sent;
          res.redirect('/board');

        case 13:
          _context4.next = 18;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](0);
          next(err(_context4.t0.message));

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
router.get('/remove/:id', isUser, function _callee5(req, res, next) {
  var sql, value, rs, r;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          sql = 'SELECT savefile FROM board WHERE id=? AND uid=?';
          value = [req.params.id, req.session.user.id];
          _context5.next = 5;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 5:
          r = _context5.sent;
          rs = r[0][0];

          if (!rs.savefile) {
            _context5.next = 10;
            break;
          }

          _context5.next = 10;
          return regeneratorRuntime.awrap(fs.remove(realPath(rs.savefile)));

        case 10:
          sql = 'DELETE FROM board WHERE id=? AND uid=?';
          _context5.next = 13;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 13:
          r = _context5.sent;
          res.redirect('/board');
          _context5.next = 20;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](0);
          next(err(_context5.t0.message));

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 17]]);
});
router.get('/change/:id', isUser, function _callee6(req, res, next) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          try {} catch (_unused) {
            next(err(e.message));
          }

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
});
router.get('/api/delete/:id'.isUser.as);
module.exports = router;