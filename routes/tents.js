// routes/tents.js - CRUD for tents (Sandeep Reddy)
const express = require('express');
const db = require('../db');
const { validateTent, searchTents } = require('../validation');

const router = express.Router();

// GET /tents  (optional: /tents?size=2-person)
router.get('/', (req, res) => {
  // if a size is given, use the search function from validation.js
  if (req.query.size) {
    const tents = searchTents(db, req.query.size);
    return res.status(200).json(tents);
  }
  const tents = db.prepare('SELECT * FROM tents').all();
  res.status(200).json(tents);
});

// GET /tents/:id
router.get('/:id', (req, res) => {
  const tent = db.prepare('SELECT * FROM tents WHERE id = ?').get(req.params.id);
  if (!tent) {
    return res.status(404).json({ message: 'Tent not found' });
  }
  res.status(200).json(tent);
});

// POST /tents
router.post('/', (req, res) => {
  // check the body first
  const error = validateTent(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const name = req.body.name.trim();
  const size = req.body.size.trim();
  const result = db.prepare('INSERT INTO tents (name, size) VALUES (?, ?)').run(name, size);

  res.status(201).json({
    message: 'Tent added',
    tent: { id: result.lastInsertRowid, name: name, size: size }
  });
});

// PUT /tents/:id
router.put('/:id', (req, res) => {
  const error = validateTent(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  // make sure the tent exists
  const tent = db.prepare('SELECT * FROM tents WHERE id = ?').get(req.params.id);
  if (!tent) {
    return res.status(404).json({ message: 'Tent not found' });
  }

  const name = req.body.name.trim();
  const size = req.body.size.trim();
  db.prepare('UPDATE tents SET name = ?, size = ? WHERE id = ?').run(name, size, req.params.id);

  res.status(200).json({
    message: 'Tent updated',
    tent: { id: tent.id, name: name, size: size }
  });
});

// DELETE /tents/:id
router.delete('/:id', (req, res) => {
  const tent = db.prepare('SELECT * FROM tents WHERE id = ?').get(req.params.id);
  if (!tent) {
    return res.status(404).json({ message: 'Tent not found' });
  }

  try {
    db.prepare('DELETE FROM tents WHERE id = ?').run(req.params.id);
    res.status(200).json({ message: 'Tent deleted' });
  } catch (err) {
    // foreign key stops us if this tent has rentals
    res.status(409).json({ message: 'Cannot delete a tent that has rentals' });
  }
});

module.exports = router;
