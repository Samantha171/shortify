const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// FORCE connection test on startup
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('DB Connection Error:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};