CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL COLLATE NOCASE UNIQUE,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  class_name TEXT NOT NULL DEFAULT '',
  field TEXT NOT NULL DEFAULT 'Informační technologie',
  avatar_url TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
) STRICT;
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
) STRICT;
CREATE INDEX sessions_user ON sessions(user_id);
CREATE TABLE subjects (id TEXT PRIMARY KEY, name TEXT NOT NULL, position INTEGER NOT NULL DEFAULT 0) STRICT;
CREATE TABLE topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
) STRICT;
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  topic_id TEXT NOT NULL REFERENCES topics(id),
  theme TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK(type IN ('text','code','image','choice')),
  extra_json TEXT NOT NULL DEFAULT '{}'
) STRICT;
CREATE INDEX topics_subject ON topics(subject_id);
CREATE INDEX cards_topic ON cards(topic_id);
CREATE TABLE progress (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES cards(id),
  status TEXT NOT NULL CHECK(status IN ('known','unknown','review')),
  updated_at TEXT NOT NULL,
  PRIMARY KEY(user_id, card_id)
) STRICT;
CREATE TABLE attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL REFERENCES cards(id),
  status TEXT NOT NULL CHECK(status IN ('known','unknown','review')),
  xp INTEGER NOT NULL CHECK(xp >= 0),
  study_day TEXT NOT NULL,
  created_at TEXT NOT NULL
) STRICT;
CREATE INDEX attempts_user_day ON attempts(user_id, study_day);
CREATE INDEX attempts_user_card ON attempts(user_id, card_id);
