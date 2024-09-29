/**
 * Description: Set up a test database and initialize the express app with it
 * and PORT set to a test port.
 */
const crypto = require('node:crypto');
const path = require('node:path');
const process = require('node:process');

// returns a promise
function setupTestDB() {
  const randomString = crypto.randomBytes(8).toString('hex');
  const testDBPath = path.join(__dirname, 'databases', `test-database-${randomString}.db`);
  
  process.env.DATABASE_PATH = testDBPath;
  process.env.PORT = 3301;
  
  // Execute database init by requiring it
  require('../database/init');
  
  const app = require('../app');
  
  // Listen on a test port and return the server instance
  return new Promise((resolve) => {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Test server running on port ${process.env.PORT}`);
      resolve(server); // resolve the server instance
    });
  });
}

module.exports = setupTestDB;

