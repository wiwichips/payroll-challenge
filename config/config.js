/**
 * Description: Loads environment variables and sets defaults.
 */
const process = require('node:process');
require('dotenv').config();

exports.port = process.env.PORT || 3300;
exports.build = process.env.BUILD || 'debug';

