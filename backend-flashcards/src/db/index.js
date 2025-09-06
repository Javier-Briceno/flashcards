const { Pool } = require('pg') // Import the pg module

const pool = new Pool({ // Create a new pool instance using environment variables
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: Number(process.env.PGPORT || 5432),
    });

module.exports = { // Export the pool and a query function for executing SQL queries
    pool, // Export the pool instance
    query: (text, params) => pool.query(text, params), // Export a query function, which takes SQL text and parameters, and executes the query using the pool
};
