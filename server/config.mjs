import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const envFile = fileURLToPath(new URL('../.env', import.meta.url));
if (existsSync(envFile)) loadEnvFile(envFile);

export function validateConfig(env = process.env) {
  const production = env.NODE_ENV === 'production';
  const origin = env.APP_ORIGIN || (production ? '' : 'http://localhost:5173');
  let parsed;
  try { parsed = new URL(origin); } catch { throw new Error('Nastav APP_ORIGIN na platny origin aplikace.'); }
  if (parsed.origin !== origin || !['http:', 'https:'].includes(parsed.protocol) || (production && parsed.protocol !== 'https:')) throw new Error('APP_ORIGIN musi byt presny origin; v produkci HTTPS, bez cesty a koncoveho lomitka.');
  const port = Number(env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT musi byt cislo 1 az 65535.');
  if (production && (!env.RESET_WEBHOOK_URL || !env.RESET_WEBHOOK_SECRET)) throw new Error('Pro produkcni obnovu hesla nastav RESET_WEBHOOK_URL a RESET_WEBHOOK_SECRET.');
  if (env.RESET_WEBHOOK_URL) {
    const webhook = new URL(env.RESET_WEBHOOK_URL);
    if (webhook.protocol !== 'https:' || webhook.username || webhook.password) throw new Error('RESET_WEBHOOK_URL musi pouzivat HTTPS bez prihlasovacich udaju v URL.');
  }
  return { production, origin, port };
}
