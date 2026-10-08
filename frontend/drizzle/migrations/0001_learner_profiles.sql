CREATE TABLE IF NOT EXISTS learnloop_learner_profiles (
  user_id INTEGER PRIMARY KEY NOT NULL,
  profile_json TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
