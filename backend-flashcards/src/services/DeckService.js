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

// Export the service functions so routes/controllers can use them.
module.exports = {
    listDecks,
    createDeck,
};