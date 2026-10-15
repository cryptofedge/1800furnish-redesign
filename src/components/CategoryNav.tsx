"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: Pick<Category, "slug" | "label">[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Product categories"
      className="sticky top-[72px] z-30 flex items-stretch border-b border-ink bg-paper"
    >
      {/* min-w-0 lets this flex item shrink so it scrolls internally; relative
          makes it the containing block for the absolutely positioned sr-only
          label below, which otherwise escapes the clip and widens the page on
          phones. */}
      <div className="scrollbar-hide relative mx-auto flex w-full min-w-0 max-w-7xl flex-1 items-stretch overflow-x-auto px-4 sm:px-8">
        {categories.map((category, i) => {
          const href = `/categories/${category.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={category.slug}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-baseline gap-1.5 whitespace-nowrap border-b-[3px] px-3 py-3 text-sm font-semibold transition-colors",
                active
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-2 hover:text-ink"
              )}
            >
              <span className="type-data text-[11px] text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              {category.label}
            </Link>
          );
        })}

        <Link
          href="/security"
          title="Nooksguard Security Solutions"
          className="ml-auto flex shrink-0 items-center gap-2 border-l border-rule pl-4 text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
        >
          <Image src="/nooksguard/emblem.webp" alt="" width={24} height={24} className="h-6 w-6" />
          <span className="hidden sm:inline">Nooksguard Security</span>
          <span className="sr-only sm:hidden">Nooksguard Security</span>
        </Link>
      </div>
    </nav>
  );
}
