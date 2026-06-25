import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";
import { getShopItemsFull, upsertShopItem, deleteShopItem } from "@/lib/db";
import type { ShopItem } from "@/lib/db";
import AdminNav from "../AdminNav";
import ShopAdminClient from "./ShopAdminClient";

export const metadata = { title: "Admin — Shop Items" };
export const dynamic = "force-dynamic";

export default async function AdminShopPage() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const items = await getShopItemsFull();

  async function saveItem(formData: FormData) {
    "use server";
    const id = formData.get("id") as string | null;
    await upsertShopItem({
      id: id || undefined,
      name: formData.get("name") as string,
      price: formData.get("price") as string,
      category: formData.get("category") as string,
      image_path: (formData.get("image_path") as string) || null,
      link: formData.get("link") as string,
      visible: formData.get("visible") === "true",
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    redirect("/admin/shop");
  }

  async function removeItem(formData: FormData) {
    "use server";
    await deleteShopItem(formData.get("id") as string);
    redirect("/admin/shop");
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Shop Items</span>
        </div>
      </header>

      <AdminNav active="Shop" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-8 text-xs text-brown/40 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          {items.length} item{items.length !== 1 ? "s" : ""} · changes are live immediately
        </div>

        <ShopAdminClient items={items} saveItem={saveItem} removeItem={removeItem} />
      </div>
    </div>
  );
}
