const express = require('express');
const FlashcardService = require('../services/FlashcardService');

const router = express.Router();

// PUT /flashcards/:cardId
router.put('/:cardId', async (req, res, next) => {
  try {
    const card = await FlashcardService.updateFlashcard(req.params.cardId, req.body);
    res.json(card);
  } catch (e) { next(e); }
});

// DELETE /flashcards/:cardId
router.delete('/:cardId', async (req, res, next) => {
  try {
    const out = await FlashcardService.deleteFlashcard(req.params.cardId);
    res.json(out);
  } catch (e) { next(e); }
});

module.exports = router;
