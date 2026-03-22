const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:2005@localhost:5432/shortify_db'
});

async function verify() {
    try {
        await client.connect();
        console.log('Connected to database');

        const visits = await client.query('SELECT * FROM visits ORDER BY visited_at DESC LIMIT 5');
        console.log('Recent visits:', JSON.stringify(visits.rows, null, 2));

        const analytics = await client.query('SELECT country, COUNT(*) as clicks FROM visits GROUP BY country');
        console.log('Country stats:', JSON.stringify(analytics.rows, null, 2));

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await client.end();
    }
}

verify();
