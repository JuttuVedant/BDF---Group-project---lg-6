const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const trekkers = db.prepare('SELECT id, name FROM trekkers').all();

  res.status(200).json({
    message: 'Trekkers retrieved successfully',
    trekkers
  });
});

router.post('/', (req, res) => {
  const name = req.body && req.body.name;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      message: 'Name is required and must be a non-empty string'
    });
  }

  // Trim the name before saving it.
  const cleanName = name.trim();
  const result = db.prepare(
    'INSERT INTO trekkers (name) VALUES (?)'
  ).run(cleanName);

  res.status(201).json({
    message: 'Trekker created successfully',
    id: result.lastInsertRowid,
    name: cleanName
  });
});

module.exports = router;
