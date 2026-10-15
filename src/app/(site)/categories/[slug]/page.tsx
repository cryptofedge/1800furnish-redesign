import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategories, getCategoryBySlug } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site";
import { ProductGrid } from "@/components/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.label} | ${SITE_NAME}`,
    description: category.description,
  };
}

// `params` is read inside a Suspense boundary so client navigations can show
// the page shell instantly (Next 16 instant navigation); known slugs are still
// fully prerendered by generateStaticParams for direct visits.
export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

/** Shown instantly on navigation while the category's content streams in. */
function CategorySkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-12 sm:px-8" aria-busy="true" aria-label="Loading category">
      <div className="min-h-11" />
      <div className="section-rule mt-4 pt-6">
        <div className="h-12 w-2/3 max-w-lg bg-mist sm:h-16 lg:h-20" />
        <div className="mt-6 h-4 w-full max-w-md bg-mist" />
      </div>
      <div className="mt-8 h-48 w-full bg-mist sm:h-64 lg:h-80" />
    </div>
  );
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const imageSrc = `/products/${category.slug}.jpg`;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <Link href="/categories" className="link inline-flex min-h-11 items-center gap-1.5 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All categories
      </Link>

      <header className="section-rule mt-4 grid gap-6 pt-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
        <h1 className="type-display text-5xl text-ink sm:text-6xl lg:text-7xl">{category.label}</h1>
        <div className="flex flex-col gap-3">
          <p className="max-w-[62ch] text-ink-2">{category.description}</p>
          <p className="type-data text-sm text-ink">{category.products.length} items</p>
        </div>
      </header>

      <div className="relative mt-8 h-48 w-full overflow-hidden border border-rule bg-well sm:h-64 lg:h-80">
        <Image
          src={imageSrc}
          alt={category.label}
          fill
          priority
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-10">
        <ProductGrid products={category.products} />
      </div>
    </div>
  );
}
