/**
 * Description: Validate the report data and filename.
 * Namespace:   req.locals.report.
 */
const sendResponse = require('../helpers/response');
const dbConnection = require('../services/db').connection;

function parseReportFilename(filename) {
  const match = filename.match(/^time-report-(\d+)\.csv$/);
  if (!match)
    return false;
  const timeReportId = Number(match[1]);
  return timeReportId;
}

function parseDate(dateString) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// modifies rows in place
function formatRows(rows) {
  for (const row of rows) {
    row['date'] = parseDate(row['date']);
    row['hours worked'] = Number(row['hours worked']);
  }
  return rows;
}

function validateReportCSV(req, res, next) {
  const { data, headers } = req.locals.csv;
  const filename = req.file.originalname;

  if (!req.locals)
    req.locals = {};
  req.locals.report = {};

  // headers should be identical and all should be present
  const expectedHeaders = new Set([ 'date', 'hours worked', 'employee id', 'job group' ]);
  for (const header of headers) {
    if (!expectedHeaders.has(header))
      return sendResponse.error(res, `Invalid column header ${header} in report`, 422);
  }

  if (headers.length < expectedHeaders.size)
    return sendResponse.error(res, 'Missing columns in report', 422);

  // filename should match expected format
  const reportId = parseReportFilename(filename);

  if (reportId === false)
    return sendResponse.error(res, `Invalid filename "${filename}"`, 422);

  req.locals.report.id = reportId;

  // validate report id uniqueness
  const stmt = dbConnection.prepare('select * from time_reports where id = ?')
  const row = stmt.get(reportId);
  if (row)
    return sendResponse.error(res, `Time Report with ID ${reportId} already exists`, 409);

  // format row data to js values
  const rowData = formatRows(data);
  req.locals.report.data = rowData;

  next();
}

module.exports = validateReportCSV;

