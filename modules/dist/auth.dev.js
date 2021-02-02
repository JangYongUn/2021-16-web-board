"use strict";

var _require = require('./util'),
    alert = _require.alert;

var isUser = function isUser(req, res, next) {
  req.sesson;
};

var isGuest = function isGuest(req, res, next) {};

module.exports = {
  isUser: isUser,
  isGuest: isGuest
};