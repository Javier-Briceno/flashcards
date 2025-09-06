require('dotenv').config(); // load env variables from .env
const { Client } = require('pg'); // import pg module

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
        // query to check for the existence of 'deck' and 'flashcard' tables
        const q = ` 
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema='public'
                AND table_name IN ('deck', 'flashcard')
            ORDER BY table_name;
        `;
        const res = await client.query(q); // execute the query and save the result in res
        const found = res.rows.map(r => r.table_name); // extract table names from the result rows
        console.log('Found tables:', found);
        if (!found.includes('deck') || !found.includes('flashcard')) { // check if both tables are found
            console.error('Missing required tables. Did db:init run?');
            process.exit(2);
        } else {
            console.log('Schema looks good ✅');
            process.exit(0);
        }
    } catch (err) {
        console.error('Schema verification failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
})();