/**
 * Description: Insert report data into the database.
 */
const sendResponse = require('./helpers/response');
const dbService = require('./services/db');

const dbConnection = dbService.connection;

function processUploadedReport(req, res) {
  console.log(req.locals.report.data);
  console.log(req.locals.report.id);

  // insert into time reports id and date
  const insertTimeReport = dbConnection.prepare(`
    insert into time_reports (id, upload_date)
    values (?, ?)
  `);
  insertTimeReport.run(req.locals.report.id, new Date().toISOString().slice(0, 10));

  // insert into the employees table
  const employeeIds = new Set();
  for (const row of req.locals.report.data) {
    employeeIds.add(row['employee id']);
  }
  const insertEmployee = dbConnection.prepare('insert or ignore into employees (id) values (?)');
  const insertEmployeeMany = dbConnection.transaction((dataArray) => {
    for (const id of dataArray)
      insertEmployee.run(id);
  });
  insertEmployeeMany(employeeIds);

  // Insert data into work entries table
  const insertWorkEntry = dbConnection.prepare(`
    insert into work_entries (date, time_duration, job_group, employee_id, report_id)
    values (?, ?, ?, ?, 42)
  `);
  const insertWorkEntriesMany = dbConnection.transaction((dataArray) => {
    for (const entry of dataArray) {
      insertWorkEntry.run(
        entry['date'].toISOString().slice(0,10),
        entry['hours worked'] * 60 * 60,
        entry['job group'],
        entry['employee id'],
        //req.locals.report.id,
      );
    }
  });
  insertWorkEntriesMany(req.locals.report.data);

  sendResponse.success(res, { ijustgot: 'yourcsvfile (:' }, 200);
}

function getReport(req, res) {
  console.log(req);
  sendResponse.error(res, { hello: 'world' });
}

function getStatus(req, res) {
  sendResponse.success(res, 'Alive');
}

exports.processReport = processUploadedReport;
exports.getReport = getReport;
exports.getStatus = getStatus;

