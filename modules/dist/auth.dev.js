"use strict";

var _require = require('./util'),
    alert = _require.alert;

var isUser = function isUser(req, res, next) {
  if (req.session.user) next();else res.send(alert('회원만 사용가능합니다.', '/auth/login'));
};

var isGuest = function isGuest(req, res, next) {
  if (!req.session.user) next();else res.send(alert('로그아웃 상태에서만 사용가능합니다.', '/'));
};

module.exports = {
  isUser: isUser,
  isGuest: isGuest
};