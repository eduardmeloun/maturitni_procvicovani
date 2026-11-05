import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { openDatabase, seedDatabase } from '../database.mjs';
import { createApp } from '../app.mjs';
import { hashToken } from '../session.mjs';
import { randomUUID } from 'node:crypto';
import { seedStudyDatabase } from '../study-seed.mjs';

async function fixture(t, options = {}) {
  const db = openDatabase(':memory:'); seedDatabase(db);
  const messages = [];
  const app = createApp(db, { sendReset: async message => messages.push(message), rateLimit: 100, ...options });
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  t.after(async () => { await new Promise(resolve => app.close(resolve)); db.close(); });
  const base = `http://127.0.0.1:${app.address().port}`;
  const post = (name, body, cookie = '', origin = 'http://localhost:5173') => fetch(`${base}/api/auth/${name}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: cookie }, body: JSON.stringify(body),
  });
  const get = (path, cookie = '') => fetch(base + path, { headers: { Cookie: cookie } });
  return { db, post, get, messages, base };
}
const account = { username: 'student', email: 'student@example.test', password: 'Secret12345', passwordConfirm: 'Secret12345' };
test('Accounts: validation, login, protected data, logout and one-time password recovery', async t => {
  const { db, post, get, messages, base } = await fixture(t);
  assert.equal((await post('register', account, '', 'https://evil.test')).status, 403);
  assert.equal((await post('register', { ...account, passwordConfirm: 'mismatch' })).status, 400);
  assert.equal((await post('register', { ...account, username: 'x' })).status, 400);
  const registration = await post('register', account);
  assert.equal(registration.status, 201);
  const cookie = registration.headers.get('set-cookie').split(';')[0];
  assert.match(registration.headers.get('set-cookie'), /HttpOnly; SameSite=Lax/);
  const user = await registration.json();
  assert.equal(user.username, 'student'); assert.equal(user.password_hash, undefined);
  const stored = db.prepare('SELECT password_hash FROM users').get().password_hash;
  assert.match(stored, /^scrypt:/); assert.ok(!stored.includes(account.password));
  assert.equal((await post('register', { ...account, email: 'STUDENT@example.test' })).status, 409);
  assert.equal((await get('/api/me')).status, 401);
  assert.equal((await get('/api/me', cookie)).status, 200);
  const attempt = await fetch(`${base}/api/progress`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173', Cookie: cookie },
    body: JSON.stringify({ attemptId: randomUUID(), cardId: 'site-001', status: 'known' }),
  });
  assert.equal(attempt.status, 200);
  assert.equal((await (await get('/api/progress', cookie)).json())[0].status, 'known');
  assert.equal((await (await get('/api/leaderboard')).json())[0].xpAllTime, 10);
  assert.equal((await post('login', { login: account.email, password: 'incorrect' })).status, 401);
  assert.equal((await post('login', { login: 'missing', password: account.password })).status, 401);
  const login = await post('login', { login: 'STUDENT', password: account.password });
  assert.equal(login.status, 200);
  const second = login.headers.get('set-cookie').split(';')[0];
  assert.equal((await post('logout', {}, cookie)).status, 200);
  assert.equal((await get('/api/me', cookie)).status, 401);
  const known = await (await post('forgot-password', { email: account.email })).json();
  const unknown = await (await post('forgot-password', { email: 'missing@example.test' })).json();
  assert.deepEqual(known, unknown); assert.equal(messages.length, 1);
  let token = new URLSearchParams(new URL(messages[0].url).hash.slice(1)).get('token');
  assert.ok(db.prepare('SELECT 1 FROM password_resets WHERE token_hash=?').get(hashToken(token)));
  assert.equal(db.prepare('SELECT 1 FROM password_resets WHERE token_hash=?').get(token), undefined);
  db.prepare('UPDATE password_resets SET expires_at=?').run('2000-01-01T00:00:00.000Z');
  const reset = { token, password: 'Changed12345', passwordConfirm: 'Changed12345' };
  assert.equal((await post('reset-password', reset)).status, 400);
  await post('forgot-password', { email: account.email });
  token = new URLSearchParams(new URL(messages[1].url).hash.slice(1)).get('token');
  assert.equal((await post('reset-password', { ...reset, token })).status, 200);
  assert.equal((await get('/api/me', second)).status, 401);
  assert.equal((await post('reset-password', { ...reset, token })).status, 400);
  assert.equal((await post('login', { login: account.email, password: account.password })).status, 401);
  assert.equal((await post('login', { login: account.email, password: reset.password })).status, 200);
  assert.equal((await get('/api/leaderboard')).status, 200);
});
test('Study seed preserves original questions and can be repeated', () => {
  const db = openDatabase(':memory:');
  try {
    seedDatabase(db); seedStudyDatabase(db);
    const count = db.prepare('SELECT COUNT(*) AS n FROM cards').get().n;
    assert.ok(count > 100);
    seedStudyDatabase(db);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM cards').get().n, count);
    assert.ok(db.prepare('SELECT id FROM cards WHERE id=?').get('site-1-1'));
  } finally { db.close(); }
});
test('Accounts: rate limiting and malformed requests', async t => {
  const { post } = await fixture(t, { rateLimit: 2 });
  assert.equal((await post('login', {})).status, 400);
  assert.equal((await post('forgot-password', { email: 123 })).status, 400);
  assert.equal((await post('login', {})).status, 429);
  assert.equal((await post('logout', {})).status, 200);
});
