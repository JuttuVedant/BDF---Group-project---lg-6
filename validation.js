// validation.js
// checks tent data and searches tents by size
// this file does NOT need express or db.js, it works alone
// (searchTents just gets the db connection passed in)

// checks ONE text field (the name or the size)
// label is just the word that goes in the message, like "name" or "size"
// gives back an error message, or null if the field is fine
function checkText(value, label) {
  // missing (not sent at all, or null)
  if (value === undefined || value === null) {
    return 'Tent ' + label + ' is required';
  }

  // has to be a string (not a number, true/false, array, object...)
  if (typeof value !== 'string') {
    return 'Tent ' + label + ' must be text';
  }

  // empty or only spaces
  if (value.trim() === '') {
    return 'Tent ' + label + ' cannot be empty';
  }

  return null; // all good
}

// validateTent(body)
// body is the data sent by the user, like { name: "Tent 1", size: "2-person" }
// returns an error message (string) if something is wrong, or null if it is valid
function validateTent(body) {
  // if there is no body at all, treat it like an empty one
  // so the user gets "Tent name is required"
  if (!body || typeof body !== 'object') {
    body = {};
  }

  // check name first, then size (we only return the first problem we find)
  const nameError = checkText(body.name, 'name');
  if (nameError) {
    return nameError;
  }

  const sizeError = checkText(body.size, 'size');
  if (sizeError) {
    return sizeError;
  }

  return null; // no errors = valid
}

// searchTents(db, size)
// db is the open database connection (the one db.js exports)
// returns an array of tents whose size matches, capital letters don't matter
// so "2-PERSON" and "2-person" both find the same tents
function searchTents(db, size) {
  // no size given = nothing to look for, so send back an empty list
  if (size === undefined || size === null) {
    return [];
  }

  // turn it into a string and remove extra spaces
  // (a query like ?size=a&size=b comes as an array, String() stops that from crashing)
  const wanted = String(size).trim();

  // LOWER() on both sides is what ignores the capital letters
  // the ? is filled by wanted, so nobody can sneak SQL in
  const sql = 'SELECT * FROM tents WHERE LOWER(TRIM(size)) = LOWER(?) ORDER BY id';
  return db.prepare(sql).all(wanted);
}

module.exports = { validateTent, searchTents };
