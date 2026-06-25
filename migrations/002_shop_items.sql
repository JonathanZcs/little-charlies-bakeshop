CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  image_path TEXT,
  link TEXT NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
