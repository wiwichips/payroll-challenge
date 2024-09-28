const multer = require('multer');
const config = require('../../config/config');


// Configure Multer to store files in memory with a 2MB size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadSize },
});

module.exports = upload;

