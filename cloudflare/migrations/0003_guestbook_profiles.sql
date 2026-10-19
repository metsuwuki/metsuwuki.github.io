-- Existing rows belong to the original MetsUwUki guestbook.
-- The DEFAULT keeps legacy clients and imports backward compatible.
ALTER TABLE guestbook ADD COLUMN profile TEXT NOT NULL DEFAULT 'metsuki'
  CHECK(profile IN ('metsuki', 'mika'));

CREATE INDEX IF NOT EXISTS guestbook_profile_status_created_idx
  ON guestbook(profile, status, created_at DESC, id DESC);
