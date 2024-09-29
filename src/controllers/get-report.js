/**
 * Description: Generate and return a payroll report from the database.
 */
const sendResponse = require('../helpers/response');
const dbService = require('../services/db');

const dbConnection = dbService.connection;

function getReport(req, res) {
  const selectstatement = dbConnection.prepare(`
    select *
    from work_entries
    order by employee_id, date
  `);
  const workEntries = selectstatement.all();
  sendResponse.success(res, { payrollReport: workEntries });
}

exports.getReport = getReport;

