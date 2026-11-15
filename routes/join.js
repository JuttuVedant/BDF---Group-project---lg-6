const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/details', (req, res) => {
  // Join the tables so the response includes names, not just IDs.
  const rentals = db.prepare(`
    SELECT
      rentals.id AS rental_id,
      trekkers.name AS trekker_name,
      tents.name AS tent_name,
      rentals.rented_date,
      rentals.returned_date
    FROM rentals
    JOIN trekkers ON rentals.trekker_id = trekkers.id
    JOIN tents ON rentals.tent_id = tents.id
  `).all();

  res.status(200).json({
    message: 'Rental details retrieved successfully',
    rentals
  });
});

module.exports = router;
