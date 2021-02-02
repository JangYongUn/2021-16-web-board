"use strict";

var err = function err(code, msg) {
  if (code == 404) {
    return {
      code: code,
      msg: msg || 'File Not Found - 파일을 찾을 수 없습니다.',
      title: 'Error 404'
    };
  } else {
    if (typeof code == 'number') {
      return {
        code: 500,
        msg: msg ? "".concat(msg, " [Error: ").concat(code, "]") : 'Server Internal Error - 서버 내부 오류',
        title: 'Error ' + code
      };
    } else {
      return {
        code: 500,
        msg: code || 'Server Internal Error - 서버 내부 오류',
        title: 'Error 500'
      };
    }
  }
};

var alert = function alert(msg, loc) {
  if (loc) return "<script>alert('".concat(msg, "'); history.go(-1);</script>");
};

var extName = function extName(filename) {
  return path.extname(filename).substr(1).toLowerCase();
};

var srcPath = function srcPath(filename) {
  return "/storages/".concat(filename.substr(0, 9), "/").concat(filename);
};

module.exports = {
  err: err
};