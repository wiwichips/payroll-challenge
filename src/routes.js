/**
 * Description: Route pipeline logic.
 */
const express = require('express');

const controllers = require('./controllers');
const upload = require('./middleware/upload');
const readCSV = require('./middleware/read-csv');
const validateReport = require('./middleware/validate-report-csv');

const router = express.Router();

router.post(
  '/report',
  upload.single('file'),
  readCSV,
  validateReport,
  controllers.processReport,
);

router.get('/report', controllers.getReport);

// for health checks
router.get('/status', controllers.getStatus);

module.exports = router;

