import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { openDatabase, seedDatabase } from '../database.mjs';
import { seedStudyDatabase } from '../study-seed.mjs';

test('JSON seedy: import všech otázek, opakování a zachování pokroku', () => {
  const db = openDatabase(':memory:');
  try {
    seedDatabase(db);
    seedStudyDatabase(db);
    const directory = new URL('../seeds/', import.meta.url);
    const questions = readdirSync(directory).filter(name => name.endsWith('-questions.json'))
      .flatMap(name => JSON.parse(readFileSync(new URL(name, directory), 'utf8')));
    assert.ok(questions.length > 0);
    for (const question of questions) {
      const saved = db.prepare('SELECT topic_id AS topicId,theme,question,answer FROM cards WHERE id=?').get(question.id);
      assert.deepEqual({ ...saved }, { topicId: question.topicId, theme: question.theme, question: question.question, answer: question.answer });
    }
    const count = db.prepare('SELECT count(*) AS n FROM cards').get().n;
    const id = questions[0].id;
    db.prepare('INSERT INTO users (id,username,email,password_hash) VALUES (?,?,?,?)').run('seed-test', 'SeedTest', 'seed@example.test', 'test');
    db.prepare('INSERT INTO progress VALUES (?,?,?,?)').run('seed-test', id, 'known', '2026-11-09T12:00:00Z');
    db.prepare('INSERT INTO attempts VALUES (?,?,?,?,?,?,?)').run('seed-attempt', 'seed-test', id, 'known', 10, '2026-11-09', '2026-11-09T12:00:00Z');
    db.prepare('UPDATE cards SET answer=? WHERE id=?').run('Stará odpověď', id);
    seedDatabase(db);
    seedStudyDatabase(db);
    assert.equal(db.prepare('SELECT count(*) AS n FROM cards').get().n, count);
    assert.equal(db.prepare('SELECT answer FROM cards WHERE id=?').get(id).answer, questions[0].answer);
    assert.equal(db.prepare('SELECT status FROM progress WHERE card_id=?').get(id).status, 'known');
    assert.equal(db.prepare('SELECT xp FROM attempts WHERE id=?').get('seed-attempt').xp, 10);
    assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(), []);
  } finally { db.close(); }
});