require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs'); // Import the file system module
const path = require('path'); // Import the path module
const { Client } = require('pg'); // Import the pg module

(async () => { 
    const sql = fs.readFileSync(path.join(__dirname, '../src/db/schema.sql'), 'utf-8'); // Read the SQL schema file
    const client = new Client({ // Create a new client instance using environment variables
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
    });
    try {
        await client.connect(); // connect to the database
        await client.query(sql); // execute the sql command to create deck and flashcard tables
        console.log('Schema applied successfully');
    } catch (err) {
        console.error('Database initialization error:', err);
        process.exit(1);
    } finally {
        await client.end(); // close the database connection
    }
})();