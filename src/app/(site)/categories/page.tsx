import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site";
import { CatalogSearch } from "@/components/CatalogSearch";

export const metadata: Metadata = {
  title: `Shop by Category | ${SITE_NAME}`,
  description: "Browse furniture, facility, and maintenance supply categories.",
};

export default async function CategoriesIndexPage() {
  const CATEGORIES = await getCategories();
  const productTotal = CATEGORIES.reduce((sum, c) => sum + c.products.length, 0);
  const searchable = CATEGORIES.flatMap((c) =>
    c.products.map((p) => ({ ...p, categorySlug: c.slug, categoryLabel: c.label }))
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="section-rule grid gap-6 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <h1 className="type-display text-6xl text-ink sm:text-7xl lg:text-8xl">Catalog</h1>
        <div className="flex flex-col gap-3">
          <p className="max-w-[62ch] text-ink-2">
            Institutional, commercial, and residential furnishing. Every item
            ships with bulk pricing available.
          </p>
          <p className="type-data text-sm text-ink">
            {CATEGORIES.length} categories · {productTotal} products
          </p>
        </div>
      </header>

      <CatalogSearch products={searchable} categories={CATEGORIES.map(({ slug, label }) => ({ slug, label }))}>
      <div className="catalog-grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category, i) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="cell lift reveal group flex flex-col"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-mist">
              <Image
                src={`/products/${category.slug}.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold text-ink">
                  <span className="type-data mr-2 text-sm font-normal text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {category.label}
                </h2>
                <span className="type-data shrink-0 text-xs text-ink-3">
                  {category.products.length} items
                </span>
              </div>
              <p className="text-sm text-ink-2">{category.description}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-ink group-hover:text-accent-ink">
                View category <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      </CatalogSearch>
    </div>
  );
}
