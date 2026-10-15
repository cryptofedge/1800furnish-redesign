"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { PhotoStage, type PhotoZoomApi } from "./viewer/PhotoStage";
import { ProductViewer } from "./ProductViewer";

export interface InspectorItem {
  product: Product;
  category: { slug: string; label: string };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home-page product inspector: one real catalog product per category, shown
 * as its actual photo (zoomable), with price and a direct path to a quote.
 * Replaces the earlier stand-in 3D chair, which wasn't a real catalog item.
 */
export function ProductConfigurator({ items }: { items: InspectorItem[] }) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState<{ product: Product; origin: { x: number; y: number } } | null>(null);
  const [lowPower, setLowPower] = useState(false);
  const photoRef = useRef<PhotoZoomApi | null>(null);

  useEffect(() => {
    const isLowPower =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    // One-time read of a browser capability unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLowPower(isLowPower);
  }, []);

  if (items.length === 0) return null;
  const current = items[Math.min(index, items.length - 1)];
  const { product, category } = current;

  function openViewer(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setViewer({ product, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
      <header className="section-rule reveal grid gap-4 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end md:gap-6">
        <h2 className="type-display text-4xl text-ink sm:text-5xl lg:text-6xl">
          Inspect every unit before it ships.
        </h2>
        <p className="max-w-[62ch] text-ink-2">
          Zoom into the real product photo, check the price per unit, and send any item
          straight to a quote. One pick from every category below.
        </p>
      </header>

      <div className="reveal mt-10 grid gap-4 lg:grid-cols-[1fr_360px] lg:gap-6">
        <div role="region" aria-label={`${product.name} photo`} className="panel relative h-[380px] overflow-hidden sm:h-[540px]">
          <PhotoStage
            src={product.image}
            alt={product.name}
            apiRef={photoRef}
            inPage
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="p-8 sm:p-14"
          />
          <p className="tag pointer-events-none absolute left-3 top-3 border-ink">
            <span className="text-ink-3">{pad(index + 1)}</span> {category.label}
          </p>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button type="button" onClick={() => photoRef.current?.zoomBy(1 / 1.25)} aria-label="Zoom out" className="btn-tool h-11 w-11 p-0">
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => photoRef.current?.zoomBy(1.25)} aria-label="Zoom in" className="btn-tool h-11 w-11 p-0">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => photoRef.current?.reset()} aria-label="Reset zoom" className="btn-tool h-11 w-11 p-0">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="tag pointer-events-none absolute bottom-3 left-3 hidden text-ink-2 sm:inline-flex">
            Double-click to zoom · Drag to move
          </p>
        </div>

        <div className="panel flex flex-col gap-5 p-5">
          <div>
            <p className="type-label">{category.label}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-ink">{product.name}</h3>
            <p className="mt-2 text-sm text-ink-2">{product.description}</p>
            <p className="mt-4 leading-none">
              <span className="type-data text-3xl font-medium text-ink">{formatCurrency(product.price)}</span>
              <span className="type-data ml-1 text-xs text-ink-3">/ unit · bulk pricing available</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href={`/?product=${encodeURIComponent(product.slug)}#quote`} className="btn btn-primary w-full">
              Request a quote for this item
            </Link>
            <button type="button" onClick={openViewer} className="btn btn-secondary w-full">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
              View full screen
            </button>
            <Link href={`/categories/${category.slug}`} className="link mt-1 inline-flex items-center gap-1 self-start text-sm">
              Browse {category.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="border-t border-rule pt-4">
            <p id="inspector-picks" className="type-label mb-3">
              One from every category
            </p>
            <ul aria-labelledby="inspector-picks" className="grid grid-cols-4 gap-2">
              {items.map((item, i) => {
                const selected = i === index;
                return (
                  <li key={item.product.slug}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-pressed={selected}
                      aria-label={`${item.category.label}: ${item.product.name}`}
                      title={`${item.category.label}: ${item.product.name}`}
                      className={cn(
                        "relative block aspect-square w-full overflow-hidden border bg-studio transition-colors",
                        selected ? "border-ink" : "border-rule hover:border-ink"
                      )}
                      style={selected ? { boxShadow: "inset 0 -3px 0 var(--color-accent)" } : undefined}
                    >
                      <Image src={item.product.image} alt="" fill
                        sizes="80px"
                        className={item.product.imageFit === "cover" ? "object-cover" : "object-contain p-1.5 mix-blend-multiply"}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {viewer && (
        <ProductViewer
          key={viewer.product.slug}
          product={viewer.product}
          origin={viewer.origin}
          lowPower={lowPower}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
}
