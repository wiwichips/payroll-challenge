#!/usr/bin/env node
/**
 * Description: CLI program to initialize sqlite3 database with database models.
 * Refer to the README.md for a description of each of the tables.
 */

const Database = require('better-sqlite3');
const path = require('node:path');
const config = require('../config/config');

const dbPath = path.resolve(config.databasePath);
const db = new Database(dbPath, { verbose: console.log });

function initializeDatabase() {
  db.exec(`
    create table if not exists job_groups (
      name text primary key,
      hourly_rate integer not null
    );
  `);

  db.exec(`
    create table if not exists employees (
      id text primary key
    );
  `);

  db.exec(`
    create table if not exists time_reports (
      id integer primary key,
      upload_date date not null
    );
  `);

  db.exec(`
    create table if not exists work_entries (
      id integer primary key autoincrement,
      date date not null,
      time_duration integer not null,
      job_group text not null,
      report_id integer not null,
      employee_id text not null,
      foreign key (job_group) references job_groups (name),
      foreign key (report_id) references time_reports (id),
      foreign key (employee_id) references employees (id)
    );
  `);

  console.log("Database is now set up!");

  const tables = db.prepare("select name from sqlite_master where type='table';").all();
  tables.forEach(table => {
    console.log(table.name);
  });

  // initialize job groups with A and B
  const insertJobGroup = db.prepare(`
    insert into job_groups (name, hourly_rate)
    values (?, ?)
  `);

  insertJobGroup.run('A', 2000);
  insertJobGroup.run('B', 3000);

  db.close();
}

initializeDatabase();

