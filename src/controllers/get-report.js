/**
 * Description: Generate and return a payroll report from the database.
 */
const sendResponse = require('../helpers/response');
const dbService = require('../services/db');

const dbConnection = dbService.connection;

function getReport(req, res) {

  sendResponse.success(res, { hello: 'world' });
}

exports.getReport = getReport;

