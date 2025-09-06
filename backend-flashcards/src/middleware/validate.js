/*
 * Helper to quickly build a standardized "Bad Request" error (HTTP 400).
 * We attach:
 *  - statusCode: 400 (so the error handler knows the HTTP status)
 *  - code: 'BAD_REQUEST' (a short machine-friendly identifier)
 *  - message: a human-readable explanation of what's wrong
 *  - details: (optional) extra info (e.g., which fields failed)
 */

function badReq(message, details) {
    // Create a normal JS Error with a readable message
    const err = new Error(message || 'Bad Request');
    // Mark it as a 400-level error so our error handler returns HTTP 400
    err.statusCode = 400;
    // Optionally store extra detail (like a list of invalid fields)
    if (details) err.details = details;
    // A short error code string that clients can check programmatically
    err.code = 'BAD_REQUEST';
    return err;
}

/**
 * The main export: a function that creates a validation middleware.
 *
 * checkFn - The validation function.
 *   It will be called like: checkFn(req, badReq)
 *   - `req` is the incoming request (so you can check req.body, req.query, etc.).
 *   - `badReq` is the helper above to throw a consistent 400 error.
 *
 * returns an Express middleware (req, res, next)
 */

module.exports = function validate(checkFn) {
    // Return an actual Express middleware
    return (req, _res, next) => {
        // ^ We prefix res with "_" to indicate we don't use it here.
        try {
            // Run custom validation if provided.
            // The "?.": optional chaining — if checkFn is undefined, it won't be called.
            checkFn?.(req, badReq);

            // If no error was thrown, validation passed — continue to the next handler.
            next();
        } catch (err) {
            // If validation threw an error, make sure it has the right shape.
            // If it doesn't already specify a status, default to 400 (Bad Request).
            if (!err.statusCode) err.statusCode = 400;
            // If it doesn't have a short code, set a sensible default.
            if (!err.code) err.code = 'BAD_REQUEST';
            
            // Pass the error to Express, which will hand it to our central error handler.
            next(err);
        }
    };
};