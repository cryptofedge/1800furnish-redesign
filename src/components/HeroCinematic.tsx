"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { ROOMS, type RoomItem } from "./room/room-photo";
import { RoomPhoto } from "./room/RoomPhoto";
import { ProductViewer } from "./ProductViewer";
import { Ticker } from "./Ticker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const BADGES = [
  "M/WBE Certified",
  "Transitional Housing Specialists",
  "Commercial Facilities",
  "Rapid Delivery Nationwide",
  "Bulk pricing on every item",
];

interface HeroCinematicProps {
  /** Live catalog figures for the read-out strip (computed by the page, never hardcoded). */
  stats?: { products: number; categories: number; securityModels: number };
  /** Catalog products marked on the room photos, room by room in marker order. */
  roomItems?: RoomItem[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroCinematic({ stats, roomItems = [] }: HeroCinematicProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Room photo state
  const [lowPower, setLowPower] = useState(false);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [viewer, setViewer] = useState<{ product: Product; origin: { x: number; y: number } } | null>(null);

  // Rooms that have marked pieces, each with the number of its first marker
  // (numbering runs on across rooms, matching the parts list).
  const roomsWithItems = ROOMS.flatMap((room) => {
    const items = roomItems.filter((item) => item.room === room.id);
    return items.length > 0 ? [{ room, items, start: roomItems.indexOf(items[0]) + 1 }] : [];
  });
  const rooms = roomsWithItems.length > 0 ? roomsWithItems : [{ room: ROOMS[0], items: [], start: 1 }];
  const activeIndex = Math.max(0, rooms.findIndex((r) => r.room.id === roomId));
  const activeRoom = rooms[activeIndex];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    // One-time read of browser capabilities unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLowPower(prefersReducedMotion || saveData);

    if (!headlineRef.current || prefersReducedMotion) return;

    const split = new SplitText(headlineRef.current, {
      type: "lines,words",
      linesClass: "overflow-hidden",
    });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(split.words, {
      yPercent: 120,
      opacity: 0,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.045,
    });

    return () => {
      tl.kill();
      split.revert();
    };
  }, []);

  const openViewer = useCallback((product: Product, origin: { x: number; y: number }) => {
    setHoveredSlug(null);
    setViewer({ product, origin });
  }, []);

  const showRoom = (id: string) => {
    setRoomId(id);
    setHoveredSlug(null);
  };

  // Tabs pattern: left/right arrows move between rooms.
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = rooms[(activeIndex + (e.key === "ArrowRight" ? 1 : rooms.length - 1)) % rooms.length].room.id;
    showRoom(next);
    document.getElementById(`room-tab-${next}`)?.focus();
  };

  // Pointing at a piece in the parts list shows its room, so the highlight is visible.
  const highlightFromList = (slug: string, room: string) => {
    setRoomId(room);
    setHoveredSlug(slug);
  };

  const openFromButton = (product: Product) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    openViewer(product, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    // Transparent: sits directly on the plain white page.
    <section className="w-full">
      {/* Top padding clears the fixed 72px site header. */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-32">
        <p className="readout mb-3">
          <span>Contract furniture</span>
          <span aria-hidden="true">/</span>
          <span>Nooksguard security</span>
          <span aria-hidden="true">/</span>
          <span>Facility &amp; maintenance supply</span>
        </p>

        <div className="section-rule pt-6">
          {/* Line breaks are set by hand from sm up so the big type breaks on phrases. */}
          <h1
            ref={headlineRef}
            className="type-display text-[clamp(3.25rem,8.6vw,8.75rem)] text-ink [text-wrap:wrap]"
          >
            Furnishing the spaces<br className="hidden sm:inline" /> where communities
            <br className="hidden sm:inline" /> <span className="type-outline">rebuild.</span>
          </h1>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-12">
          <div className="flex min-w-0 flex-col gap-6">
            <p className="max-w-[62ch] text-base text-ink-2 sm:text-lg">
              From transitional housing to municipal facilities and modern offices —
              {" "}{SITE_NAME} delivers commercial-grade furniture, security, and
              maintenance supplies at the scale institutions need.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/#quote" className="btn btn-primary w-full sm:w-auto">
                Request a quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/#configurator" className="btn btn-secondary w-full sm:w-auto">
                Explore capabilities
              </Link>
            </div>
          </div>

          {/* Live catalog figures, computed by the page (never hardcoded). */}
          {stats && (
            <dl className="grid grid-cols-3 border-t-[3px] border-ink">
              {[
                { value: stats.products, label: "Products" },
                { value: stats.categories, label: "Categories" },
                { value: stats.securityModels, label: "Security models" },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className={`flex flex-col-reverse justify-end gap-1 pt-3 ${i > 0 ? "border-l border-rule pl-3 sm:pl-5" : "pr-3"}`}
                >
                  <dt className="type-label">{label}</dt>
                  <dd className="type-display text-6xl text-ink sm:text-7xl lg:text-8xl">{pad(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Real room photos with numbered catalog pieces (hover, select, drag to look
            around); tabs switch rooms. */}
        <figure className="m-0 mt-10 flex flex-col gap-2">
          {rooms.length > 1 && (
            <div role="tablist" aria-label="Rooms" className="mb-3 flex flex-wrap gap-2" onKeyDown={onTabKey}>
              {rooms.map(({ room, items, start }, i) => {
                const selected = i === activeIndex;
                return (
                  <button
                    key={room.id}
                    type="button"
                    role="tab"
                    id={`room-tab-${room.id}`}
                    aria-selected={selected}
                    aria-controls={`room-panel-${room.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => showRoom(room.id)}
                    className={`inline-flex min-h-11 items-center gap-2 border bg-well px-3 text-sm font-semibold transition-colors ${
                      selected ? "border-ink text-ink" : "border-rule text-ink-2 hover:border-ink hover:text-ink"
                    }`}
                    style={selected ? { boxShadow: "inset 0 -3px 0 var(--color-accent)" } : undefined}
                  >
                    <span className="type-data text-xs font-normal text-ink-3">
                      {pad(start)}–{pad(start + items.length - 1)}
                    </span>
                    {room.label}
                  </button>
                );
              })}
            </div>
          )}
          <div className="frame-marks">
            <div className="relative aspect-[3/2] w-full border border-rule bg-studio sm:aspect-[16/9] lg:aspect-[21/9]">
              {/* Every room stays mounted and crossfades; the hidden one is inert and stops swaying. */}
              {rooms.map(({ room, items, start }, i) => {
                const selected = i === activeIndex;
                return (
                  <div
                    key={room.id}
                    id={`room-panel-${room.id}`}
                    role={rooms.length > 1 ? "tabpanel" : undefined}
                    aria-labelledby={rooms.length > 1 ? `room-tab-${room.id}` : undefined}
                    inert={!selected}
                    className="absolute inset-0 transition-[opacity,visibility] duration-500"
                    style={{ opacity: selected ? 1 : 0, visibility: selected ? "visible" : "hidden" }}
                  >
                    <RoomPhoto
                      photo={room.photo}
                      label={room.label}
                      items={items}
                      firstNumber={start}
                      eager={i === 0}
                      hoveredSlug={hoveredSlug}
                      onHover={setHoveredSlug}
                      onSelect={openViewer}
                      paused={viewer !== null || !selected}
                      sway={!lowPower}
                    />
                  </div>
                );
              })}
              {roomItems.length > 0 && (
                <p className="tag pointer-events-none absolute bottom-3 left-3 border-ink">
                  <span className="hidden sm:inline">Select a number to see the catalog item · Drag to look around</span>
                  <span className="sm:hidden">Tap a number · Swipe sideways to look around</span>
                </p>
              )}
            </div>
          </div>
          <figcaption className="fig-caption flex flex-wrap justify-between gap-x-4 gap-y-1 pt-1">
            <span>
              FIG. {pad(activeIndex + 1)} — {activeRoom.room.label}
              {activeRoom.items.length > 0 && ` · ${activeRoom.items.length} similar catalog items`}
            </span>
            <span aria-hidden="true">{SITE_NAME.toUpperCase()}</span>
          </figcaption>
        </figure>

        {/* Parts list: the room's legend, and a full-size way in for touch and keyboard users. */}
        {roomItems.length > 0 && (
          <ol aria-label="Items in these rooms" className="catalog-grid mt-6 grid-cols-1 sm:grid-cols-3 xl:grid-cols-6">
            {roomItems.map(({ product, room }, i) => {
              const highlighted = hoveredSlug === product.slug;
              return (
                <li key={product.slug} className="cell lift reveal">
                  <button
                    type="button"
                    onClick={openFromButton(product)}
                    onPointerEnter={() => highlightFromList(product.slug, room)}
                    onPointerLeave={() => setHoveredSlug(null)}
                    onFocus={() => highlightFromList(product.slug, room)}
                    onBlur={() => setHoveredSlug(null)}
                    aria-label={`${pad(i + 1)}: view ${product.name} up close`}
                    className="group flex h-full w-full flex-row text-left sm:flex-col"
                    style={highlighted ? { boxShadow: "inset 0 -3px 0 var(--color-accent)" } : undefined}
                  >
                    {/* The catalog product itself, so buyers see exactly what they would order. */}
                    <span className="relative block aspect-[4/3] w-32 shrink-0 overflow-hidden border-r border-rule bg-studio sm:w-full sm:border-b sm:border-r-0">
                      <Image
                        src={product.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 200px, (min-width: 640px) 33vw, 128px"
                        className={
                          product.imageFit === "cover"
                            ? "object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                            : "object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.05]"
                        }
                      />
                    </span>
                    <span className="flex items-start gap-3 self-center px-3 py-3 sm:self-auto">
                      <span className="type-data mt-px text-xs text-ink-3">{pad(i + 1)}</span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-semibold leading-snug text-ink">{product.name}</span>
                        <span className="type-data text-xs text-ink-2">{formatCurrency(product.price)} / unit</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

      </div>

      <Ticker
        label="Credentials"
        items={stats ? [...BADGES, `${stats.securityModels} Nooksguard security models`] : BADGES}
      />

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
