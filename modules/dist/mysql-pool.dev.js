"use strict";

var mysql = require('mysql2/promise');

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); // await sqlGen('board', ['I', 'U', 'D', 'S'], {});

var sqlGen = function sqlGen(table, mode, opt) {
  var _opt$field, field, _opt$data, data, _opt$file, file, _opt$where, where, _opt$order, order, _opt$limit, limit, sql, value, r, rs;

  return regeneratorRuntime.async(function sqlGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _opt$field = opt.field, field = _opt$field === void 0 ? [] : _opt$field, _opt$data = opt.data, data = _opt$data === void 0 ? {} : _opt$data, _opt$file = opt.file, file = _opt$file === void 0 ? null : _opt$file, _opt$where = opt.where, where = _opt$where === void 0 ? null : _opt$where, _opt$order = opt.order, order = _opt$order === void 0 ? [] : _opt$order, _opt$limit = opt.limit, limit = _opt$limit === void 0 ? [] : _opt$limit;
          value = [];
          return _context.abrupt("return", r[0]);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = {
  mysql: mysql,
  pool: pool,
  sqlGen: sqlGen
};