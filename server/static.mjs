import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, relative, isAbsolute, extname } from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2' };
const routes = new Set(['/', '/kontakty', '/flashcards', '/profile', '/leaderboard', '/login', '/register', '/reset-password']);
export function createStaticHandler(directory) {
  return async (req, res, url) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { res.writeHead(400); res.end(); return; }
    if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').includes('..')) { res.writeHead(400); res.end(); return; }
    try {
      const root = await realpath(directory);
      const target = await realpath(resolve(root, routes.has(pathname.replace(/\/$/, '') || '/') ? 'index.html' : '.' + pathname));
      const location = relative(root, target);
      if (location.startsWith('..') || isAbsolute(location) || !(await stat(target)).isFile()) { res.writeHead(404); res.end(); return; }
      const body = req.method === 'HEAD' ? null : await readFile(target);
      res.writeHead(200, {
        'Content-Type': types[extname(target)] || 'application/octet-stream',
        'Cache-Control': location.startsWith('assets') ? 'public, max-age=31536000, immutable' : 'no-cache',
      });
      res.end(body);
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) console.error('Static file error:', error.code);
      res.writeHead(['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500); res.end();
    }
  };
}
