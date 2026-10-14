import {
  Baby,
  BedDouble,
  Building2,
  Home,
  Lamp,
  Lock,
  Shirt,
  Sofa,
  SprayCan,
  Tag,
  Tv,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { cacheLife } from "next/cache";
import { CATEGORIES as STATIC_CATEGORIES, type Category, type Product } from "@/lib/categories";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import type { ShapeKind, ShapeVariant } from "@/components/product-shapes";

const ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Sofa,
  Baby,
  BedDouble,
  Home,
  Building2,
  Tv,
  Shirt,
  Lamp,
  Lock,
  SprayCan,
  Tag,
};

interface CategoryRow {
  slug: string;
  label: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface ProductRow {
  id: string;
  category_slug: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  shape: string;
  accent_hex: string;
  shape_variant: ShapeVariant | null;
  /** Added by supabase/migrations/add-model-url.sql; undefined on older schemas. */
  model_url?: string | null;
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    description: row.description,
    image: row.image_url,
    shape: row.shape as ShapeKind,
    accentHex: row.accent_hex,
    shapeVariant: row.shape_variant ?? undefined,
    modelUrl: row.model_url || undefined,
  };
}

// Raw DB rows only (no icon component references — those aren't serializable
// across a "use cache" boundary) so the network round-trip to Supabase can be
// cached and contribute to the prerendered static shell under Cache Components.
async function fetchCategoryRows(): Promise<{ categoryRows: CategoryRow[]; productRows: ProductRow[] } | null> {
  "use cache";
  cacheLife("minutes");

  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  const [{ data: categoryRows, error: categoriesError }, { data: productRows, error: productsError }] =
    await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("name"),
    ]);

  if (categoriesError || productsError || !categoryRows) {
    console.error("[catalog] Supabase read failed, falling back to static data:", categoriesError || productsError);
    return null;
  }

  return {
    categoryRows: categoryRows as CategoryRow[],
    productRows: (productRows ?? []) as ProductRow[],
  };
}

async function fetchFromSupabase(): Promise<Category[] | null> {
  const rows = await fetchCategoryRows();
  if (!rows) return null;

  return rows.categoryRows.map((row) => ({
    slug: row.slug,
    label: row.label,
    description: row.description,
    icon: ICONS[row.icon] ?? Tag,
    products: rows.productRows
      .filter((p) => p.category_slug === row.slug)
      .map(mapProduct),
  }));
}

/** All categories + products. Reads from Supabase when configured, otherwise the static seed data. */
export async function getCategories(): Promise<Category[]> {
  const fromDb = await fetchFromSupabase();
  return fromDb ?? STATIC_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getProductById(id: string): Promise<(Product & { id: string; categorySlug: string }) | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  const row = data as ProductRow;
  return { ...mapProduct(row), id: row.id, categorySlug: row.category_slug };
}
