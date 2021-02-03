"use strict";

var crypto = require('crypto');

var bcrypt = require('bcrypt');

var pass = '1111';
var salt = '1234n8sa@4912mka';
var pass2 = '1111';
var sha512 = crypto.createHash('sha512').update(pass + salt).digest('base64');
sha512 = crypto.createHash('sha512').update(sha512).digest('base64');
sha512 = crypto.createHash('sha512').update(sha512).digest('base64');
var sha5122 = crypto.createHash('sha512').update(pass2 + salt).digest('base64');
sha5122 = crypto.createHash('sha512').update(sha5122).digest('base64');
sha5122 = crypto.createHash('sha512').update(sha5122).digest('base64');
console.log(sha512);
console.log(sha5122);
var hash = null;

var genPass = function genPass(pass) {
  return regeneratorRuntime.async(function genPass$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(pass, 7));

        case 2:
          hash = _context.sent;
          console.log(hash);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

var comparePass = function comparePass(pass) {
  var compare;
  return regeneratorRuntime.async(function comparePass$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(pass, hash));

        case 2:
          compare = _context2.sent;
          console.log(compare);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

genPass('1234');
setTimeout(function () {
  comparePass('1234');
}, 1000);