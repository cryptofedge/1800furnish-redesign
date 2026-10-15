import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SECURITY_CATEGORIES } from "@/lib/nooksguard/categories";
import { NooksguardButton } from "./NooksguardButton";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home-page section for the Nooksguard security catalog: the emblem, the
 * brand line, live counts (computed from the data, never hardcoded) and a
 * hairline grid of every product family.
 */
export function NooksguardSection() {
  const live = SECURITY_CATEGORIES.filter((c) => c.status === "live");
  const liveModels = live.reduce((sum, c) => sum + c.productCount, 0);
  // Live families first (in catalog order), coming-soon ones at the end.
  const families = [...live, ...SECURITY_CATEGORIES.filter((c) => c.status !== "live")];

  return (
    <section
      aria-labelledby="nooksguard-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-8 sm:py-24"
    >
      <div className="section-rule grid gap-10 pt-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
        <div className="frame-marks mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
          <Image
            src="/nooksguard/emblem.webp"
            alt="Nooksguard emblem"
            width={512}
            height={512}
            sizes="(min-width: 1024px) 40vw, 384px"
            className="block aspect-square w-full border-2 border-ink"
          />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h2 id="nooksguard-title" className="type-display text-6xl text-ink sm:text-7xl lg:text-8xl">
              Nooksguard
            </h2>
            <p className="type-label mt-3 text-sm tracking-[0.3em]">Security Solutions</p>
          </div>

          <p className="type-display text-2xl text-ink sm:text-3xl">
            Verified protection. Confirmed, not assumed.
          </p>
          <p className="max-w-[62ch] text-ink-2">
            Security inspection and counter-surveillance equipment for screening people and
            baggage, field response and information protection. Every model is quoted and
            delivered through the same Merkabanooks process.
          </p>

          <dl className="grid max-w-md grid-cols-2 border-t-[3px] border-ink">
            <div className="flex flex-col-reverse justify-end gap-1 pr-3 pt-3">
              <dt className="type-label">Security models</dt>
              <dd className="type-display text-6xl text-ink sm:text-7xl">{liveModels}</dd>
            </div>
            <div className="flex flex-col-reverse justify-end gap-1 border-l border-rule pl-3 pt-3 sm:pl-5">
              <dt className="type-label">Product families</dt>
              <dd className="type-display text-6xl text-ink sm:text-7xl">{pad(live.length)}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <NooksguardButton size="lg" label="Explore Nooksguard" className="w-full sm:w-auto" />
            <Link href="/#quote" className="btn btn-secondary min-h-14 w-full sm:w-auto">
              Request a security quote
            </Link>
          </div>
        </div>
      </div>

      <ul
        aria-label="Nooksguard product families"
        className="catalog-grid mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {families.map((category, i) => {
          const isLive = category.status === "live";
          const body = (
            <>
              <span className="type-data mt-0.5 text-xs text-ink-3">{pad(i + 1)}</span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-semibold leading-snug text-ink">{category.label}</span>
                <span className="type-data text-xs text-ink-2">
                  {category.productCount} model{category.productCount === 1 ? "" : "s"}
                </span>
              </span>
            </>
          );
          return isLive ? (
            <li key={category.slug} className="cell lift">
              <Link
                href={`/security/${category.slug}`}
                className="group flex h-full min-h-16 items-start gap-3 p-4"
              >
                {body}
                <ArrowRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink transition-colors group-hover:text-accent-ink"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ) : (
            <li key={category.slug} className="cell flex min-h-16 items-start gap-3 p-4">
              {body}
              <span className="tag shrink-0 border-warn text-warn">Coming soon</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
