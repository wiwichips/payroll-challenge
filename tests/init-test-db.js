/**
 * Description: Set up a test database and initialize the express app with it
 * and PORT set to a test port.
 */
const crypto = require('node:crypto');
const path = require('node:path');
const process = require('node:process');

const setupTestDB = async () => {
  const randomString = crypto.randomBytes(8).toString('hex');
  const testDBPath = path.join(__dirname, 'databases', `test-database-${randomString}.db`);

  process.env.DATABASE_PATH = testDBPath;
  process.env.PORT = 3301;

  // execute database init by requirning it
  require('../database/init');

  const app = require('../app');
  return app;
};

module.exports = setupTestDB;

