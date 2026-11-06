
import { readFileSync, existsSync } from "node:fs";
import { openDatabase, transaction } from "./database.mjs";

const db = openDatabase();

const sources = [
  {
    subjectId: "site",
    subjectName: "Sítě",
    questionsFile: "study-questions.json",
    topicsFile: "study-topics.json",
  },
  {
    subjectId: "programovani",
    subjectName: "Programování",
    questionsFile: "programming-questions.json",
    topicsFile: "programming-topics.json",
  },
  {
    subjectId: "weby",
    subjectName: "Webové aplikace",
    questionsFile: "web-questions.json",
    topicsFile: "web-topics.json",
  },
];

function loadJson(filename) {
  const url = new URL(`./seeds/${filename}`, import.meta.url);

  if (!existsSync(url)) return null;

  const data = JSON.parse(readFileSync(url, "utf8"));

  if (!Array.isArray(data)) {
    throw new Error(`${filename} musí obsahovat JSON pole.`);
  }

  return data;
}

try {
  const insertSubject = db.prepare(`
    INSERT INTO subjects (id, name, position)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      position = excluded.position
  `);

  const insertTopic = db.prepare(`
    INSERT INTO topics (id, subject_id, name, position)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      subject_id = excluded.subject_id,
      name = excluded.name,
      position = excluded.position
  `);

  const insertCard = db.prepare(`
    INSERT INTO cards (id, topic_id, theme, question, answer)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      topic_id = excluded.topic_id,
      theme = excluded.theme,
      question = excluded.question,
      answer = excluded.answer
  `);

  transaction(db, () => {
    let totalQuestions = 0;
    let totalTopics = 0;

    for (const [index, source] of sources.entries()) {
      const questions = loadJson(source.questionsFile);

      if (!questions) {
        console.log(`Přeskakuji ${source.questionsFile}`);
        continue;
      }

      const topics = loadJson(source.topicsFile);

      insertSubject.run(
        source.subjectId,
        source.subjectName,
        index
      );

      // Načtení maturitních okruhů
      if (topics) {
        for (const topic of topics) {
          if (!topic.id || !topic.name) {
            throw new Error(`Neplatný okruh v ${source.topicsFile}`);
          }

          if (topic.subjectId && topic.subjectId !== source.subjectId) {
            throw new Error(`Nesprávný subjectId u okruhu ${topic.id}`);
          }

          insertTopic.run(
            topic.id,
            source.subjectId,
            topic.name,
            topic.position ?? 0
          );
        }

        totalTopics += topics.length;
      } else {
        // Pokud topics.json neexistuje, vytvoří témata z otázek
        const generatedTopics = new Map();

        for (const question of questions) {
          if (!generatedTopics.has(question.topicId)) {
            generatedTopics.set(question.topicId, question.theme);
          }
        }

        let position = 0;

        for (const [id, name] of generatedTopics) {
          insertTopic.run(id, source.subjectId, name, position++);
        }

        totalTopics += generatedTopics.size;
      }

      // Načtení otázek
      for (const question of questions) {
        if (
          !question.id ||
          !question.topicId ||
          !question.question ||
          !question.answer
        ) {
          throw new Error(`Neplatná otázka v ${source.questionsFile}`);
        }

        insertCard.run(
          question.id,
          question.topicId,
          question.theme ?? "",
          question.question,
          question.answer
        );
      }

      totalQuestions += questions.length;

      console.log(
        `${source.subjectName}: ${questions.length} otázek`
      );
    }

    console.log("-----------------------------");
    console.log(`Celkem okruhů: ${totalTopics}`);
    console.log(`Celkem otázek: ${totalQuestions}`);
    console.log("Import dokončen.");
  });
} catch (error) {
  console.error("Chyba při importu:", error.message);
  process.exitCode = 1;
} finally {
  db.close();
}
