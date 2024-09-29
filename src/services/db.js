/**
 * Description: Set up database connections.
 */
const path = require('node:path');
const Database = require('better-sqlite3');
const config = require('../../config/config');

const dbPath = path.resolve(config.databasePath);
const db = new Database(dbPath, { verbose: console.log }); // TODO use central logger

// check if a an entry exists in the database for a given table and primary key id
function checkExists(tableName, id) {
  const tableInfo = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const primaryKeyColumn = tableInfo.find(col => col.pk === 1);

  // Query the table using the primary key column
  const query = `SELECT COUNT(1) as count FROM ${tableName} WHERE ${primaryKeyColumn.name} = ?`;
  const result = db.prepare(query).get(id);

  return result.count > 0;
}

exports.connection = db;
exports.checkExists = checkExists;

