const express = require('express');
const db = require('../db');
const { validateTent, searchTents } = require('../validation');

const router = express.Router();

router.get('/', (req, res) => {
  // Use the helper when a size filter is given.
  if (Object.prototype.hasOwnProperty.call(req.query, 'size')) {
    const tents = searchTents(db, req.query.size);
    return res.status(200).json({
      message: 'Tents retrieved successfully',
      tents
    });
  }

  const tents = db.prepare('SELECT id, name, size FROM tents').all();

  res.status(200).json({
    message: 'Tents retrieved successfully',
    tents
  });
});

router.get('/:id', (req, res) => {
  const tent = db.prepare(
    'SELECT id, name, size FROM tents WHERE id = ?'
  ).get(req.params.id);

  if (!tent) {
    return res.status(404).json({ message: 'Tent not found' });
  }

  res.status(200).json({
    message: 'Tent retrieved successfully',
    tent
  });
});

router.post('/', (req, res) => {
  const validationMessage = validateTent(req.body);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const result = db.prepare(
    'INSERT INTO tents (name, size) VALUES (?, ?)'
  ).run(req.body.name, req.body.size);

  res.status(201).json({
    message: 'Tent created successfully',
    id: result.lastInsertRowid
  });
});

router.put('/:id', (req, res) => {
  const validationMessage = validateTent(req.body);

  if (validationMessage) {
    return res.status(400).json({ message: validationMessage });
  }

  const result = db.prepare(
    'UPDATE tents SET name = ?, size = ? WHERE id = ?'
  ).run(req.body.name, req.body.size, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Tent not found' });
  }

  res.status(200).json({ message: 'Tent updated successfully' });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM tents WHERE id = ?'
  ).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Tent not found' });
  }

  res.status(200).json({ message: 'Tent deleted successfully' });
});

module.exports = router;
