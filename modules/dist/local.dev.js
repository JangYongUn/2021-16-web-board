"use strict";

module.exports = function () {
  return function (req, res, next) {
    req.app.locals.user = req.session.user || {};
    next();
  };
};