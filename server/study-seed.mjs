import { questions } from '../src/data/questions.js';
import { transaction } from './database.mjs';

const additionalCards = [
  ['programovani-002', 'programovani-zaklady', 'Proměnné a datové typy', 'Jaký je rozdíl mezi proměnnou a konstantou?', 'Proměnné lze během běhu programu přiřadit novou hodnotu, konstantě ne. U objektu uloženého v konstantě ale může být možné měnit jeho obsah.'],
  ['programovani-003', 'programovani-zaklady', 'Podmínky', 'K čemu slouží podmínka if a větev else?', 'Podmínka if spustí blok příkazů, pokud je výraz pravdivý. Větev else se provede, pokud podmínka neplatí. Umožňují programu rozhodovat podle vstupů nebo stavu.'],
  ['programovani-004', 'programovani-zaklady', 'Cykly', 'Jaký je rozdíl mezi cykly for a while?', 'Cyklus for obvykle spojuje inicializaci, podmínku a změnu řídicí proměnné a hodí se například pro průchod polem. Cyklus while opakuje příkazy, dokud platí podmínka. Oba mohou proběhnout i nulakrát.'],
  ['programovani-005', 'programovani-zaklady', 'Funkce', 'Co jsou parametry a návratová hodnota funkce?', 'Parametry jsou pojmenované vstupy funkce, kterým při volání předáváme argumenty. Návratová hodnota je výsledek předaný volajícímu obvykle příkazem return. Funkce pomáhají rozdělit program na opakovaně použitelné části.'],
  ['programovani-006', 'programovani-zaklady', 'Datové struktury', 'Co je pole a jak přistupujeme k jeho prvkům?', 'Pole uchovává uspořádanou posloupnost prvků. K prvkům přistupujeme pomocí indexu, který například v JavaScriptu začíná nulou. Pole o délce n má indexy od 0 do n − 1.'],
  ['programovani-007', 'programovani-zaklady', 'Objektové programování', 'Jaký je rozdíl mezi třídou a objektem?', 'Třída popisuje společné vlastnosti a metody určitého typu objektů. Objekt je konkrétní instance se svým stavem. Například třída Student může mít vlastnost jméno a metodu pro přihlášení ke zkoušce.'],
  ['weby-002', 'weby-zaklady', 'HTML', 'Co je sémantické HTML a proč ho používat?', 'Sémantické značky vyjadřují význam obsahu, například nav pro navigaci, main pro hlavní obsah a button pro tlačítko. Pomáhají přístupnosti, orientaci ve zdrojovém kódu i strojovému zpracování stránky.'],
  ['weby-003', 'weby-zaklady', 'CSS', 'Z čeho se skládá CSS box model?', 'Box model tvoří obsah, vnitřní odsazení padding, rámeček border a vnější odsazení margin. Při box-sizing: border-box zahrnuje nastavená šířka a výška také padding a border, ale nezahrnuje margin.'],
  ['weby-004', 'weby-zaklady', 'Responzivní design', 'Jak vytvořit web přizpůsobený mobilům i počítačům?', 'Používáme pružné rozměry, Flexbox nebo Grid, přizpůsobivé obrázky a media queries. V HTML nastavíme viewport a rozložení ověříme na různých šířkách obrazovky.'],
  ['weby-005', 'weby-zaklady', 'JavaScript a DOM', 'Co je DOM a jak souvisí s JavaScriptem?', 'DOM je objektová reprezentace dokumentu ve stromové struktuře. JavaScript přes něj může vyhledávat elementy, měnit jejich obsah a atributy a reagovat na události, například kliknutí nebo odeslání formuláře.'],
  ['weby-006', 'weby-zaklady', 'HTTP', 'Jaký je rozdíl mezi HTTP metodami GET a POST?', 'GET slouží k získání reprezentace zdroje a nemá měnit stav serveru. POST předává data ke zpracování, například při vytvoření záznamu. Samotná metoda POST data nešifruje; přenos chrání HTTPS.'],
  ['weby-007', 'weby-zaklady', 'Formuláře a bezpečnost', 'Proč je nutné validovat data formuláře i na serveru?', 'Validace v prohlížeči dává rychlou zpětnou vazbu, ale uživatel ji může obejít a poslat vlastní požadavek. Server proto musí znovu ověřit formát, rozsah i oprávnění a při práci s databází používat parametrizované dotazy.'],
];

export function seedStudyDatabase(db) {
  transaction(db, () => {
    const topic = db.prepare('INSERT INTO topics (id,subject_id,name,position) VALUES (?,?,?,?) ON CONFLICT DO NOTHING');
    const card = db.prepare('INSERT INTO cards (id,topic_id,theme,question,answer) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING');
    for (const q of questions) {
      const number = Number(q.id.split('-')[1]);
      const topicId = `site-okruh-${number}`;
      topic.run(topicId, 'site', q.okruh, number);
      card.run(q.id, topicId, q.tema, q.otazka, q.odpoved);
    }
    for (const values of additionalCards) card.run(...values);
  });
}
