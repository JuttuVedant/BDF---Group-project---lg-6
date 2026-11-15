const express = require("express");
const router = express.Router();

const db = require("../db");

// Get all rentals
router.get("/", (req, res) => {
  try {
    const rentals = db.prepare("SELECT * FROM rentals").all();
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a rental
router.post("/", (req, res) => {
  try {
    const { trekker_id, tent_id } = req.body;

    // Check if both IDs are provided
    if (!trekker_id || !tent_id) {
      return res.status(400).json({
        message: "Both trekker_id and tent_id are required"
      });
    }

    // Check if the trekker exists
    const trekker = db.prepare(
      "SELECT * FROM trekkers WHERE id = ?"
    ).get(trekker_id);

    if (!trekker) {
      return res.status(404).json({ message: "Trekker not found" });
    }

    // Check if the tent exists
    const tent = db.prepare(
      "SELECT * FROM tents WHERE id = ?"
    ).get(tent_id);

    if (!tent) {
      return res.status(404).json({ message: "Tent not found" });
    }

    // Check if this tent is already rented
    const activeRental = db.prepare(
      "SELECT * FROM rentals WHERE tent_id = ? AND (returned_date IS NULL OR returned_date = '')"
    ).get(tent_id);

    if (activeRental) {
      return res.status(409).json({
        message: `Tent ${tent.name} is already rented`
      });
    }

    // Get today's date
    const today = new Date();
    const rentedDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    // Save the new rental
    const result = db.prepare(
      "INSERT INTO rentals (trekker_id, tent_id, rented_date, returned_date) VALUES (?, ?, ?, NULL)"
    ).run(trekker_id, tent_id, rentedDate);

    const rental = db.prepare(
      "SELECT * FROM rentals WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return a rental
router.post("/:id/return", (req, res) => {
  try {
    const { id } = req.params;

    // Find the rental
    const rental = db.prepare(
      "SELECT * FROM rentals WHERE id = ?"
    ).get(id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Check if it was already returned
    if (rental.returned_date !== null && rental.returned_date !== "") {
      return res.status(409).json({ message: "Already returned" });
    }

    // Get today's date
    const today = new Date();
    const returnedDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    // Update the rental
    db.prepare(
      "UPDATE rentals SET returned_date = ? WHERE id = ?"
    ).run(returnedDate, id);

    const updatedRental = db.prepare(
      "SELECT * FROM rentals WHERE id = ?"
    ).get(id);

    res.status(200).json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
