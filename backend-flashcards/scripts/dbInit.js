require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module
const { Client } = require('pg'); // Import the pg module

(async () => { 
    const deckSql = fs.readFileSync(path.join(__dirname, '../src/db/deck.sql'), 'utf-8'); // Read the deck SQL schema file
    const flashcardSql = fs.readFileSync(path.join(__dirname, '../src/db/flashcard.sql'), 'utf-8'); // Read the flashcard SQL schema file
    const client = new Client({ // Create a new client instance using environment variables
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: Number(process.env.PGPORT || 5432),
    });
    try {
        await client.connect(); // connect to the database
        await client.query('BEGIN'); // start the transaction
        await client.query(deckSql); // execute the sql command to create deck table
        await client.query(flashcardSql); // execute the sql command to create flashcard table
        await client.query('COMMIT'); // commit the transaction
        console.log('Schema applied successfully');
    } catch (err) {
        // Try to roll back only if a transaction actually started, and never let a rollback failure hide the real cause of the crash.
        if (began) { // only if BEGIN succeeded…
            try {
                await client.query('ROLLBACK'); // rollback the transaction in case of error (undo the partial work)
            } catch (_) {} // ignore rollback errors
        }
        console.error('Database initialization error:', err);
        process.exit(1);
    } finally {
        await client.end(); // close the database connection
    }
})();