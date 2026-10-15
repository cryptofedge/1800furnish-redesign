"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import { Box, Loader2, Maximize2, Minus, Plus, RotateCcw, Ruler, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FINISHES } from "@/lib/finishes";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { TURNTABLE_KEY_STEP, type TurntableApi } from "./viewer/useTurntable";

const ViewerStage = dynamic(() => import("./viewer/ViewerStage").then((m) => m.ViewerStage), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-ink-3">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
    </div>
  ),
});

interface ProductViewerProps {
  product: Product;
  /** Device flagged low-power / reduced-motion: show the photo until the user opts in. */
  lowPower: boolean;
  /** Viewport point the viewer should appear to grow out of (centre of the clicked card). */
  origin?: { x: number; y: number };
  onClose: () => void;
}

export function ProductViewer({ product, lowPower, origin, onClose }: ProductViewerProps) {
  // Track the chosen swatch by id: a product's own color can equal one of the
  // shared finishes (e.g. walnut), and matching by hex would mark both selected.
  const [finishId, setFinishId] = useState("standard");
  const [showDimensions, setShowDimensions] = useState(false);
  const [force3D, setForce3D] = useState(false);
  // The viewer animates itself out, then asks the parent to unmount it
  // (onAnimationComplete below) — no AnimatePresence needed.
  const [closing, setClosing] = useState(false);
  // The WebGL canvas measures its parent with getBoundingClientRect(), which
  // reports the *transformed* box, so it must not mount until the stage's
  // scale-in animation has finished — otherwise it sizes itself to the
  // half-scale box and never re-measures.
  const [stageReady, setStageReady] = useState(false);
  const apiRef = useRef<TurntableApi | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const show3D = !lowPower || force3D;

  const requestClose = useCallback(() => setClosing(true), []);

  const finishes = [{ id: "standard", label: "Standard (as shown)", hex: product.accentHex }, ...FINISHES];
  const finishHex = (finishes.find((f) => f.id === finishId) ?? finishes[0]).hex;

  // Scale the stage in/out around the card the user clicked, so it reads as the
  // card expanding to fullscreen (and collapsing back on close).
  const originX = useMotionValue(0.5);
  const originY = useMotionValue(0.5);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!origin || !stage) return;
    const r = stage.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    originX.set(Math.min(1, Math.max(0, (origin.x - r.left) / r.width)));
    originY.set(Math.min(1, Math.max(0, (origin.y - r.top) / r.height)));
  }, [origin, originX, originY]);

  // Lock page scroll, move focus into the dialog, hand it back on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  // Esc closes even if focus has wandered outside the dialog.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [requestClose]);

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const api = apiRef.current;
    if (!api) return;
    // Don't hijack keys while a button/link has focus and the key is Enter/Space.
    switch (e.key) {
      case "ArrowLeft":
        api.rotateBy(-TURNTABLE_KEY_STEP, 0);
        break;
      case "ArrowRight":
        api.rotateBy(TURNTABLE_KEY_STEP, 0);
        break;
      case "ArrowUp":
        api.rotateBy(0, -TURNTABLE_KEY_STEP / 2);
        break;
      case "ArrowDown":
        api.rotateBy(0, TURNTABLE_KEY_STEP / 2);
        break;
      case "+":
      case "=":
        api.zoomBy(0.85);
        break;
      case "-":
      case "_":
        api.zoomBy(1 / 0.85);
        break;
      case "r":
      case "R":
        api.reset();
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-mist/[0.97]"
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={() => {
        if (closing) onClose();
      }}
      style={{ pointerEvents: closing ? "none" : "auto" }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} — 360° viewer`}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        // Clicking the padding around the panels (the visible backdrop) closes.
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
        className="absolute inset-0 flex flex-col outline-none md:flex-row md:p-4 lg:p-6"
      >
        <motion.div
          ref={stageRef}
          style={{ originX, originY }}
          initial={{ opacity: 0, scale: 0.55 }}
          animate={closing ? { opacity: 0, scale: 0.7 } : { opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          onAnimationComplete={() => {
            if (!closing) setStageReady(true);
          }}
          className="relative min-h-0 flex-1 overflow-hidden bg-well md:border md:border-rule"
        >
          {show3D && !stageReady ? (
            <div className="flex h-full w-full items-center justify-center text-ink-3">
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            </div>
          ) : show3D ? (
            <ViewerStage
              modelUrl={product.modelUrl}
              shape={product.shape}
              variant={product.shapeVariant}
              finishHex={finishHex}
              showDimensions={showDimensions}
              autoRotate={!lowPower}
              apiRef={apiRef}
            />
          ) : (
            <div className="relative h-full w-full bg-well">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="100vw"
                className="object-contain p-8 pb-48 sm:p-12 sm:pb-52"
              />
              <div className="panel absolute inset-x-4 bottom-4 mx-auto flex max-w-sm flex-col items-center gap-3 border-ink p-4 text-center">
                <Box className="h-6 w-6 text-ink-2" aria-hidden="true" />
                <p className="text-sm text-ink-2">3D is paused to save battery and data on this device.</p>
                <button type="button" onClick={() => setForce3D(true)} className="btn btn-secondary w-full">
                  View in 3D anyway
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={requestClose}
            aria-label="Close viewer"
            className="btn-tool absolute right-3 top-3 z-10 h-11 w-11 p-0"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          {show3D && (
            <p className="pointer-events-none absolute bottom-3 left-3 hidden bg-well/90 px-2 py-1 text-xs text-ink-2 sm:block">
              Drag to spin · Scroll or pinch to zoom · Arrow keys rotate · R resets
            </p>
          )}
        </motion.div>

        {/* Controls panel: bottom sheet on phones, side rail on desktop. */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={closing ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
          transition={{ delay: closing ? 0 : 0.12, duration: closing ? 0.2 : 0.3 }}
          className="panel flex max-h-[46vh] shrink-0 flex-col gap-4 overflow-y-auto md:gap-5 border-x-0 border-b-0 border-t-ink p-4 sm:p-5 md:ml-4 md:max-h-none md:w-[340px] md:border md:border-rule lg:w-[360px]"
        >
          <div>
            <span className="tag border-ink">360° viewer</span>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink">{product.name}</h2>
            <p className="mt-2 text-sm text-ink-2">{product.description}</p>
            <p className="mt-3 leading-none">
              <span className="type-data text-2xl font-medium text-ink">{formatCurrency(product.price)}</span>
              <span className="type-data ml-1 text-xs text-ink-3">/ unit</span>
            </p>
          </div>

          <div className="border-t border-rule pt-4">
            <p className="type-label mb-2">Finish</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Finish">
              {finishes.map((finish) => {
                const active = finishId === finish.id;
                return (
                  <button
                    type="button"
                    key={finish.id}
                    role="radio"
                    aria-checked={active}
                    aria-label={finish.label}
                    title={finish.label}
                    onClick={() => setFinishId(finish.id)}
                    className={cn("btn-tool min-h-11 justify-start gap-2 text-xs", active ? "text-ink" : "text-ink-2")}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-ink/25"
                      style={{ backgroundColor: finish.hex }}
                      aria-hidden="true"
                    />
                    {finish.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-rule pt-4">
            <button
              type="button"
              onClick={() => setShowDimensions((v) => !v)}
              aria-pressed={showDimensions}
              disabled={!show3D}
              className="btn-tool min-h-11 text-xs"
            >
              <Ruler className="h-4 w-4" aria-hidden="true" />
              {showDimensions ? "Hide dimensions" : "Show dimensions"}
            </button>
            <button
              type="button"
              onClick={() => apiRef.current?.reset()}
              disabled={!show3D}
              className="btn-tool min-h-11 text-xs"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset view
            </button>
          </div>

          {show3D && (
            <div className="flex items-center gap-2">
              <span className="type-label mr-1">Zoom</span>
              <button
                type="button"
                onClick={() => apiRef.current?.zoomBy(1 / 0.85)}
                aria-label="Zoom out"
                className="btn-tool h-11 w-11 p-0"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => apiRef.current?.zoomBy(0.85)}
                aria-label="Zoom in"
                className="btn-tool h-11 w-11 p-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
              {showDimensions && (
                <span className="ml-auto text-right text-[11px] leading-tight text-ink-3">
                  {product.modelUrl ? "Dimensions from model" : "Approximate — confirm on spec sheet"}
                </span>
              )}
            </div>
          )}

          {/* Pinned to the bottom of the phone sheet so the CTA never scrolls out of view. */}
          <div className="sticky bottom-0 -mx-4 -mb-4 mt-auto border-t border-rule bg-well p-4 sm:-mx-5 sm:-mb-5 sm:p-5 md:static md:mx-0 md:mb-0 md:border-0 md:p-0">
            <Link
              href={`/?product=${encodeURIComponent(product.slug)}#quote`}
              className="btn btn-primary w-full"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
              Request a quote for this item
            </Link>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}
