/**
 * Description: Loads environment variables and sets defaults.
 */
const process = require('node:process');
const path = require('node:path');
require('dotenv').config();

exports.port = process.env.PORT || 3300;
exports.build = process.env.BUILD || 'debug';
exports.maxUploadSize =  Number(process.env.MAX_UPLOAD_SIZE || 2 * 1024 * 1024);
exports.databasePath = path.resolve(process.env.DATABASE_PATH || './database/payroll.db');

