# Maturyta Formalyta

Studijní aplikace pro přípravu k maturitě: React + TypeScript + Vite, Node.js HTTP API a SQLite. Vyžaduje Node.js 24.14 nebo novější řady 24. SQLite je v této řadě Node stále experimentální.

## Lokální spuštění

```sh
npm ci
npm run db:seed
npm run dev
```

Otevři http://localhost:5173. API běží na 127.0.0.1:3001. Vite používá pevný port kvůli ověřování Origin.
Volitelně zkopíruj `.env.example` do `.env`. Server a databázové příkazy načítají `.env` automaticky; proměnné nastavené v prostředí mají přednost. `.env` ani osobní databáze nepatří do Gitu.
Seed je opakovatelný, nepřepisuje existující data a nevytváří výchozí účet. Databáze vznikne v `data/app.sqlite`.

## Funkce

- Úvodní stránka, kontakty, veřejný žebříček, profil a studijní kartičky s filtry předmětu, okruhu, tématu a stavu.
- Registrace, přihlášení e-mailem nebo jménem, odhlášení a obnova hesla. Přímé URL `/login`, `/register`, `/reset-password` otevírají modal.
- Unikátní jméno (3–32 ASCII písmen, číslic, teček, pomlček a podtržítek), e-mail a heslo o 8–128 znacích.
- Hesla: scrypt s náhodnou solí. Relace: náhodný token v HttpOnly/SameSite cookie, v DB pouze jeho SHA-256 hash; v produkci Secure cookie.
- Profil a kartičky vyžadují relaci, API izoluje data podle účtu. Výsledky a serverem vypočtené XP přetrvají obnovení stránky.
- Síťově opakovaný pokus používá stejné UUID, aby se XP nepřičítaly dvakrát. API chyby 4xx uvolní ovládání filtrů; při neurčité síťové chybě lze stejný pokus zopakovat.
- Profil, žebříček i přehled žebříčku na úvodu používají skutečná data. Grafika přípravy na úvodu je označená ukázka.

## Obnova hesla

Odkaz platí 30 minut a je jednorázový. Nový odkaz ruší předchozí; změna hesla ruší všechny relace účtu.
Lokálně se odkaz vypisuje do terminálu API. V produkci jsou povinné `RESET_WEBHOOK_URL` a `RESET_WEBHOOK_SECRET`.
Vlastní e-mailová služba musí přijmout HTTPS POST s JSON `{ email, url }`, ověřit hlavičku `Authorization: Bearer <secret>`, doručit e-mail a vrátit úspěšný HTTP status. Odesílání má časový limit 10 sekund. Token se nevrací z veřejného API ani neukládá v otevřeném tvaru do databáze.
Auth zápisy vyžadují shodný Origin a mají limit 20 požadavků na IP za 15 minut. Odhlášení zůstává dostupné i po vyčerpání limitu. Limity jsou v paměti jednoho procesu; za proxy používají IP proxy, nikoliv nedůvěryhodné X-Forwarded-For. Pro větší provoz nastav limitování také na důvěryhodné reverzní proxy.

## Produkční spuštění

1. Zajisti trvalý zapisovatelný disk pro SQLite a pravidelné zálohy.
2. Nastav `APP_ORIGIN` na přesný veřejný HTTPS origin bez koncového lomítka, `RESET_WEBHOOK_URL` a `RESET_WEBHOOK_SECRET` pro skutečné doručování e-mailů.
3. Nainstaluj závislosti a sestav aplikaci:

```sh
npm ci
npm run db:seed
npm run build
npm start
```

`npm start` nastavuje produkční režim. Jeden Node server obsluhuje API, sestavený frontend z `dist` i přímé odkazy na podstránky. Migrace databáze běží automaticky při startu. Chybějící build nebo neplatná produkční konfigurace zastaví start s chybou.
Před Node server postav HTTPS reverzní proxy (např. Caddy/nginx), která přeposílá web i API na `127.0.0.1:3001`. Backend sám TLS neukončuje. `HOST` a `PORT` lze změnit podle hostingu.
Statické soubory mají správné MIME typy, verzované assets dlouhou cache a HTML vyžaduje ověření změn. Server neposkytuje `.env`, zdrojové soubory ani databázi. Nastavuje CSP, ochranu proti vložení do rámce a no-referrer kvůli citlivým odkazům.
`npm run preview` je pouze Vite náhled a neposkytuje API.

## Konfigurace

| Proměnná | Význam |
| --- | --- |
| APP_ORIGIN | Povolený origin zápisů; lokálně http://localhost:5173, produkčně povinný HTTPS origin |
| DATABASE_PATH | SQLite soubor, výchozí data/app.sqlite |
| HOST | Adresa serveru, výchozí 127.0.0.1 |
| PORT | Port API/produkčního webu, výchozí 3001; lokálně při změně uprav Vite proxy |
| RESET_WEBHOOK_URL | HTTPS endpoint vlastní služby pro odesílání obnovovacích e-mailů |
| RESET_WEBHOOK_SECRET | Sdílený tajný klíč e-mailové služby |

## Příkazy a ověření

- `npm run dev`: frontend a API s automatickým obnovením.
- `npm run db:migrate` / `npm run db:seed`: migrace / doplnění studijních dat.
- `npm test`: izolované integrační testy účtů, pokroku, migrací/seedu a produkčního serveru.
- `npm run lint` a `npm run build`: kontrola kódu a sestavení.
- `npm start`: produkční server. `npm run start:server`: API podle nastaveného NODE_ENV.

## Obsah a kontakty před veřejným spuštěním

Řada původních síťových otázek má dosud text „Správná odpověď zatím není doplněna.“. Je potřeba odborně doplnit a zkontrolovat studijní odpovědi; technické testy jejich správnost neověřují.
Kontaktní formulář otevírá e-mailovou aplikaci přes mailto; zprávu musí uživatel odeslat v ní. Před veřejným použitím ověř skutečnou dostupnost uvedené kontaktní schránky. Kontakty nejsou automatické serverové odesílání.
Pro veřejný provoz nastav a ověř skutečnou e-mailovou službu, HTTPS a zálohování. Repo neobsahuje přístupové údaje k hostingu ani poštovní službě.

## Pro tým

Rozhraní API a vlastnictví modulů: [docs/TEAM.md](docs/TEAM.md). Veřejné stránky jsou v `src/pages`, účty, studium a statistiky v `src/features`; společná navigace a ochrana stránek v `src/app/App.tsx`.
Integraci a úpravy vzhledu připravuje `nastrel`; ověřený stav se slučuje do `main`. Před každým mergem spusť testy, lint a build. Lokální data a složku DOKUMENTACE lze zachovat odděleně od verzovaného školního návrhu ve složce Skupinova prace 3. rocnik.
