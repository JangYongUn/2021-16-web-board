const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	waitForConnections: true,
  connectionLimit: 10,
	queueLimit: 0,
});



// await sqlGen('board', ['I', 'U', 'D', 'S'], {});
const sqlGen = async (table, mode, opt) => {
	let { field = [], data = {}, file=null, where=null, order=[], limit=[]} = opt;
	let sql, value=[], r, rs;
	return r[0];
}



module.exports = { mysql, pool, sqlGen };