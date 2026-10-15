"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ClipboardList, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/quote-data";
import { openQuoteList } from "@/lib/quote-list";
import type { Product } from "@/lib/categories";
import { PhotoStage, type PhotoZoomApi } from "./viewer/PhotoStage";
import { ProductViewer } from "./ProductViewer";
import { AddToQuoteButton } from "./quote/AddToQuoteButton";
import { QtyStepper } from "./quote/QuoteListDrawer";

/**
 * Top of a product page: the zoomable product photo, price, a quantity
 * picker and "Add to quote". Specs we don't have (dimensions, materials,
 * lead time) are not invented; the page says they are confirmed in the quote.
 */
export function ProductDetail({ product, categoryLabel }: { product: Product; categoryLabel: string }) {
  const [qty, setQty] = useState(1);
  const [viewer, setViewer] = useState<{ x: number; y: number } | null>(null);
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

  function openViewer(e: MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setViewer({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }

  const listProduct = { slug: product.slug, name: product.name, price: product.price, image: product.image };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
      <div role="region" aria-label={`${product.name} photo`} className="panel relative h-[340px] overflow-hidden sm:h-[520px]">
        <PhotoStage
          src={product.image}
          alt={product.name}
          apiRef={photoRef}
          inPage
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="p-8 sm:p-14"
        />
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

      <div className="flex min-w-0 flex-col gap-5">
        <div>
          <p className="type-label">{categoryLabel}</p>
          <h1 className="type-display mt-2 text-4xl text-ink sm:text-5xl">{product.name}</h1>
          <p className="mt-3 max-w-[52ch] text-ink-2">{product.description}</p>
        </div>

        <p className="leading-none">
          <span className="type-data text-4xl font-medium text-ink">{formatCurrency(product.price)}</span>
          <span className="type-data ml-1 text-sm text-ink-3">/ unit · bulk pricing available</span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-rule py-4">
          <span className="type-label">Quantity</span>
          <QtyStepper qty={qty} name={product.name} onChange={(q) => setQty(Math.max(1, q))} />
          <span className="type-data text-sm text-ink-2">
            = <span className="text-ink">{formatCurrency(product.price * qty)}</span>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <AddToQuoteButton variant="primary" qty={qty} product={listProduct} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={openQuoteList} className="btn btn-secondary">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Quote list
            </button>
            <button type="button" onClick={openViewer} className="btn btn-secondary">
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
              Full screen
            </button>
          </div>
        </div>

        <p className="text-sm text-ink-3">
          Dimensions, materials, finishes and delivery lead time are confirmed in your quote. Volume pricing applies
          to bulk and facility-wide orders.
        </p>
      </div>

      {viewer && (
        <ProductViewer product={product} origin={viewer} lowPower={lowPower} onClose={() => setViewer(null)} />
      )}
    </div>
  );
}
