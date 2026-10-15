"use client";

import { useDeferredValue, useId, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import type { Product } from "@/lib/categories";
import { ProductGrid } from "./ProductGrid";

export interface SearchableProduct extends Product {
  categorySlug: string;
  categoryLabel: string;
}

type Sort = "featured" | "price-asc" | "price-desc";

/**
 * Catalog search: type to search every product (name, description, category),
 * narrow by category, sort by price. With nothing entered, the page shows its
 * normal category cards (`children`).
 */
export function CatalogSearch({
  products,
  categories,
  children,
}: {
  products: SearchableProduct[];
  categories: { slug: string; label: string }[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("featured");
  const deferredQuery = useDeferredValue(query);
  const ids = { q: useId(), cat: useId(), sort: useId() };

  const active = deferredQuery.trim() !== "" || category !== "all" || sort !== "featured";

  const results = useMemo(() => {
    const words = deferredQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = products.filter((p) => {
      if (category !== "all" && p.categorySlug !== category) return false;
      if (words.length === 0) return true;
      const haystack = `${p.name} ${p.description} ${p.categoryLabel}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, deferredQuery, category, sort]);

  function reset() {
    setQuery("");
    setCategory("all");
    setSort("featured");
  }

  return (
    <div className="mt-10">
      <div role="search" className="grid gap-3 border-y border-rule py-4 sm:grid-cols-[minmax(0,1fr)_14rem_14rem]">
        <div className="relative">
          <label htmlFor={ids.q} className="sr-only">
            Search products
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
          <input
            id={ids.q}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${products.length} products — e.g. "bunk bed", "mattress", "cart"`}
            className="field pl-9"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor={ids.cat} className="sr-only">
            Category
          </label>
          <select id={ids.cat} value={category} onChange={(e) => setCategory(e.target.value)} className="field">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.sort} className="sr-only">
            Sort
          </label>
          <select id={ids.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field">
            <option value="featured">Sort: catalog order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {active ? (
        <div className="mt-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="type-data text-sm text-ink" aria-live="polite">
              {results.length} result{results.length === 1 ? "" : "s"}
              {deferredQuery.trim() ? ` for “${deferredQuery.trim()}”` : ""}
            </p>
            <button type="button" onClick={reset} className="btn-tool min-h-11">
              <X className="h-4 w-4" aria-hidden="true" />
              Clear search
            </button>
          </div>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="border-y border-rule py-10">
              <p className="font-semibold text-ink">No products match that search.</p>
              <p className="mt-1 text-sm text-ink-2">
                Try a shorter word, or browse the categories. Need something not listed? Add a note to your quote
                request.
              </p>
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
