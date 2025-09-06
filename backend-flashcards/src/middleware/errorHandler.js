// We detect if the app is running in "development" mode.
// In development we can safely show more error detail (like stack traces).
// In production we should avoid leaking internal details to users.
const isDev = process.env.NODE_ENV !== 'production';

/**
 * Express error-handling middleware.
 *
 * Any time `next(error)` is called inside a route/controller,
 * Express jumps to this function and lets you decide
 * how to turn that error into an HTTP response.
 *
 * Signature MUST be (err, req, res, next) so Express recognizes it as an error handler.
 */
module.exports = function errorHandler(err, req, res, next) {
    // Pick an HTTP status code for the response.
    // If the error came with `err.statusCode` or `err.status`, use it.
    // Otherwise default to 500 (Internal Server Error).
    const status = Number(err.status || err.statusCode || 500);

    // Choose a short, machine-friendly error code string.
    // If the error already has a code (e.g., 'BAD_REQUEST'), use it.
    // Otherwise infer one from the status, or fall back to 'INTERNAL_ERROR'.
    const code = err.code || (status === 400 ? 'BAD_REQUEST'
        : status === 404 ? 'NOT_FOUND'
        : 'INTERNAL_SERVER_ERROR');

    // Build a consistent JSON response body.
    // This makes it easy for the frontend to parse errors
    // in a single, predictable format:
    // { "error": { "code": "...", "message": "..." } }
    const payload = {
        error: {
            code, 
            message: err.message || 'An unexpected error occurred', // Use the error's message if provided; otherwise a generic text.
        },
    };

    // Include extra validation details, if present.
    // Some validators attach an array of detailed issues (e.g., which field failed).
    // We only add it if it's an array to keep the shape predictable.
    if (err.details && Array.isArray(err.details)) {
        payload.error.details = err.details;
    }

    // In development, include the stack trace.
    // The stack shows WHERE the error happened in the code.
    // Never expose this in production because it can reveal internals.
    if (isDev) {
        payload.error.stack = err.stack;
    }
  
    // Log the error to the server console.
    // This helps you debug while keeping the client response clean.
    // We log a timestamp, the status, the code, and the message.
    console.error(`[${new Date().toISOString()}] ${status} ${code}:`, err.message);

    // Finally, send the HTTP response with the chosen status and JSON body.
    res.status(status).json(payload);
};