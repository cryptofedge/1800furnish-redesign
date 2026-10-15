"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, Pause, Play } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import type { RoomItem } from "./room/RoomScene";
import { ProductViewer } from "./ProductViewer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

// WebGL room is client-only and loaded on demand; the photo shows until it's ready.
const RoomScene = dynamic(() => import("./room/RoomScene").then((m) => m.RoomScene), {
  ssr: false,
  loading: () => null,
});

const BADGES = [
  "M/WBE Certified",
  "Transitional Housing Specialists",
  "Commercial Facilities",
  "Rapid Delivery Nationwide",
];

interface HeroCinematicProps {
  /** Opt-in fallback video (see public/videos/README.md); the photo is used otherwise. */
  videoSrcWebm?: string;
  videoSrcMp4?: string;
  posterSrc?: string;
  /** Live catalog figures for the read-out strip (computed by the page, never hardcoded). */
  stats?: { products: number; categories: number; securityModels: number };
  /** Catalog products placed in the live 3D room, in callout order. */
  roomItems?: RoomItem[];
}

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroCinematic({
  videoSrcWebm,
  videoSrcMp4,
  posterSrc = "/products/living-room.jpg",
  stats,
  roomItems = [],
}: HeroCinematicProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const hasVideo = Boolean(videoSrcWebm || videoSrcMp4);

  // 3D room state
  const [lowPower, setLowPower] = useState(false);
  const [force3D, setForce3D] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ product: Product; origin: { x: number; y: number } } | null>(null);

  const viewerOpen = viewer !== null;
  const show3D = roomItems.length > 0 && (!lowPower || force3D);
  // While the 360° viewer is open the room stays mounted but stops drawing, so
  // only one canvas renders and closing the viewer is instant (no reload).
  const roomActive = onScreen && !viewerOpen;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    // One-time read of browser capabilities unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLowPower(prefersReducedMotion || saveData);

    if (prefersReducedMotion) {
      videoRef.current?.pause();
    }

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

  // Pause the room's render loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const openViewer = useCallback((product: Product, origin: { x: number; y: number }) => {
    setHoveredSlug(null);
    setViewer({ product, origin });
  }, []);

  const openFromButton = (product: Product) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    openViewer(product, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  const handleReady = useCallback(() => setReady(true), []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const fallbackVisible = !show3D || !ready;

  return (
    // Transparent on purpose: the drafting grid on <body> shows through.
    <section className="w-full">
      {/* Top padding clears the fixed 72px site header. */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-32">
        {stats && (
          <p className="readout mb-3" aria-label="Catalog at a glance">
            <span>
              <b>{stats.products}</b> products
            </span>
            <span aria-hidden="true">/</span>
            <span>
              <b>{stats.categories}</b> categories
            </span>
            <span aria-hidden="true">/</span>
            <span>
              <b>{stats.securityModels}</b> Nooksguard security models
            </span>
            <span aria-hidden="true">/</span>
            <span>Bulk pricing on every item</span>
          </p>
        )}

        <div className="section-rule grid gap-8 pt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-12">
          <h1 ref={headlineRef} className="type-display text-5xl text-ink sm:text-6xl lg:text-7xl">
            Furnishing the spaces where communities rebuild.
          </h1>

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
        </div>

        {/* Live 3D room */}
        <figure className="m-0 mt-10 flex flex-col gap-2">
          <div className="frame-marks">
            <div
              ref={stageRef}
              className="relative aspect-[4/3] w-full overflow-hidden border border-ink sm:aspect-[16/9] lg:aspect-[21/9]"
            >
              {/* Fallback media: shown before the room is ready, on low-power devices, and behind the viewer. */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: fallbackVisible ? 1 : 0 }}
                aria-hidden={!fallbackVisible}
              >
                {hasVideo && !videoFailed ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      aria-hidden="true"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={posterSrc}
                      onPlay={() => setVideoPaused(false)}
                      onPause={() => setVideoPaused(true)}
                      onError={() => setVideoFailed(true)}
                    >
                      {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
                      {videoSrcMp4 && <source src={videoSrcMp4} type="video/mp4" />}
                    </video>
                    {fallbackVisible && (
                      <button
                        type="button"
                        onClick={toggleVideo}
                        aria-label="Pause background video"
                        aria-pressed={videoPaused}
                        className="btn-tool absolute bottom-3 right-3 z-10 h-11 w-11 p-0"
                      >
                        {videoPaused ? (
                          <Play className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Pause className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <Image src={posterSrc} alt="" fill priority sizes="100vw" className="object-cover" />
                )}
              </div>

              {show3D && (
                <div className="absolute inset-0">
                  <RoomScene
                    items={roomItems}
                    hoveredSlug={hoveredSlug}
                    onHover={setHoveredSlug}
                    onSelect={openViewer}
                    active={roomActive}
                    sway={!lowPower}
                    onReady={handleReady}
                  />
                </div>
              )}

              {show3D && ready && (
                <p className="tag pointer-events-none absolute bottom-3 left-3 border-ink">
                  <span className="hidden sm:inline">Drag to turn · Select a number to inspect in 360°</span>
                  <span className="sm:hidden">Swipe sideways to turn</span>
                </p>
              )}

              {lowPower && !force3D && roomItems.length > 0 && (
                <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => setForce3D(true)} className="btn btn-secondary bg-well">
                    <Box className="h-4 w-4" aria-hidden="true" />
                    View the 3D room
                  </button>
                </div>
              )}
            </div>
          </div>
          <figcaption className="fig-caption flex flex-wrap justify-between gap-x-4 gap-y-1 pt-1">
            <span>
              FIG. 01 — Single-occupancy unit
              {roomItems.length > 0 && ` · ${roomItems.length} catalog items`}
            </span>
            <span aria-hidden="true">{SITE_NAME.toUpperCase()}</span>
          </figcaption>
        </figure>

        {/* Parts list: the room's legend, and a full-size way in for touch and keyboard users. */}
        {roomItems.length > 0 && (
          <ol aria-label="Items in this room" className="catalog-grid mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {roomItems.map(({ product }, i) => {
              const highlighted = hoveredSlug === product.slug;
              return (
                <li key={product.slug} className="cell">
                  <button
                    type="button"
                    onClick={openFromButton(product)}
                    onPointerEnter={() => setHoveredSlug(product.slug)}
                    onPointerLeave={() => setHoveredSlug(null)}
                    onFocus={() => setHoveredSlug(product.slug)}
                    onBlur={() => setHoveredSlug(null)}
                    aria-label={`${pad(i + 1)}: open ${product.name} in the 360° viewer`}
                    className="flex h-full min-h-14 w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-paper"
                    style={highlighted ? { boxShadow: "inset 0 -3px 0 var(--color-accent)" } : undefined}
                  >
                    <span className="type-data mt-px text-xs text-ink-3">{pad(i + 1)}</span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-semibold leading-snug text-ink">{product.name}</span>
                      <span className="type-data text-xs text-ink-2">{formatCurrency(product.price)} / unit</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        <ul aria-label="Credentials" className="mt-10 grid grid-cols-2 border-t border-rule sm:grid-cols-4">
          {BADGES.map((label) => (
            <li
              key={label}
              className="border-b border-rule py-3 pr-3 text-sm font-semibold leading-snug text-ink even:border-l even:pl-3 sm:border-b-0 sm:border-l sm:pl-3 sm:first:border-l-0 sm:first:pl-0"
            >
              {label}
            </li>
          ))}
        </ul>
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
