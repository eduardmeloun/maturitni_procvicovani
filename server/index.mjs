import { validateConfig } from './config.mjs';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './database.mjs';
import { createApp } from './app.mjs';

const { port, origin, production } = validateConfig();
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
if (production && !existsSync(new URL('../dist/index.html', import.meta.url))) throw new Error('Nejdrive spust npm run build.');
const db = openDatabase();
const app = createApp(db, { allowedOrigin: origin, staticDirectory: production ? dist : undefined });
app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`API: http://localhost:${port}`));
function shutdown() { app.close(() => { db.close(); process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
