// db.js - opens the database and makes the tables
// everyone else just does: const db = require('./db') (or '../db' inside routes/)

const Database = require('better-sqlite3');
const path = require('path');

// open (or create) the trekgear.db file next to this file
const db = new Database(path.join(__dirname, 'trekgear.db'));

// sqlite ignores foreign keys unless we turn them on
db.pragma('foreign_keys = ON');

// make the 3 tables (only if they are not there already)
db.exec(`
  CREATE TABLE IF NOT EXISTS trekkers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    size TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rentals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trekker_id INTEGER NOT NULL,
    tent_id INTEGER NOT NULL,
    rented_date TEXT NOT NULL,
    returned_date TEXT, -- stays NULL while the rental is active
    FOREIGN KEY (trekker_id) REFERENCES trekkers(id),
    FOREIGN KEY (tent_id) REFERENCES tents(id)
  );
`);

// share the connection with everyone
module.exports = db;
