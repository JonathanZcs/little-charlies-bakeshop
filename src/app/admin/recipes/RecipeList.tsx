"use client";

import { useState } from "react";
import type { RecipeWithIngredients } from "@/lib/db";

type Ingredient = {
  ingredient_name: string;
  quantity: string;
  unit: string;
  cost_per_unit: string;
};

function cents(n: number) {
  return (n / 100).toFixed(2);
}

function calcMargin(recipe: RecipeWithIngredients) {
  const totalIngredientCostCents = recipe.ingredients.reduce(
    (sum, ing) => sum + ing.quantity * ing.cost_per_unit_cents,
    0
  );
  const costPerUnit = recipe.yield_count > 0 ? totalIngredientCostCents / recipe.yield_count : 0;
  const profitPerUnit = recipe.sale_price_cents - costPerUnit;
  const marginPct =
    recipe.sale_price_cents > 0 ? (profitPerUnit / recipe.sale_price_cents) * 100 : 0;
  return { totalIngredientCostCents, costPerUnit, profitPerUnit, marginPct };
}

function MarginBadge({ pct }: { pct: number }) {
  const color =
    pct >= 60
      ? "bg-green-100 text-green-700 border-green-200"
      : pct >= 40
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-red-100 text-red-700 border-red-200";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 border ${color}`}>
      {pct.toFixed(1)}% margin
    </span>
  );
}

function RecipeCard({
  recipe,
  removeRecipe,
}: {
  recipe: RecipeWithIngredients;
  removeRecipe: (fd: FormData) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const { costPerUnit, profitPerUnit, marginPct } = calcMargin(recipe);

  return (
    <div className="bg-cream border border-parchment p-5 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="font-serif text-mocha text-lg">{recipe.name}</h3>
            <MarginBadge pct={marginPct} />
          </div>
          {recipe.description && (
            <p className="text-xs text-brown/50 italic mt-0.5">{recipe.description}</p>
          )}
          <p className="text-xs text-brown/50 mt-1">
            Makes {recipe.yield_count} {recipe.yield_unit}
          </p>
        </div>
        <div className="text-right shrink-0 space-y-1">
          <p className="text-sm text-rose font-semibold">${cents(recipe.sale_price_cents)} sale</p>
          <p className="text-sm text-brown/60">${cents(costPerUnit)} cost/unit</p>
          <p className={`text-sm font-medium ${profitPerUnit >= 0 ? "text-green-700" : "text-red-600"}`}>
            ${cents(profitPerUnit)} profit/unit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-parchment">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-rose hover:text-dusty-rose tracking-widest uppercase cursor-pointer"
        >
          {expanded ? "▲ Hide Ingredients" : "▼ Show Ingredients"}
        </button>
        <form action={removeRecipe}>
          <input type="hidden" name="id" value={recipe.id} />
          <button
            type="submit"
            className="text-xs text-brown/30 hover:text-red-400 tracking-widest uppercase cursor-pointer"
            onClick={(e) => {
              if (!confirm(`Delete recipe "${recipe.name}"?`)) e.preventDefault();
            }}
          >
            Delete
          </button>
        </form>
      </div>

      {expanded && (
        <div className="mt-4 bg-warm-white border border-parchment/60 p-4">
          {recipe.ingredients.length === 0 ? (
            <p className="text-xs text-brown/30 italic">No ingredients added yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-brown/40 border-b border-parchment">
                  <th className="text-left pb-2">Ingredient</th>
                  <th className="text-right pb-2">Qty</th>
                  <th className="text-left pb-2 pl-2">Unit</th>
                  <th className="text-right pb-2">Cost/unit</th>
                  <th className="text-right pb-2">Line cost</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ing) => (
                  <tr key={ing.id} className="border-b border-parchment/40 last:border-0">
                    <td className="py-1.5 text-brown">{ing.ingredient_name}</td>
                    <td className="py-1.5 text-right text-brown/70">{ing.quantity}</td>
                    <td className="py-1.5 pl-2 text-brown/70">{ing.unit}</td>
                    <td className="py-1.5 text-right text-brown/70">${cents(ing.cost_per_unit_cents)}</td>
                    <td className="py-1.5 text-right text-brown font-medium">
                      ${cents(ing.quantity * ing.cost_per_unit_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function IngredientRow({
  index,
  ingredient,
  onChange,
  onRemove,
}: {
  index: number;
  ingredient: Ingredient;
  onChange: (i: number, field: keyof Ingredient, value: string) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end">
      <div className="col-span-4">
        {index === 0 && (
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Ingredient</label>
        )}
        <input
          value={ingredient.ingredient_name}
          onChange={(e) => onChange(index, "ingredient_name", e.target.value)}
          placeholder="All-purpose flour"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="col-span-2">
        {index === 0 && (
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Qty</label>
        )}
        <input
          type="number"
          step="any"
          value={ingredient.quantity}
          onChange={(e) => onChange(index, "quantity", e.target.value)}
          placeholder="2"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="col-span-2">
        {index === 0 && (
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Unit</label>
        )}
        <input
          value={ingredient.unit}
          onChange={(e) => onChange(index, "unit", e.target.value)}
          placeholder="cups"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="col-span-3">
        {index === 0 && (
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Cost / unit ($)</label>
        )}
        <input
          type="number"
          step="0.01"
          value={ingredient.cost_per_unit}
          onChange={(e) => onChange(index, "cost_per_unit", e.target.value)}
          placeholder="0.12"
          className="w-full border border-parchment bg-cream px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>
      <div className="col-span-1 flex justify-end pb-0">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-brown/30 hover:text-red-400 text-lg leading-none cursor-pointer"
          aria-label="Remove ingredient"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function AddRecipeForm({ saveRecipe, onClose }: { saveRecipe: (fd: FormData) => Promise<void>; onClose: () => void }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { ingredient_name: "", quantity: "", unit: "", cost_per_unit: "" },
  ]);
  const [salePriceDollars, setSalePriceDollars] = useState("");
  const [yieldCount, setYieldCount] = useState("1");

  function updateIngredient(i: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing)));
  }

  function addRow() {
    setIngredients((prev) => [...prev, { ingredient_name: "", quantity: "", unit: "", cost_per_unit: "" }]);
  }

  function removeRow(i: number) {
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  }

  const totalCostCents = ingredients.reduce((sum, ing) => {
    const qty = parseFloat(ing.quantity) || 0;
    const cost = parseFloat(ing.cost_per_unit) || 0;
    return sum + qty * cost * 100;
  }, 0);
  const yieldNum = parseFloat(yieldCount) || 1;
  const costPerUnit = totalCostCents / yieldNum;
  const salePriceCents = (parseFloat(salePriceDollars) || 0) * 100;
  const profitPerUnit = salePriceCents - costPerUnit;
  const marginPct = salePriceCents > 0 ? (profitPerUnit / salePriceCents) * 100 : 0;

  return (
    <form
      action={async (fd) => {
        fd.set("ingredients_json", JSON.stringify(ingredients));
        await saveRecipe(fd);
        onClose();
      }}
      className="bg-cream border border-parchment p-6 mb-6 space-y-5"
    >
      <h3 className="font-serif text-mocha text-xl">New Recipe</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Recipe Name *</label>
          <input
            name="name"
            required
            className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Sale Price ($) *</label>
          <input
            name="sale_price"
            type="number"
            step="0.01"
            required
            value={salePriceDollars}
            onChange={(e) => setSalePriceDollars(e.target.value)}
            placeholder="45.00"
            className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Description</label>
        <input
          name="description"
          className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Yield Count *</label>
          <input
            name="yield_count"
            type="number"
            step="any"
            required
            value={yieldCount}
            onChange={(e) => setYieldCount(e.target.value)}
            placeholder="12"
            className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-brown/50 block mb-1">Yield Unit *</label>
          <input
            name="yield_unit"
            required
            defaultValue="cookies"
            placeholder="cookies, loaves, dozen..."
            className="w-full border border-parchment bg-warm-white px-3 py-2 text-sm text-brown focus:outline-none focus:border-rose"
          />
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-widest text-brown/50">Ingredients</label>
          <p className="text-[10px] text-brown/40 italic">
            Enter cost for the unit you use (e.g. cost per cup, not per bag)
          </p>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <IngredientRow
              key={i}
              index={i}
              ingredient={ing}
              onChange={updateIngredient}
              onRemove={removeRow}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 text-xs text-rose hover:text-dusty-rose tracking-widest uppercase cursor-pointer"
        >
          + Add Ingredient
        </button>
      </div>

      {/* Live margin preview */}
      <div className="bg-warm-white border border-parchment p-4 space-y-1.5">
        <p className="text-[10px] uppercase tracking-widest text-brown/40 mb-2">Live Preview</p>
        <div className="flex justify-between text-sm">
          <span className="text-brown/60">Total ingredient cost</span>
          <span className="text-brown">${cents(totalCostCents)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brown/60">Cost per {yieldCount || "1"} unit(s)</span>
          <span className="text-brown">${cents(costPerUnit)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brown/60">Sale price</span>
          <span className="text-rose font-semibold">${cents(salePriceCents)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-parchment pt-1.5">
          <span className="text-brown/60">Profit per unit</span>
          <span className={`font-medium ${profitPerUnit >= 0 ? "text-green-700" : "text-red-600"}`}>
            ${cents(profitPerUnit)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-brown/60">Margin</span>
          <MarginBadge pct={marginPct} />
        </div>
      </div>

      <p className="text-xs text-brown/40 italic">
        Ingredient costs are entered manually. Enter the cost for the unit you use (e.g. if flour is $5/5lb bag and
        you use cups, calculate cost per cup). A grocery price integration can be added later.
      </p>

      <div className="flex gap-3">
        <button type="submit" className="px-5 py-2.5 bg-rose text-cream text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer">
          Save Recipe
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 border border-parchment text-brown text-xs tracking-widest uppercase hover:border-rose hover:text-rose transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function RecipeList({
  recipes,
  saveRecipe,
  removeRecipe,
}: {
  recipes: RecipeWithIngredients[];
  saveRecipe: (fd: FormData) => Promise<void>;
  removeRecipe: (fd: FormData) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-brown/50">{recipes.length} recipe{recipes.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setAdding(true)}
          className="text-xs text-rose border border-rose/50 px-4 py-2 hover:bg-blush transition-colors tracking-widest uppercase cursor-pointer"
        >
          + Add Recipe
        </button>
      </div>

      {adding && <AddRecipeForm saveRecipe={saveRecipe} onClose={() => setAdding(false)} />}

      {recipes.length === 0 && !adding && (
        <div className="text-center py-16 text-brown/30">
          <p className="font-light">No recipes yet. Add your first one to start tracking margins.</p>
        </div>
      )}

      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} removeRecipe={removeRecipe} />
      ))}
    </div>
  );
}
