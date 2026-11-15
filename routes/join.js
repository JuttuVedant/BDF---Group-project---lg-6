// routes/join.js - rentals joined with names (Sandeep Reddy)
// mounted at /rentals so the full path is GET /rentals/details
const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /rentals/details
router.get('/details', (req, res) => {
  // join rentals with trekkers and tents to show names instead of ids
  const rows = db.prepare(`
    SELECT rentals.id,
           trekkers.name AS trekker_name,
           tents.name AS tent_name,
           rentals.rented_date,
           rentals.returned_date
    FROM rentals
    JOIN trekkers ON rentals.trekker_id = trekkers.id
    JOIN tents ON rentals.tent_id = tents.id
  `).all();

  res.status(200).json(rows);
});

module.exports = router;
