import { readFileSync, existsSync } from 'node:fs';
import { openDatabase, transaction } from './database.mjs';

const db = openDatabase();
const sources = [
  { subjectId: 'site', name: 'Sítě', questions: 'study-questions.json', topics: 'study-topics.json' },
  { subjectId: 'programovani', name: 'Programování', questions: 'programming-questions.json', topics: 'programming-topics.json' },
  { subjectId: 'weby', name: 'Tvorba webů', questions: 'web-questions.json', topics: 'web-topics.json' },
];
const readJson = filename => {
  const url = new URL(`./seeds/${filename}`, import.meta.url);
  if (!existsSync(url)) return null;
  const data = JSON.parse(readFileSync(url, 'utf8'));
  if (!Array.isArray(data)) throw new Error(`${filename}: očekávám JSON pole`);
  return data;
};
try {
  const subjectStmt = db.prepare(`
    INSERT INTO subjects(id,name,position) VALUES(?,?,?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name
  `);
  const topicStmt = db.prepare(`
    INSERT INTO topics(id,subject_id,name,position) VALUES(?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, position=excluded.position
  `);
  const cardStmt = db.prepare(`
    INSERT INTO cards(id,topic_id,theme,question,answer) VALUES(?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET topic_id=excluded.topic_id,
      theme=excluded.theme, question=excluded.question, answer=excluded.answer
  `);
  let total = 0;
  transaction(db, () => {
    sources.forEach((source, index) => {
      const cards = readJson(source.questions);
      if (cards === null) {
        console.log(`Přeskakuji ${source.questions} (neexistuje)`);
        return;
      }
      const definedTopics = readJson(source.topics);
      const topics = definedTopics ?? [...new Set(cards.map(c => c.topicId))].map((id, i) => ({
        id, subjectId: source.subjectId, name: id, position: i + 1
      }));
      subjectStmt.run(source.subjectId, source.name, index);
      for (const topic of topics) {
        if (!topic.id || !topic.name || topic.subjectId !== source.subjectId)
          throw new Error(`Neplatný okruh v ${source.topics}: ${JSON.stringify(topic)}`);
        topicStmt.run(topic.id, source.subjectId, topic.name, topic.position ?? 0);
      }
      const validIds = new Set(topics.map(t => t.id));
      for (const card of cards) {
        if (!card.id || !card.topicId || !card.theme || !card.question || !card.answer)
          throw new Error(`Neúplná kartička: ${JSON.stringify(card)}`);
        if (!validIds.has(card.topicId))
          throw new Error(`Neznámý topicId ${card.topicId} u ${card.id}`);
        cardStmt.run(card.id, card.topicId, card.theme, card.question, card.answer);
        total++;
      }
      console.log(`${source.name}: ${topics.length} okruhů, ${cards.length} kartiček`);
    });
  });
  console.log(`Import dokončen: ${total} kartiček`);
} catch (err) {
  console.error('Import selhal:', err);
  process.exitCode = 1;
} finally {
  db.close();
}

