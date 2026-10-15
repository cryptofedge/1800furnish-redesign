# Product images

- `<slug>.jpg` — one photo per category, used on the `/categories` index grid
  and each category page's banner.
- `items/<product-slug>.jpg` — one unique photo per product (48 total; 33 are
  real products from the client's 1800furnish.com store, see `items/SOURCES.md`),
  referenced by `Product.image` in `src/lib/categories.ts`. Used as the
  low-power/`prefers-reduced-motion` fallback when the 3D viewer is disabled
  (see `ProductGrid.tsx`).

Category banners: 7 are the client's own store banners from 1800furnish.com
(dining, living-room, kids-room, bedroom, electronics, linens, housewares); the
rest, and product photos without a store match, are from [Unsplash](https://unsplash.com) under the
[Unsplash License](https://unsplash.com/license) — free for commercial use,
no attribution required.

The primary interactive view on a product card is a drag-to-orbit 3D model
(`ProductScene3D.tsx` + `src/components/product-shapes.tsx`), not these
photos — the shapes are simple procedural geometry (not photoreal), matching
each product's real-world silhouette (chair, table, bed, appliance box, etc.)
and tinted with the product's `accentHex`.
