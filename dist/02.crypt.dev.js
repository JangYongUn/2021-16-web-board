"use strict";

var crypto = require('crypto');

var bcrypt = require('bcrypt');

var pass = '1234';
var sha512 = crypto.createHash('sha512').update(pass).digest('base64');

var genPass = function genPass(pass) {
  var hash;
  return regeneratorRuntime.async(function genPass$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(pass, 9));

        case 2:
          hash = _context.sent;

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};