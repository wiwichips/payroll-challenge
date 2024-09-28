const express = require('express');
const controllers = require('./controllers');
const upload = require('./middleware/upload');

const router = express.Router();

router.post('/report', upload.single('file'), controllers.uploadReport);
router.get('/report', controllers.getReport);

module.exports = router;

