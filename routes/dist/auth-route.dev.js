"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require("express");

var route = express.Route();
var pugs = {
  css: 'auth',
  js: 'auth',
  title: 'Express Board',
  headerTitle: 'Node/Express를 활용한 인증 구현'
};
router.get('/join', function (req, res, next) {
  var pug = _objectSpread({}, pugs);

  pug.headerTitle += ' - 회원가입';
  res.render('auth/join', _objectSpread({}, pug)); // res.join({ pugs: { ...pugs }, pug: { ...pug} });
});
/*********** API ************/

router.get('/userid', function _callee(req, res, next) {
  var sql, value, r, rs;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          sql = 'SELECT userid FROM auth WHERE userid=?';
          value = [req.query.userid];
          _context.next = 5;
          return regeneratorRuntime.awrap(pool.query(res));

        case 5:
          r = _context.sent;
          req.query.userid;
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          next(err(e.message));

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
});
module.exports = router;