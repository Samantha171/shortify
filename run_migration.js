const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:2005@localhost:5432/shortify_db'
});

async function run() {
  try {
    await client.connect();
    await client.query('ALTER TABLE urls ADD COLUMN IF NOT EXISTS qr_generated BOOLEAN DEFAULT FALSE;');
    console.log('Database migrated successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();
