# Database Migrations

Run these against your Neon database in order. Use the Neon console SQL editor or psql:

```bash
psql $DATABASE_URL < migrations/001_menu_tables.sql
psql $DATABASE_URL < migrations/002_shop_items.sql
psql $DATABASE_URL < migrations/003_recipes.sql
```

All migrations use `CREATE TABLE IF NOT EXISTS` so they are safe to re-run.

## What each migration adds

| File | Tables |
|------|--------|
| `001_menu_tables.sql` | `menu_cards`, `menu_items` |
| `002_shop_items.sql` | `shop_items` |
| `003_recipes.sql` | `recipes`, `recipe_ingredients` |

## After running migrations

- The public `/menu` page still reads from hardcoded data until you seed `menu_cards` / `menu_items` and swap the page to read from the DB.
- The `/admin/menu` page shows a notice about this.
- The `/admin/shop` page manages `shop_items`; the public `/shop` page still reads hardcoded data until the DB is seeded.
- The `/admin/recipes` page is fully functional immediately after running `003_recipes.sql`.
