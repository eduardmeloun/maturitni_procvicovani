# Dohoda rozhraní pro pětičlenný tým

Tento dokument popisuje implementovaný základ. Návrh obrazovek je ve složce školní dokumentace. Rozšíření XP a typů otázek jsou týmová rozhodnutí.

## Vlastnictví částí

| Část | Soubory / odpovědnost |
| --- | --- |
| Základ (tato branch) | server/database.mjs, migrace, server/app.mjs, src/lib, konfigurace |
| Veřejné stránky | nové komponenty v src/features/public, společný vzhled a kontaktní backend |
| Účty | src/features/auth, nový serverový auth modul; používá users, sessions a server/session.mjs |
| Procvičování | src/features/study, api.cards a api.saveProgress |
| Statistiky | src/features/stats, grafy a nový backend pro profil, odznaky a žebříček |

Adresáře features vytvoří jejich autoři. App.tsx zatím obsahuje navigaci a zástupné stránky; při napojení komponent upravujte pouze příslušnou větev. Nové serverové endpointy napojte v app.mjs po dohodě s vlastníkem základu. Statistický modul počítá XP z attempts, nikoliv z hodnot poslaných klientem.

## Datový model

- subjects → topics (maturitní okruhy) → cards. Pole cards.theme je téma uvnitř okruhu.
- users: interní UUID, username, email, password_hash, class_name, field, avatar_url. Žádné heslo v otevřeném tvaru.
- sessions: pouze SHA-256 hash náhodného tokenu, vazba na uživatele a expirace.
- progress: poslední stav každé kartičky pro konkrétního uživatele.
- attempts: neměnná historie pokusů, serverové XP a studijní den Europe/Prague.
- Nenavštívená karta nemá progress; API ji vrací se stavem unseen. Ukládat lze known / unknown / review.
- Datum a čas: ISO UTC; studijní den: YYYY-MM-DD v Praze. SQLite používá snake_case, JSON camelCase.

## Hotové HTTP API

Všechny odpovědi jsou přímo JSON (bez obálky data). Chyby: `{ "error": { "message": "…" } }`.

| Metoda | URL | Přístup / odpověď |
| --- | --- | --- |
| GET | /api/health | veřejné; stav serveru a DB |
| GET | /api/subjects | veřejné; seznam předmětů |
| GET | /api/topics?subjectId=site | veřejné; okruhy, filtr je volitelný |
| GET | /api/me | přihlášený uživatel bez hesla a e-mailu |
| GET | /api/cards?topicId=site-zaklady&status=unseen | přihlášení; oba filtry volitelné |
| GET | /api/progress | vlastní aktuální pokrok |
| POST | /api/progress | vlastní výsledek pokusu |
| GET | /api/activity | vlastní denní součty pokusů a XP |

Příklad pro autora kartiček:

```ts
import { api } from './lib/api' // uprav relativní cestu podle komponenty
const cards = await api.cards({ topicId: 'site-zaklady' })
const attempt = { attemptId: crypto.randomUUID(), cardId: cards[0].id, status: 'known' as const }
const result = await api.saveProgress(attempt)
// Při síťové chybě zopakuj stejný objekt se stejným attemptId.
// Nové hodnocení = nové UUID. Neodesílej automaticky při mountu komponenty.
```

POST vrací attemptId, cardId, status, xpAwarded, duplicate. Návrhové pravidlo základu: 10 XP za první known dané karty za celou historii, další pokusy 0 XP. Změna stavu XP neodečítá. Duplicitní požadavek vrátí původní XP, ale znovu je nepřičte; UI musí obnovit celková data, ne slepě přičítat odpověď. Neplatná data 400, bez relace 401, cizí Origin 403, neexistující karta 404, kolize attemptId 409. Jiný uživatel nemůže číst ani zapisovat cizí progress přes userId v požadavku.

## Napojení účtů (další člen)

Implementuj registraci, login, logout a obnovu hesla jako nový modul, včetně validace, hashování hesel (např. scrypt), limitování pokusů a ověření Origin u zápisů. Po ověření účtu použij:

```js
import { createSession, revokeSession } from './session.mjs';
const cookie = createSession(db, userId, { secure: process.env.NODE_ENV === 'production' });
res.setHeader('Set-Cookie', cookie);
// logout: revokeSession(db, req) odstraní relaci a vrátí mazací cookie.
```

Token patří do HttpOnly cookie, nikoliv localStorage. V produkci HTTPS a Secure cookie. Auth endpointy a žádný výchozí přihlášený účet zatím neexistují. Chráněné endpointy tedy do dokončení účtů správně vracejí 401; integrační testy si vytvářejí izolované testovací relace přímo v DB.

## Migrace a slučování

Neměň aplikovanou 001_initial.sql. Přidej 002_nazev.sql atd.; čísla si domluvte, dva soubory nesmějí mít stejné číslo. Migrace se aplikují automaticky při startu serveru a evidují se v migrations. Schéma, seed a testy patří do Gitu; data/app.sqlite a osobní data ne.

Nejprve slučte tento základ do společné main. Ostatní si ho přenesou do svých branchí před napojováním. Před mergem: npm test a npm run build. Finální společný scénář: založení účtu → přihlášení → hodnocení kartičky → obnovení stránky → správný vlastní pokrok a statistiky.

## Produkční provoz

Tato branch připravuje lokální základ, ne veřejné nasazení. Pro produkci je nutný Node server s trvalým zapisovatelným diskem, HTTPS reverse proxy a zálohování SQLite. Frontend dist hostuj pod stejným originem, /api přeposílej na Node a ostatní URL přepisuj na index.html. Server sám statické soubory neobsluhuje. Nastav APP_ORIGIN na přesný veřejný origin. Nepoužívej databázi na pomíjivém disku serverless hostingu; pro více replik zvolte sdílenou databázi.
