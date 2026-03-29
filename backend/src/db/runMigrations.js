import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './mysql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
  const migrationDir = path.resolve(__dirname, '../../../db/migrations');
  const files = (await fs.readdir(migrationDir))
    .filter((name) => name.endsWith('.sql'))
    .sort();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const [appliedRows] = await pool.query('SELECT filename FROM schema_migrations');
  const appliedSet = new Set(appliedRows.map((row) => row.filename));

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`Skipping already-applied migration: ${file}`);
      continue;
    }

    const sql = await fs.readFile(path.join(migrationDir, file), 'utf8');
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
    console.log(`Applied migration: ${file}`);
  }

  await pool.end();
}

run().catch(async (error) => {
  console.error('Migration failed', error);
  await pool.end();
  process.exit(1);
});
