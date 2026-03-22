const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

pool.connect()
    .then(async (client) => {
        console.log('Connected to PostgreSQL');
        await client.query("SET timezone = 'Asia/Kolkata'");
        client.release();
    })
    .catch(err => console.error('DB Connection Error:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};