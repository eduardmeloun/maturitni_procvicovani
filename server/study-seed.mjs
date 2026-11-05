import { questions } from '../src/data/questions.js';
import { transaction } from './database.mjs';
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
  });
}
