# Maturyta Formalyta

Týmová webová aplikace pro přípravu k maturitě IT na SPŠ Mladá Boleslav.
React + TypeScript + Vite, Node.js HTTP API a SQLite (vestavěné node:sqlite; v Node 24 ještě experimentální).

## Spuštění

Potřebuješ Node.js 24.14 nebo novější řady 24 a npm. V kořeni tohoto projektu:

```sh
npm ci
npm run db:seed
npm run dev
```

Otevři http://localhost:5173. Jeden příkaz spouští frontend i API (127.0.0.1:3001).
Pokud je port obsazený, ukonči předchozí server. Vite záměrně nepřepíná port kvůli kontrole Origin.
SQLite soubor vznikne v data/app.sqlite. Není součástí Gitu. Seed lze bezpečně opakovat; přidá tři ukázkové předměty a kartičky, nepřepisuje existující obsah a nezakládá účty.

## Příkazy

| Příkaz | Účel |
| --- | --- |
| npm run dev | Frontend i backend s obnovou při změnách |
| npm run dev:client | Pouze Vite |
| npm run dev:server | Pouze API s automatickým restartem |
| npm run db:migrate | Aplikace nových SQL migrací |
| npm run db:seed | Migrace a opakovatelné ukázkové údaje |
| npm test | Integrační testy HTTP API a izolované SQLite |
| npm run build | TypeScript kontrola a sestavení frontendu do dist |
| npm run start:server | API bez sledování změn |

## Pro tým

Dohoda dat, tabulky, seznam endpointů, příklady klienta a napojení účtů: [docs/TEAM.md](docs/TEAM.md).

- src/lib/contracts.ts: společné typy dat.
- src/lib/api.ts: společný klient, předává cookie a zpracovává chyby.
- src/App.tsx: dočasná navigace a místa pro týmové obrazovky.
- server/migrations: verzované SQL schéma.
- server/database.mjs: připojení, migrace, transakce, seed.
- server/session.mjs: vytváření, ověření a rušení relací pro budoucí auth modul.
- server/app.mjs: API a ukládání pokroku.

Hotový je technický základ, nikoliv finální stránky, přihlašování a statistiky. Bez auth modulu vrací chráněné API 401. Manrope je zatím pouze preferovaný font v CSS s lokálním fallbackem; jeho skutečné fontové soubory dodá autor vzhledu.

## Konfigurace a nasazení

Proměnné prostředí backendu (nastavují se v shellu nebo hostingu; .env se automaticky nenačítá):

- DATABASE_PATH: SQLite cesta; výchozí data/app.sqlite v projektu.
- HOST: výchozí 127.0.0.1.
- PORT: výchozí 3001. Při změně uprav i Vite proxy.
- APP_ORIGIN: výchozí http://localhost:5173, přesný povolený origin zápisů.

Např. v PowerShellu: `$env:APP_ORIGIN = 'https://vase-domena.cz'`.
Veřejné nasazení vyžaduje trvalý disk, HTTPS, obsluhu dist a proxy /api; podrobnosti v docs/TEAM.md. npm run preview slouží jen ke kontrole statického buildu, neposkytuje backend.
