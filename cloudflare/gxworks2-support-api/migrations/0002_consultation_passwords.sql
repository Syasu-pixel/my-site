CREATE TABLE IF NOT EXISTS consultation_passwords (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  consultation_id INTEGER NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  notification_status TEXT NOT NULL DEFAULT 'pending',
  notification_sent_at TEXT,
  notification_provider_id TEXT,
  last_error TEXT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id)
);

CREATE INDEX IF NOT EXISTS idx_consultation_passwords_consultation_id
  ON consultation_passwords(consultation_id);
