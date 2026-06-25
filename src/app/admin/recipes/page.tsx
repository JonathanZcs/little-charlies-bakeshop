import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";
import { getRecipes, getRecipe, upsertRecipe, upsertRecipeIngredient, deleteRecipe } from "@/lib/db";
import type { RecipeWithIngredients } from "@/lib/db";
import AdminNav from "../AdminNav";
import RecipeList from "./RecipeList";

export const metadata = { title: "Admin — Recipes" };
export const dynamic = "force-dynamic";

export default async function AdminRecipesPage() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const recipes = await getRecipes();

  // Load all recipes with ingredients
  const recipesWithIngredients: RecipeWithIngredients[] = (
    await Promise.all(recipes.map((r) => getRecipe(r.id)))
  ).filter(Boolean) as RecipeWithIngredients[];

  async function saveRecipe(formData: FormData) {
    "use server";
    const id = formData.get("id") as string | null;
    const salePriceDollars = parseFloat((formData.get("sale_price") as string) || "0");
    const yieldCount = parseFloat((formData.get("yield_count") as string) || "1");

    const recipe = await upsertRecipe({
      id: id || undefined,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      sale_price_cents: Math.round(salePriceDollars * 100),
      yield_count: yieldCount,
      yield_unit: formData.get("yield_unit") as string,
    });
    if (!recipe) { redirect("/admin/recipes"); return; }

    // Save ingredients (sent as JSON in a hidden field)
    const ingredientsJson = formData.get("ingredients_json") as string;
    if (ingredientsJson) {
      const ingredients = JSON.parse(ingredientsJson) as Array<{
        ingredient_name: string;
        quantity: string;
        unit: string;
        cost_per_unit: string;
      }>;
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        await upsertRecipeIngredient({
          recipe_id: recipe.id,
          ingredient_name: ing.ingredient_name,
          quantity: parseFloat(ing.quantity) || 0,
          unit: ing.unit,
          cost_per_unit_cents: Math.round((parseFloat(ing.cost_per_unit) || 0) * 100),
          sort_order: i,
        });
      }
    }

    redirect("/admin/recipes");
  }

  async function removeRecipe(formData: FormData) {
    "use server";
    await deleteRecipe(formData.get("id") as string);
    redirect("/admin/recipes");
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Recipe Cost Calculator</span>
        </div>
      </header>

      <AdminNav active="Recipes" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-mocha">Recipe Cost Calculator</h1>
          <p className="text-brown/60 mt-1 font-light">Know your margins. Price with confidence.</p>
        </div>

        <RecipeList
          recipes={recipesWithIngredients}
          saveRecipe={saveRecipe}
          removeRecipe={removeRecipe}
        />
      </div>
    </div>
  );
}
