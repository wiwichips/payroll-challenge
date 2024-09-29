/**
 * Description: Used for liveness testing.
 */
const sendResponse = require('../helpers/response');

function getStatus(req, res) {
  sendResponse.success(res, 'Alive');
}

exports.getStatus = getStatus;

