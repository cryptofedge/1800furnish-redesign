"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject, type WheelEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Imperative controls, mirroring the 3D turntable's API so one panel drives either view. */
export interface PhotoZoomApi {
  zoomBy(factor: number): void;
  panBy(dx: number, dy: number): void;
  reset(): void;
}

interface View {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_CLICK_SCALE = 2.5;
const HOME: View = { scale: 1, x: 0, y: 0 };

/**
 * Keep the zoomed photo covering its box: it can't be dragged past its own
 * edges, and at scale 1 it always sits centred. `w`/`h` are the box size.
 */
function clampView(v: View, w: number, h: number): View {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale));
  const maxX = (w * (scale - 1)) / 2;
  const maxY = (h * (scale - 1)) / 2;
  return {
    scale,
    x: Math.min(maxX, Math.max(-maxX, v.x)),
    y: Math.min(maxY, Math.max(-maxY, v.y)),
  };
}

/** Zoom by `factor` keeping the point `(px, py)` (relative to the box centre) still. */
function zoomAround(v: View, factor: number, px: number, py: number): View {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
  const k = scale / v.scale;
  return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
}

interface PhotoStageProps {
  src: string;
  alt: string;
  apiRef?: RefObject<PhotoZoomApi | null>;
  /** Extra padding inside the box so the product isn't flush with the edges. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /**
   * For photos inside a scrolling page (not a fullscreen viewer): the wheel
   * scrolls the page instead of zooming, and touch scrolling stays free until
   * the photo is zoomed (double-tap or the +/− controls zoom in).
   */
  inPage?: boolean;
}

/**
 * The real product photo, zoomable: scroll or pinch to zoom, drag to move,
 * double-click (or double-tap) to jump in and back out. Used by the product
 * viewer and the home-page inspector instead of a stand-in 3D shape.
 */
export function PhotoStage({ src, alt, apiRef, className, sizes = "100vw", priority, inPage = false }: PhotoStageProps) {
  const [view, setView] = useState<View>(HOME);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef<number | null>(null);

  // A different photo always starts un-zoomed.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(HOME);
  }, [src]);

  // Expose the same controls the 3D stage offers (+/−, reset, arrow keys).
  useEffect(() => {
    if (!apiRef) return;
    const size = () => {
      const box = boxRef.current;
      return box ? { w: box.clientWidth, h: box.clientHeight } : { w: 0, h: 0 };
    };
    apiRef.current = {
      zoomBy(factor) {
        const { w, h } = size();
        setView((v) => clampView(zoomAround(v, factor, 0, 0), w, h));
      },
      panBy(dx, dy) {
        const { w, h } = size();
        setView((v) => clampView({ ...v, x: v.x + dx, y: v.y + dy }, w, h));
      },
      reset() {
        setView(HOME);
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef]);

  function boxPoint(clientX: number, clientY: number) {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return { px: 0, py: 0, w: 0, h: 0 };
    return { px: clientX - r.left - r.width / 2, py: clientY - r.top - r.height / 2, w: r.width, h: r.height };
  }

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    if (inPage) return;
    const { px, py, w, h } = boxPoint(e.clientX, e.clientY);
    const factor = Math.exp(-e.deltaY * 0.0015);
    setView((v) => clampView(zoomAround(v, factor, px, py), w, h));
  }

  function handleDoubleClick(e: MouseEvent<HTMLDivElement>) {
    const { px, py, w, h } = boxPoint(e.clientX, e.clientY);
    setView((v) => (v.scale > 1.05 ? HOME : clampView(zoomAround(v, DOUBLE_CLICK_SCALE / v.scale, px, py), w, h)));
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) setDragging(true);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2) {
      // Pinch: zoom by the change in finger distance, around their midpoint.
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const last = pinchDistance.current;
      pinchDistance.current = distance;
      if (last) {
        const { px, py, w, h } = boxPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
        setView((v) => clampView(zoomAround(v, distance / last, px, py), w, h));
      }
      return;
    }

    const { w, h } = boxPoint(e.clientX, e.clientY);
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    setView((v) => (v.scale > 1 ? clampView({ ...v, x: v.x + dx, y: v.y + dy }, w, h) : v));
  }

  function handlePointerEnd(e: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDistance.current = null;
    if (pointers.current.size === 0) setDragging(false);
  }

  const zoomed = view.scale > 1.01;

  return (
    <div
      ref={boxRef}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      className={cn(
        "relative h-full w-full select-none overflow-hidden bg-well",
        zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
      )}
      // Pinch and drag are handled here, so the browser mustn't scroll or zoom the
      // page — except an un-zoomed in-page photo, which must let the page scroll.
      style={{ touchAction: inPage && !zoomed ? "pan-y" : "none" }}
    >
      <div
        className={cn("absolute inset-0", !dragging && "transition-transform duration-150 ease-out")}
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          className={cn("object-contain", className ?? "p-6 sm:p-10")}
        />
      </div>
    </div>
  );
}
