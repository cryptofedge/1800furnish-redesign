"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const BADGES = [
  "M/WBE Certified",
  "Transitional Housing Specialists",
  "Commercial Facilities",
  "Rapid Delivery Nationwide",
];

interface HeroCinematicProps {
  videoSrcWebm?: string;
  videoSrcMp4?: string;
  posterSrc?: string;
  /** Live catalog figures for the read-out strip (computed by the page, never hardcoded). */
  stats?: { products: number; categories: number; securityModels: number };
}

// No hero video ships yet (see public/videos/README.md), so the video layer is
// opt-in: pass videoSrcWebm/videoSrcMp4 once files exist. Until then the hero
// uses a still photo, avoiding three 404s on every page load.
export function HeroCinematic({
  videoSrcWebm,
  videoSrcMp4,
  posterSrc = "/products/living-room.jpg",
  stats,
}: HeroCinematicProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const hasVideo = Boolean(videoSrcWebm || videoSrcMp4);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

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
        <div className="section-rule grid gap-10 pt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-8">
            <h1
              ref={headlineRef}
              className="type-display text-5xl text-ink sm:text-7xl lg:text-8xl"
            >
              Furnishing the spaces where communities rebuild.
            </h1>

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

            <ul
              aria-label="Credentials"
              className="mt-auto grid grid-cols-2 border-t border-rule sm:grid-cols-4"
            >
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

          <figure className="m-0 flex flex-col gap-2">
          <div className="frame-marks lg:flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink bg-well lg:aspect-auto lg:h-full lg:min-h-[28rem]">
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
                <button
                  type="button"
                  onClick={toggleVideo}
                  aria-label="Pause background video"
                  aria-pressed={videoPaused}
                  className="btn-tool absolute bottom-3 right-3 h-11 w-11 p-0"
                >
                  {videoPaused ? (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </>
            ) : (
              <Image
                src={posterSrc}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          </div>
          <figcaption className="fig-caption flex justify-between gap-4 pt-1">
            <span>FIG. 01 — Furnished living space</span>
            <span aria-hidden="true">{SITE_NAME.toUpperCase()}</span>
          </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
