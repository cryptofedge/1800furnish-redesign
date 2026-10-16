"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { ROOM_PHOTO, type RoomItem } from "./room-photo";

interface RoomPhotoProps {
  items: RoomItem[];
  hoveredSlug: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (product: Product, origin: { x: number; y: number }) => void;
  /** True while the product viewer is open: the idle sway stops. */
  paused: boolean;
  /** Slow idle sway; off under prefers-reduced-motion / data saver. */
  sway: boolean;
}

// The photo is drawn a little larger than the frame so it can be panned.
const SCALE = 1.08;
// A press that moves further than this is a drag to look around, not a click.
const CLICK_SLOP = 6;
// Panning never pushes a marker's center closer than this to the frame's edge.
const MARKER_MARGIN = 24;

const pad = (n: number) => String(n).padStart(2, "0");

// The photo layer keeps the photo's own aspect ratio and covers the frame
// (container query units), so % coordinates on it stay glued to the pieces.
const aspect = ROOM_PHOTO.width / ROOM_PHOTO.height;
const layerW = `max(100cqw, ${(aspect * 100).toFixed(3)}cqh)`;
const layerH = `max(100cqh, ${(100 / aspect).toFixed(3)}cqw)`;
const LAYER_STYLE = {
  width: layerW,
  height: layerH,
  left: `calc((100cqw - ${layerW}) * ${ROOM_PHOTO.focus[0]})`,
  top: `calc((100cqh - ${layerH}) * ${ROOM_PHOTO.focus[1]})`,
};

/** Where a % point of the photo lands once the photo is scaled about its center. */
const scaled = (p: number) => `${50 + (p - 50) * SCALE}%`;

/**
 * The hero's real room photo with the old 3D room's features: numbered
 * markers, a hover card with the catalog photo and price, the piece lighting
 * up, click to open the product viewer, drag to look around and an idle sway.
 */
export function RoomPhoto({ items, hoveredSlug, onHover, onSelect, paused, sway }: RoomPhotoProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const hoveredIndex = items.findIndex((item) => item.product.slug === hoveredSlug);
  const hovered = hoveredIndex >= 0 ? { item: items[hoveredIndex], index: hoveredIndex } : null;
  // Pan state lives in a ref and is written straight to the layer's style, so
  // dragging and swaying never re-render React.
  const pan = useRef({
    x: 0,
    target: 0,
    min: 0,
    max: 0,
    written: Number.NaN,
    dragging: false,
    pointerId: -1,
    startX: 0,
    startTarget: 0,
    moved: 0,
    lastInteract: Number.NEGATIVE_INFINITY,
  });

  // How far the photo can slide: never far enough to show an edge of the
  // photo or push a marker out of the frame.
  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;
    const measure = () => {
      const s = pan.current;
      const sw = stage.clientWidth;
      const w = layer.offsetWidth;
      const edgeMin = Math.min(0, sw - (layer.offsetLeft + (w * (1 + SCALE)) / 2));
      const edgeMax = Math.max(0, -(layer.offsetLeft + (w * (1 - SCALE)) / 2));
      let lo = edgeMin;
      let hi = edgeMax;
      for (const { hotspot } of items) {
        const center = layer.offsetLeft + w * (0.5 + (hotspot.at[0] / 100 - 0.5) * SCALE);
        lo = Math.max(lo, MARKER_MARGIN - center);
        hi = Math.min(hi, sw - MARKER_MARGIN - center);
      }
      if (lo > hi) {
        // The frame is too narrow to show every marker and still move: hold still.
        lo = hi = Math.min(edgeMax, Math.max(edgeMin, (lo + hi) / 2));
      }
      s.min = lo;
      s.max = hi;
      s.target = Math.min(s.max, Math.max(s.min, s.target));
      if (Number.isNaN(s.written)) s.x = s.target; // first layout: start in place, no slide
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [items]);

  // Stop animating while the hero is scrolled out of view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !onScreen || paused) return;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      const s = pan.current;
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      // Idle: drift slowly side to side, like the 3D room's sway. Any pointer
      // activity over the photo holds it still for 3s so markers stay put.
      if (sway && !s.dragging && t - s.lastInteract > 3000) {
        const mid = (s.min + s.max) / 2;
        const goal = mid + Math.sin((t / 1000) * 0.18) * ((s.max - s.min) / 2) * 0.7;
        s.target += (goal - s.target) * (1 - Math.exp(-dt * 0.8));
      }
      s.x += (s.target - s.x) * (1 - Math.exp(-dt * 10));
      if (Math.abs(s.x - s.written) > 0.05 || Number.isNaN(s.written)) {
        s.written = s.x;
        layer.style.transform = `translate3d(${s.x.toFixed(2)}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onScreen, paused, sway]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const s = pan.current;
    s.lastInteract = e.timeStamp;
    s.moved = 0;
    // Markers are buttons with their own clicks; everything else drags.
    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
    s.dragging = true;
    s.pointerId = e.pointerId;
    s.startX = e.clientX;
    s.startTarget = s.target;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const s = pan.current;
    s.lastInteract = e.timeStamp;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    // Released outside the photo before the drag was captured.
    if (e.buttons === 0) {
      s.dragging = false;
      return;
    }
    const dx = e.clientX - s.startX;
    s.moved = Math.max(s.moved, Math.abs(dx));
    // Capture only once it is clearly a drag: capturing on press would retarget
    // the click away from the piece under the pointer.
    if (s.moved > CLICK_SLOP && !e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    s.target = Math.min(s.max, Math.max(s.min, s.startTarget + dx));
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const s = pan.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    s.dragging = false;
    s.lastInteract = e.timeStamp;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const selectFrom = (product: Product) => (e: MouseEvent<HTMLElement>) => {
    if (pan.current.moved > CLICK_SLOP) return; // that was a drag, not a click
    const r = e.currentTarget.getBoundingClientRect();
    onSelect(product, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div
      ref={stageRef}
      role="group"
      aria-label="Room photo: numbered pieces are similar items from our catalog"
      className="relative h-full w-full cursor-grab touch-pan-y select-none overflow-hidden [container-type:size] active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => onHover(null)}
    >
      <div ref={layerRef} className="absolute will-change-transform" style={LAYER_STYLE}>
        {/* Photo and outlines are scaled together; markers below are not, so their text stays crisp. */}
        <div className="absolute inset-0" style={{ transform: `scale(${SCALE})` }}>
          <Image
            src={ROOM_PHOTO.src}
            alt={ROOM_PHOTO.alt}
            fill
            // The hero photo is the page's largest paint: fetch it first (`priority` is deprecated in Next 16).
            loading="eager"
            fetchPriority="high"
            draggable={false}
            sizes="(min-width: 1280px) 1320px, 110vw"
            className="object-cover"
          />
          {items.map(({ product, hotspot }) => {
            const [l, t, w, h] = hotspot.box;
            const highlighted = hoveredSlug === product.slug;
            return (
              <div
                key={product.slug}
                aria-hidden="true"
                onClick={selectFrom(product)}
                onPointerEnter={() => onHover(product.slug)}
                onPointerLeave={() => onHover(null)}
                className="absolute cursor-pointer"
                style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
              >
                {/* Highlight: the rest of the photo fades back and corner marks frame the piece. */}
                <span
                  className="room-focus pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{ opacity: highlighted ? 1 : 0 }}
                />
              </div>
            );
          })}
        </div>

        {items.map(({ product, hotspot }, i) => {
          const [x, y] = hotspot.at;
          const highlighted = hoveredSlug === product.slug;
          return (
            <div
              key={product.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: scaled(x), top: scaled(y), zIndex: highlighted ? 2 : 1 }}
            >
              {!highlighted && <span aria-hidden="true" className="room-ping" style={{ animationDelay: `${i * 0.6}s` }} />}
              <button
                type="button"
                onClick={selectFrom(product)}
                onPointerEnter={() => onHover(product.slug)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(product.slug)}
                onBlur={() => onHover(null)}
                aria-label={`${pad(i + 1)}: view ${product.name} up close`}
                className="type-data relative flex h-8 min-w-8 items-center justify-center border border-ink bg-well px-1 text-[11px] text-ink transition-colors hover:bg-accent sm:h-10 sm:min-w-10 sm:px-1.5 sm:text-xs"
                style={highlighted ? { background: "var(--color-accent)" } : undefined}
              >
                {pad(i + 1)}
              </button>
            </div>
          );
        })}
      </div>

      {/* The highlighted piece's catalog card, docked in the top corner away from
          the piece so it is never cut off by the frame. */}
      {hovered && (
        <div
          className={`pointer-events-none absolute top-3 z-10 w-44 border border-ink bg-well text-left ${
            hovered.item.hotspot.at[0] < 50 ? "right-3" : "left-3"
          }`}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-rule bg-studio">
            <Image
              src={hovered.item.product.image}
              alt=""
              fill
              sizes="176px"
              className={hovered.item.product.imageFit === "cover" ? "object-cover" : "object-contain p-2 mix-blend-multiply"}
            />
          </div>
          <div className="px-2.5 py-1.5">
            <p className="type-label">{pad(hovered.index + 1)} · Catalog item</p>
            <p className="mt-0.5 text-xs font-semibold leading-tight text-ink">{hovered.item.product.name}</p>
            <p className="type-data mt-0.5 text-[11px] text-ink-2">{formatCurrency(hovered.item.product.price)} / unit</p>
          </div>
        </div>
      )}
    </div>
  );
}
