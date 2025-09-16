// src/routes/learn.routes.js
const express = require('express');
const LearnService = require('../services/LearnService');

const router = express.Router();

// GET /decks/:deckId/learn?shuffle=true&limit=50&offset=0
router.get('/:deckId/learn', async (req, res, next) => {
  try {
    const { shuffle, limit, offset } = req.query;
    const cards = await LearnService.getDeckCards(req.params.deckId, {
      shuffle,
      limit,
      offset,
    });
    res.json(cards);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
