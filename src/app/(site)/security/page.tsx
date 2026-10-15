import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SECURITY_CATEGORIES, SECURITY_PRODUCT_TOTAL } from "@/lib/nooksguard/categories";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Security Solutions | ${SITE_NAME}`,
  description:
    "Nooksguard Security Solutions — X-ray inspection, CT screening, metal detection, body scanners, vehicle surveillance and counter-surveillance equipment.",
};

export default function SecurityIndexPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <header className="section-rule grid gap-6 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/nooksguard/emblem.webp"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="type-label">Nooksguard Security Solutions</span>
          </div>
          <h1 className="type-display text-5xl text-ink sm:text-6xl lg:text-7xl">
            Verified Protection. Confirmed, Not Assumed.
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-[62ch] text-ink-2">
            Integrated security inspection and counter-surveillance equipment for people,
            baggage, vehicles, field response and information protection.
          </p>
          <p className="type-data text-sm text-ink">
            {SECURITY_PRODUCT_TOTAL}+ models · {SECURITY_CATEGORIES.length} product families
          </p>
        </div>
      </header>

      <div className="catalog-grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {SECURITY_CATEGORIES.map((category) => {
          const live = category.status === "live";
          const modelCount = (
            <span className="type-data text-xs text-ink-2">
              {category.productCount} model{category.productCount === 1 ? "" : "s"}
            </span>
          );
          const content = (
            <>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold leading-snug text-ink">{category.label}</h2>
                {live ? (
                  <span className="tag shrink-0 border-ok text-ok">Live</span>
                ) : (
                  <span className="tag shrink-0 border-warn text-warn">Coming soon</span>
                )}
              </div>
              <p className="text-sm text-ink-2">{category.description}</p>
              <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                {modelCount}
                {live && (
                  <ArrowRight
                    className="h-4 w-4 text-ink transition-colors group-hover:text-accent-ink"
                    aria-hidden="true"
                  />
                )}
              </div>
            </>
          );

          return live ? (
            <Link
              key={category.slug}
              href={`/security/${category.slug}`}
              className="cell group flex min-h-[44px] flex-col gap-2 p-5 transition-colors hover:bg-paper"
            >
              {content}
            </Link>
          ) : (
            <div key={category.slug} className="cell flex flex-col gap-2 p-5">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
