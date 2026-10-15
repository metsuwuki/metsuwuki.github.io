PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS guestbook (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 50),
  message TEXT NOT NULL CHECK(length(message) BETWEEN 2 AND 500),
  avatar TEXT NOT NULL DEFAULT 'profile' CHECK(avatar IN ('profile','profile1','profile2','profile3','profile4','profile5','profile6','profile7')),
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible','hidden')),
  submitter_hash TEXT
);
CREATE INDEX IF NOT EXISTS guestbook_status_created_idx ON guestbook(status, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS visitors (
  visitor_hash TEXT PRIMARY KEY,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS visitors_last_seen_idx ON visitors(last_seen DESC);

CREATE TABLE IF NOT EXISTS sessions (
  session_hash TEXT PRIMARY KEY,
  visitor_hash TEXT NOT NULL REFERENCES visitors(visitor_hash) ON DELETE CASCADE,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_first_seen_idx ON sessions(first_seen DESC);
CREATE INDEX IF NOT EXISTS sessions_visitor_idx ON sessions(visitor_hash, first_seen DESC);

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dedup_key TEXT NOT NULL UNIQUE,
  visitor_hash TEXT NOT NULL REFERENCES visitors(visitor_hash) ON DELETE CASCADE,
  session_hash TEXT NOT NULL REFERENCES sessions(session_hash) ON DELETE CASCADE,
  path TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS page_views_occurred_idx ON page_views(occurred_at DESC);
CREATE INDEX IF NOT EXISTS page_views_visitor_occurred_idx ON page_views(visitor_hash, occurred_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key_hash TEXT NOT NULL,
  action TEXT NOT NULL,
  bucket_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY(key_hash, action, bucket_start)
);
CREATE INDEX IF NOT EXISTS rate_limits_bucket_idx ON rate_limits(bucket_start);
