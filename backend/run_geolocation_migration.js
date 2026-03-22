const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:2005@localhost:5432/shortify_db'
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database');

        await client.query('ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT;');
        await client.query('ALTER TABLE visits ADD COLUMN IF NOT EXISTS city TEXT;');
        
        console.log('Migration completed successfully');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
