/**
 * Description: Validate the shape of the report id and check if it exists.
 * Namespace:   req.locals.reportId.
 */
const { checkExists } = require('../services/db');
const sendResponse = require('../helpers/response');

function checkReportId(req, res, next) {
  const reportId = req.params.reportId;
  req.locals = req.locals || {};

  if (reportId) {
    const timeReoprtExists = checkExists('time_reports', reportId);
    if (!timeReoprtExists) {
      return sendResponse.error(res, `Time Report with id ${reportId} not found`, 404);
    }
    req.locals.reportId = reportId;
  }
  next();
}

module.exports = checkReportId;

