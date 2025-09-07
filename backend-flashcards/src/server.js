require('dotenv').config(); // load env variables from .env file
const express = require('express'); // import the express module (Express helps us create a web server and define API routes.)
const cors = require('cors'); // import the cors module (CORS lets your browser-based frontend (usually on a different port) call this API)

const errorHandler = require('./middleware/errorHandler') // errorHandler: a central place to turn thrown errors into nice JSON responses
const validate = require('./middleware/validate') // validate: a tiny helper to check inputs and fail early with a clean error  

const decksRoutes = require('./routes/decks.routes') // Import the router that contains all "deck" endpoints

const app = express(); // create an express application

// parse JSON request bodies
app.use(express.json());

// enable CORS for requests from the frontend
const allowed = (process.env.CORS_ORIGIN || '') // get allowed origins from env variable
    .split(',') // split by comma
    .map(origin => origin.trim()) // trim whitespace
    .filter(Boolean); // filter out empty strings

app.use(cors({ // enable CORS
    origin: allowed.length ? allowed : true // if no origins are specified, allow all origins
}))

// Mount the decks router under the "/decks" base path.
// Everything defined as "/" inside decks.routes.js becomes "/decks" here.
app.use('/decks', decksRoutes);

app.get('/health', (req, res) => { // health check endpoint
    res.json({ 'ok': true, 'time': new Date().toISOString() }); // respond with a JSON object containing the current time
});

/**
 * Temporary TEST ROUTES (safe to remove later)
 * These are just for learning/testing the middleware behavior.
 * You can safely delete them later.
 * 1) Validation test → should 400 when ?name= is missing
 * 2) Boom test → throws an app error with custom status/code
 */

// This route requires a query parameter ?name=... (e.g., /_test/validation?name=Alice).
// The validate(...) middleware runs BEFORE the handler and can throw a "400 Bad Request" error if something is wrong.
app.get(
    '/_test/validation',
    validate((req, badReq) => {
        // If name is missing, throw a controlled 400 error:
        if (!req.query.name) throw badReq('Query param "name" is required');
    }),
     // If validation passes, we reach this handler:
    (req, res) => {
        res.json({ ok: true, name: req.query.name });
    }
);

// This route purposely throws an error to show how the error handler responds.
// We set a custom HTTP status (418) and custom error code; then pass it to 'next(e)'.
// The error handler (mounted later) turns it into a neat JSON response.
app.get('/_test/boom', (_req, _res, next) => {
        const err = new Error('Deliberate failure for testing'); // human-readable error message
        err.statusCode = 418; // "I'm a teapot" (fun HTTP status for testing)
        err.code = 'I_AM_A_TEAPOT'; // machine-readable error code
        next(err); // hand the error to Express → will be caught by our errorHandler middleware
    }
);

// 404 "Not Found" handler for any route that wasn't matched above.
// This MUST come before the central error handler.
// If the request reaches here, it means no previous route matched the path.
app.use((req, res) => {
    res.status(404).json({
        error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} not found` },
    });
});

// Centralized error handler (must be the LAST middleware).
// Any error thrown in routes/middleware flows down to here.
// It formats the error into a consistent JSON structure.
app.use(errorHandler);

const port = Number(process.env.PORT || 3001); // get the port from env variable or default to 3001
app.listen(port, () => {
    console.log('API listening on port', port); // log the port the server is listening on
    console.log( // log the allowed origins for CORS
        allowed.length // if there are allowed origins
            ? 'CORS enabled for: ' + allowed.join(', ') // list them
            : 'CORS enabled for all origins' // otherwise, indicate that all origins are allowed
    );
});

module.exports = app; // export the app for testing