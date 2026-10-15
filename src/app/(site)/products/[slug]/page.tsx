import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/catalog";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function findProduct(slug: string) {
  const categories = await getCategories();
  for (const category of categories) {
    const product = category.products.find((p) => p.slug === slug);
    if (product) return { product, category };
  }
  return undefined;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.flatMap((c) => c.products.map((p) => ({ slug: p.slug })));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await findProduct(slug);
  if (!found) return {};
  const { product, category } = found;
  return {
    title: `${product.name} | ${SITE_NAME}`,
    description: `${product.description} ${category.label} · bulk pricing for institutions.`,
    ...(product.imagePending ? {} : { openGraph: { images: [{ url: product.image }] } }),
  };
}

// `params` is read inside a Suspense boundary so client navigations show the
// page frame instantly; every product is still prerendered for direct visits.
export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12" aria-busy="true" aria-label="Loading product">
      <div className="min-h-11" />
      <div className="section-rule mt-4 grid gap-6 pt-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
        <div className="h-[340px] bg-mist sm:h-[520px]" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 bg-mist" />
          <div className="h-12 w-3/4 bg-mist" />
          <div className="h-4 w-full bg-mist" />
        </div>
      </div>
    </div>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const found = await findProduct(slug);
  if (!found) notFound();
  const { product, category } = found;
  const related = category.products.filter((p) => p.slug !== product.slug);

  // Search-engine product data: only facts the catalog actually has.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    ...(product.imagePending ? {} : { image: `${SITE_URL}${product.image}` }),
    category: category.label,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "USD",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <script
        type="application/ld+json"
        // JSON-LD must be raw JSON; the values come from our own catalog.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="flex min-h-11 flex-wrap items-center gap-x-2 text-sm">
        <Link href={`/categories/${category.slug}`} className="link inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {category.label}
        </Link>
        <span aria-hidden="true" className="text-ink-3">/</span>
        <span className="text-ink-2" aria-current="page">
          {product.name}
        </span>
      </nav>

      <div className="section-rule mt-4 pt-6">
        <ProductDetail product={product} categoryLabel={category.label} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16 sm:mt-24">
          <div className="section-rule flex flex-wrap items-end justify-between gap-4 pt-6">
            <h2 id="related-title" className="type-display text-3xl text-ink sm:text-4xl">
              More from {category.label}
            </h2>
            <Link href={`/categories/${category.slug}`} className="link text-sm">
              See all {category.products.length}
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
