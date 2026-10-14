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
    <div className="flex h-full w-full items-center justify-center text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin" />
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
  const [finishHex, setFinishHex] = useState(product.accentHex);
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
      className="fixed inset-0 z-[60] bg-charcoal-950/85 backdrop-blur-sm"
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
          className="relative min-h-0 flex-1 overflow-hidden bg-charcoal-950 md:rounded-2xl md:border md:border-slate-200/10"
        >
          {show3D && !stageReady ? (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
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
            <div className="relative h-full w-full">
              <Image src={product.image} alt={product.name} fill sizes="100vw" className="object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-charcoal-950/50 p-8 text-center">
                <Box className="h-10 w-10 text-amber-400" />
                <p className="max-w-sm text-sm text-slate-300">
                  3D is paused to save battery and data on this device.
                </p>
                <button
                  onClick={() => setForce3D(true)}
                  className="rounded-full border border-amber-400/40 px-5 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-400/10"
                >
                  View in 3D anyway
                </button>
              </div>
            </div>
          )}

          <button
            onClick={requestClose}
            aria-label="Close viewer"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-950/70 text-slate-300 backdrop-blur transition-colors hover:bg-charcoal-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="h-5 w-5" />
          </button>

          {show3D && (
            <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-charcoal-950/70 px-3 py-1 text-[11px] text-slate-400 sm:block">
              Drag to spin · Scroll or pinch to zoom · Arrow keys rotate · R resets
            </div>
          )}
        </motion.div>

        {/* Controls panel: bottom sheet on phones, side rail on desktop. */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={closing ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
          transition={{ delay: closing ? 0 : 0.12, duration: closing ? 0.2 : 0.3 }}
          className="glass-panel flex max-h-[46vh] shrink-0 flex-col gap-4 overflow-y-auto rounded-t-2xl p-5 md:ml-4 md:max-h-none md:w-[320px] md:rounded-2xl lg:w-[340px]"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">360° viewer</p>
            <h2 className="mt-1 font-display text-xl leading-tight text-slate-100">{product.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{product.description}</p>
            <p className="mt-2 font-display text-2xl text-amber-300">
              {formatCurrency(product.price)}
              <span className="ml-1 text-xs font-sans text-slate-500">/ unit</span>
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Finish</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Finish">
              {finishes.map((finish) => {
                const active = finishHex === finish.hex;
                return (
                  <button
                    key={finish.id}
                    role="radio"
                    aria-checked={active}
                    aria-label={finish.label}
                    title={finish.label}
                    onClick={() => setFinishHex(finish.hex)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400",
                      active
                        ? "border-amber-400/60 bg-amber-400/10 text-slate-100"
                        : "border-slate-200/10 text-slate-400 hover:border-slate-200/30"
                    )}
                  >
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: finish.hex }} />
                    {finish.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowDimensions((v) => !v)}
              aria-pressed={showDimensions}
              disabled={!show3D}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-40",
                showDimensions
                  ? "border-amber-400/60 bg-amber-400/10 text-slate-100"
                  : "border-slate-200/10 text-slate-300 hover:border-slate-200/30"
              )}
            >
              <Ruler className="h-4 w-4" />
              {showDimensions ? "Hide dimensions" : "Show dimensions"}
            </button>
            <button
              onClick={() => apiRef.current?.reset()}
              disabled={!show3D}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/10 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-200/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" />
              Reset view
            </button>
          </div>

          {show3D && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Zoom</span>
              <button
                onClick={() => apiRef.current?.zoomBy(1 / 0.85)}
                aria-label="Zoom out"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/10 text-slate-300 hover:border-slate-200/30"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => apiRef.current?.zoomBy(0.85)}
                aria-label="Zoom in"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/10 text-slate-300 hover:border-slate-200/30"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              {showDimensions && (
                <span className="ml-auto text-[11px]">
                  {product.modelUrl ? "Dimensions from model" : "Approximate — confirm on spec sheet"}
                </span>
              )}
            </div>
          )}

          <Link
            href={`/?product=${encodeURIComponent(product.slug)}#quote`}
            className="btn-gradient-border mt-auto flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-charcoal-950 transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
          >
            <Maximize2 className="h-4 w-4" />
            Request a quote for this item
          </Link>
        </motion.aside>
      </div>
    </motion.div>
  );
}
