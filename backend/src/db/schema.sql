-- AI Support Ticket Triage schema (PostgreSQL / Neon)

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IS NULL OR priority IN ('Low', 'Medium', 'High')),
  category TEXT CHECK (
    category IS NULL OR category IN ('Billing', 'Bug', 'Feature Request', 'Other')
  ),
  suggested_reply TEXT,
  ai_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (ai_status IN ('pending', 'success', 'failed')),
  ai_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets (priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets (category);
