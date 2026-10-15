"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

interface TickerProps {
  /** Short, true statements about the business. Rendered in display type. */
  items: string[];
  /** Accessible name for the band. */
  label: string;
}

/**
 * Full-bleed orange ticker band. The list scrolls endlessly (CSS, see
 * .marquee in globals.css), pauses on hover, and has a real pause button so
 * keyboard and touch users can stop the motion (WCAG 2.2.2). Reduced-motion
 * users get a still band.
 */
export function Ticker({ items, label }: TickerProps) {
  const [paused, setPaused] = useState(false);

  const row = (copy: "a" | "b") => (
    <ul aria-hidden={copy === "b" || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={`${copy}-${item}`} className="flex items-center">
          <span className="type-display whitespace-nowrap px-5 text-3xl text-ink sm:px-8 sm:text-5xl">
            {item}
          </span>
          <span aria-hidden="true" className="block h-2.5 w-2.5 rotate-45 bg-ink sm:h-3.5 sm:w-3.5" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={label} className="flex items-stretch border-y-[3px] border-ink bg-accent">
      <div className="marquee min-w-0 flex-1 py-3 sm:py-4" data-paused={paused}>
        <div className="marquee-track">
          {row("a")}
          {row("b")}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label="Pause the scrolling highlights"
        aria-pressed={paused}
        className="flex w-12 shrink-0 items-center justify-center border-l-[3px] border-ink bg-well text-ink transition-colors hover:bg-mist sm:w-16"
      >
        {paused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
      </button>
    </section>
  );
}
