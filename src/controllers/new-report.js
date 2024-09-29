/**
 * Description: Insert report data into the database.
 */
const sendResponse = require('../helpers/response');
const dbService = require('../services/db');

const dbConnection = dbService.connection;

function processUploadedReport(req, res) {
  // insert into time reports id and date
  const reportId = req.locals.report.id;
  const insertTimeReport = dbConnection.prepare(`
    insert into time_reports (id, upload_date)
    values (?, ?)
  `);
  insertTimeReport.run(reportId, new Date().toISOString().slice(0, 10));

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
    values (?, ?, ?, ?, ?)
  `);
  const insertWorkEntriesMany = dbConnection.transaction((dataArray) => {
    for (const entry of dataArray) {
      insertWorkEntry.run(
        entry['date'].toISOString().slice(0,10),
        entry['hours worked'] * 60 * 60,
        entry['job group'],
        entry['employee id'],
        req.locals.report.id,
      );
    }
  });
  insertWorkEntriesMany(req.locals.report.data);

  sendResponse.success(res, { id: reportId }, 201);
}

exports.newReport = processUploadedReport;

