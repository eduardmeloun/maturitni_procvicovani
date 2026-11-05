import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { openDatabase, seedDatabase } from '../database.mjs';
import { createApp, studyDay } from '../app.mjs';
import { createSession } from '../session.mjs';

test('API: autentizace, izolace, transakce, opakování a trvalé uložení', async t => {
  const dir = mkdtempSync(join(tmpdir(), 'maturyta-test-'));
  const path = join(dir, 'test.sqlite');
  let db = openDatabase(path);
  seedDatabase(db); seedDatabase(db);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM cards').get().n, 3);
  const insert = db.prepare('INSERT INTO users (id,username,email,password_hash) VALUES (?,?,?,?)');
  insert.run('a', 'Student A', 'a@example.test', 'test-only-no-login');
  insert.run('b', 'Student B', 'b@example.test', 'test-only-no-login');
  const cookieA = createSession(db, 'a', { secure: false }).split(';')[0];
  const cookieB = createSession(db, 'b', { secure: false }).split(';')[0];
  const expired = createSession(db, 'a', { ttlSeconds: -1 }).split(';')[0];
  const app = createApp(db);
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  const base = `http://127.0.0.1:${app.address().port}`;
  t.after(async () => { await new Promise(resolve => app.close(resolve)); db.close(); rmSync(dir, { recursive: true, force: true }); });
  const get = (path, cookie = '') => fetch(base + path, { headers: { Cookie: cookie } });
  const post = (body, cookie = cookieA, origin = 'http://localhost:5173') => fetch(base + '/api/progress', {
    method: 'POST', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  assert.equal((await get('/api/health')).status, 200);
  assert.equal((await (await get('/api/subjects')).json()).length, 3);
  assert.equal((await (await get('/api/topics?subjectId=site')).json()).length, 1);
  assert.equal((await get('/api/cards')).status, 401);
  assert.equal((await get('/api/me', expired)).status, 401);
  assert.equal((await (await get('/api/me', cookieA)).json()).id, 'a');
  assert.equal((await get('/api/cards?status=bad', cookieA)).status, 400);
  const input = { attemptId: randomUUID(), cardId: 'site-001', status: 'known' };
  assert.equal((await post(input, cookieA, 'https://foreign.test')).status, 403);
  assert.equal((await post({ ...input, status: 'invalid' })).status, 400);
  assert.equal((await post({ ...input, cardId: 'missing' })).status, 404);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM attempts').get().n, 0);
  assert.equal((await (await post(input)).json()).xpAwarded, 10);
  assert.equal((await (await post(input)).json()).duplicate, true);
  assert.equal((await post({ ...input, status: 'review' })).status, 409);
  assert.equal((await post(input, cookieB)).status, 409);
  assert.equal((await (await post({ ...input, attemptId: randomUUID() })).json()).xpAwarded, 0);
  assert.equal((await (await get('/api/progress', cookieA)).json()).length, 1);
  assert.equal((await (await get('/api/progress', cookieB)).json()).length, 0);
  assert.equal((await (await get('/api/cards?status=known', cookieA)).json()).length, 1);
  const activity = await (await get('/api/activity', cookieA)).json();
  assert.equal(activity[0].attempts, 2); assert.equal(activity[0].xp, 10);
  db.close(); db = openDatabase(path);
  assert.equal(db.prepare('SELECT status FROM progress WHERE user_id=?').get('a').status, 'known');
});

test('Studijní den respektuje půlnoc v Praze', () => {
  assert.equal(studyDay(new Date('2026-11-04T23:30:00Z')), '2026-11-05');
  assert.equal(studyDay(new Date('2026-07-04T22:30:00Z')), '2026-07-05');
});
