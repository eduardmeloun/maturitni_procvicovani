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

## Účty a integrované stránky

Účty implementuje `server/auth.mjs`, modal `src/features/auth` a společná navigace `src/app/App.tsx`.
Veřejné POST endpointy (vždy s povoleným Origin a JSON):

| URL | Tělo |
| --- | --- |
| /api/auth/register | username, email, password, passwordConfirm |
| /api/auth/login | login (jméno nebo e-mail), password |
| /api/auth/logout | {} |
| /api/auth/forgot-password | email |
| /api/auth/reset-password | token, password, passwordConfirm |

Registrace (201) a přihlášení (200) vracejí veřejný User a nastavují cookie. Ostatní vracejí potvrzení; odhlášení maže relaci. Hesla používají scrypt se solí, tokeny relací a obnovy SHA-256. Obnova ruší všechny relace účtu. Produkční e-mailové doručování a limitování popisuje README.
Migrace 002_password_resets.sql přidává pouze jednorázové tokeny obnovy, původní 001 zůstává beze změny.
GET /api/leaderboard je veřejný a vrací id, name, xpAllTime a xpThisMonth vypočtené serverem z attempts. Profil načítá vlastní progress/activity; žádný mock se nepoužívá pro živá data.
`src/features/study/StudyPage.tsx` používá společný API klient. Původní otázky ze `src/data/questions.js` přidává opakovatelný seed, původní soubor Flashcards.jsx slouží jako kompatibilní export.

## Migrace a slučování

Neměň aplikovanou 001_initial.sql. Další migraci přidej jako 003_nazev.sql atd.; čísla si domluvte, dva soubory nesmějí mít stejné číslo. Migrace se aplikují automaticky při startu serveru a evidují se v migrations. Schéma, seed a testy patří do Gitu; data/app.sqlite a osobní data ne.

Pracovní větve sdílejí společný integrovaný základ; main zůstala beze změny. Před mergem: npm test a npm run build. Finální společný scénář: založení účtu → přihlášení → hodnocení kartičky → obnovení stránky → správný vlastní pokrok a statistiky.

## Produkční provoz

Tato branch připravuje lokální základ, ne veřejné nasazení. Pro produkci je nutný Node server s trvalým zapisovatelným diskem, HTTPS reverse proxy a zálohování SQLite. Frontend dist hostuj pod stejným originem, /api přeposílej na Node a ostatní URL přepisuj na index.html. Server sám statické soubory neobsluhuje. Nastav APP_ORIGIN na přesný veřejný origin. Nepoužívej databázi na pomíjivém disku serverless hostingu; pro více replik zvolte sdílenou databázi.
