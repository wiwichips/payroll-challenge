/**
 * Deals with uploaded files to endpoints.
 * Namespace: req.file.
 */
const multer = require('multer');
const config = require('../../config/config');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadSize },
});

module.exports = upload;

