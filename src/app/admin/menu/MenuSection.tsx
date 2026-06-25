"use client";

import { useState, useRef } from "react";
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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-mocha/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-warm-white border border-parchment w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-serif text-lg text-mocha">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brown/40 hover:text-brown text-2xl leading-none cursor-pointer w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ImageField({ defaultUrl }: { defaultUrl?: string | null }) {
  const [preview, setPreview] = useState(defaultUrl ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Photo</label>

      {preview ? (
        <div className="relative w-full h-44 mb-2 bg-parchment/40 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setPreview("");
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-mocha/70 text-cream text-[10px] tracking-widest uppercase px-2 py-1 hover:bg-mocha cursor-pointer"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 mb-2 border-2 border-dashed border-parchment hover:border-rose/50 transition-colors cursor-pointer bg-cream/50">
          <span className="text-2xl mb-1 text-brown/30">📷</span>
          <span className="text-xs text-brown/40 tracking-widest uppercase">Click to upload photo</span>
          <input
            ref={fileRef}
            type="file"
            name="image_file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      )}

      {/* Hidden file ref when preview is active */}
      {preview && (
        <input
          ref={fileRef}
          type="file"
          name="image_file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
      )}

      <input
        name="image_path"
        value={preview}
        onChange={(e) => setPreview(e.target.value)}
        placeholder="or paste an image URL"
        className="w-full border border-parchment px-3 py-2 text-sm text-brown/60 placeholder:text-brown/30"
      />
    </div>
  );
}

function ItemModal({
  item,
  cardId,
  saveItem,
  removeItem,
  onClose,
}: {
  item: MenuItem | null;
  cardId: string;
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <Modal title={item ? "Edit Item" : "Add Item"} onClose={onClose}>
      <form
        action={async (fd) => {
          await saveItem(fd);
          onClose();
        }}
        className="p-6 space-y-4"
      >
        {item && <input type="hidden" name="id" value={item.id} />}
        <input type="hidden" name="card_id" value={cardId} />
        {!item && <input type="hidden" name="visible" value="true" />}
        {!item && <input type="hidden" name="sort_order" value="0" />}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Name *</label>
            <input
              name="item_name"
              defaultValue={item?.item_name}
              required
              autoFocus
              className="w-full border border-parchment px-3 py-2 text-sm text-brown"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Price</label>
            <input
              name="price"
              defaultValue={item?.price ?? ""}
              placeholder="$12"
              className="w-full border border-parchment px-3 py-2 text-sm text-brown"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Description</label>
          <input
            name="description"
            defaultValue={item?.description ?? ""}
            className="w-full border border-parchment px-3 py-2 text-sm text-brown"
          />
        </div>

        <ImageField defaultUrl={item?.image_path} />

        {item && (
          <div className="flex items-center gap-6">
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
              Visible on menu
            </label>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brown/50 mr-2">Sort</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={item.sort_order}
                className="w-16 border border-parchment px-2 py-1 text-xs text-brown"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-parchment">
          <button
            type="submit"
            className="px-5 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer"
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {item && (
            <form action={removeItem} className="ml-auto">
              <input type="hidden" name="id" value={item.id} />
              <button
                type="submit"
                className="text-xs text-brown/30 hover:text-red-400 tracking-widest uppercase cursor-pointer px-2 py-2"
                onClick={(e) => {
                  if (!confirm(`Delete "${item.item_name}"?`)) e.preventDefault();
                }}
              >
                Delete
              </button>
            </form>
          )}
        </div>
      </form>
    </Modal>
  );
}

function CardModal({
  card,
  section,
  saveCard,
  removeCard,
  onClose,
}: {
  card: MenuCard | null;
  section: string;
  saveCard: (fd: FormData) => Promise<void>;
  removeCard: (fd: FormData) => Promise<void>;
  onClose: () => void;
}) {
  return (
    <Modal title={card ? "Edit Card" : "New Card"} onClose={onClose}>
      <form
        action={async (fd) => {
          await saveCard(fd);
          onClose();
        }}
        className="p-6 space-y-4"
      >
        {card && <input type="hidden" name="id" value={card.id} />}
        <input type="hidden" name="section" value={section} />
        {!card && <input type="hidden" name="visible" value="true" />}
        {!card && <input type="hidden" name="sort_order" value="0" />}

        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Card Name *</label>
          <input
            name="card_name"
            defaultValue={card?.card_name}
            required
            autoFocus
            className="w-full border border-parchment px-3 py-2 text-sm text-brown"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Note</label>
          <input
            name="note"
            defaultValue={card?.note ?? ""}
            placeholder="e.g. gluten-free available on request"
            className="w-full border border-parchment px-3 py-2 text-sm text-brown"
          />
        </div>
        {card && (
          <div className="grid grid-cols-2 gap-3">
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
              Visible on menu
            </label>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brown/50 mr-2">Sort</label>
              <input
                type="number"
                name="sort_order"
                defaultValue={card.sort_order}
                className="w-16 border border-parchment px-2 py-1 text-xs text-brown"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-parchment">
          <button
            type="submit"
            className="px-5 py-2 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer"
          >
            {card ? "Save Changes" : "Create Card"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {card && (
            <form action={removeCard} className="ml-auto">
              <input type="hidden" name="id" value={card.id} />
              <button
                type="submit"
                className="text-xs text-brown/30 hover:text-red-400 tracking-widest uppercase cursor-pointer px-2 py-2"
                onClick={(e) => {
                  if (!confirm(`Delete card "${card.card_name}" and ALL its items?`)) e.preventDefault();
                }}
              >
                Delete Card
              </button>
            </form>
          )}
        </div>
      </form>
    </Modal>
  );
}

function ItemCard({
  item,
  saveItem,
  removeItem,
}: {
  item: MenuItem;
  saveItem: (fd: FormData) => Promise<void>;
  removeItem: (fd: FormData) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="group text-left w-full bg-warm-white border border-parchment hover:border-rose/40 transition-colors overflow-hidden cursor-pointer"
      >
        {item.image_path ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.image_path}
            alt={item.item_name}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="w-full h-36 bg-parchment/40 flex items-center justify-center">
            <span className="text-3xl opacity-30">🎂</span>
          </div>
        )}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-mocha leading-snug">{item.item_name}</span>
            {item.price && (
              <span className="text-sm text-rose font-semibold shrink-0">{item.price}</span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-brown/50 mt-0.5 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            {!item.visible && (
              <span className="text-[9px] uppercase tracking-widest text-brown/30 border border-parchment px-1.5 py-0.5">
                hidden
              </span>
            )}
            <span className="text-[10px] text-rose/60 tracking-widest uppercase ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
          </div>
        </div>
      </button>

      {editing && (
        <ItemModal
          item={item}
          cardId={item.card_id}
          saveItem={saveItem}
          removeItem={removeItem}
          onClose={() => setEditing(false)}
        />
      )}
    </>
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
    <div className="bg-cream border border-parchment mb-5">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-parchment/60">
        <div>
          <h3 className="font-serif text-mocha text-base">{card.card_name}</h3>
          {card.note && <p className="text-xs text-brown/40 italic mt-0.5">{card.note}</p>}
          {!card.visible && (
            <span className="text-[9px] uppercase tracking-widest text-brown/30 border border-parchment px-1.5 py-0.5 mt-1 inline-block">
              hidden
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-brown/30">{items.length} item{items.length !== 1 ? "s" : ""}</span>
          <button
            type="button"
            onClick={() => setAddingItem(true)}
            className="text-xs bg-rose text-cream px-3 py-1.5 tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer"
          >
            + Add Item
          </button>
          <button
            type="button"
            onClick={() => setEditingCard(true)}
            className="text-xs text-brown/40 hover:text-rose tracking-widest uppercase cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Items grid */}
      <div className="p-4">
        {items.length === 0 ? (
          <button
            type="button"
            onClick={() => setAddingItem(true)}
            className="w-full py-8 border-2 border-dashed border-parchment hover:border-rose/40 text-brown/30 text-sm transition-colors cursor-pointer"
          >
            No items yet — click to add the first one
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} saveItem={saveItem} removeItem={removeItem} />
            ))}
          </div>
        )}
      </div>

      {editingCard && (
        <CardModal
          card={card}
          section={card.section}
          saveCard={saveCard}
          removeCard={removeCard}
          onClose={() => setEditingCard(false)}
        />
      )}
      {addingItem && (
        <ItemModal
          item={null}
          cardId={card.id}
          saveItem={saveItem}
          removeItem={removeItem}
          onClose={() => setAddingItem(false)}
        />
      )}
    </div>
  );
}

export default function MenuSection({ section, cards, itemsByCard, saveCard, saveItem, removeItem, removeCard }: Props) {
  const [addingCard, setAddingCard] = useState(false);

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl text-mocha capitalize">{section}</h2>
        <button
          type="button"
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

      {cards.length === 0 && (
        <p className="text-sm text-brown/30 italic py-4">No cards yet — use &quot;+ Add Card&quot; to create one.</p>
      )}

      {addingCard && (
        <CardModal
          card={null}
          section={section}
          saveCard={saveCard}
          removeCard={removeCard}
          onClose={() => setAddingCard(false)}
        />
      )}
    </div>
  );
}
