PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  case_number TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL DEFAULT 'received',
  accepted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  plc TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL,
  desired TEXT NOT NULL,
  photo TEXT NOT NULL DEFAULT '',
  gxdata TEXT NOT NULL DEFAULT '',
  zip_name TEXT NOT NULL DEFAULT '',
  zip_size INTEGER NOT NULL DEFAULT 0,
  zip_storage_mode TEXT NOT NULL DEFAULT 'pending',
  zip_object_key TEXT,

  admin_mail_status TEXT NOT NULL DEFAULT 'pending',
  admin_mail_started_at TEXT,
  admin_mail_sent_at TEXT,
  admin_mail_provider_id TEXT,

  customer_mail_status TEXT NOT NULL DEFAULT 'pending',
  customer_mail_started_at TEXT,
  customer_mail_sent_at TEXT,
  customer_mail_provider_id TEXT,

  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_consultations_case_number
  ON consultations(case_number);
CREATE INDEX IF NOT EXISTS idx_consultations_state
  ON consultations(state);
CREATE INDEX IF NOT EXISTS idx_consultations_updated_at
  ON consultations(updated_at);

CREATE TABLE IF NOT EXISTS consultation_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_at TEXT NOT NULL,
  detail TEXT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_consultation_events_consultation_id
  ON consultation_events(consultation_id, event_at);
