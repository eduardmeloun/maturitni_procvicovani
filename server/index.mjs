import { openDatabase } from './database.mjs';
import { createApp } from './app.mjs';

const db = openDatabase();
const port = Number(process.env.PORT || 3001);
const app = createApp(db, { allowedOrigin: process.env.APP_ORIGIN || 'http://localhost:5173' });
app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`API: http://localhost:${port}`));
function shutdown() { app.close(() => { db.close(); process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
