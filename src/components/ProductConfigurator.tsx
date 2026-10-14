"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Box, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FINISHES } from "@/lib/finishes";
import type { Hotspot } from "./Scene3D";

const Scene3D = dynamic(() => import("./Scene3D").then((m) => m.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  ),
});

const HOTSPOTS: Hotspot[] = [
  {
    id: "frame",
    position: [0.55, 0.3, 0.1],
    label: "Frame Construction",
    material: "Heavy-duty 16-gauge steel frame, powder-coated finish",
    price: "Included",
  },
  {
    id: "upholstery",
    position: [0, 0.65, 0.5],
    label: "Seating Surface",
    material: "Commercial-grade fabric, 100k+ double-rub rating, stain resistant",
    price: "From $640 / unit",
  },
  {
    id: "legs",
    position: [-0.48, -0.1, -0.47],
    label: "Leg Hardware",
    material: "Reinforced steel legs rated for high-turnover institutional use",
    price: "Included",
  },
];

export function ProductConfigurator() {
  const [activeFinish, setActiveFinish] = useState(FINISHES[0]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const isLowPower =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    // One-time read of a browser capability unavailable during SSR; deliberately
    // not computed during render to avoid a server/client markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!isLowPower);
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:px-10">
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Interactive Product Viewer
        </span>
        <h2 className="font-display text-3xl font-medium text-slate-200 sm:text-4xl">
          Inspect every unit before it ships.
        </h2>
        <p className="max-w-2xl text-slate-400">
          Rotate, inspect, and switch finishes in real time. Every spec, material,
          and price point is one click away.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="glass-panel relative h-[480px] overflow-hidden rounded-2xl sm:h-[560px]">
          {enabled ? (
            <Scene3D finishHex={activeFinish.hex} hotspots={HOTSPOTS} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <Box className="h-10 w-10 text-amber-400" />
              <p className="max-w-sm text-sm text-slate-400">
                3D preview is paused to save battery and data on this device.
              </p>
              <button
                onClick={() => setEnabled(true)}
                className="rounded-full border border-amber-400/40 px-5 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-400/10"
              >
                Enable 3D View
              </button>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-charcoal-950/70 px-3 py-1 text-xs text-slate-400">
            Drag to orbit · Click markers for specs
          </div>
        </div>

        <div className="glass-panel flex flex-col gap-6 rounded-2xl p-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
              Finish / Material
            </h3>
            <div className="flex flex-col gap-2">
              {FINISHES.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setActiveFinish(finish)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
                    activeFinish.id === finish.id
                      ? "border-amber-400/50 bg-amber-400/10 text-slate-200"
                      : "border-slate-200/10 text-slate-400 hover:border-slate-200/30"
                  )}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-white/20"
                    style={{ backgroundColor: finish.hex }}
                  />
                  {finish.label}
                  {activeFinish.id === finish.id && (
                    <motion.span
                      layoutId="finish-check"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200/10 pt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-200">
              Specs at a glance
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Fire-code certified foam &amp; fabric</li>
              <li>Rated for high-turnover institutional use</li>
              <li>Available in bulk with volume pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
