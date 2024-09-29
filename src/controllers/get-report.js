/**
 * Description: Generate and return a payroll report from the database.
 * Assumptions: This is called after the report and/or employee ids have been validated by middleware.
 */
const sendResponse = require('../helpers/response');
const dbService = require('../services/db');

const dbConnection = dbService.connection;

// generates the payroll reports
function getReport(req, res) {
  try {
    const employeeId = req.locals.employeeId;
    const reportId = req.locals.reportId;

    const { query, queryParams } = buildQuery(employeeId, reportId);
    const workEntries = dbConnection.prepare(query).all(...queryParams);

    const payrollReport = {};

    workEntries.forEach((entry) => {
      const { employee_id, date, time_duration, hourly_rate } = entry;
      const payPeriod = getPayPeriod(date);

      // seconds to hours & cents to dollars
      const amountPaid = (time_duration / (60 * 60)) * (hourly_rate / 100);

      if (!payrollReport[employee_id])
        payrollReport[employee_id] = {};

      const payPeriodKey = `${payPeriod.startDate}_${payPeriod.endDate}`;
      if (!payrollReport[employee_id][payPeriodKey]) {
        payrollReport[employee_id][payPeriodKey] = {
          payPeriod,
          amountPaid: 0,
        };
      }

      // add payment for the days work
      payrollReport[employee_id][payPeriodKey].amountPaid += amountPaid;
    });

    const employeeReports = [];
    Object.keys(payrollReport).forEach((employeeId) => {
      Object.values(payrollReport[employeeId]).forEach((report) => {
        employeeReports.push({
          employeeId,
          payPeriod: report.payPeriod,
          amountPaid: `$${report.amountPaid.toFixed(2)}`,
        });
      });
    });

    return sendResponse.success(res, { payrollReport: { employeeReports } }, 200);
  } catch (error) {
    console.log(error); // TODO: log this later using logging
    return sendResponse.error(res, 'Internal server error', 500);
  }
};

// Helper function to calculate the pay period
function getPayPeriod(date) {
  const parsedDate = new Date(date);
  const year = parsedDate.getUTCFullYear();
  const month = parsedDate.getUTCMonth() + 1; // getUTCMonth returns 0-11
  const day = parsedDate.getUTCDate();

  if (day < 16) {
    // First half of the month (1st to 15th)
    return {
      startDate: `${year}-${String(month).padStart(2, '0')}-01`,
      endDate: `${year}-${String(month).padStart(2, '0')}-15`,
    };
  } else {
    // Second half of the month (16th to end)
    const endDate = new Date(year, month, 0).getUTCDate(); // get the last day of the month (0)
    return {
      startDate: `${year}-${String(month).padStart(2, '0')}-16`,
      endDate: `${year}-${String(month).padStart(2, '0')}-${endDate}`,
    };
  }
}

// helper function to build the SQL query
function buildQuery(employeeId, reportId) {
  const conditions = [];
  const queryParams = [];
  let query = `
    SELECT we.id, we.date, we.time_duration, we.job_group, we.report_id, we.employee_id, jg.hourly_rate 
    FROM work_entries we
    JOIN job_groups jg ON we.job_group = jg.name
  `;

  if (employeeId) {
    conditions.push('we.employee_id = ?');
    queryParams.push(employeeId);
  }

  if (reportId) {
    conditions.push('we.report_id = ?');
    queryParams.push(reportId);
  }

  if (conditions.length > 0)
    query += ` WHERE ${conditions.join(' AND ')}`;

  query += ' ORDER BY we.employee_id, we.date';
  return { query, queryParams };
}

exports.getReport = getReport;

