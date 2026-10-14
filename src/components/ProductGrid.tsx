"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Box, Loader2, Maximize2 } from "lucide-react";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { ProductViewer } from "./ProductViewer";

const ProductScene3D = dynamic(
  () => import("./ProductScene3D").then((m) => m.ProductScene3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    ),
  }
);

export function ProductGrid({ products }: { products: Product[] }) {
  const [enabled, setEnabled] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [active, setActive] = useState<{ product: Product; origin: { x: number; y: number } } | null>(null);
  const press = useRef<{ x: number; y: number; t: number } | null>(null);

  // Open the viewer "from" the card's media box so the transition grows out of it.
  function open(product: Product, el: HTMLElement) {
    const media = el.closest("[data-card]")?.querySelector("[data-media]") ?? el;
    const r = media.getBoundingClientRect();
    setActive({ product, origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 } });
  }

  useEffect(() => {
    const isLowPower =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!isLowPower);
    setLowPower(isLowPower);
  }, []);

  // A tap/click on the preview opens the viewer; a drag just rotates it.
  function onPressStart(e: PointerEvent) {
    press.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  }
  function onPressEnd(e: PointerEvent, product: Product) {
    const p = press.current;
    press.current = null;
    if (!p) return;
    const moved = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    if (moved < 6 && e.timeStamp - p.t < 400) open(product, e.currentTarget as HTMLElement);
  }

  // While the fullscreen viewer is open, the small previews swap to photos so
  // only one WebGL canvas exists at a time.
  const previews3D = enabled && !active;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!enabled && (
          <div className="glass-panel col-span-full flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Box className="h-4 w-4 text-amber-400" />
              3D previews are paused to save battery and data on this device.
            </p>
            <button
              onClick={() => setEnabled(true)}
              className="rounded-full border border-amber-400/40 px-4 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-400/10"
            >
              Enable 3D View
            </button>
          </div>
        )}

        {products.map((product) => (
          <div key={product.slug} data-card className="glass-panel flex flex-col overflow-hidden rounded-2xl">
            <div
              data-media
              className="relative h-36 w-full bg-charcoal-900/60"
              onPointerDown={onPressStart}
              onPointerUp={(e) => onPressEnd(e, product)}
            >
              {previews3D ? (
                <ProductScene3D shape={product.shape} color={product.accentHex} variant={product.shapeVariant} />
              ) : (
                <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              )}
              {previews3D && (
                <div className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-full bg-charcoal-950/70 px-2 py-0.5 text-[10px] text-slate-400">
                  Drag to rotate · Tap to expand
                </div>
              )}
              <button
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  open(product, e.currentTarget);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                aria-label={`Open ${product.name} in the 360° viewer`}
                className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-charcoal-950/70 px-2 py-1 text-[10px] font-semibold text-amber-300 backdrop-blur transition-colors hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                <Maximize2 className="h-3 w-3" />
                360°
              </button>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-sm font-semibold text-slate-200">
                <button
                  onClick={(e: MouseEvent<HTMLButtonElement>) => open(product, e.currentTarget)}
                  className="text-left transition-colors hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
                >
                  {product.name}
                </button>
              </h3>
              <p className="mt-1 flex-1 text-xs text-slate-400">{product.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg text-amber-300">
                  {formatCurrency(product.price)}
                </span>
                <Link
                  href={`/?product=${encodeURIComponent(product.slug)}#quote`}
                  className="rounded-full border border-amber-400/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-400/10"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <ProductViewer
          key={active.product.slug}
          product={active.product}
          origin={active.origin}
          lowPower={lowPower && !enabled}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
