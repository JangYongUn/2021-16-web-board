"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var _require = require('../modules/mysql-pool'),
    pool = _require.pool;

var _require2 = require('../modules/util'),
    err = _require2.err,
    alert = _require2.alert;

var _require3 = require('../modules/auth'),
    isUser = _require3.isUser,
    isGuest = _require3.isGuest;

var bcrypt = require('bcrypt');

var router = express.Router();
var pugs = {
  css: 'auth',
  js: 'auth',
  title: 'Express Board',
  headerTitle: 'Node/Express를 활용한 인증 구현'
};
router.get('/logout', isUser, function (req, res, next) {
  req.session.destroy();
  req.app.locals.user = {};
  res.redirect('/');
});
router.post('/logon', isGuest, function _callee(req, res, next) {
  var msg, sql, value, r, rs, compare, _req$body, userid, userpw;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          msg = '아이디 혹은 패스워드를 확인하세요.';
          _req$body = req.body, userid = _req$body.userid, userpw = _req$body.userpw; // SELECT userpw FROM auth WHERE userid='booldook';

          sql = 'SELECT * FROM auth WHERE userid=?';
          value = [userid];
          _context.next = 6;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 6:
          r = _context.sent;

          if (!(r[0].length == 1)) {
            _context.next = 14;
            break;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(userpw + process.env.BCRYPT_SALT, r[0][0].userpw));

        case 10:
          compare = _context.sent;

          if (compare) {
            // 패스워드도 일치
            rs = r[0][0];
            req.session.user = {
              id: rs.id,
              userid: rs.userid,
              username: rs.username,
              email: rs.email
            };
            res.redirect('/');
          } else {
            // 패스워드가 틀림
            res.send(alert(msg));
          }

          _context.next = 15;
          break;

        case 14:
          // 아이디가 존재하지 않음
          res.send(alert(msg));

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.get('/login', isGuest, function (req, res, next) {
  var pug = _objectSpread({}, pugs);

  pug.headerTitle += ' - 회원 로그인';
  res.render('auth/login', _objectSpread({}, pug));
});
router.post('/save', isGuest, function _callee2(req, res, next) {
  var _req$body2, userid, userpw, username, email, sql, value, r, rs, len, num, eng, spe, regExp;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, userid = _req$body2.userid, userpw = _req$body2.userpw, username = _req$body2.username, email = _req$body2.email;
          len = userpw.length;
          num = userpw.search(/[0-9]/g);
          eng = userpw.search(/[a-z]/ig);
          spe = userpw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
          regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
          sql = 'SELECT userid FROM auth WHERE userid=?';
          value = [userid];
          _context2.next = 11;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 11:
          r = _context2.sent;
          rs = r[0];
          if (rs.length > 0) next(err('아이디 중복 오류'));
          if (len < 8 || len > 20 || num < 0 || eng < 0 || spe < 0) next(err('비밀번호 오류'));
          if (username.length == 0) next(err('이름 오류'));
          if (email.match(regExp) == null) next(err('이메일 오류'));
          _context2.next = 19;
          return regeneratorRuntime.awrap(bcrypt.hash(userpw + process.env.BCRYPT_SALT, Number(process.env.BCRYPT_ROUND)));

        case 19:
          userpw = _context2.sent;
          sql = 'INSERT INTO auth SET userid=?, userpw=?, username=?, email=?';
          value = [userid, userpw, username, email];
          _context2.next = 24;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 24:
          r = _context2.sent;
          rs = r[0];
          if (rs.affectedRows == 1) res.redirect('/');else next(err('회원등록 오류'));
          _context2.next = 32;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](0);
          next(err(_context2.t0.message));

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 29]]);
});
router.get('/join', isGuest, function (req, res, next) {
  var pug = _objectSpread({}, pugs);

  pug.headerTitle += ' - 회원가입';
  res.render('auth/join', _objectSpread({}, pug));
});
/*********** API ***********/

router.get('/userid', isGuest, function _callee3(req, res, next) {
  var sql, value, r, rs;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          sql = 'SELECT userid FROM auth WHERE userid=?';
          value = [req.query.userid];
          _context3.next = 5;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 5:
          r = _context3.sent;
          if (r[0][0]) res.json({
            code: 200,
            result: false
          });else res.json({
            code: 200,
            result: true
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          next(err(_context3.t0.message));

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;