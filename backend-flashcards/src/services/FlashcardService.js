const { query } = require('../db');

// Create a standardized 400 Bad Request error for missing fields.
function _req(field) {
  const e = new Error(`${field} is required`);
  e.statusCode = 400; e.code = 'BAD_REQUEST';
  return e;
}

// Create a new flashcard in a specific deck after basic validation.
async function createFlashcard(deckId, { front, back, image_url = null }) {
  const id = Number(deckId); // Ensure deckId is a number.
  if (!id) throw _req('deckId'); // Must have a valid deck id.
  if (!front?.trim()) throw _req('front'); // Front text is required.
  if (!back?.trim()) throw _req('back'); // Back text is required.

  // Insert the flashcard and return the created row.
  const { rows } = await query(
    `INSERT INTO flashcard (deck_id, front, back, image_url)
     VALUES ($1, $2, $3, $4)
     RETURNING card_id, deck_id, front, back, image_url, created_at`,
    [id, front.trim(), back.trim(), image_url]
  );
  return rows[0]; // Return the new flashcard.
}

// Update fields of a flashcard (front/back/image_url) if they are provided.
async function updateFlashcard(cardId, { front, back, image_url }) {
  const id = Number(cardId); // Ensure cardId is a number.
  if (!id) throw _req('cardId'); // Must have a valid card id.

  const fields = []; // SQL "SET" parts will be collected here.
  const values = []; // Values for the parameterized query.
  let i = 1; // Placeholder counter for $1, $2, ...

  // Optional updates.
  if (front !== undefined) { fields.push(`front = $${i++}`); values.push(front); } 
  if (back  !== undefined) { fields.push(`back = $${i++}`);  values.push(back); }
  if (image_url !== undefined) { fields.push(`image_url = $${i++}`); values.push(image_url); }

  // Nothing to change.
  if (!fields.length) throw _req('at least one field (front/back/image_url)');

  values.push(id); // Last value is the WHERE id.
  // Perform the update and return the updated row.
  const { rows } = await query(
    `UPDATE flashcard SET ${fields.join(', ')} WHERE card_id = $${i} RETURNING *`,
    values
  );
  if (!rows.length) { const e = new Error('Flashcard not found'); e.statusCode = 404; throw e; } // No match.
  return rows[0]; // Return the updated flashcard.
}

// Delete a flashcard by id and confirm the deletion.
async function deleteFlashcard(cardId) {
  const id = Number(cardId); // Ensure cardId is a number.
  if (!id) throw _req('cardId'); // Must have a valid card id.
  const { rowCount } = await query('DELETE FROM flashcard WHERE card_id = $1', [id]); // Delete it.
  if (!rowCount) { const e = new Error('Flashcard not found'); e.statusCode = 404; throw e; } // No match.
  return { ok: true }; // Deletion succeeded.
}

// Export the service functions for use in routes.
module.exports = { createFlashcard, updateFlashcard, deleteFlashcard };
