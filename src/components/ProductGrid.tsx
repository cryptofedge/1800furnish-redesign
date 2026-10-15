"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rotate3d, ZoomIn } from "lucide-react";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { ProductViewer } from "./ProductViewer";
import { AddToQuoteButton } from "./quote/AddToQuoteButton";

// Catalog cards: the product photo on white is the primary view (it's what a
// buyer scans), and the product viewer opens on demand — on the real photo,
// zoomable. Only products with a real 3D model are tagged 360°. No WebGL runs
// on the grid itself, so a category page stays light on phones.
export function ProductGrid({ products }: { products: Product[] }) {
  const [lowPower, setLowPower] = useState(false);
  const [active, setActive] = useState<{ product: Product; origin: { x: number; y: number } } | null>(null);

  useEffect(() => {
    const isLowPower =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    // One-time read of a browser capability unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLowPower(isLowPower);
  }, []);

  // Open the viewer "from" the card's photo so the transition grows out of it.
  function open(product: Product, el: HTMLElement) {
    const media = el.closest("[data-card]")?.querySelector("[data-media]") ?? el;
    const r = media.getBoundingClientRect();
    setActive({ product, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  }

  return (
    <>
      <ul className="catalog-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.slug} data-card className="cell lift reveal flex flex-col">
            <button
              type="button"
              data-media
              onClick={(e: MouseEvent<HTMLButtonElement>) => open(product, e.currentTarget)}
              aria-label={`View ${product.name} up close`}
              className="scanline group relative block aspect-[4/3] w-full overflow-hidden bg-studio sm:aspect-square"
            >
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className={
                  product.imageFit === "cover"
                    ? "object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    : "object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]"
                }
              />
              <span className="tag absolute left-3 top-3 gap-1 border-ink">
                {product.modelUrl ? (
                  <>
                    <Rotate3d className="h-3 w-3" aria-hidden="true" />
                    360°
                  </>
                ) : (
                  <>
                    <ZoomIn className="h-3 w-3" aria-hidden="true" />
                    Zoom
                  </>
                )}
              </span>
            </button>

            <div className="flex flex-1 flex-col border-t border-rule p-4">
              <h3 className="font-semibold leading-snug text-ink">
                <Link href={`/products/${product.slug}`} className="transition-colors hover:text-accent-ink">
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 flex-1 text-sm text-ink-2">{product.description}</p>

              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="leading-none">
                  <span className="type-data text-xl font-medium text-ink">{formatCurrency(product.price)}</span>
                  <span className="type-data ml-1 text-xs text-ink-3">/ unit</span>
                </p>
                <AddToQuoteButton
                  product={{ slug: product.slug, name: product.name, price: product.price, image: product.image }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      {active && (
        <ProductViewer
          key={active.product.slug}
          product={active.product}
          origin={active.origin}
          lowPower={lowPower}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
