"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/categories";

const NAV_LINKS = [
  { label: "Shop", href: "/categories" },
  { label: "Capabilities", href: "/#configurator" },
  { label: "Sectors", href: "/#sectors" },
  { label: "Process", href: "/#process" },
  { label: "Security", href: "/security" },
];

interface SiteHeaderProps {
  categories: Pick<Category, "slug" | "label">[];
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 bg-paper transition-colors duration-150",
        scrolled || menuOpen ? "border-b border-ink" : "border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        <Link href="/" className="type-display text-2xl leading-none text-ink sm:text-[1.75rem]">
          Merkabanooks
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#quote" className="btn btn-primary hidden sm:inline-flex">
            Request a quote
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="btn-tool h-11 w-11 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-rule bg-paper md:hidden"
          >
            <div className="max-h-[75vh] overflow-y-auto px-4 pb-8 pt-4 sm:px-8">
              <nav aria-label="Main" className="flex flex-col border-b border-rule">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="type-display border-t border-rule py-3 text-3xl text-ink transition-colors hover:text-accent-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <p className="type-label mb-2 mt-6">Shop by category</p>
              <div className="catalog-grid grid-cols-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="cell px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-mist"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/#quote"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary mt-6 w-full"
              >
                Request a quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
