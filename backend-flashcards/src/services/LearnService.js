// src/services/LearnService.js
const { query } = require('../db');

function badRequest(msg) {
  const e = new Error(msg);
  e.statusCode = 400;
  e.code = 'BAD_REQUEST';
  return e;
}

/**
 * Get cards for learn mode.
 * Supports:
 *  - shuffle=true → random order (DB-side)
 *  - limit, offset → pagination
 */
async function getDeckCards(deckId, opts = {}) {
  const id = Number(deckId);
  if (!Number.isFinite(id)) throw badRequest('deckId must be a number');

  const shuffle = String(opts.shuffle || '').toLowerCase() === 'true';
  const limit = opts.limit ? Number(opts.limit) : 0;
  const offset = opts.offset ? Number(opts.offset) : 0;

  const params = [id];
  const orderBy = shuffle ? 'RANDOM()' : 'created_at DESC';

  let pagin = '';
  if (limit > 0) {
    params.push(limit);
    pagin += ` LIMIT $${params.length}`;
  }
  if (offset > 0) {
    params.push(offset);
    pagin += ` OFFSET $${params.length}`;
  }

  const { rows } = await query(
    `
    SELECT card_id, deck_id, front, back, image_url, created_at
    FROM flashcard
    WHERE deck_id = $1
    ORDER BY ${orderBy}${pagin}
    `,
    params
  );
  return rows;
}

module.exports = { getDeckCards };
