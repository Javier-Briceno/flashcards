// Pull the `query` helper from our DB module. It runs SQL with parameters and
// returns `{ rows }` from pg.Pool. Using parameterized queries avoids SQL injection.
const { query } = require('../db')

/**
 * List decks with optional filtering.
 * - If `parent` is provided:
 *    • parent === ''  → only root-level decks (parent_deck_id IS NULL)
 *    • parent is a number → only decks whose parent_deck_id = parent
 * - Else if `category` is provided → only decks with that exact category
 * - Else → return all decks
 *
 * Results are ordered by newest first (created_at DESC).
 */
async function listDecks({ category, parent }) {
    // Filter by parent (supports root-level with parent="")
    if (parent !== undefined) {
        // If `parent` is an empty string, caller explicitly asked for root-level decks
        if (parent === '') {
            // IS NULL means "no parent deck"
            const { rows } = await query(
                'SELECT * FROM deck WHERE parent_deck_id IS NULL ORDER BY created_at DESC'
            );
            return rows;
        }

        // Otherwise, we expect a numeric parent id in the query string (?parent=123).
        // Convert to Number and validate.
        const parentId = Number(parent);
        if (Number.isNaN(parentId)) {
            // Create an error with a 400 (Bad Request) so our error middleware can format it.
            const err = new Error('parent must be a number or be empty for root');
            err.statusCode = 400;
            throw err;
        }

        // Parameterized query: $1 is replaced by parentId safely by the driver.
        const { rows } = await query(
            'SELECT * FROM deck WHERE parent_deck_id = $1 ORDER BY created_at DESC',
            [parentId]
        );
        return rows;
    }

    // Filter by category
    if (category) {
        const { rows } = await query(
            'SELECT * FROM deck WHERE category = $1 ORDER BY created_at DESC',
            [category]
        );
        return rows;
    }

    // Default: all decks (no filters)
    const { rows } = await query('SELECT * FROM deck ORDER BY created_at DESC');
    return rows;
}

/**
 * Create a new deck.
 * Expects an object with:
 *  - name (string, required)
 *  - category (string | null, optional)
 *  - parent_deck_id (number | null, optional)
 *
 * Returns the newly created deck record (selected columns).
 */
async function createDeck({ name, category = null, parent_deck_id = null }) {
    // Basic validation: name must exist and not be just whitespace.
    if (!name || !name.trim()) {
        const err = new Error('name is required');
        err.statusCode = 400;
        throw err;
    }

    // Normalize the optional parent to either a real number or null.
    // Accept both undefined and null as "no parent".
    const parent = parent_deck_id === null || parent_deck_id === undefined ? null : Number(parent_deck_id);

    // If a parent is provided, make sure it's a number.
    if (parent !== null && Number.isNaN(parent)) {
        const err = new Error('parent_deck_id must be a number or null');
        err.statusCode = 400;
        throw err;
    }

    // Insert the deck and return selected fields.
    // - `name.trim()` removes accidental spaces the user might send.
    // - `category || null` ensures empty strings become NULL in DB if desired.
    // - RETURNING lets us get the inserted row without a second SELECT.
    const { rows } = await query(
        `INSERT INTO deck (name, category, parent_deck_id)
        VALUES ($1, $2, $3)
        RETURNING deck_id, name, category, parent_deck_id, created_at`,
        [name.trim(), category || null, parent]
    );
    // rows[0] is the newly created deck.
    return rows[0];
}

/**
 * Get one deck (by id) together with:
 *  - its direct child decks (subdecks)
 *  - its flashcards
 */
async function getDeckWithChildrenAndCards(deckId) {
    const id = Number(deckId); // Convert the incoming id to a Number (URLs are strings by default).
    if (!Number.isFinite(id)) { // Basic validation: reject values like "abc" or NaN.
        const err = new Error('id must be a number');
        err.statusCode = 400; 
        err.code = 'BAD_REQUEST';
        throw err;
    }
    // Fetch the deck itself.
    // Note: "$1" is a placeholder; `[id]` is the array of values to plug in.
    // This *parameterized query* helps prevent SQL injection.
    const d = await query('SELECT * FROM deck WHERE deck_id = $1', [id]);
    if (d.rowCount === 0) { // If no deck was found, tell the client (404 Not Found).
        const err = new Error('deck not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
    }

    // Fetch direct child decks (subdecks) of this deck.
    const subdecks = await query('SELECT * FROM deck WHERE parent_deck_id = $1 ORDER BY created_at DESC', [id]);

    // Fetch all flashcards that belong to this deck.
    const flashcards = await query('SELECT * FROM flashcard WHERE deck_id = $1 ORDER BY created_at DESC', [id]);

    // Return a single combined object that the route can send as JSON.
    return {
        deck: d.rows[0], // the one deck row we found above
        subdecks: subdecks.rows,
        flashcards: flashcards.rows,
    };
}

// updates a deck by id
// any of {name, category parent_deck_id} may be provided
async function updateDeck(deckId, { name, category, parent_deck_id }) {
    // convert deckId to a number and validates it
    const id = Number(deckId);
    if (!Number.isFinite(id)) {
        const err = new Error('id must be a number');
        err.statusCode = 400;
        err.code = 'BAD_REQUEST';
        throw err;
    }

    // check the deck exists (useful if no fields are being updated)
    const d = await query('SELECT * FROM deck WHERE deck_id = $1', [id]);
    if (d.rowCount === 0) {
        const err = new Error('deck was not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
    }

    // Prevent setting a deck as its own parent
    if (parent_deck_id !== undefined && parent_deck_id !== null && Number(parent_deck_id) === id) {
        const err = new Error('parent_deck_id cannot be the same as deckId');
        err.statusCode = 400;
        err.code = 'BAD_REQUEST';
        throw err;
    }

    // build a dynamic UPDATE statement with only the fields that were actually provided
    const fields = [];
    const values = [];
    let i = 1;

    // Update "name" only if the caller sent it
    if (name !== undefined) {
        fields.push(`name = $${i++}`);
        values.push(name);
    }
    // Update "category" only if provided.
    if (category !== undefined) {
        fields.push(`category = $${i++}`);
        values.push(category);
    }
    // Update "parent_deck_id" only if provided.
    if (parent_deck_id !== undefined) {
        fields.push(`parent_deck_id = $${i++}`);
        values.push(parent_deck_id);
    }

    // If no fields were provided, just return the current row (no-op update).
    if (!fields.length) {
        return d.rows[0];
    }
    // For the update path, append the WHERE id as the last parameter.
    values.push(id);

    // Perform the UPDATE only for the fields provided, and return the updated row
    const { rows } = await query(
        `UPDATE deck SET ${fields.join(', ')} WHERE deck_id = $${i} RETURNING *`,
        values
    );

    // If UPDATE affected 0 rows, the deck didn't exist (race condition or bad id).
    if (!rows.length) {
        const err = new Error('Deck not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
    }

    // All good: return the updated row.
    return rows[0];
}

async function deleteDeckRecursive(deckId) {
    const id = Number(deckId);
    // ON DELETE CASCADE (schema) will remove subdecks & flashcards automatically
    const result = await query('DELETE FROM deck WHERE deck_id = $1', [id]);
    // result.rowCount === 0 → not found
    if (result.rowCount === 0) {
        const err = new Error('Deck not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
    }
    return { ok: true }
}

// Export the service functions so routes/controllers can use them.
module.exports = {
    listDecks,
    createDeck,
    getDeckWithChildrenAndCards,
    updateDeck,
    deleteDeckRecursive,
};