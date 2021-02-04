const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const moment = require('moment');
// const logFile = path.join(__dirname, '../log', moment().format('YYYYMMDD')+'.log');

const stream = rfs.createStream(/* "file.log" */ moment().format('YYYYMMDD')+'.log', {
	interval: "1d",
	path: path.join(__dirname, '../log');
});


module.exports = () => {
	
};