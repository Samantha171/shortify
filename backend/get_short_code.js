const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:2005@localhost:5432/shortify_db'
});

async function getShortCode() {
    try {
        await client.connect();
        const res = await client.query('SELECT short_code FROM urls LIMIT 1;');
        console.log(res.rows[0].short_code);
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

getShortCode();
