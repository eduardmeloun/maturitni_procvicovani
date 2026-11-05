CREATE TABLE password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
) STRICT;
CREATE INDEX password_resets_user ON password_resets(user_id);
