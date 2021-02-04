"use strict";

/************* Import **************/
require('dotenv').config();

var express = require('express');

var app = express();

var path = require('path');

var _require = require('./modules/util'),
    err = _require.err;

var session = require('./modules/session');

var local = require('./modules/local');

var logger = require('./modules/logger');
/************* Server **************/


app.listen(process.env.PORT, function () {
  console.log('=====================');
  console.log('http://localhost:' + process.env.PORT);
  console.log('=====================');
});
/************* View/pug **************/

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
/************* Post/Body **************/

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
/************* SESSION **************/

app.use(session());
app.use(local());
/************* Router **************/

var authRouter = require('./routes/auth-route');

var boardRouter = require('./routes/board-route');

var apiRouter = require('./routes/api-route');

var galleryRouter = require('./routes/gallery-route');

app.use(logger('common'));
app.use('/', express["static"](path.join(__dirname, 'public')));
app.use('/storages', express["static"](path.join(__dirname, 'uploads')));
app.use(logger('combined'));
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/api', apiRouter);
app.use('/gallery', galleryRouter);
/************* Error **************/

app.use(function (req, res, next) {
  next(err(404));
});
app.use(function (err, req, res, next) {
  res.render('error', err);
});