"use strict";

var express = require('express');

var app = express();
app.listen(3000); // 1번방식

app.use(function (req, res, next) {
  req.user = 'booldook';
  next();
}); // 2번방식

var middleware2 = function middleware2(req, res, next) {
  req.user2 = 'booldook2';
  next();
};

var middleware3 = function middleware3(req, res, next) {
  req.user3 = 'booldook3';
  next();
}; // 3번방식


var middleware4 = function middleware4(value) {
  return function (req, res, next) {
    req.user4 = value;
    next();
  };
};

app.get('/', middleware2, middleware3, middleware4('booldook4'), function (req, res) {
  res.send("<h1>".concat(req.user, "/").concat(req.user2, "/").concat(req.user3, "/").concat(req.user4, "</h1>"));
});