import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";
import {
  getMenuCardsFull,
  getMenuItemsFull,
  upsertMenuCard,
  upsertMenuItem,
  deleteMenuItem,
  deleteMenuCard,
} from "@/lib/db";
import type { MenuCard, MenuItem } from "@/lib/db";
import AdminNav from "../AdminNav";
import MenuSection from "./MenuSection";

export const metadata = { title: "Admin — Menu Management" };
export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const [cards, items] = await Promise.all([getMenuCardsFull(), getMenuItemsFull()]);

  const sections = ["bakery", "breakfast", "drinks"] as const;
  const cardsBySection = Object.fromEntries(
    sections.map((s) => [s, cards.filter((c) => c.section === s)])
  ) as Record<string, MenuCard[]>;

  const itemsByCard = Object.fromEntries(
    cards.map((c) => [c.id, items.filter((i) => i.card_id === c.id)])
  ) as Record<string, MenuItem[]>;

  // Server actions
  async function saveCard(formData: FormData) {
    "use server";
    const id = formData.get("id") as string | null;
    await upsertMenuCard({
      id: id || undefined,
      section: formData.get("section") as string,
      card_name: formData.get("card_name") as string,
      note: (formData.get("note") as string) || null,
      visible: formData.get("visible") === "true",
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    redirect("/admin/menu");
  }

  async function saveItem(formData: FormData) {
    "use server";
    const id = formData.get("id") as string | null;
    await upsertMenuItem({
      id: id || undefined,
      card_id: formData.get("card_id") as string,
      item_name: formData.get("item_name") as string,
      description: (formData.get("description") as string) || null,
      price: (formData.get("price") as string) || null,
      visible: formData.get("visible") === "true",
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    redirect("/admin/menu");
  }

  async function removeItem(formData: FormData) {
    "use server";
    await deleteMenuItem(formData.get("id") as string);
    redirect("/admin/menu");
  }

  async function removeCard(formData: FormData) {
    "use server";
    await deleteMenuCard(formData.get("id") as string);
    redirect("/admin/menu");
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Menu Management</span>
        </div>
      </header>

      <AdminNav active="Menu" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* DB migration notice */}
        <div className="bg-amber-50 border border-amber-200 px-5 py-4 mb-8 text-sm text-amber-800">
          <strong className="tracking-wide uppercase text-xs">Before using this page:</strong>
          <p className="mt-1 font-light">
            Changes here will take effect once the menu is migrated to the database. Run{" "}
            <code className="bg-amber-100 px-1 font-mono text-xs">migrations/001_menu_tables.sql</code>{" "}
            against your Neon database first, then seed the tables from the hardcoded menu data.
            The public <code className="bg-amber-100 px-1 font-mono text-xs">/menu</code> page still reads
            from hardcoded arrays until that migration is complete.
          </p>
        </div>

        {sections.map((section) => (
          <MenuSection
            key={section}
            section={section}
            cards={cardsBySection[section] ?? []}
            itemsByCard={itemsByCard}
            saveCard={saveCard}
            saveItem={saveItem}
            removeItem={removeItem}
            removeCard={removeCard}
          />
        ))}
      </div>
    </div>
  );
}
