"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
}

// No hero video ships yet (see public/videos/README.md), so the video layer is
// opt-in: pass videoSrcWebm/videoSrcMp4 once files exist. Until then the hero
// uses a still photo, avoiding three 404s on every page load.
export function HeroCinematic({
  videoSrcWebm,
  videoSrcMp4,
  posterSrc = "/products/living-room.jpg",
}: HeroCinematicProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const hasVideo = Boolean(videoSrcWebm || videoSrcMp4);

  // Parallax depth: the video drifts slower than scroll, headline content holds.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[100vh] min-h-[640px] w-full items-center overflow-hidden bg-charcoal-950"
    >
      {/* Background video layer */}
      <motion.div style={{ y: videoY }} className="absolute inset-0 -z-10 h-[120%]">
        {hasVideo && !videoFailed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            onError={() => setVideoFailed(true)}
          >
            {videoSrcWebm && <source src={videoSrcWebm} type="video/webm" />}
            {videoSrcMp4 && <source src={videoSrcMp4} type="video/mp4" />}
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${posterSrc})` }}
          />
        )}
        {/* Cinematic color + readability grade */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-transparent to-charcoal-950/40" />
      </motion.div>

      {/* Foreground content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 sm:px-10"
      >
        <div className="flex flex-wrap gap-3">
          {BADGES.map((label, i) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
              className="glass-pill rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-amber-300/90 sm:text-sm"
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                {label}
              </motion.span>
            </motion.span>
          ))}
        </div>

        <h1
          ref={headlineRef}
          className="max-w-4xl font-display text-5xl font-medium leading-[1.05] text-slate-200 sm:text-6xl lg:text-7xl"
        >
          Furnishing the spaces where communities rebuild.
        </h1>

        <p className="max-w-xl text-base text-slate-400 sm:text-lg">
          From transitional housing to municipal facilities and modern offices —
          {" "}{SITE_NAME} delivers commercial-grade furniture, security, and
          maintenance supplies at the scale institutions need.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/#quote"
            className={cn(
              "btn-gradient-border group flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3",
              "text-sm font-semibold text-charcoal-950 transition-colors hover:bg-amber-400 sm:text-base"
            )}
          >
            Request a Quote
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/#configurator"
            className="btn-gradient-border flex items-center gap-2 rounded-full border border-slate-200/20 bg-charcoal-900/40 px-6 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:border-amber-300/40 sm:text-base"
          >
            <PlayCircle className="h-4 w-4" />
            Explore Capabilities
          </Link>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-slate-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-9 w-5 rounded-full border border-slate-400/40 p-1">
          <div className="h-2 w-full rounded-full bg-amber-300" />
        </div>
      </motion.div>
    </section>
  );
}
