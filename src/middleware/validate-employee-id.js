/**
 * Description: Validate the shape of the employee id and check if it exists.
 * Namespace:   req.locals.employeeId.
 */
const { checkExists } = require('../services/db');
const sendResponse = require('../helpers/response');

function checkEmployeeId(req, res, next) {
  const employeeId = req.query.employeeid;
  req.locals = req.locals || {};

  if (employeeId) {
    const employeeExists = checkExists('employees', employeeId);
    if (!employeeExists) {
      return sendResponse.error(res, `Employee with id ${employeeId} not found`, 404);
    }
    req.locals.employeeId = employeeId;
  }
  next();
}

module.exports = checkEmployeeId;

