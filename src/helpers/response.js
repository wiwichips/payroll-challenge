/**
 * Description: Helper functions for sending responses in a uniform way.
 */

function success(res, data, statusCode = 200) {
  res.status(statusCode).json({
    status: 'success',
    data,
  });
};

function error(res, message, statusCode = 500) {
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

function bindRes(res) {
  this.success = (data, code=200) => success(res, data, code);
  this.error = (msg, code=500) => error(res, msg, code);
  return this;
}

exports.success = success;
exports.error = error;
exports.bindRes = bindRes;

