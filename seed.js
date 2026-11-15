// seed.js - puts some sample data in the database
// run it with: node seed.js
// it only adds data if the tables are empty, so running it twice is safe

const db = require('./db');

// small helper to count rows in a table
function countRows(table) {
  return db.prepare('SELECT COUNT(*) AS total FROM ' + table).get().total;
}

// trekkers
if (countRows('trekkers') === 0) {
  const insertTrekker = db.prepare('INSERT INTO trekkers (name) VALUES (?)');
  const trekkers = ['Asha', 'Ravi', 'Meena', 'Kiran'];
  trekkers.forEach((name) => insertTrekker.run(name));
  console.log('Added ' + trekkers.length + ' trekkers');
} else {
  console.log('Trekkers already have data, skipping');
}

// tents
if (countRows('tents') === 0) {
  const insertTent = db.prepare('INSERT INTO tents (name, size) VALUES (?, ?)');
  const tents = [
    ['Tent 1', '2-person'],
    ['Tent 2', '2-person'],
    ['Tent 3', '2-person'],
    ['Tent 4', '2-person'],
    ['Tent 5', '4-person'],
    ['Tent 6', '4-person'],
    ['Tent 7', '4-person'],
    ['Tent 8', '4-person'],
    ['Tent 9', '6-person'],
    ['Tent 10', '6-person'],
  ];
  tents.forEach((t) => insertTent.run(t[0], t[1]));
  console.log('Added ' + tents.length + ' tents');
} else {
  console.log('Tents already have data, skipping');
}

// rentals
// note: Tent 8 is NOT rented here on purpose, because Tejas's twist tests need Tent 8 to be free
if (countRows('rentals') === 0) {
  const insertRental = db.prepare(
    'INSERT INTO rentals (trekker_id, tent_id, rented_date, returned_date) VALUES (?, ?, ?, ?)'
  );
  // Ravi (id 2) rented Tent 3 (id 3) and already returned it
  insertRental.run(2, 3, '2026-11-01', '2026-11-03');
  // Meena (id 3) rented Tent 5 (id 5) and still has it (returned_date is NULL)
  insertRental.run(3, 5, '2026-11-10', null);
  console.log('Added 2 rentals');
} else {
  console.log('Rentals already have data, skipping');
}

console.log('Seed done!');
