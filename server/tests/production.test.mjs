import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openDatabase } from '../database.mjs';
import { createApp } from '../app.mjs';
import { validateConfig } from '../config.mjs';

test('Production serves SPA deep links, assets and API without exposing files', async t => {
  const directory = mkdtempSync(join(tmpdir(), 'maturyta-static-'));
  const dist = join(directory, 'dist'); mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), '<html>App</html>');
  writeFileSync(join(dist, 'assets', 'app-hash.js'), 'console.log("app")');
  writeFileSync(join(directory, 'secret.txt'), 'private');
  const db = openDatabase(':memory:');
  const app = createApp(db, { staticDirectory: dist });
  app.listen(0, '127.0.0.1'); await once(app, 'listening');
  t.after(async () => { await new Promise(resolve => app.close(resolve)); db.close(); rmSync(directory, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${app.address().port}`;
  for (const path of ['/', '/profile', '/flashcards?predmet=site', '/reset-password', '/kontakty/']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(await response.text(), '<html>App</html>');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  }
  const script = await fetch(base + '/assets/app-hash.js');
  assert.match(script.headers.get('content-type'), /javascript/);
  assert.match(script.headers.get('cache-control'), /immutable/);
  const head = await fetch(base + '/profile', { method: 'HEAD' });
  assert.equal(head.status, 200); assert.equal(await head.text(), '');
  for (const path of ['/secret.txt', '/.env', '/server/auth.mjs', '/assets/missing.js', '/not-a-page']) assert.equal((await fetch(base + path)).status, 404);
  assert.equal((await fetch(base + '/%2e%2e%2fsecret.txt')).status, 400);
  assert.equal((await fetch(base + '/%zz')).status, 400);
  assert.equal((await fetch(base + '/profile', { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/api/health')).status, 200);
  const missingApi = await fetch(base + '/api/missing');
  assert.equal(missingApi.status, 404); assert.match(missingApi.headers.get('content-type'), /json/);
});

test('Production configuration rejects missing or unsafe settings', () => {
  const settings = { NODE_ENV: 'production', APP_ORIGIN: 'https://study.example', RESET_WEBHOOK_URL: 'https://mail.example/reset', RESET_WEBHOOK_SECRET: 'test-secret' };
  assert.equal(validateConfig(settings).origin, settings.APP_ORIGIN);
  assert.equal(validateConfig({}).origin, 'http://localhost:5173');
  assert.throws(() => validateConfig({ ...settings, APP_ORIGIN: '' }));
  assert.throws(() => validateConfig({ ...settings, APP_ORIGIN: 'http://study.example' }));
  assert.throws(() => validateConfig({ ...settings, APP_ORIGIN: 'https://study.example/path' }));
  assert.throws(() => validateConfig({ ...settings, PORT: 'bad' }));
  assert.throws(() => validateConfig({ ...settings, RESET_WEBHOOK_SECRET: '' }));
  assert.throws(() => validateConfig({ ...settings, RESET_WEBHOOK_URL: 'http://mail.example' }));
});
