import { createHash, randomBytes } from 'node:crypto';

export const hashToken = token => createHash('sha256').update(token).digest('hex');
// Auth modul po ověření hesla zavolá tuto funkci a vrátí cookie v HTTP odpovědi.
export function createSession(db, userId, { secure = true, ttlSeconds = 604800 } = {}) {
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,?)')
    .run(hashToken(token), userId, new Date(Date.now() + ttlSeconds * 1000).toISOString());
  return `session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${ttlSeconds}${secure ? '; Secure' : ''}`;
}

export function getSessionUser(db, request) {
  const token = /(?:^|;\s*)session=([a-f0-9]{64})(?:;|$)/.exec(request.headers.cookie || '')?.[1];
  if (!token) return null;
  return db.prepare(`SELECT u.id,u.username,u.class_name AS className,u.field,u.avatar_url AS avatarUrl
    FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`)
    .get(hashToken(token), new Date().toISOString()) || null;
}

export function revokeSession(db, request) {
  const token = /(?:^|;\s*)session=([a-f0-9]{64})(?:;|$)/.exec(request.headers.cookie || '')?.[1];
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(token));
  return 'session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0; Secure';
}
