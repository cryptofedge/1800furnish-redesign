import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { SECURITY_CATEGORIES, SECURITY_PRODUCT_TOTAL } from "@/lib/nooksguard/categories";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Security Solutions | ${SITE_NAME}`,
  description:
    "Nooksguard Security Solutions — X-ray inspection, CT screening, metal detection, body scanners, vehicle surveillance and counter-surveillance equipment.",
};

export default function SecurityIndexPage() {
  return (
    <div className="bg-charcoal-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10">
        <div className="mb-4 flex items-center gap-3">
          <Image src="/nooksguard/logo.webp" alt="Nooksguard Security Solutions" width={40} height={40} className="h-10 w-10" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Nooksguard Security Solutions
          </span>
        </div>
        <h1 className="font-display text-3xl font-medium text-slate-200 sm:text-4xl">
          Verified Protection. Confirmed, Not Assumed.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Integrated security inspection and counter-surveillance equipment for people,
          baggage, vehicles, field response and information protection — {SECURITY_PRODUCT_TOTAL}+
          models across {SECURITY_CATEGORIES.length} product families.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_CATEGORIES.map((category) => {
            const live = category.status === "live";
            const content = (
              <>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="mb-1 text-base font-semibold text-slate-200">{category.label}</h2>
                <p className="text-sm text-slate-400">{category.description}</p>
                <p className="mt-3 text-xs font-medium text-blue-300">
                  {live ? (
                    <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {category.productCount} model{category.productCount === 1 ? "" : "s"} <ArrowRight className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="text-slate-500">{category.productCount} model{category.productCount === 1 ? "" : "s"} · coming soon</span>
                  )}
                </p>
              </>
            );

            return live ? (
              <Link
                key={category.slug}
                href={`/security/${category.slug}`}
                className="glass-panel group rounded-2xl p-6 transition-colors hover:border-blue-400/40"
              >
                {content}
              </Link>
            ) : (
              <div key={category.slug} className="glass-panel group rounded-2xl p-6 opacity-60">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
