require('dotenv').config(); // load environment variables from .env file
const { Client } = require('pg'); // import the pg module

(async () => {
    const client = new Client({ // Create a new client instance using environment variables
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: Number(process.env.PGPORT || 5432),
    });
    try {
        await client.connect();
        // simple queries to check if the database is reachable
        const ver = await client.query('SELECT version()'); // query to get the postgres version
        const now = await client.query('SELECT NOW() AS now'); // query to get the current time from the database server
        console.log('DB OK.');
        console.log('Version:', ver.rows[0].version); // log the postgres version
        console.log('Time:', now.rows[0].now); // log the current time
        process.exit(0);
    } catch (err) {
        console.error('DB check failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
})();