"use client";

import { useState } from "react";
import type { ShopItem } from "@/lib/db";

type Props = {
  items: ShopItem[];
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
};

function ItemForm({
  item,
  saveItem,
  onClose,
}: {
  item?: ShopItem;
  saveItem: (fd: FormData) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <form
      action={async (fd) => {
        await saveItem(fd);
        onClose();
      }}
      className="bg-warm-white border border-parchment p-5 mb-4 space-y-3"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Name *</label>
          <input
            name="name"
            defaultValue={item?.name ?? ""}
            required
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Price *</label>
          <input
            name="price"
            defaultValue={item?.price ?? ""}
            placeholder="$12.00"
            required
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Category *</label>
          <input
            name="category"
            defaultValue={item?.category ?? ""}
            required
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Sort Order</label>
          <input
            type="number"
            name="sort_order"
            defaultValue={item?.sort_order ?? 0}
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Image Path</label>
        <input
          name="image_path"
          defaultValue={item?.image_path ?? ""}
          placeholder="/images/product.jpg"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Order Link *</label>
        <input
          name="link"
          defaultValue={item?.link ?? ""}
          required
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-brown cursor-pointer">
        <input type="hidden" name="visible" value="false" />
        <input
          type="checkbox"
          name="visible"
          value="true"
          defaultChecked={item?.visible ?? true}
          className="accent-rose"
          onChange={(e) => {
            const hidden = e.currentTarget.previousElementSibling as HTMLInputElement;
            hidden.disabled = e.currentTarget.checked;
          }}
        />
        Visible on shop page
      </label>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="px-4 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer">
          {item ? "Save Changes" : "Add Item"}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ItemRow({
  item,
  saveItem,
  removeItem,
}: {
  item: ShopItem;
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <ItemForm item={item} saveItem={saveItem} onClose={() => setEditing(false)} />;
  }

  return (
    <div className="bg-cream border border-parchment p-4 flex items-center gap-4 justify-between">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif text-mocha">{item.name}</span>
          <span className="text-xs bg-blush border border-parchment px-2 py-0.5 text-rose tracking-widest uppercase">
            {item.category}
          </span>
          {!item.visible && (
            <span className="text-[10px] uppercase tracking-widest text-brown/30 border border-parchment px-1.5 py-0.5">
              hidden
            </span>
          )}
        </div>
        <p className="text-sm text-rose font-semibold mt-0.5">{item.price}</p>
        {item.image_path && (
          <p className="text-xs text-brown/40 mt-0.5 font-mono">{item.image_path}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-brown/40 hover:text-rose tracking-widest uppercase cursor-pointer"
        >
          Edit
        </button>
        <form action={removeItem}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="text-xs text-brown/30 hover:text-red-400 tracking-widest uppercase cursor-pointer"
            onClick={(e) => {
              if (!confirm(`Delete "${item.name}"?`)) e.preventDefault();
            }}
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ShopAdminClient({ items, saveItem, removeItem }: Props) {
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-brown/50">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-rose border border-rose/50 px-4 py-2 hover:bg-blush transition-colors tracking-widest uppercase cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {adding && (
        <ItemForm saveItem={saveItem} onClose={() => setAdding(false)} />
      )}

      <div className="space-y-3">
        {items.length === 0 && !adding && (
          <div className="text-center py-16 border border-dashed border-parchment bg-cream/40">
            <p className="text-brown/50 font-light">No shop items yet.</p>
            <p className="text-sm text-brown/35 mt-1">
              Use “+ Add Item” to list your first product.
            </p>
          </div>
        )}
        {items.map((item) => (
          <ItemRow key={item.id} item={item} saveItem={saveItem} removeItem={removeItem} />
        ))}
      </div>
    </div>
  );
}
