"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Loader2 } from "lucide-react";
import { FINISHES } from "@/lib/finishes";
import type { Hotspot } from "./Scene3D";

const Scene3D = dynamic(() => import("./Scene3D").then((m) => m.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-ink-3">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading 3D view</span>
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

const SPECS = [
  "Fire-code certified foam & fabric",
  "Rated for high-turnover institutional use",
  "Available in bulk with volume pricing",
];

export function ProductConfigurator() {
  const [activeFinish, setActiveFinish] = useState(FINISHES[0]);
  const [enabled, setEnabled] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  // Pause the 3D render loop while this section is off-screen (the home page
  // also runs the hero room, so idle canvases shouldn't keep drawing).
  const previewRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
      <header className="section-rule grid gap-4 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end md:gap-6">
        <h2 className="type-display text-4xl text-ink sm:text-5xl lg:text-6xl">
          Inspect every unit before it ships.
        </h2>
        <p className="max-w-[62ch] text-ink-2">
          Rotate, inspect, and switch finishes in real time. Every spec, material,
          and price point is one click away.
        </p>
      </header>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_320px] lg:gap-6">
        <div
          ref={previewRef}
          role="region"
          aria-label="3D chair preview"
          className="panel relative h-[400px] overflow-hidden sm:h-[560px]"
        >
          {enabled ? (
            <Scene3D
              finishHex={activeFinish.hex}
              hotspots={HOTSPOTS}
              activeHotspot={activeHotspot}
              onActiveHotspotChange={setActiveHotspot}
              active={onScreen}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <Box className="h-10 w-10 text-ink-3" aria-hidden="true" />
              <p className="max-w-sm text-sm text-ink-2">
                3D preview is paused to save battery and data on this device.
              </p>
              <button
                type="button"
                onClick={() => setEnabled(true)}
                className="btn btn-secondary"
              >
                Enable 3D View
              </button>
            </div>
          )}

          <p className="tag pointer-events-none absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] text-ink-2">
            Drag to orbit · Click markers for specs
          </p>
        </div>

        <div className="panel flex flex-col gap-6 p-5">
          <div>
            <h3 id="finish-heading" className="type-label mb-3">
              Finish / Material
            </h3>
            <div role="group" aria-labelledby="finish-heading" className="flex flex-col gap-2">
              {FINISHES.map((finish) => {
                const selected = activeFinish.id === finish.id;
                return (
                  <button
                    key={finish.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveFinish(finish)}
                    className="btn-tool min-h-11 w-full justify-start gap-3 px-3 text-left text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 rounded-full border border-ink/20"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <span className={selected ? "text-ink" : "text-ink-2"}>
                      {finish.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-rule pt-5">
            <h3 id="hotspot-heading" className="type-label mb-3">
              Components
            </h3>
            <ul aria-labelledby="hotspot-heading" className="flex flex-col gap-2">
              {HOTSPOTS.map((hotspot) => {
                const open = activeHotspot === hotspot.id;
                const detailId = `hotspot-detail-${hotspot.id}`;
                return (
                  <li key={hotspot.id}>
                    <button
                      type="button"
                      aria-pressed={open}
                      aria-controls={open ? detailId : undefined}
                      onClick={() => setActiveHotspot(open ? null : hotspot.id)}
                      className="btn-tool min-h-11 w-full justify-start px-3 text-left text-sm"
                    >
                      <span className={open ? "text-ink" : "text-ink-2"}>
                        {hotspot.label}
                      </span>
                    </button>
                    {open && (
                      <div id={detailId} className="border-x border-b border-rule px-3 py-2.5">
                        <p className="text-sm text-ink-2">{hotspot.material}</p>
                        <p className="type-data mt-1 text-sm text-ink">{hotspot.price}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-rule pt-5">
            <h3 className="type-label mb-2">Specs at a glance</h3>
            <ul className="divide-y divide-rule border-b border-rule text-sm text-ink-2">
              {SPECS.map((spec) => (
                <li key={spec} className="py-2.5">
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
