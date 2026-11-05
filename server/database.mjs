import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export function transaction(db, work) {
  db.exec('BEGIN IMMEDIATE');
  try { const result = work(); db.exec('COMMIT'); return result; }
  catch (error) { db.exec('ROLLBACK'); throw error; }
}

export function openDatabase(path = process.env.DATABASE_PATH || resolve(root, 'data/app.sqlite')) {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
  db.exec('CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL) STRICT');
  const directory = new URL('./migrations/', import.meta.url);
  for (const name of readdirSync(directory).filter(name => name.endsWith('.sql')).sort()) {
    transaction(db, () => {
      if (db.prepare('SELECT name FROM migrations WHERE name = ?').get(name)) return;
      db.exec(readFileSync(new URL(name, directory), 'utf8'));
      db.prepare('INSERT INTO migrations VALUES (?, ?)').run(name, new Date().toISOString());
    });
  }
  return db;
}

export function seedDatabase(db) {
  transaction(db, () => {
    const subject = db.prepare('INSERT INTO subjects (id,name,position) VALUES (?,?,?) ON CONFLICT DO NOTHING');
    const topic = db.prepare('INSERT INTO topics (id,subject_id,name,position) VALUES (?,?,?,?) ON CONFLICT DO NOTHING');
    const card = db.prepare('INSERT INTO cards (id,topic_id,theme,question,answer) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING');
    for (const [index, [id, name, topicName, question, answer]] of [
      ['programovani', 'Programování', 'Základy algoritmizace', 'Co je algoritmus?', 'Konečná posloupnost jednoznačných kroků vedoucích k řešení úlohy.'],
      ['site', 'Sítě', 'Síťové modely', 'K čemu slouží IP adresa?', 'K logickému adresování síťových rozhraní a směrování paketů mezi sítěmi.'],
      ['weby', 'Tvorba webů', 'Základy webu', 'Jakou úlohu mají HTML, CSS a JavaScript?', 'HTML určuje strukturu, CSS vzhled a JavaScript chování webové stránky.'],
    ].entries()) {
      subject.run(id, name, index);
      topic.run(`${id}-zaklady`, id, topicName, 0);
      card.run(`${id}-001`, `${id}-zaklady`, 'Úvod', question, answer);
    }
  });
}
