DROP TABLE IF EXISTS items;

CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  batch TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_bdt REAL NOT NULL,
  expiry TEXT NOT NULL,
  returned INTEGER NOT NULL DEFAULT 0,
  returned_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON medicines(expiry);
CREATE INDEX IF NOT EXISTS idx_medicines_returned ON medicines(returned);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
