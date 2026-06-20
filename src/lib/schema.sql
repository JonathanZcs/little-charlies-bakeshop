-- Run this once in your Neon SQL Editor after connecting the database.
-- Vercel Dashboard → Storage → (your Neon DB) → SQL Editor → paste & run.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Customer
  customer_name        TEXT NOT NULL,
  customer_phone       TEXT NOT NULL,
  customer_email       TEXT NOT NULL,

  -- Order info
  order_type           TEXT NOT NULL,
  event_date           DATE,
  details              TEXT NOT NULL,

  -- Workflow status
  -- Values: pending | accepted | declined | deposit_paid | completed
  status               TEXT NOT NULL DEFAULT 'pending',

  -- Admin
  admin_note           TEXT,

  -- Square
  square_invoice_id    TEXT,
  square_invoice_url   TEXT,
  deposit_amount_cents INTEGER,

  -- Timestamps
  accepted_at          TIMESTAMPTZ,
  declined_at          TIMESTAMPTZ,
  deposit_paid_at      TIMESTAMPTZ
);

-- Index for fast admin dashboard queries
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
