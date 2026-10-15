import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById } from "@/lib/catalog";
import { ProductEditForm } from "./ProductEditForm";

interface ProductEditPageProps {
  params: Promise<{ id: string }>;
}

export const instant = false;

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All products
      </Link>
      <header className="section-rule flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pt-4">
        <h1 className="type-display text-4xl text-ink">Edit product</h1>
        <p className="type-data text-sm text-ink-3">{product.categorySlug}</p>
      </header>

      <ProductEditForm product={product} />
    </div>
  );
}
