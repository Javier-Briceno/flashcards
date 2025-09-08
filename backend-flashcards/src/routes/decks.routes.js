// Import dependencies used in this file
const express = require('express'); // the web framework handling HTTP routing.
const validate = require('../middleware/validate'); // custom middleware to validate requests (throws if invalid).
const DeckService = require('../services/DeckService'); // the "business logic" layer that talks to the database.

// Create a new router instance.
// A router groups related endpoints under a common path (mounted later as /decks in server.js).
const router = express.Router();

/**
 * GET /decks
 * Optional query params:
 *   - category: string (filters decks by category)
 *   - parent: number or empty string "" (filters by parent deck; "" means only root-level decks)
 *
 * Flow:
 *  - Read query params from the URL (e.g., /decks?category=Science&parent=)
 *  - Ask the service for the matching decks
 *  - Send them back as JSON
 *  - If something goes wrong, pass the error to Express' error handler with next(e)
 */
router.get('/', async (req, res, next) => {
    try {
        // Destructure two possible filters from the query string
        const { category, parent } = req.query;

        // Delegate the actual fetching/filtering to the service layer
        const decks = await DeckService.listDecks({ category, parent });

        // Respond with JSON (Express sets the correct Content-Type header)
        res.json(decks);
    } catch (err) {
        // Forward any error to the centralized error middleware
        next(err);
    }
});

/**
 * POST /decks
 * Request body (JSON):
 *   { "name": string, "category"?: string, "parent_deck_id"?: number | null }
 *
 * Flow:
 *  - Run a quick validation: "name" must be present
 *  - If validation passes, call the service to create the deck in the DB
 *  - Return the newly created deck as JSON with HTTP 201 Created
 *  - On error, forward to the error handler
 *
 * Notes:
 *  - The "validate" middleware runs BEFORE the async handler.
 *    If it throws, the handler below won't run.
 *  - We rely on body-parsing middleware (app.use(express.json())) in server.js
 *    so req.body already contains the parsed JSON.
 */
router.post(
    '/',
    // validate(...) is our tiny guard that throws a 400 if "name" is missing.
    validate(req => {
        // Optional chaining (?.) avoids errors if body is undefined/null.
        if (!req.body?.name) throw new Error('name is required');
    }),
    // Actual handler that creates the deck
    async (req, res, next) => {
        try {
            // Pass the entire body to the service;
            // the service will normalize/validate types as needed.
            const deck = await DeckService.createDeck(req.body);

            // 201 = Created. Return the new resource.
            res.status(201).json(deck);
        } catch (err) {
            next(err);
        }
    }
);

// Route: GET /decks/:deckId
// Return ONE deck by its id, plus its direct subdecks and its flashcards.
router.get('/:deckId', async (req, res, next) => {
    // Express hands us three things:
    // - req:  the incoming HTTP request (URL, params, body, etc.)
    // - res:  the HTTP response we will send back
    // - next: a function to pass errors to the global error handler

    try {
        const data = await DeckService.getDeckWithChildrenAndCards(req.params.deckId); // req.params contains the dynamic parts of the URL.
        res.json(data); // Send the result back to the client as JSON.
    } catch (err) {
        // If anything throws (e.g., deck not found, bad id, DB error),
        // pass the error to Express' error handler middleware.
        next(err);
    }
});

// PUT /decks/:deckId  (rename, change category/parent)
router.put(
    '/:deckId',
    validate(req => {
        const body = req.body || {};
        if (
            body.name === undefined &&
            body.category === undefined &&
            body.parent_deck_id === undefined
        ) throw new Error('At least one field is required (name, category, parent_deck_id)');
    }),
    async (req, res, next) => {
        try {
            const updated = await DeckService.updateDeck(req.params.deckId, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
);

// DELETE /decks/:deckId  (cascade delete subdecks + flashcards)
router.delete('/:deckId', async (req, res, next) => {
    try {
        const out = await DeckService.deleteDeckRecursive(req.params.deckId);
        res.json(out);
    } catch (err) {
        next(err);
    }
});

// Export the router so server.js can mount it with app.use('/decks', router)
module.exports = router;