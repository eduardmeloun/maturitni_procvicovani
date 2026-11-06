# Maturyta Formalyta – dokumentace aplikace

**Škola:** Střední průmyslová škola Mladá Boleslav (SPŠ MB)
**Obor:** Informační technologie
**Předmět:** Programování
**Tým:** 5 studentů 3. ročníku (Jan Tománek (vedoucí), Jan Kotrba, Michal Suchan, Adam David, Šimon Hrůza)
**Stav projektu:** fáze návrhu a dokumentace (částečně hotové grafické návrhy ve Figmě, samotné programování zatím nezačalo)

---

# 1. Představení aplikace

Tato kapitola představuje aplikaci **Maturyta Formalyta**. Popisuje její název, účel, problém, který má řešit, cílovou skupinu uživatelů a její hlavní funkce. Aplikace je v době psaní této dokumentace ve fázi návrhu. Vše, co je zde popsáno, proto představuje **plánované řešení** vycházející z grafických návrhů vytvořených ve Figmě a z dosavadních rozhodnutí týmu. Konkrétní podoba funkcí se může během vývoje upřesnit.

## 1.1 Název aplikace

Aplikace se jmenuje **Maturyta Formalyta**.

Název vznikl jako slovní hříčka. Spojuje slovo „maturita“ s rýmujícím se slovem „formalita“ a dodává aplikaci uvolněný, nezapomenutelný a trochu humorný charakter. Název sám o sobě nemá žádný hlubší význam. Záměrně působí vstřícně a neformálně, což odpovídá cíli aplikace: udělat přípravu na maturitu méně stresující a zábavnější.

Logo aplikace se skládá z ikony čepice absolventa a názvu „Maturyta Formalyta“ ve dvou řádcích. Objevuje se v levé části horní navigační lišty na všech obrazovkách. Dominantní barvou identity je modrá.

## 1.2 K čemu aplikace slouží

**Maturyta Formalyta** je webová aplikace určená k přípravě na maturitní zkoušku formou **flashcards**, tedy učebních kartiček. Studentům umožňuje učit se maturitní látku postupně, po jednotlivých otázkách a tématech, a průběžně sledovat, jak jim příprava jde.

Aplikace slouží především k těmto účelům:

- **Opakování a procvičování maturitní látky.** Obsah je rozdělený do maturitních předmětů a okruhů. Student si vybere předmět, okruh a téma a prochází kartičky s otázkami a odpověďmi.
- **Sledování vlastního pokroku.** U každé otázky student označuje, zda ji **umí**, **neumí**, nebo si ji potřebuje **zopakovat**. Aplikace z těchto údajů vytváří přehled, kolik látky už je naučeno a co ještě zbývá.
- **Motivace k pravidelnému učení.** Aplikace obsahuje herní prvky, například body zkušeností (XP), úrovně, denní série (streak), odznaky a žebříček studentů. Tyto prvky mají studenta vést k tomu, aby se učil pravidelně a ne až těsně před maturitou.
- **Soustředění obsahu na jednom místě.** Maturitní látka z více předmětů je dostupná v jedné aplikaci a nemusí se skládat z různých sešitů, poznámek a dokumentů.

Aplikace je cíleně zaměřená na **maturitu oboru Informační technologie**. Je tedy tvořena podle skutečných maturitních okruhů a výuky na naší škole a ne jako obecný nástroj pro libovolné téma.

## 1.3 Jaký problém aplikace řeší

Příprava na maturitu je rozsáhlá a náročná. Student se musí zorientovat v desítkách okruhů z několika předmětů a látka pochází ze všech čtyř ročníků studia. V praxi se při přípravě setkáváme s těmito problémy:

1. **Rozptýlené studijní materiály.** Poznámky z hodin, prezentace a podklady od učitelů jsou uložené na různých místech a v různých podobách. Student tráví čas jejich hledáním místo samotného učení.
2. **Nepřehlednost toho, co už student umí.** Bez systematického sledování pokroku je těžké odhadnout, které okruhy jsou dobře zvládnuté a které vyžadují více času. Studenti pak často opakují to, co už znají, a podceňují slabší místa.
3. **Nedostatek pravidelného procvičování.** Učení bývá odkládáno na poslední chvíli. Dlouhodobá příprava rozložená do menších částí je přitom výrazně efektivnější.
4. **Nízká motivace.** Opakování látky formou čtení poznámek je pro mnoho studentů monotónní. Chybí zpětná vazba, pocit postupu i prvek soutěživosti.
5. **Obecné nástroje nejsou přizpůsobené našemu oboru.** Existující aplikace s kartičkami jsou obecné a obsah pro konkrétní maturitní okruhy našeho oboru v nich není připravený. Student by si musel vše vytvářet sám.

Aplikace **Maturyta Formalyta** na tyto problémy reaguje tím, že nabízí jednotné, přehledné a hravé prostředí s obsahem připraveným přímo pro maturitní okruhy oboru Informační technologie. Zároveň automaticky sleduje pokrok a motivuje k pravidelné práci.

Aplikace je projektem našeho týmu, který vznikl v rámci předmětu Programování. Téma jsme si vybrali, protože maturitu čeká i nás a takový nástroj by nám samotným reálně pomohl.

## 1.4 Kdo bude aplikaci používat

### Cílová skupina

Aplikace je určena **studentům naší školy (SPŠ Mladá Boleslav) oboru Informační technologie**, kteří se chtějí připravit na maturitní zkoušku.

Vzhledem k tomu, že obsah vychází z látky všech čtyř ročníků, mohou aplikaci využívat studenti **1. až 4. ročníku**:

- **Studenti 4. ročníku** ji využijí jako hlavní nástroj bezprostřední přípravy na maturitu.
- **Studenti nižších ročníků** (1.–3.) ji mohou používat průběžně k opakování a upevňování látky, a tím si dlouhodobě budovat základ pro maturitu.

Autoři aplikace jsou sami studenty 3. ročníku, takže dobře znají potřeby a pohled budoucích uživatelů.

### Uživatelé a správa

- **Student** je hlavní role. Po registraci a přihlášení prochází kartičky, sleduje pokrok, získává body a odznaky, má vlastní profil a vidí své umístění v žebříčku.
- **Správa uživatelů** bude v počátečním období zajišťována týmem autorů. Zvažujeme, že tato možnost bude součástí aplikace.

Rozšíření aplikace na další obory nebo školy zatím není součástí plánu. Zaměřujeme se výhradně na obor Informační technologie na naší škole.

## 1.5 Jaké jsou hlavní funkce aplikace

Níže jsou uvedeny hlavní funkce aplikace. Vycházejí z grafických návrhů ve Figmě (úvodní stránka, kontakty, přihlášení a registrace, žebříček a profil). Funkce, které návrhy zatím přímo neukazují, jsou označeny jako **plánované**.

### 1.5.1 Flashcards (učební kartičky)

Základní funkcí aplikace je učení pomocí kartiček. Obsah je členěn do struktury **předmět → okruh → téma**.

- Pokrývá **všechny maturitní předměty oboru**, zejména **Programování**, **Tvorbu webů** a **Sítě**.
- Předpokládané typy kartiček jsou:
  - klasické **otočné kartičky** (otázka na přední straně, odpověď na zadní),
  - kartičky **s obrázky**,
  - kartičky **s ukázkami kódu**,
  - otázky **s výběrem z možností**.
- Konkrétní rozsah a podoba kartiček se budou upřesňovat při tvorbě obsahu.
- Obsah kartiček připravujeme my (autoři aplikace). Vytváření obsahu systémem nebo studenty není plánováno.

### 1.5.2 Sebehodnocení a procvičování

U každé otázky student označuje svůj stav: **umím**, **neumím**, nebo **zopakovat**. Na úvodní stránce se zobrazuje **procentuální přehled**, kolik otázek má student naučených, kolik ještě neumí a kolik si pouze opakuje. Díky tomu je okamžitě vidět, kde jsou slabá místa. Na základě toho aplikace umožňuje:

- **zkoušení** (procvičování vybraných otázek nebo okruhů),
- přehled **co student umí a co se musí doučit**.

### 1.5.3 Úvodní stránka a navigace

Úvodní stránka slouží jako rozcestník. V horní navigační liště jsou tlačítka pro přechod do jednotlivých částí aplikace, například **Okruhy**, **Otázky** (podle stavu umím / neumím / zopakovat), **Předměty**, **Flashcards** a **Leaderboard**. Dále obsahuje tlačítka pro **přihlášení** a **registraci**.

### 1.5.4 Registrace a přihlášení

Aplikace obsahuje **uživatelské účty**.

- **Registrace** probíhá zadáním uživatelského jména, e-mailu a hesla (s potvrzením hesla) a odsouhlasením podmínek.
- **Přihlášení** probíhá pomocí e-mailu a hesla. K dispozici je také funkce **zapomenutého hesla**.
- Formulář pro přihlášení a registraci je řešen jako jedno okno s přepínačem mezi oběma režimy.

### 1.5.5 Profil uživatele

Každý student má svůj **profil**, který obsahuje:

- jméno, třídu a obor a profilový obrázek,
- **úroveň** (level),
- **dnešní streak**, tedy počet dní v řadě, kdy se student učil,
- počet **splněných karet**,
- přehled **maturitních okruhů** s procentuálním pokrokem u každého (například Programování, Sítě, Tvorba webů),
- graf aktivity za **posledních 7 dní**, tedy kolik kartiček student procvičil,
- sekci **odznaků**, které student získává za dosažené cíle (například série dní v řadě, počet splněných karet nebo dokončení okruhu).

### 1.5.6 Leaderboard (žebříček)

Stránka s žebříčkem motivuje studenty prostřednictvím přátelského soupeření. Zobrazuje:

- aktuální **pozici (rank)** studenta,
- celkový počet **bodů zkušeností (XP)**,
- celkový **pokrok** v procentech,
- **kalendář aktivity**, ve kterém jsou barevně odlišeny dny s aktivitou a dny bez aktivity,
- **žebříček studentů** (například za aktuální měsíc) s pořadím a počtem XP.

### 1.5.7 Herní prvky (gamifikace)

Aplikace využívá herní prvky ke zvýšení motivace:

- **XP (body zkušeností)**, které student získává především podle úspěšnosti v jednotlivých úrovních procvičování,
- **levely (úrovně)**, které odrážejí celkový postup,
- **streak** (série dní v řadě),
- **odznaky a achievementy**,
- **žebříček** studentů.

Přímé výzvy mezi studenty (souboje) zatím neplánujeme.

### 1.5.8 Další funkce a vlastnosti

- **Kontaktní stránka.** Slouží k nahlášení chyby, návrhu na zlepšení nebo žádosti o chybějící téma. Obsahuje kontaktní údaje a formulář pro odeslání zprávy.
- **Responzivní zobrazení.** Aplikace má fungovat na **počítači, tabletu i mobilním telefonu**, aby se student mohl učit kdykoli a kdekoli.
- **Tmavý režim** (plánováno).
- **Sdílení** (plánováno).
- Offline režim a vlastní balíčky kartiček vytvářené uživateli zatím neplánujeme.

## 1.6 Shrnutí a cíl aplikace

Hlavním cílem aplikace **Maturyta Formalyta** je **zvýšit úspěšnost studentů oboru Informační technologie u maturitní zkoušky**. Dalším cílem je zvýšit motivaci k pravidelné přípravě. Aplikace může také částečně ušetřit čas a usnadnit učení, ovšem přínos se bude u každého studenta lišit.

V této fázi projekt existuje ve formě grafických návrhů a písemné dokumentace. Po jejím dokončení budeme pokračovat samotnou implementací. Zpětnou vazbu od budoucích uživatelů (studentů naší školy) zatím nemáme a chceme ji získat v dalších fázích projektu.