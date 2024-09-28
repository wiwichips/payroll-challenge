/**
 * Description: Loads environment variables and sets defaults.
 */
require('dotenv').config();

exports.port = process.env.PORT || 3300;
exports.build = process.env.BUILD || 'debug';

