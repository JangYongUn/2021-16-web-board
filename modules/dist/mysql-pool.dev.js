"use strict";

var _require = require('../modules/util'),
    err = _require.err;

var mysql = require('mysql2/promise');

var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
/******* filed, data, file ********/
// data = { name: '홍길동', age: 25, score: 70 }
// sql = INSERT INTO score SET name=?, age=?, score=?
// value = ['홍길동', 25, 70];
// field = ['name', 'age', 'score'] => name=?, age=?, score=?
// data = req.body
// field : ['id', 'title', 'content'] -> id, title, content <- array.toString()

/******* WHERE ********/
// WHERE id=1
// WHERE title LIKE '%booldook%'
// WHERE id=5 AND uid='booldook'
// WHERE id=5 OR uid='booldook'
// WHERE id>5 AND uid='booldook'

/*
- 조건1
- WHERE id=1, WHERE id>5, WHERE id LIKE '%booldook%'
where : ['id', 1];
where : ['id', 5, '>'];
where : ['userid', 'booldook', 'LIKE'];

- 조건2
- WHERE id>5 AND uid LIKE '%booldook%'
where : {
	op: 'AND',
	field: [['id', 5, '>'], ['userid', 'booldook', 'LIKE']]
}
*/

/******* ORDER ********/
// ORDER BY id DESC => ['id', 'DESC']
// ORDER BY uid ASC, id DESC => [['uid', 'ASC'],['id', 'DESC']]

/******* LIMIT ********/
// LIMIT 0, 5 => [0, 5];

/******* router 실행 ********/
// await sqlGen('board', ['I', 'U', 'D', 'S'], {});

var sqlGen = function sqlGen(next, table, mode) {
  var opt,
      _opt$field,
      field,
      _opt$data,
      data,
      file,
      where,
      order,
      limit,
      sql,
      value,
      r,
      tmp,
      _iteratorNormalCompletion,
      _didIteratorError,
      _iteratorError,
      _iterator,
      _step,
      v,
      op,
      _field,
      i,
      _i,
      _args = arguments;

  return regeneratorRuntime.async(function sqlGen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          opt = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
          _context.prev = 1;
          _opt$field = opt.field, field = _opt$field === void 0 ? [] : _opt$field, _opt$data = opt.data, data = _opt$data === void 0 ? {} : _opt$data, file = opt.file, where = opt.where, order = opt.order, limit = opt.limit;
          value = [];
          mode = mode.toUpperCase();

          if (mode == 'I') {
            sql = "INSERT INTO ".concat(table, " SET ");
          }

          if (mode == 'S') {
            sql = "SELECT ".concat(field.length == 0 ? '*' : field.toString(), " FROM ").concat(table, " ");
          }

          if (mode == 'U') {
            sql = "UPDATE ".concat(table, " SET ");
          }

          if (mode == 'D') {
            sql = "DELETE FROM ".concat(table, " ");
          }

          tmp = Object.entries(data).filter(function (v) {
            return field.includes(v[0]);
          });
          if (file) tmp.push(['savefile', file.filename], ['orifile', file.originalname]);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 14;

          for (_iterator = tmp[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            v = _step.value;
            sql += v[0] + '=?,';
            value.push(v[1]);
          }

          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](14);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 22:
          _context.prev = 22;
          _context.prev = 23;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 25:
          _context.prev = 25;

          if (!_didIteratorError) {
            _context.next = 28;
            break;
          }

          throw _iteratorError;

        case 28:
          return _context.finish(25);

        case 29:
          return _context.finish(22);

        case 30:
          sql = sql.substr(0, sql.length - 1);

          if (where && Array.isArray(where)) {
            sql += " WHERE ".concat(where[0], " ").concat(where[2] || '=', " '").concat(where[2] == 'LIKE' ? '%' : '').concat(where[1]).concat(where[2] == 'LIKE' ? '%' : '', "' ");
          }

          if (where && where.op && where.field) {
            op = where.op.trim().toUpperCase();
            _field = where.field;

            for (i in _field) {
              sql += i == 0 ? ' WHERE ' : ' ' + op + ' ';
              sql += " ".concat(_field[i][0], " ").concat(_field[i][2] || '=', " '").concat(_field[i][2] == 'LIKE' ? '%' : '').concat(_field[i][1]).concat(_field[i][2] == 'LIKE' ? '%' : '', "' ");
            }
          }

          if (!((mode == 'U' || mode == 'D') && !sql.includes('WHERE'))) {
            _context.next = 35;
            break;
          }

          throw new Error('수정 및 삭제시에는 WHERE절이 필요합니다.');

        case 35:
          if (order) {
            if (Array.isArray(order[0])) {
              for (_i in order) {
                sql += " ".concat(_i == 0 ? 'ORDER BY' : ',', " ").concat(order[_i][0], " ").concat(order[_i][1], " ");
              }
            } else {
              sql += " ORDER BY ".concat(order[0], " ").concat(order[1], " ");
            }
          }

          if (limit && Array.isArray(limit)) sql += " LIMIT ".concat(limit[0], ", ").concat(limit[1], " ");
          console.log(sql);
          console.log(value);
          _context.next = 41;
          return regeneratorRuntime.awrap(pool.query(sql, value));

        case 41:
          r = _context.sent;
          return _context.abrupt("return", r[0]);

        case 45:
          _context.prev = 45;
          _context.t1 = _context["catch"](1);
          next(err(_context.t1.message || _context.t1));

        case 48:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 45], [14, 18, 22, 30], [23,, 25, 29]]);
};

module.exports = {
  mysql: mysql,
  pool: pool,
  sqlGen: sqlGen
};