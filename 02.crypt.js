const crypto = require('crypto');
const bcrypt = require('bcrypt');

let pass = '1234';
let sha512 = crypto.createHash('sha512').update(pass).digest('base64');


const genPass = async (pass) => {
	var hash = await bcrypt.hash(pass, 9);
}