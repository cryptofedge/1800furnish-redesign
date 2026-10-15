import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SECURITY_CATEGORIES, getSecurityCategory } from "@/lib/nooksguard/categories";
import { SITE_NAME } from "@/lib/site";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return SECURITY_CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getSecurityCategory(slug);
  if (!category) return {};
  return {
    title: `${category.label} | Nooksguard | ${SITE_NAME}`,
    description: category.description,
  };
}

// `params` is read inside a Suspense boundary so client navigations can show
// the page shell instantly (Next 16 instant navigation); every family is still
// prerendered by generateStaticParams for direct visits.
export default function SecurityCategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<SecurityCategorySkeleton />}>
      <SecurityCategoryContent params={params} />
    </Suspense>
  );
}

/** Shown instantly on navigation while the category's content streams in. */
function SecurityCategorySkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16 sm:px-8" aria-busy="true" aria-label="Loading category">
      <div className="min-h-11" />
      <div className="section-rule mt-4 pt-6">
        <div className="h-12 w-2/3 max-w-lg bg-mist sm:h-16 lg:h-20" />
        <div className="mt-6 h-4 w-full max-w-md bg-mist" />
      </div>
      <div className="mt-8 h-48 w-full bg-mist sm:h-64 lg:h-80" />
    </div>
  );
}

async function SecurityCategoryContent({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getSecurityCategory(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
      <Link
        href="/security"
        className="mb-6 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All security categories
      </Link>

      <header className="section-rule grid gap-6 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <h1 className="type-display text-5xl text-ink sm:text-6xl lg:text-7xl">{category.label}</h1>
        <p className="max-w-[62ch] text-ink-2">{category.description}</p>
      </header>

      {category.status === "coming-soon" ? (
        <div className="mt-10 border-y border-rule py-8">
          <p className="font-semibold text-ink">
            Full specs and imagery for this category are being added.
          </p>
          <p className="mt-2 max-w-[62ch] text-sm text-ink-2">
            In the meantime, call (516) 980-2444 or email sales@Nooksguard.com for
            {" "}{category.productCount} {category.label.toLowerCase()} model{category.productCount === 1 ? "" : "s"}.
          </p>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-16">
          {category.tiers.map((tier) => {
            // When some cards in a row have photos, the rest get a matching
            // placeholder well so names and specs stay aligned across the row.
            const tierHasImages = tier.products.some((p) => p.image);
            return (
              <section key={tier.id}>
                <h2 className="type-display text-2xl text-ink">{tier.label}</h2>
                {tier.description && <p className="mt-2 max-w-[62ch] text-sm text-ink-2">{tier.description}</p>}
                <ul className="catalog-grid mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {tier.products.map((product) => (
                    <li key={product.slug} className="cell flex flex-col">
                      {!product.image && tierHasImages && (
                        <div className="flex aspect-[4/3] w-full items-center justify-center border-b border-rule bg-mist">
                          <span className="type-label">Photo pending</span>
                        </div>
                      )}
                      {product.image && (
                        <div className="relative aspect-[4/3] w-full border-b border-rule bg-studio">
                          <Image
                            src={product.image}
                            alt={product.model}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                            className="object-contain p-4 mix-blend-multiply"
                          />
                          {product.imageNote && (
                            <span className="tag absolute bottom-2 left-2">{product.imageNote}</span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-4">
                        <h3 className="type-data text-sm font-medium text-ink">{product.model}</h3>
                        <p className="mt-1 font-semibold leading-snug text-ink">{product.name}</p>
                        <dl className="mt-4 border-t border-rule">
                          {product.specs.map((spec) => (
                            <div
                              key={spec.label}
                              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-3 border-b border-rule py-2"
                            >
                              <dt className="type-label">{spec.label}</dt>
                              <dd className="type-data break-words text-xs text-ink">{spec.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
