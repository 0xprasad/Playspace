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

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationDir, file), 'utf8');
    await pool.query(sql);
    console.log(`Applied migration: ${file}`);
  }

  await pool.end();
}

run().catch(async (error) => {
  console.error('Migration failed', error);
  await pool.end();
  process.exit(1);
});
