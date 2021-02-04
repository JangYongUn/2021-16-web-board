"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

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
  css: 'board',
  js: 'board',
  title: 'Express Board',
  tinyKey: process.env.TINY_KEY,
  headerTitle: 'Node/Express를 활용한 게시판'
};
router.get('/download/:id', function _callee(req, res, next) {
  var opt, rs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          opt = {
            field: ['orifile', 'savefile'],
            where: ['id', req.params.id]
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(sql(next, 'board', 'S', opt));

        case 3:
          rs = _context.sent;
          filePath = realPath(rs[0].savefile);
          res.download(filePath, rs[0].orifile);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/view/:id', function _callee2(req, res, next) {
  var opt, rs, rs2;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // 게시물 가져오기
          opt = {
            where: ['id', req.params.id]
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(sql(next, 'board', 'S', opt));

        case 3:
          rs = _context2.sent;
          rs[0].created = moment(rs[0].created).format('YYYY-MM-DD');

          if (rs[0].savefile) {
            rs[0].filename = rs[0].orifile;
            rs[0].src = imgExt.includes(extName(rs[0].savefile)) ? srcPath(rs[0].savefile) : null;
          } // 현재 게시물의 같은아이피 정보 가져오기(1)


          opt = {
            field: ['id'],
            where: {
              op: 'and',
              field: [['bid', rs[0].id], ['ip', ip.getClientIp(req)]]
            }
          };
          _context2.next = 9;
          return regeneratorRuntime.awrap(sql(next, 'board_ip', 'S', opt));

        case 9:
          rs2 = _context2.sent;
          // 현재 아이피 정보 남기기.
          opt = {
            field: ['bid', 'ip'],
            data: {
              bid: req.params.id,
              ip: ip.getClientIp(req)
            }
          };
          _context2.next = 13;
          return regeneratorRuntime.awrap(sql(next, 'board_ip', 'I', opt));

        case 13:
          if (!(rs2.length == 0)) {
            _context2.next = 17;
            break;
          }

          opt = {
            field: ['readnum'],
            data: {
              readnum: Number(rs[0].readnum) + 1
            },
            where: ['id', req.params.id]
          };
          _context2.next = 17;
          return regeneratorRuntime.awrap(sql(next, 'board', 'U', opt));

        case 17:
          // 결과를 뿌려라
          res.render('board/view', _objectSpread({}, pugs, {
            rs: rs[0]
          }));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
});
router.get(['/', '/list'], function _callee3(req, res, next) {
  var opt, rs, rs2, rs3;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          opt = {
            field: ['count(*)']
          };
          _context3.next = 3;
          return regeneratorRuntime.awrap(sql(next, 'board', 'S', opt));

        case 3:
          rs = _context3.sent;
          pager = pagers(req.query.page || 1, rs[0]['count(*)']);
          opt = {
            order: ['id', 'desc'],
            limit: [pager.startIdx, pager.listCnt]
          };
          _context3.next = 8;
          return regeneratorRuntime.awrap(sql(next, 'board', 'S', opt));

        case 8:
          rs2 = _context3.sent;
          rs3 = rs2.map(function (v) {
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
            rs: rs3,
            pager: pager
          }));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.get('/create', isUser, function (req, res, next) {
  res.render('board/create', pugs);
});
router.post('/save', isUser, upload.single('upfile'), function _callee4(req, res, next) {
  var opt, rs;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!req.banExt) {
            _context4.next = 4;
            break;
          }

          res.send(alert("".concat(req.banExt, " \uD30C\uC77C\uC740 \uC5C5\uB85C\uB4DC \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.")));
          _context4.next = 9;
          break;

        case 4:
          opt = {
            file: req.file,
            field: ['title', 'content', 'writer', 'uid'],
            data: _objectSpread({}, req.body, {
              uid: req.session.user.id
            })
          };
          _context4.next = 7;
          return regeneratorRuntime.awrap(sql(next, 'board', 'I', opt));

        case 7:
          rs = _context4.sent;
          res.redirect('/board');

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
});
router.get('/remove/:id', isUser, function _callee5(req, res, next) {
  var opt, rs, _opt, _rs, _sql, _value, _rs2, _r;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          opt = {
            field: ['savefile'],
            where: {
              op: 'AND',
              field: [['id', req.params.id], ['uid', req.session.user.id]]
            }
          };
          _context5.next = 3;
          return regeneratorRuntime.awrap(sql(next, 'board', 'S', opt));

        case 3:
          rs = _context5.sent;

          if (!(r[0].length == 0)) {
            _context5.next = 8;
            break;
          }

          res.send(alert('정상적인 접근이 아닙니다.'));
          _context5.next = 20;
          break;

        case 8:
          if (!_rs[0].savefile) {
            _context5.next = 11;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(fs[0].remove(realPath(_rs[0].savefile)));

        case 11:
          _opt = {
            field: []
          };
          _context5.next = 14;
          return regeneratorRuntime.awrap(sql(next, 'board', 'D', _opt));

        case 14:
          _rs = _context5.sent;
          sql = (_readOnlyError("sql"), 'DELETE FROM board WHERE id=? AND uid=?');
          _context5.next = 18;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 18:
          r = _context5.sent;
          res.redirect('/board');

        case 20:
          _context5.prev = 20;
          _sql = 'SELECT savefile FROM board WHERE id=? AND uid=?';
          _value = [req.params.id, req.session.user.id];
          _context5.next = 25;
          return regeneratorRuntime.awrap(pool.query(_sql, _value));

        case 25:
          _r = _context5.sent;

          if (!(_r[0].length == 0)) {
            _context5.next = 30;
            break;
          }

          res.send(alert('정상적인 접근이 아닙니다.'));
          _context5.next = 39;
          break;

        case 30:
          _rs2 = _r[0][0];

          if (!_rs2.savefile) {
            _context5.next = 34;
            break;
          }

          _context5.next = 34;
          return regeneratorRuntime.awrap(fs.remove(realPath(_rs2.savefile)));

        case 34:
          _sql = 'DELETE FROM board WHERE id=? AND uid=?';
          _context5.next = 37;
          return regeneratorRuntime.awrap(pool.query(_sql, _value));

        case 37:
          _r = _context5.sent;
          res.redirect('/board');

        case 39:
          _context5.next = 44;
          break;

        case 41:
          _context5.prev = 41;
          _context5.t0 = _context5["catch"](20);
          next(err(_context5.t0.message));

        case 44:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[20, 41]]);
});
router.get('/change/:id', isUser, function _callee6(req, res, next) {
  var _sql2, _value2, rs, _r2;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _sql2 = 'SELECT * FROM board WHERE id=? AND uid=?';
          _value2 = [req.params.id, req.session.user.id];
          _context6.next = 5;
          return regeneratorRuntime.awrap(pool.query(_sql2, _value2));

        case 5:
          _r2 = _context6.sent;
          if (_r2[0].length == 0) res.send(alert('정상적인 접근이 아닙니다.'));else {
            rs = _r2[0][0];

            if (rs.savefile) {
              rs.filename = rs.orifile;
              rs.src = imgExt.includes(extName(rs.savefile)) ? srcPath(rs.savefile) : null;
            }

            res.render('board/change', _objectSpread({}, pugs, {
              rs: rs
            }));
          }
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          next(err(_context6.t0.message));

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
router.get('/api/remove/:id', isUser, function _callee7(req, res, next) {
  var _sql3, _value3, _r3, rs, id;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _sql3 = 'SELECT savefile FROM board WHERE id=? AND uid=?';
          _value3 = [req.params.id, req.session.user.id];
          _context7.next = 6;
          return regeneratorRuntime.awrap(pool.query(_sql3, _value3));

        case 6:
          _r3 = _context7.sent;

          if (!(_r3[0].length == 0)) {
            _context7.next = 11;
            break;
          }

          res.json({
            error: '삭제할 파일이 존재하지 않습니다.'
          });
          _context7.next = 19;
          break;

        case 11:
          rs = _r3[0][0];
          _context7.next = 14;
          return regeneratorRuntime.awrap(fs.remove(realPath(rs.savefile)));

        case 14:
          _sql3 = 'UPDATE board SET orifile=NULL, savefile=NULL WHERE id=? AND uid=?';
          _context7.next = 17;
          return regeneratorRuntime.awrap(pool.query(_sql3, _value3));

        case 17:
          _r3 = _context7.sent;
          res.json({
            code: 200
          });

        case 19:
          _context7.next = 24;
          break;

        case 21:
          _context7.prev = 21;
          _context7.t0 = _context7["catch"](0);
          next(err(_context7.t0.message));

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 21]]);
});
router.post('/update', isUser, upload.single('upfile'), function _callee8(req, res, next) {
  var _sql4, _value4, rs, _r4, _req$body, title, content, writer, id;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body = req.body, title = _req$body.title, content = _req$body.content, writer = _req$body.writer, id = _req$body.id;

          if (!req.file) {
            _context8.next = 11;
            break;
          }

          _sql4 = 'SELECT savefile FROM board WHERE id=? AND uid=?';
          _value4 = [id, req.session.user.id];
          _context8.next = 7;
          return regeneratorRuntime.awrap(pool.query(_sql4, _value4));

        case 7:
          _r4 = _context8.sent;

          if (!(_r4[0].length && _r4[0][0].savefile)) {
            _context8.next = 11;
            break;
          }

          _context8.next = 11;
          return regeneratorRuntime.awrap(fs.remove(realPath(_r4[0][0].savefile)));

        case 11:
          _sql4 = 'UPDATE board SET title=?, content=?, writer=? ';
          _value4 = [title, content, writer];

          if (!req.banExt) {
            _context8.next = 17;
            break;
          }

          res.send(alert("".concat(req.banExt, " \uD30C\uC77C\uC740 \uC5C5\uB85C\uB4DC \uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.")));
          _context8.next = 24;
          break;

        case 17:
          if (req.file) {
            _sql4 += ', orifile=?, savefile=?';

            _value4.push(req.file.originalname, req.file.filename);
          }

          _sql4 += ' WHERE id=? AND uid=?';

          _value4.push(id, req.session.user.id);

          _context8.next = 22;
          return regeneratorRuntime.awrap(pool.query(_sql4, _value4));

        case 22:
          _r4 = _context8.sent;
          res.redirect('/board');

        case 24:
          _context8.next = 29;
          break;

        case 26:
          _context8.prev = 26;
          _context8.t0 = _context8["catch"](0);
          next(err(_context8.t0.message));

        case 29:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 26]]);
});
module.exports = router;