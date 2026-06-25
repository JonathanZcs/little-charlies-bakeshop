"use client";

import { useState } from "react";
import type { MenuCard, MenuItem } from "@/lib/db";

type Props = {
  section: string;
  cards: MenuCard[];
  itemsByCard: Record<string, MenuItem[]>;
  saveCard: (formData: FormData) => Promise<void>;
  saveItem: (formData: FormData) => Promise<void>;
  removeItem: (formData: FormData) => Promise<void>;
  removeCard: (formData: FormData) => Promise<void>;
};

function ItemRow({
  item,
  saveItem,
  removeItem,
}: {
  item: MenuItem;
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-parchment/50 last:border-0 gap-4">
        <div className="flex-1 min-w-0">
          <span className="text-sm text-brown">{item.item_name}</span>
          {item.description && (
            <span className="text-xs text-brown/50 italic ml-2">{item.description}</span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {item.price && <span className="text-sm text-rose font-semibold">{item.price}</span>}
          {!item.visible && (
            <span className="text-[10px] uppercase tracking-widest text-brown/30 border border-parchment px-1.5 py-0.5">
              hidden
            </span>
          )}
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
                if (!confirm(`Delete "${item.item_name}"?`)) e.preventDefault();
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        await saveItem(fd);
        setEditing(false);
      }}
      className="bg-warm-white border border-parchment/60 p-4 my-2 space-y-3"
    >
      <input type="hidden" name="id" value={item.id} />
      <input type="hidden" name="card_id" value={item.card_id} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Name</label>
          <input
            name="item_name"
            defaultValue={item.item_name}
            required
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Price</label>
          <input
            name="price"
            defaultValue={item.price ?? ""}
            placeholder="$12"
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Description</label>
        <input
          name="description"
          defaultValue={item.description ?? ""}
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-brown cursor-pointer">
          <input type="hidden" name="visible" value="false" />
          <input
            type="checkbox"
            name="visible"
            value="true"
            defaultChecked={item.visible}
            className="accent-rose"
            onChange={(e) => {
              const hidden = e.currentTarget.previousElementSibling as HTMLInputElement;
              hidden.disabled = e.currentTarget.checked;
            }}
          />
          Visible
        </label>
        <input
          type="number"
          name="sort_order"
          defaultValue={item.sort_order}
          className="w-20 border border-parchment bg-cream px-2 py-1 text-xs text-brown"
          placeholder="Order"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-4 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddItemForm({
  cardId,
  saveItem,
  onClose,
}: {
  cardId: string;
  saveItem: (fd: FormData) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <form
      action={async (fd) => {
        await saveItem(fd);
        onClose();
      }}
      className="bg-warm-white border border-parchment/60 p-4 mt-3 space-y-3"
    >
      <input type="hidden" name="card_id" value={cardId} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Name *</label>
          <input
            name="item_name"
            required
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Price</label>
          <input
            name="price"
            placeholder="$12"
            className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Description</label>
        <input
          name="description"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <input type="hidden" name="visible" value="true" />
      <input type="hidden" name="sort_order" value="0" />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer"
        >
          Add Item
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CardBlock({
  card,
  items,
  saveCard,
  saveItem,
  removeItem,
  removeCard,
}: {
  card: MenuCard;
  items: MenuItem[];
  saveCard: (fd: FormData) => Promise<void>;
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
  removeCard: (fd: FormData) => Promise<void>;
}) {
  const [editingCard, setEditingCard] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  return (
    <div className="bg-cream border border-parchment p-5 mb-4">
      {/* Card header */}
      {editingCard ? (
        <form
          action={async (fd) => {
            await saveCard(fd);
            setEditingCard(false);
          }}
          className="space-y-3 mb-4"
        >
          <input type="hidden" name="id" value={card.id} />
          <input type="hidden" name="section" value={card.section} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Card Name</label>
              <input
                name="card_name"
                defaultValue={card.card_name}
                required
                className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Sort Order</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={card.sort_order}
                className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Note</label>
            <input
              name="note"
              defaultValue={card.note ?? ""}
              className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-brown cursor-pointer">
            <input type="hidden" name="visible" value="false" />
            <input
              type="checkbox"
              name="visible"
              value="true"
              defaultChecked={card.visible}
              className="accent-rose"
              onChange={(e) => {
                const hidden = e.currentTarget.previousElementSibling as HTMLInputElement;
                hidden.disabled = e.currentTarget.checked;
              }}
            />
            Visible
          </label>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer">
              Save Card
            </button>
            <button type="button" onClick={() => setEditingCard(false)} className="px-4 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer">
              Cancel
            </button>
            <form action={removeCard} className="ml-auto">
              <input type="hidden" name="id" value={card.id} />
              <button
                type="submit"
                className="text-xs text-brown/30 hover:text-red-400 tracking-widest uppercase cursor-pointer"
                onClick={(e) => {
                  if (!confirm(`Delete card "${card.card_name}" and ALL its items?`)) e.preventDefault();
                }}
              >
                Delete Card
              </button>
            </form>
          </div>
        </form>
      ) : (
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-serif text-mocha text-lg">{card.card_name}</h3>
            {card.note && <p className="text-xs text-brown/40 italic mt-0.5">{card.note}</p>}
            {!card.visible && (
              <span className="text-[10px] uppercase tracking-widest text-brown/30 border border-parchment px-1.5 py-0.5 mt-1 inline-block">
                hidden
              </span>
            )}
          </div>
          <button
            onClick={() => setEditingCard(true)}
            className="text-xs text-brown/40 hover:text-rose tracking-widest uppercase cursor-pointer"
          >
            Edit Card
          </button>
        </div>
      )}

      {/* Items */}
      <div>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} saveItem={saveItem} removeItem={removeItem} />
        ))}
      </div>

      {/* Add item */}
      {addingItem ? (
        <AddItemForm cardId={card.id} saveItem={saveItem} onClose={() => setAddingItem(false)} />
      ) : (
        <button
          onClick={() => setAddingItem(true)}
          className="mt-3 text-xs text-rose hover:text-dusty-rose tracking-widest uppercase cursor-pointer"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}

function AddCardForm({
  section,
  saveCard,
  onClose,
}: {
  section: string;
  saveCard: (fd: FormData) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <form
      action={async (fd) => {
        await saveCard(fd);
        onClose();
      }}
      className="bg-cream border border-parchment p-5 mb-4 space-y-3"
    >
      <input type="hidden" name="section" value={section} />
      <input type="hidden" name="visible" value="true" />
      <input type="hidden" name="sort_order" value="0" />
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Card Name *</label>
        <input
          name="card_name"
          required
          className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Note</label>
        <input
          name="note"
          className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer">
          Add Card
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function MenuSection({ section, cards, itemsByCard, saveCard, saveItem, removeItem, removeCard }: Props) {
  const [addingCard, setAddingCard] = useState(false);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-mocha capitalize">{section}</h2>
        <button
          onClick={() => setAddingCard(true)}
          className="text-xs text-rose border border-rose/50 px-3 py-1.5 hover:bg-blush transition-colors tracking-widest uppercase cursor-pointer"
        >
          + Add Card
        </button>
      </div>

      {cards.map((card) => (
        <CardBlock
          key={card.id}
          card={card}
          items={itemsByCard[card.id] ?? []}
          saveCard={saveCard}
          saveItem={saveItem}
          removeItem={removeItem}
          removeCard={removeCard}
        />
      ))}

      {cards.length === 0 && !addingCard && (
        <p className="text-sm text-brown/30 italic py-4">No cards yet. Add one above.</p>
      )}

      {addingCard && (
        <AddCardForm section={section} saveCard={saveCard} onClose={() => setAddingCard(false)} />
      )}
    </div>
  );
}
