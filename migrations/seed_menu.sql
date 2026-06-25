-- Seed menu_cards and menu_items from hardcoded menu data
-- Run this after 001_menu_tables.sql
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING with stable UUIDs

-- ── Bakery ────────────────────────────────────────────────────────────────────

INSERT INTO menu_cards (id, section, card_name, images, note, sort_order, visible)
VALUES
  ('a1000001-0000-0000-0000-000000000001', 'bakery', 'Decorated Cookies',
   ARRAY['/images/menu-cookies.jpg'],
   'Custom designs welcome. Lead time required.', 1, true),
  ('a1000001-0000-0000-0000-000000000002', 'bakery', 'Cakes & Cupcakes',
   ARRAY['/images/menu-cake.jpg','/images/cupcakes-1.jpg','/images/cupcakes-2.jpg','/images/cupcakes-3.jpg'],
   'Custom cakes require deposit to confirm.', 2, true),
  ('a1000001-0000-0000-0000-000000000003', 'bakery', 'Sourdough',
   ARRAY['/images/menu-sourdough.jpeg','/images/sourdough-loaf.jpg'],
   NULL, 3, true),
  ('a1000001-0000-0000-0000-000000000004', 'bakery', 'Pies',
   ARRAY['/images/menu-pies-v2.jpg'],
   'Whole pies only. Pre-order required.', 4, true),
  ('a1000001-0000-0000-0000-000000000005', 'bakery', 'Cheesecake',
   ARRAY['/images/cheesecake-whole.jpg','/images/cheesecake-slice.jpg'],
   'Pre-order recommended.', 5, true),
  ('a1000001-0000-0000-0000-000000000006', 'bakery', 'French Macarons',
   ARRAY['/images/menu-macarons.jpg','/images/macarons.jpg'],
   'Seasonal flavors. Pre-order recommended.', 6, true)
ON CONFLICT (id) DO NOTHING;

-- ── Breakfast ─────────────────────────────────────────────────────────────────

INSERT INTO menu_cards (id, section, card_name, images, note, sort_order, visible)
VALUES
  ('b2000002-0000-0000-0000-000000000001', 'breakfast', 'Warm Breakfast',
   ARRAY['/images/avocado-toast.jpg','/images/breakfast-focaccia.jpg','/images/sourdough-toast.jpg'],
   'Served Tue – Sat. Items subject to daily availability. Pricing in store.', 1, true),
  ('b2000002-0000-0000-0000-000000000002', 'breakfast', 'Sourdough Bagels',
   ARRAY['/images/bagels-1.jpg','/images/bagels-2.jpg','/images/bagels.jpg'],
   'Made in-house daily. Pricing in store.', 2, true)
ON CONFLICT (id) DO NOTHING;

-- ── Drinks ────────────────────────────────────────────────────────────────────

INSERT INTO menu_cards (id, section, card_name, images, note, img_class, sort_order, visible)
VALUES
  ('c3000003-0000-0000-0000-000000000001', 'drinks', 'Lattes',
   ARRAY['/images/latte.jpg','/images/coffee-1.jpg','/images/coffee-2.jpg','/images/coffee-4.jpg','/images/coffee-6.jpg'],
   'Available iced or hot. More flavors available in store.', 'object-top', 1, true),
  ('c3000003-0000-0000-0000-000000000002', 'drinks', 'Specialty Drinks',
   ARRAY['/images/matcha.jpg','/images/coffee-6.jpg'],
   'Seasonal specials rotate regularly. Pricing in store.', 'object-top', 2, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Decorated Cookies ───────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0001-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000001', '1 Dozen — Standard',      '$45',      1, true),
  ('i0001-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000001', '1 Dozen — Custom Shape',  'From $50', 2, true),
  ('i0001-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000001', 'Gift Set',                'From $30', 3, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Cakes & Cupcakes ─────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0002-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000002', '6in Double Layer',     '$55',      1, true),
  ('i0002-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000002', '6in Triple Layer',     '$65',      2, true),
  ('i0002-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000002', 'Cupcakes (1 Dozen)',   'From $36', 3, true),
  ('i0002-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000002', 'Smash Cake',           'From $25', 4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Sourdough ────────────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0003-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000003', 'Sourdough Loaf',       '$12', 1, true),
  ('i0003-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000003', 'Jumbo Cinnamon Roll',  '$6',  2, true),
  ('i0003-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000003', 'Scone',                '$4',  3, true),
  ('i0003-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000003', 'Sourdough Starter',    '$5',  4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Pies ─────────────────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0004-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000004', 'Seasonal Fruit Pie', 'From $28', 1, true),
  ('i0004-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000004', 'Cream Pie',          'From $28', 2, true),
  ('i0004-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000004', 'Nut Pie',            'From $30', 3, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Cheesecake ───────────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0005-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000005', 'Classic New York',    '$40',    1, true),
  ('i0005-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000005', 'Seasonal Flavor',     '$42',    2, true),
  ('i0005-0000-0000-0000-000000000003', 'a1000001-0000-0000-0000-000000000005', 'Shooters (6pk)',       '$22.50', 3, true),
  ('i0005-0000-0000-0000-000000000004', 'a1000001-0000-0000-0000-000000000005', 'Whole 9in',            '$55',    4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — French Macarons ──────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, price, sort_order, visible)
VALUES
  ('i0006-0000-0000-0000-000000000001', 'a1000001-0000-0000-0000-000000000006', '6-Pack',   '$18', 1, true),
  ('i0006-0000-0000-0000-000000000002', 'a1000001-0000-0000-0000-000000000006', '1 Dozen',  '$34', 2, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Warm Breakfast ───────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, description, sort_order, visible)
VALUES
  ('i0007-0000-0000-0000-000000000001', 'b2000002-0000-0000-0000-000000000001', 'Breakfast Burrito',
   'eggs, potato, spinach, onion, garlic, cheese blend, bacon', 1, true),
  ('i0007-0000-0000-0000-000000000002', 'b2000002-0000-0000-0000-000000000001', 'Avocado Toast',
   'smashed avocado, everything seasoning on sourdough', 2, true),
  ('i0007-0000-0000-0000-000000000003', 'b2000002-0000-0000-0000-000000000001', 'Breakfast Focaccia',
   NULL, 3, true),
  ('i0007-0000-0000-0000-000000000004', 'b2000002-0000-0000-0000-000000000001', 'Pepperoni Roll',
   NULL, 4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Sourdough Bagels ─────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, sort_order, visible)
VALUES
  ('i0008-0000-0000-0000-000000000001', 'b2000002-0000-0000-0000-000000000002', 'Cream Cheese',             1, true),
  ('i0008-0000-0000-0000-000000000002', 'b2000002-0000-0000-0000-000000000002', 'Butter',                   2, true),
  ('i0008-0000-0000-0000-000000000003', 'b2000002-0000-0000-0000-000000000002', 'Bacon Chive Cream Cheese', 3, true),
  ('i0008-0000-0000-0000-000000000004', 'b2000002-0000-0000-0000-000000000002', 'Blueberry Cream Cheese',   4, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Lattes ───────────────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, sort_order, visible)
VALUES
  ('i0009-0000-0000-0000-000000000001', 'c3000003-0000-0000-0000-000000000001', 'White Chocolate Caramel',       1, true),
  ('i0009-0000-0000-0000-000000000002', 'c3000003-0000-0000-0000-000000000001', 'Cinnamon Roll',                 2, true),
  ('i0009-0000-0000-0000-000000000003', 'c3000003-0000-0000-0000-000000000001', 'Cookie Butter',                 3, true),
  ('i0009-0000-0000-0000-000000000004', 'c3000003-0000-0000-0000-000000000001', 'Brown Sugar Shaken Espresso',   4, true),
  ('i0009-0000-0000-0000-000000000005', 'c3000003-0000-0000-0000-000000000001', 'Banana Bread Dirty Chai',       5, true)
ON CONFLICT (id) DO NOTHING;

-- ── Menu items — Specialty Drinks ─────────────────────────────────────────────

INSERT INTO menu_items (id, card_id, item_name, description, sort_order, visible)
VALUES
  ('i0010-0000-0000-0000-000000000001', 'c3000003-0000-0000-0000-000000000002', 'Dirty Coconut',
   'Diet Coke, vanilla, lime, coconut cream', 1, true),
  ('i0010-0000-0000-0000-000000000002', 'c3000003-0000-0000-0000-000000000002', 'Strawberry Matcha',
   NULL, 2, true),
  ('i0010-0000-0000-0000-000000000003', 'c3000003-0000-0000-0000-000000000002', 'Honey Matcha',
   NULL, 3, true)
ON CONFLICT (id) DO NOTHING;
