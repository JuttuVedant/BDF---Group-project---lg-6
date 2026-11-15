// routes/trekkers.js - get all and add trekkers (Sandeep Reddy)
const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /trekkers
router.get('/', (req, res) => {
  const trekkers = db.prepare('SELECT * FROM trekkers').all();
  res.status(200).json(trekkers);
});

// POST /trekkers
router.post('/', (req, res) => {
  const name = req.body.name;

  // name is required and must be text that is not empty
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Trekker name is required' });
  }

  const result = db.prepare('INSERT INTO trekkers (name) VALUES (?)').run(name.trim());

  res.status(201).json({
    message: 'Trekker added',
    trekker: { id: result.lastInsertRowid, name: name.trim() }
  });
});

module.exports = router;
