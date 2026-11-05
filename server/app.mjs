import { createServer } from 'node:http';
import { createAuth } from './auth.mjs';
import { getSessionUser } from './session.mjs';
import { transaction } from './database.mjs';

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
}
async function readJson(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new HttpError(415, 'Použij application/json.');
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > 16384) throw new HttpError(413, 'Požadavek je příliš velký.');
  }
  try { const value = JSON.parse(body); if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(); return value; }
  catch { throw new HttpError(400, 'Neplatný JSON objekt.'); }
}
export const studyDay = (date = new Date()) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' }).format(date);

export function createApp(db, { allowedOrigin = 'http://localhost:5173', sendReset, rateLimit = 20 } = {}) {
  const auth = createAuth(db, { allowedOrigin, sendReset, rateLimit, send, readJson, HttpError });
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = url.pathname;
      if (req.method === 'GET' && path === '/api/health') {
        db.prepare('SELECT 1').get();
        return send(res, 200, { status: 'ok', database: 'ok' });
      }
      if (req.method === 'GET' && path === '/api/subjects') {
        return send(res, 200, db.prepare('SELECT * FROM subjects ORDER BY position,id').all());
      }
      if (req.method === 'GET' && path === '/api/topics') {
        const id = url.searchParams.get('subjectId');
        return send(res, 200, db.prepare(`SELECT id,subject_id AS subjectId,name,position FROM topics
          WHERE (? IS NULL OR subject_id=?) ORDER BY position,id`).all(id, id));
      }
      if (req.method === 'GET' && path === '/api/leaderboard') {
        const month = studyDay().slice(0, 7);
        return send(res, 200, db.prepare(`SELECT u.id,u.username AS name,
          COALESCE(SUM(a.xp),0) AS xpAllTime,
          COALESCE(SUM(CASE WHEN substr(a.study_day,1,7)=? THEN a.xp ELSE 0 END),0) AS xpThisMonth
          FROM users u LEFT JOIN attempts a ON a.user_id=u.id GROUP BY u.id ORDER BY xpAllTime DESC,u.id`).all(month));
      }
      if (path.startsWith('/api/auth/')) return await auth(req, res, path);
      const protectedPath = ['/api/me', '/api/cards', '/api/progress', '/api/activity'].includes(path);
      if (!protectedPath) throw new HttpError(404, 'API endpoint neexistuje.');
      const user = getSessionUser(db, req);
      if (!user) throw new HttpError(401, 'Nejdřív se přihlas.');
      if (req.method === 'GET' && path === '/api/me') return send(res, 200, user);
      if (req.method === 'GET' && path === '/api/cards') {
        const topic = url.searchParams.get('topicId');
        const status = url.searchParams.get('status');
        if (status && !['known', 'unknown', 'review', 'unseen'].includes(status)) throw new HttpError(400, 'Neplatný stav.');
        const cards = db.prepare(`SELECT c.id,c.topic_id AS topicId,c.theme,c.question,c.answer,c.type,
          c.extra_json AS extraJson,COALESCE(p.status,'unseen') AS status FROM cards c
          LEFT JOIN progress p ON p.card_id=c.id AND p.user_id=?
          WHERE (? IS NULL OR c.topic_id=?) AND (? IS NULL OR COALESCE(p.status,'unseen')=?) ORDER BY c.id`)
          .all(user.id, topic, topic, status, status).map(({ extraJson, ...card }) => ({ ...card, extra: JSON.parse(extraJson) }));
        return send(res, 200, cards);
      }
      if (req.method === 'GET' && path === '/api/progress') {
        return send(res, 200, db.prepare('SELECT card_id AS cardId,status,updated_at AS updatedAt FROM progress WHERE user_id=? ORDER BY card_id').all(user.id));
      }
      if (req.method === 'GET' && path === '/api/activity') {
        return send(res, 200, db.prepare(`SELECT study_day AS day,COUNT(*) AS attempts,SUM(xp) AS xp
          FROM attempts WHERE user_id=? GROUP BY study_day ORDER BY study_day`).all(user.id));
      }
      if (req.method === 'POST' && path === '/api/progress') {
        // Cookie autentizace: prohlížeč musí poslat povolený Origin, chybějící se odmítá.
        if (req.headers.origin !== allowedOrigin) throw new HttpError(403, 'Nepovolený původ požadavku.');
        const { attemptId, cardId, status } = await readJson(req);
        if (typeof attemptId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(attemptId)
          || typeof cardId !== 'string' || cardId.length > 100 || !['known', 'unknown', 'review'].includes(status)) {
          throw new HttpError(400, 'Očekávám attemptId (UUID v4), cardId a status known/unknown/review.');
        }
        const result = transaction(db, () => {
          const previous = db.prepare('SELECT user_id,card_id,status,xp FROM attempts WHERE id=?').get(attemptId);
          if (previous) {
            if (previous.user_id !== user.id || previous.card_id !== cardId || previous.status !== status) throw new HttpError(409, 'ID pokusu už bylo použito pro jiný výsledek.');
            return { attemptId, cardId, status, xpAwarded: previous.xp, duplicate: true };
          }
          if (!db.prepare('SELECT id FROM cards WHERE id=?').get(cardId)) throw new HttpError(404, 'Kartička neexistuje.');
          const rewarded = db.prepare('SELECT 1 FROM attempts WHERE user_id=? AND card_id=? AND xp>0').get(user.id, cardId);
          const xp = status === 'known' && !rewarded ? 10 : 0;
          const now = new Date();
          db.prepare('INSERT INTO attempts VALUES (?,?,?,?,?,?,?)').run(attemptId, user.id, cardId, status, xp, studyDay(now), now.toISOString());
          db.prepare(`INSERT INTO progress VALUES (?,?,?,?) ON CONFLICT(user_id,card_id)
            DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at`).run(user.id, cardId, status, now.toISOString());
          return { attemptId, cardId, status, xpAwarded: xp, duplicate: false };
        });
        return send(res, 200, result);
      }
      throw new HttpError(405, 'Metoda není povolena.');
    } catch (error) {
      if (!(error instanceof HttpError)) console.error(error);
      send(res, error instanceof HttpError ? error.status : 500, { error: { message: error instanceof HttpError ? error.message : 'Vnitřní chyba serveru.' } });
    }
  });
}
