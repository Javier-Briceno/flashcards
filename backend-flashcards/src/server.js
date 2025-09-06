require('dotenv').config(); // load env variables from .env file
const express = require('express'); // import the express module
const cors = require('cors'); // import the cors module

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

app.get('/health', (req, res) => { // health check endpoint
    res.json({ 'ok': true, 'time': new Date().toISOString() }); // respond with a JSON object containing the current time
});

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