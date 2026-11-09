import './config.mjs';
import { openDatabase, seedDatabase } from './database.mjs';
import { seedStudyDatabase } from './study-seed.mjs';
const db = openDatabase();
try {
  if (process.argv.includes('--seed')) { seedDatabase(db); seedStudyDatabase(db); }
  console.log('Databázové migrace dokončeny.' + (process.argv.includes('--seed') ? ' Ukázkové otázky připraveny.' : ''));
} finally { db.close(); }
