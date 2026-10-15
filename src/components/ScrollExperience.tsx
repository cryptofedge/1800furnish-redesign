"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = ["Blueprint", "Structure", "Furnishing", "Move-In Ready"];

export function ScrollExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const structureRef = useRef<SVGGElement>(null);
  const furnitureRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGGElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      prefersReducedMotion ||
      !sectionRef.current ||
      !structureRef.current ||
      !furnitureRef.current ||
      !glowRef.current
    ) {
      setActiveStep(STEPS.length - 1);
      return;
    }

    gsap.set(furnitureRef.current.children, { y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=250%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          setActiveStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length)));
        },
      },
    });

    tl.to(structureRef.current, { opacity: 1, duration: 1 }, 0)
      .to(furnitureRef.current.children, { opacity: 1, y: 0, stagger: 0.15, duration: 1 }, 1)
      .to(glowRef.current, { opacity: 1, duration: 1 }, 2);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex h-screen w-full items-center overflow-hidden bg-paper">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 sm:px-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        <div className="section-rule flex flex-col gap-5 pt-5">
          <h2 className="type-display text-3xl text-ink sm:text-4xl">
            From Blueprint to Furnished Facility
          </h2>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-1">
            {STEPS.map((step, i) => (
              <li
                key={step}
                aria-current={i === activeStep ? "step" : undefined}
                className={cn(
                  "flex items-baseline gap-2 border-l-[3px] py-1.5 pl-3 text-sm font-semibold transition-colors duration-150",
                  i === activeStep
                    ? "border-accent text-ink"
                    : i < activeStep
                      ? "border-ink text-ink"
                      : "border-rule text-ink-3"
                )}
              >
                <span className="type-data text-xs font-normal text-ink-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="max-w-[62ch] text-sm text-ink-2 lg:max-w-xs">
            Scroll to watch a facility go from floor plan to fully furnished —
            the same process our team runs for every institutional rollout.
          </p>
        </div>

        <div className="panel relative mx-auto aspect-[4/3] w-full max-w-2xl overflow-hidden">
          <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
            {/* Drafting grid: always visible */}
            <g className="stroke-rule" strokeWidth="0.5" fill="none">
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 20} y1={0} x2={i * 20} y2={300} />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} />
              ))}
            </g>

            {/* Base blueprint layer: thin ink linework, always visible */}
            <g className="stroke-ink" strokeWidth="1" fill="none">
              <rect x="30" y="30" width="340" height="240" />
              <line x1="30" y1="150" x2="120" y2="150" />
              <rect x="260" y="30" width="60" height="90" />
              {/* door swing */}
              <path d="M160 270 V230 A40 40 0 0 1 200 270" strokeDasharray="3 3" />
              {/* overall dimension line, top */}
              <path d="M30 18 H370 M30 13 V23 M370 13 V23" strokeWidth="0.75" />
            </g>

            {/* Structure: walls are built (heavy ink), floor takes a paper fill */}
            <g ref={structureRef} opacity="0">
              <rect x="30" y="30" width="340" height="240" className="fill-paper" />
              <g className="stroke-ink" strokeWidth="6" fill="none" strokeLinecap="square">
                <path d="M160 270 H30 V30 H370 V270 H200" />
                <line x1="30" y1="150" x2="120" y2="150" />
                <path d="M260 30 V120 H320 V30" strokeWidth="4" />
              </g>
              <path d="M160 270 V230 A40 40 0 0 1 200 270" className="stroke-ink" strokeWidth="1" fill="none" />
            </g>

            {/* Furniture: fades + rises in, staggered (one child per piece) */}
            <g ref={furnitureRef}>
              {/* sofa */}
              <g opacity="0">
                <rect x="60" y="180" width="90" height="50" className="fill-ink-2" />
                <rect x="60" y="180" width="90" height="12" className="fill-ink" />
              </g>
              {/* coffee table */}
              <g opacity="0">
                <rect x="180" y="190" width="60" height="40" className="fill-well stroke-ink" strokeWidth="1.5" />
              </g>
              {/* round table + chairs */}
              <g opacity="0">
                <circle cx="300" cy="210" r="26" className="fill-well stroke-ink" strokeWidth="1.5" />
                <rect x="294" y="172" width="12" height="9" className="fill-ink" />
                <rect x="294" y="239" width="12" height="9" className="fill-ink" />
                <rect x="262" y="204" width="9" height="12" className="fill-ink" />
                <rect x="329" y="204" width="9" height="12" className="fill-ink" />
              </g>
              {/* desk */}
              <g opacity="0">
                <rect x="60" y="60" width="70" height="30" className="fill-ink-2" />
                <rect x="85" y="96" width="20" height="14" className="fill-well stroke-ink" strokeWidth="1.5" />
              </g>
            </g>

            {/* Finished pass: drawing title block stamps the plan as complete */}
            <g ref={glowRef} opacity="0">
              <rect x="262" y="276" width="108" height="18" className="fill-well stroke-ink" strokeWidth="1" />
              <text
                x="316"
                y="288.5"
                textAnchor="middle"
                fontSize="8"
                className="type-data fill-ink"
                letterSpacing="0.5"
              >
                MOVE-IN READY
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
