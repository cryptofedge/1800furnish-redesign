"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateProduct, type UpdateProductState } from "@/app/admin/products/actions";
import type { Product } from "@/lib/categories";

interface ProductEditFormProps {
  product: Product & { id: string; categorySlug: string };
}

const initialState: UpdateProductState = {};

export function ProductEditForm({ product }: ProductEditFormProps) {
  const action = updateProduct.bind(null, product.id, product.categorySlug);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        <p className="type-label mb-1.5">Photo</p>
        <div className="relative aspect-square w-full overflow-hidden border border-rule bg-well">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, not a next/image-compatible URL
            <img src={preview} alt={product.name} className="h-full w-full object-contain p-4" />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 280px, 100vw"
              className="object-contain p-4"
            />
          )}
        </div>
        <label className="btn btn-secondary mt-3 w-full focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent-ink">
          Replace photo
          <input
            type="file"
            name="image"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      <div className="panel flex flex-col gap-5 p-5 sm:p-6">
        <div>
          <label htmlFor="name" className="type-label mb-1.5 block">
            Name
          </label>
          <input id="name" name="name" defaultValue={product.name} required className="field" />
        </div>

        <div>
          <label htmlFor="description" className="type-label mb-1.5 block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
            required
            rows={3}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="price" className="type-label mb-1.5 block">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1}
            defaultValue={product.price}
            required
            className="field type-data max-w-[160px]"
          />
        </div>

        {state.error && (
          <p role="alert" className="border border-danger px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}
        <div role="status" aria-live="polite">
          {state.success && (
            <p className="flex items-center gap-2 border border-ok px-3 py-2 text-sm text-ok">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              Saved — changes are live on the site.
            </p>
          )}
        </div>

        <button type="submit" disabled={pending} className="btn btn-primary mt-1 w-full sm:w-fit">
          {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
