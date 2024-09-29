/**
 * Description: Route pipeline logic.
 */
const express = require('express');

const { newReport } = require('./controllers/new-report');
const { getReport } = require('./controllers/get-report');
const { getStatus } = require('./controllers/status');
const upload = require('./middleware/upload');
const readCSV = require('./middleware/read-csv');
const validateEmployeeId = require('./middleware/validate-employee-id');
const validateReportId = require('./middleware/validate-report-id');
const validateReport = require('./middleware/validate-report-csv');

const router = express.Router();

router.post(
  '/reports',
  upload.single('file'),
  readCSV,
  validateReport,
  newReport,
);

router.get('/reports', validateEmployeeId, getReport);

router.get('/reports/:reportId', validateEmployeeId, validateReportId, getReport);

// for health checks
router.get('/status', getStatus);

module.exports = router;

