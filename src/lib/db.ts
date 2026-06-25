import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn("[db] DATABASE_URL not set — DB calls will fail until Neon is connected.");
}

export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

export type OrderStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "deposit_paid"
  | "completed";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_type: string;
  event_date: string | null;
  details: string;
  status: OrderStatus;
  admin_note: string | null;
  square_invoice_id: string | null;
  square_invoice_url: string | null;
  deposit_amount_cents: number | null;
  accepted_at: string | null;
  declined_at: string | null;
  deposit_paid_at: string | null;
  image_urls: string[] | null;
};

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_type: string;
  event_date: string | null;
  details: string;
  image_urls?: string[];
}): Promise<Order | null> {
  if (!sql) return null;
  const imageUrlsJson = JSON.stringify(data.image_urls ?? []);
  const rows = await sql`
    INSERT INTO orders (customer_name, customer_phone, customer_email, order_type, event_date, details, image_urls)
    VALUES (${data.customer_name}, ${data.customer_phone}, ${data.customer_email},
            ${data.order_type}, ${data.event_date}, ${data.details}, ${imageUrlsJson}::jsonb)
    RETURNING *
  `;
  return rows[0] as Order;
}

function normalizeEventDate(d: unknown): string | null {
  if (!d) return null;
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10); // trim any time suffix
  return null;
}

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  if (!sql) return [];
  const rows = status
    ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return (rows as Order[]).map((row) => ({ ...row, event_date: normalizeEventDate(row.event_date) }));
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!sql) return null;
  const rows = await sql`SELECT * FROM orders WHERE id = ${id}`;
  return (rows[0] as Order) ?? null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM orders WHERE id = ${id}`;
  return true;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra: Partial<Pick<Order, "admin_note" | "square_invoice_id" | "square_invoice_url" | "deposit_amount_cents">> = {}
): Promise<Order | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  const rows = await sql`
    UPDATE orders SET
      status               = ${status},
      admin_note           = COALESCE(${extra.admin_note ?? null}, admin_note),
      square_invoice_id    = COALESCE(${extra.square_invoice_id ?? null}, square_invoice_id),
      square_invoice_url   = COALESCE(${extra.square_invoice_url ?? null}, square_invoice_url),
      deposit_amount_cents = COALESCE(${extra.deposit_amount_cents ?? null}, deposit_amount_cents),
      accepted_at          = CASE WHEN ${status} = 'accepted' THEN ${now} ELSE accepted_at END,
      declined_at          = CASE WHEN ${status} = 'declined' THEN ${now} ELSE declined_at END,
      deposit_paid_at      = CASE WHEN ${status} = 'deposit_paid' THEN ${now} ELSE deposit_paid_at END
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Order) ?? null;
}

// ── Menu ─────────────────────────────────────────────────────────────────────

export type MenuCard = {
  id: string;
  section: string;
  card_name: string;
  images: string[];
  note: string | null;
  img_class: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  card_id: string;
  item_name: string;
  description: string | null;
  price: string | null;
  image_path: string | null;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export async function getMenuCards(): Promise<MenuCard[]> {
  if (!sql) return [];
  const rows = await sql`
    SELECT * FROM menu_cards WHERE visible = true ORDER BY section, sort_order
  `;
  return rows as MenuCard[];
}

export async function getMenuCardsFull(): Promise<MenuCard[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM menu_cards ORDER BY section, sort_order`;
    return rows as MenuCard[];
  } catch { return []; }
}

export async function getMenuItemsForCard(cardId: string): Promise<MenuItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM menu_items WHERE card_id = ${cardId} ORDER BY sort_order`;
    return rows as MenuItem[];
  } catch { return []; }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM menu_items WHERE visible = true ORDER BY sort_order`;
    return rows as MenuItem[];
  } catch { return []; }
}

export async function getMenuItemsFull(): Promise<MenuItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM menu_items ORDER BY sort_order`;
    return rows as MenuItem[];
  } catch { return []; }
}

export async function upsertMenuCard(data: {
  id?: string;
  section: string;
  card_name: string;
  images?: string[];
  note?: string | null;
  img_class?: string | null;
  sort_order?: number;
  visible?: boolean;
}): Promise<MenuCard | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  if (data.id) {
    const rows = await sql`
      UPDATE menu_cards SET
        section    = ${data.section},
        card_name  = ${data.card_name},
        images     = ${data.images ?? []}::text[],
        note       = ${data.note ?? null},
        img_class  = ${data.img_class ?? null},
        sort_order = ${data.sort_order ?? 0},
        visible    = ${data.visible ?? true},
        updated_at = ${now}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return (rows[0] as MenuCard) ?? null;
  }
  const rows = await sql`
    INSERT INTO menu_cards (section, card_name, images, note, img_class, sort_order, visible, created_at, updated_at)
    VALUES (${data.section}, ${data.card_name}, ${data.images ?? []}::text[], ${data.note ?? null},
            ${data.img_class ?? null}, ${data.sort_order ?? 0}, ${data.visible ?? true}, ${now}, ${now})
    RETURNING *
  `;
  return (rows[0] as MenuCard) ?? null;
}

export async function upsertMenuItem(data: {
  id?: string;
  card_id: string;
  item_name: string;
  description?: string | null;
  price?: string | null;
  image_path?: string | null;
  sort_order?: number;
  visible?: boolean;
}): Promise<MenuItem | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  if (data.id) {
    const rows = await sql`
      UPDATE menu_items SET
        card_id     = ${data.card_id},
        item_name   = ${data.item_name},
        description = ${data.description ?? null},
        price       = ${data.price ?? null},
        image_path  = ${data.image_path ?? null},
        sort_order  = ${data.sort_order ?? 0},
        visible     = ${data.visible ?? true},
        updated_at  = ${now}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return (rows[0] as MenuItem) ?? null;
  }
  const rows = await sql`
    INSERT INTO menu_items (card_id, item_name, description, price, image_path, sort_order, visible, created_at, updated_at)
    VALUES (${data.card_id}, ${data.item_name}, ${data.description ?? null}, ${data.price ?? null},
            ${data.image_path ?? null}, ${data.sort_order ?? 0}, ${data.visible ?? true}, ${now}, ${now})
    RETURNING *
  `;
  return (rows[0] as MenuItem) ?? null;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM menu_items WHERE id = ${id}`;
  return true;
}

export async function deleteMenuCard(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM menu_cards WHERE id = ${id}`;
  return true;
}

// ── Shop Items ────────────────────────────────────────────────────────────────

export type ShopItem = {
  id: string;
  name: string;
  price: string;
  category: string;
  image_path: string | null;
  link: string;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getShopItems(): Promise<ShopItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM shop_items WHERE visible = true ORDER BY sort_order`;
    return rows as ShopItem[];
  } catch { return []; }
}

export async function getShopItemsFull(): Promise<ShopItem[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM shop_items ORDER BY sort_order`;
    return rows as ShopItem[];
  } catch { return []; }
}

export async function upsertShopItem(data: {
  id?: string;
  name: string;
  price: string;
  category: string;
  image_path?: string | null;
  link: string;
  visible?: boolean;
  sort_order?: number;
}): Promise<ShopItem | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  if (data.id) {
    const rows = await sql`
      UPDATE shop_items SET
        name       = ${data.name},
        price      = ${data.price},
        category   = ${data.category},
        image_path = ${data.image_path ?? null},
        link       = ${data.link},
        visible    = ${data.visible ?? true},
        sort_order = ${data.sort_order ?? 0},
        updated_at = ${now}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return (rows[0] as ShopItem) ?? null;
  }
  const rows = await sql`
    INSERT INTO shop_items (name, price, category, image_path, link, visible, sort_order, created_at, updated_at)
    VALUES (${data.name}, ${data.price}, ${data.category}, ${data.image_path ?? null},
            ${data.link}, ${data.visible ?? true}, ${data.sort_order ?? 0}, ${now}, ${now})
    RETURNING *
  `;
  return (rows[0] as ShopItem) ?? null;
}

export async function deleteShopItem(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM shop_items WHERE id = ${id}`;
  return true;
}

// ── Recipes ───────────────────────────────────────────────────────────────────

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  sale_price_cents: number;
  yield_count: number;
  yield_unit: string;
  created_at: string;
  updated_at: string;
};

export type RecipeIngredient = {
  id: string;
  recipe_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  cost_per_unit_cents: number;
  sort_order: number;
  created_at: string;
};

export type RecipeWithIngredients = Recipe & { ingredients: RecipeIngredient[] };

export async function getRecipes(): Promise<Recipe[]> {
  if (!sql) return [];
  try {
    const rows = await sql`SELECT * FROM recipes ORDER BY name`;
    return rows as Recipe[];
  } catch { return []; }
}

export async function getRecipe(id: string): Promise<RecipeWithIngredients | null> {
  if (!sql) return null;
  try {
    const recipes = await sql`SELECT * FROM recipes WHERE id = ${id}`;
    if (!recipes[0]) return null;
    const ingredients = await sql`
      SELECT * FROM recipe_ingredients WHERE recipe_id = ${id} ORDER BY sort_order
    `;
    return { ...(recipes[0] as Recipe), ingredients: ingredients as RecipeIngredient[] };
  } catch { return null; }
}

export async function upsertRecipe(data: {
  id?: string;
  name: string;
  description?: string | null;
  sale_price_cents: number;
  yield_count: number;
  yield_unit: string;
}): Promise<Recipe | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  if (data.id) {
    const rows = await sql`
      UPDATE recipes SET
        name             = ${data.name},
        description      = ${data.description ?? null},
        sale_price_cents = ${data.sale_price_cents},
        yield_count      = ${data.yield_count},
        yield_unit       = ${data.yield_unit},
        updated_at       = ${now}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return (rows[0] as Recipe) ?? null;
  }
  const rows = await sql`
    INSERT INTO recipes (name, description, sale_price_cents, yield_count, yield_unit, created_at, updated_at)
    VALUES (${data.name}, ${data.description ?? null}, ${data.sale_price_cents},
            ${data.yield_count}, ${data.yield_unit}, ${now}, ${now})
    RETURNING *
  `;
  return (rows[0] as Recipe) ?? null;
}

export async function upsertRecipeIngredient(data: {
  id?: string;
  recipe_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  cost_per_unit_cents: number;
  sort_order?: number;
}): Promise<RecipeIngredient | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  if (data.id) {
    const rows = await sql`
      UPDATE recipe_ingredients SET
        ingredient_name   = ${data.ingredient_name},
        quantity          = ${data.quantity},
        unit              = ${data.unit},
        cost_per_unit_cents = ${data.cost_per_unit_cents},
        sort_order        = ${data.sort_order ?? 0}
      WHERE id = ${data.id}
      RETURNING *
    `;
    return (rows[0] as RecipeIngredient) ?? null;
  }
  const rows = await sql`
    INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit, cost_per_unit_cents, sort_order, created_at)
    VALUES (${data.recipe_id}, ${data.ingredient_name}, ${data.quantity}, ${data.unit},
            ${data.cost_per_unit_cents}, ${data.sort_order ?? 0}, ${now})
    RETURNING *
  `;
  return (rows[0] as RecipeIngredient) ?? null;
}

export async function deleteRecipe(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM recipes WHERE id = ${id}`;
  return true;
}

export async function deleteRecipeIngredient(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM recipe_ingredients WHERE id = ${id}`;
  return true;
}
