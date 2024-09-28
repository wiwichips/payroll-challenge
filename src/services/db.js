/**
 * Description: Set up database connections.
 */
const path = require('node:path');
const Database = require('better-sqlite3');
const config = require('../../config/config');

const dbPath = path.resolve(config.databasePath);
const db = new Database(dbPath, { verbose: console.log }); // TODO use central logger

exports.connection = db;

