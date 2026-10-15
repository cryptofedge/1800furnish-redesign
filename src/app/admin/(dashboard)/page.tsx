import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { getCategories } from "@/lib/catalog";
import { formatCurrency } from "@/lib/quote-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Admin pages are always request-time (auth-gated, live data) — never prerendered.
export const instant = false;

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="panel p-6 text-sm text-ink-2">
        Supabase isn&apos;t configured, so there&apos;s nothing to edit yet —
        see the &quot;Admin backend&quot; section in README.md.
      </div>
    );
  }

  const categories = await getCategories();
  const products = categories.flatMap((category) =>
    category.products.map((product) => ({ ...product, categoryLabel: category.label }))
  );

  return (
    <div>
      <header className="section-rule flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pt-4">
        <h1 className="type-display text-4xl text-ink">Products</h1>
        <p className="type-data text-sm text-ink-2">
          {products.length} products across {categories.length} categories.
        </p>
      </header>

      <div className="panel mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-ink">
            <tr>
              <th scope="col" className="type-label px-3 py-3 sm:px-4">Product</th>
              <th scope="col" className="type-label hidden px-3 py-3 sm:table-cell sm:px-4">Category</th>
              <th scope="col" className="type-label hidden px-3 py-3 text-right sm:table-cell sm:px-4">Price</th>
              <th scope="col" className="px-3 py-3 sm:px-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-rule transition-colors last:border-b-0 hover:bg-paper"
              >
                <td className="px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 border border-rule bg-well sm:h-12 sm:w-12">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-semibold text-ink">{product.name}</span>
                      <span className="block text-xs text-ink-3 sm:hidden">{product.categoryLabel}</span>
                      <span className="type-data block text-xs text-ink-2 sm:hidden">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-3 text-ink-2 sm:table-cell sm:px-4">{product.categoryLabel}</td>
                <td className="type-data hidden whitespace-nowrap px-3 py-3 text-right text-ink sm:table-cell sm:px-4">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-3 py-3 text-right sm:px-4">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="btn btn-secondary px-3"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit<span className="sr-only"> {product.name}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
