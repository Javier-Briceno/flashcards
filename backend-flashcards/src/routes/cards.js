const express = require('express');
const router = express.Router();

// Sample in-memory "database"
let cards = [
  { id: 1, front: "Hola", back: "Hello" },
  { id: 2, front: "Gracias", back: "Thank you" },
];

// GET all cards
router.get('/', (req, res) => {
  res.json(cards);
});

// POST new card
router.post('/', (req, res) => {
  const newCard = { id: Date.now(), ...req.body };
  cards.push(newCard);
  res.status(201).json(newCard);
});

module.exports = router;