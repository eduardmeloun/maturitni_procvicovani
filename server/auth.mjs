import { randomUUID, randomBytes, scrypt as derive, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { createSession, revokeSession, getSessionUser, hashToken } from './session.mjs';
import { transaction } from './database.mjs';
const scrypt = promisify(derive);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${key.toString('hex')}`;
}
async function verify(password, stored) {
  const [, salt, hash] = stored.split(':');
  const key = await scrypt(password, salt || 'dummy-salt', 64);
  return !!hash && hash.length === 128 && timingSafeEqual(key, Buffer.from(hash, 'hex'));
}
export function createAuth(db, { allowedOrigin, sendReset, rateLimit, send, readJson, HttpError }) {
  const limits = new Map();
  const secure = process.env.NODE_ENV === 'production';
  const fail = (code, message) => { throw new HttpError(code, message); };
  const checkPassword = value => {
    if (typeof value !== 'string' || value.length < 8 || value.length > 128) fail(400, 'Heslo musí mít 8 až 128 znaků.');
  };
  const deliver = sendReset || (async ({ email, url }) => {
    if (!secure) { console.info(`[Obnova hesla pro ${email}] ${url}`); return; }
    if (!process.env.RESET_WEBHOOK_URL) fail(503, 'Obnova hesla nyní není dostupná.');
    const response = await fetch(process.env.RESET_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESET_WEBHOOK_SECRET || ''}` },
      body: JSON.stringify({ email, url }), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) fail(503, 'Obnova hesla nyní není dostupná.');
  });
  return async (req, res, path) => {
    if (req.method !== 'POST') fail(405, 'Metoda není povolena.');
    if (req.headers.origin !== allowedOrigin) fail(403, 'Nepovolený původ požadavku.');
    if (!['register', 'login', 'logout', 'forgot-password', 'reset-password'].some(name => path === `/api/auth/${name}`)) fail(404, 'API endpoint neexistuje.');
    const now = Date.now();
    for (const [key, value] of limits) if (value.until < now) limits.delete(key);
    const ip = req.socket.remoteAddress;
    const limit = limits.get(ip) || { until: now + 900000, count: 0 };
    if (limit.count >= rateLimit || (!limits.has(ip) && limits.size >= 10000)) fail(429, 'Příliš mnoho pokusů. Zkus to za 15 minut.');
    limit.count++; limits.set(ip, limit);
    const body = await readJson(req);
    db.prepare('DELETE FROM password_resets WHERE expires_at<=?').run(new Date().toISOString());
    db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(new Date().toISOString());
    const clearCookie = () => revokeSession(db, req).replace(secure ? /$^/ : /; Secure$/, '');
    const signIn = id => {
      revokeSession(db, req);
      const cookie = createSession(db, id, { secure });
      res.setHeader('Set-Cookie', cookie);
      return getSessionUser(db, { headers: { cookie: cookie.split(';')[0] } });
    };
    if (path.endsWith('/logout')) {
      res.setHeader('Set-Cookie', clearCookie());
      return send(res, 200, { ok: true });
    }
    if (path.endsWith('/register')) {
      const username = typeof body.username === 'string' ? body.username.trim() : '';
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(400, 'Zadej platný e-mail a jméno (3–32 písmen, číslic, _, . nebo -).');
      checkPassword(body.password);
      if (body.password !== body.passwordConfirm) fail(400, 'Zadaná hesla se neshodují.');
      const passwordHash = await hashPassword(body.password);
      const id = randomUUID();
      try { db.prepare('INSERT INTO users (id,username,email,password_hash) VALUES (?,?,?,?)').run(id, username, email, passwordHash); }
      catch (error) { if (String(error.message).includes('UNIQUE')) fail(409, 'E-mail nebo uživatelské jméno už je obsazené.'); throw error; }
      return send(res, 201, signIn(id));
    }
    if (path.endsWith('/login')) {
      const login = typeof body.login === 'string' ? body.login.trim() : '';
      checkPassword(body.password);
      if (!login || login.length > 254) fail(400, 'Zadej e-mail nebo uživatelské jméno.');
      const user = db.prepare('SELECT id,password_hash FROM users WHERE email=? OR username=?').get(login, login);
      const valid = await verify(body.password, user?.password_hash || '');
      if (!user || !valid) fail(401, 'Nesprávné přihlašovací údaje.');
      if (db.prepare('SELECT password_hash FROM users WHERE id=?').get(user.id)?.password_hash !== user.password_hash) fail(401, 'Přihlas se znovu.');
      return send(res, 200, signIn(user.id));
    }
    if (path.endsWith('/forgot-password')) {
      if (typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) fail(400, 'Zadej platný e-mail.');
      if (secure && !sendReset && !process.env.RESET_WEBHOOK_URL) fail(503, 'Obnova hesla nyní není dostupná.');
      const user = db.prepare('SELECT id,email FROM users WHERE email=?').get(body.email.trim());
      if (user) {
        const token = randomBytes(32).toString('hex');
        transaction(db, () => {
          db.prepare('DELETE FROM password_resets WHERE user_id=?').run(user.id);
          db.prepare('INSERT INTO password_resets VALUES (?,?,?)').run(hashToken(token), user.id, new Date(now + 1800000).toISOString());
        });
        try { await deliver({ email: user.email, url: `${allowedOrigin}/reset-password#token=${token}` }); }
        catch (error) { db.prepare('DELETE FROM password_resets WHERE token_hash=?').run(hashToken(token)); throw error; }
      }
      return send(res, 200, { message: 'Pokud účet existuje, obdržíš odkaz pro obnovu hesla.' });
    }
    checkPassword(body.password);
    if (body.password !== body.passwordConfirm) fail(400, 'Zadaná hesla se neshodují.');
    if (typeof body.token !== 'string' || !/^[a-f0-9]{64}$/.test(body.token)) fail(400, 'Odkaz je neplatný nebo vypršel.');
    const passwordHash = await hashPassword(body.password);
    transaction(db, () => {
      const reset = db.prepare('SELECT user_id FROM password_resets WHERE token_hash=? AND expires_at>?').get(hashToken(body.token), new Date().toISOString());
      if (!reset) fail(400, 'Odkaz je neplatný nebo vypršel.');
      db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(passwordHash, reset.user_id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(reset.user_id);
      db.prepare('DELETE FROM password_resets WHERE user_id=?').run(reset.user_id);
    });
    res.setHeader('Set-Cookie', clearCookie());
    return send(res, 200, { message: 'Heslo bylo změněno. Přihlas se novým heslem.' });
  };
}
