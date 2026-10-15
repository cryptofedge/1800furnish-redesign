"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, HeartHandshake, ShieldCheck, Sparkles, Landmark, Hotel, Home, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorCard {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Photo for the card (category banner photos in public/products). */
  image: string;
}

interface Sector {
  id: "institutional" | "commercial";
  label: string;
  tagline: string;
  cards: SectorCard[];
}

const SECTORS: Sector[] = [
  {
    id: "institutional",
    label: "Municipal & Non-Profit",
    tagline: "Transitional housing, senior programs, and public contracts",
    cards: [
      {
        icon: Home,
        title: "Transitional Housing",
        image: "/products/transitional-housing.jpg",
        description: "Full-unit furniture packages for rapid resident move-in.",
      },
      {
        icon: HeartHandshake,
        title: "Senior Programs",
        image: "/products/bedroom.jpg",
        description: "ADA-adjustable, pressure-relief furniture for care programs.",
      },
      {
        icon: Users,
        title: "Non-Profits",
        image: "/products/dining.jpg",
        description: "Flexible, grant-friendly procurement for community orgs.",
      },
      {
        icon: Landmark,
        title: "Municipal Contracts",
        image: "/products/clearance.jpg",
        description: "M/WBE certified vendor for city & county procurement.",
      },
    ],
  },
  {
    id: "commercial",
    label: "Commercial & Residential",
    tagline: "Offices, hospitality, and modern living spaces",
    cards: [
      {
        icon: Building2,
        title: "Commercial Offices",
        image: "/products/commercial.jpg",
        description: "Workstations and common areas built for daily throughput.",
      },
      {
        icon: Sparkles,
        title: "Modern Living",
        image: "/products/living-room.jpg",
        description: "Residential-grade furnishing for multi-unit developments.",
      },
      {
        icon: Hotel,
        title: "Hospitality",
        image: "/products/linens.jpg",
        description: "Durable, design-forward furniture for guest-facing spaces.",
      },
      {
        icon: ShieldCheck,
        title: "Janitorial Services",
        image: "/products/janitorial.jpg",
        description: "Facility maintenance supply programs, delivered on cadence.",
      },
    ],
  },
];

export function SectorShowcase() {
  const [activeId, setActiveId] = useState<Sector["id"]>("institutional");
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Standard tablist keyboard model: arrows move between tabs, Home/End jump.
  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % SECTORS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + SECTORS.length) % SECTORS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = SECTORS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActiveId(SECTORS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
      <header className="section-rule flex flex-col gap-3 pt-6">
        <span className="type-label">Who We Serve</span>
        <h2 className="type-display text-4xl text-ink sm:text-5xl lg:text-6xl">
          Two sides of the same supply chain.
        </h2>
      </header>

      <div
        role="tablist"
        aria-label="Sectors"
        className="mt-8 grid grid-cols-2 border-b border-ink sm:flex"
      >
        {SECTORS.map((sector, i) => {
          const selected = activeId === sector.id;
          return (
            <button
              key={sector.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`sector-tab-${sector.id}`}
              aria-selected={selected}
              aria-controls={`sector-panel-${sector.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(sector.id)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cn(
                "-mb-px flex min-h-11 items-center border-b-[3px] px-3 py-3 text-left text-sm font-semibold transition-colors sm:px-4",
                selected ? "border-accent text-ink" : "border-transparent text-ink-2 hover:text-ink"
              )}
            >
              {sector.label}
            </button>
          );
        })}
      </div>

      {/* One tabpanel per sector so every tab's aria-controls resolves; the
          inactive panel is hidden and only the shown one fades in. */}
      {SECTORS.map((sector) => {
        const selected = activeId === sector.id;
        return (
          <div
            key={sector.id}
            role="tabpanel"
            id={`sector-panel-${sector.id}`}
            aria-labelledby={`sector-tab-${sector.id}`}
            hidden={!selected}
            tabIndex={0}
          >
            <motion.div
              initial={false}
              animate={{ opacity: selected ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.15, ease: "easeOut" }}
            >
              <p className="mb-6 mt-6 max-w-[62ch] text-ink-2">{sector.tagline}</p>
              <ul className="catalog-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {sector.cards.map((card) => (
                  <SectorCardItem key={card.title} card={card} />
                ))}
              </ul>
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}

function SectorCardItem({ card }: { card: SectorCard }) {
  const Icon = card.icon;
  return (
    <li className="cell flex flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-rule bg-studio sm:aspect-[4/3]">
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h3 className="flex items-center gap-2 font-semibold leading-snug text-ink">
          <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
          {card.title}
        </h3>
        <p className="text-sm text-ink-2">{card.description}</p>
      </div>
    </li>
  );
}
