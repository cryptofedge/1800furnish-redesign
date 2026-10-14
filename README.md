# Merkabanooks

An immersive, cinematic site for Merkabanooks: furniture, commercial
facility, and maintenance supply for transitional housing, municipal
programs, nonprofits, and commercial/residential clients.

Built with Next.js App Router, Tailwind CSS, Framer Motion, GSAP + ScrollTrigger,
and React Three Fiber.

Also includes **Nooksguard Security Solutions** (`/security`), a sister
product line's catalog accessible via the logo button at the end of the
shop category nav. It's a large, in-progress build — see
[`src/lib/nooksguard/PROGRESS.md`](src/lib/nooksguard/PROGRESS.md) for what's
live vs. pending.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** — charcoal/slate base with warm amber/wood accents (see
  design tokens in [`src/app/globals.css`](src/app/globals.css))
- **Framer Motion** — micro-interactions, tab transitions, modals
- **GSAP + ScrollTrigger + SplitText** — hero text reveal, pinned scroll
  storytelling
- **React Three Fiber + drei** — interactive 3D product viewer

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    (site)/                  # public marketing site (shares SiteHeader/SiteFooter layout)
      page.tsx                 # composes every home-page section
      categories/              # /categories (index) and /categories/[slug] (detail)
    admin/                    # staff-only backend (see "Admin backend" below)
      login/page.tsx            # staff sign-in
      (dashboard)/               # everything else under /admin, auth-gated
        page.tsx                   # product list
        products/[id]/             # edit one product (name, price, description, photo)
      actions.ts                 # login/logout Server Actions
      products/actions.ts        # updateProduct Server Action (+ image upload)
    api/quote/route.ts        # RFQ submission endpoint
  proxy.ts                  # Next.js proxy (middleware): refreshes auth session,
                             # gates /admin/* routes — see src/lib/supabase/middleware.ts
  components/
    HeroCinematic.tsx       # video background, parallax, split-text headline
    Scene3D.tsx              # home-page R3F canvas: fallback mesh / GLTF, hotspots, finish color
    ProductConfigurator.tsx  # wraps Scene3D with finish switcher + low-power fallback
    SectorShowcase.tsx       # dual-sector tabbed showcase
    ScrollExperience.tsx     # pinned "blueprint to furnished" scroll sequence
    QuoteCalculator.tsx      # bulk RFQ / facility package calculator + modal
    CategoryNav.tsx          # sticky category tab bar (on /categories/* routes)
    ProductGrid.tsx          # per-product 3D preview grid + low-power photo fallback; opens ProductViewer
    ProductViewer.tsx        # fullscreen 360° viewer modal (finishes, dimensions, keyboard, quote CTA)
    viewer/                  # ViewerStage (studio canvas), useTurntable (orbit/inertia/zoom), GltfModel, DimensionLines
    ProductScene3D.tsx       # lightweight per-product R3F canvas (drag-to-orbit)
    product-shapes.tsx       # procedural 3D archetypes (chair, table, bed, ...)
    SiteHeader.tsx / SiteFooter.tsx
  lib/
    categories.ts      # static seed/fallback catalog data + types
    catalog.ts          # reads from Supabase when configured, else falls back to categories.ts
    supabase/            # browser/server/middleware Supabase clients
    quote-data.ts      # room types, grades, add-ons, pricing logic
    utils.ts            # `cn()` class helper
supabase/
  schema.sql          # run once in the Supabase SQL editor: tables, RLS, storage bucket
  seed.sql             # run once after schema.sql: populates the current catalog
public/
  videos/README.md       # hero video spec + ffmpeg compression commands
  models/README.md       # GLTF/GLB model spec + wiring instructions (home-page viewer)
  products/README.md     # category + per-product photo sourcing
```

## Asset pipeline (before launch)

Nothing here ships with real media — every visual degrades gracefully to a
procedural/placeholder state so the site is fully functional without assets:

- **Hero video** — drop `hero-loop.webm` / `hero-loop.mp4` / `hero-poster.jpg`
  into `public/videos/`. Spec and ffmpeg compression commands are in
  [`public/videos/README.md`](public/videos/README.md). Until then, the hero
  falls back to the dark gradient background.
- **3D product models** — drop a `.glb` into `public/models/` and pass its
  path as `modelUrl` to `<Scene3D />` (via `<ProductConfigurator />`). Spec,
  Draco compression, and finish-switcher material naming are in
  [`public/models/README.md`](public/models/README.md). Until then, the
  viewer renders a procedural stand-in chair.

## 360° product viewer

Every product card on `/categories/*` opens a fullscreen viewer
([`src/components/ProductViewer.tsx`](src/components/ProductViewer.tsx)):
tap the preview, the **360°** badge, or the product name.

- **Spin / tilt:** drag (mouse or touch). Full 360° yaw; tilt is clamped so
  the piece never flips. Damped follow with a little inertia after release,
  and a slow auto-rotate after 3s idle that stops the moment you touch it.
- **Zoom:** scroll wheel, pinch, the +/− buttons, or `+`/`-` keys — clamped
  so the piece can't clip or vanish.
- **Keyboard:** arrow keys rotate, `+`/`-` zoom, `R` resets, `Esc` closes.
  The dialog is `role="dialog"`, traps initial focus, restores focus on close.
- **Panel:** name + price, finish swatches (shared list in
  [`src/lib/finishes.ts`](src/lib/finishes.ts)), *Show dimensions* (W/D/H
  guide lines from the model's real bounding box), *Reset view*, and
  *Request a quote for this item* — which lands on the home-page calculator
  with that product attached to the RFQ (`/?product=<slug>#quote`).
- **Models:** a product with `modelUrl` (static catalog) / `model_url`
  (Supabase, see below) loads that `.glb` with Draco support and a progress
  badge; everything else renders its procedural shape from
  `product-shapes.tsx`, so every product works today. Wiring instructions in
  [`public/models/README.md`](public/models/README.md).
- **Performance:** the viewer is `next/dynamic` + `ssr:false`; while it's
  open the grid previews swap to photos so only one WebGL canvas exists. The
  low-power / `prefers-reduced-motion` fallback shows the product photo with
  a "View in 3D anyway" opt-in.

Design notes and references: [`VIEWER-NOTES.md`](VIEWER-NOTES.md).

**Supabase:** run
[`supabase/migrations/add-model-url.sql`](supabase/migrations/add-model-url.sql)
once (adds a nullable `model_url` column). Fresh installs get it from
`schema.sql`. No env vars needed.

## RFQ / quote submission

`POST /api/quote` ([`src/app/api/quote/route.ts`](src/app/api/quote/route.ts))
is wired for [Resend](https://resend.com) but works without it: by default
(no `RESEND_API_KEY` set) it just logs each request server-side and returns
success, so the form is fully functional with no setup.

To switch on real email, no code changes needed:

1. Create a free account at [resend.com](https://resend.com) and generate an
   API key at [resend.com/api-keys](https://resend.com/api-keys).
2. Copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY`.
3. Set `QUOTE_NOTIFICATION_EMAIL` to the inbox that should receive RFQs
   (defaults to `sales@merkabanooks.com`).
4. **Verify your sending domain** in the Resend dashboard and set
   `QUOTE_FROM_EMAIL` to an address on it (e.g.
   `"Merkabanooks <quotes@merkabanooks.com>"`). Until a domain is verified,
   Resend restricts the default `onboarding@resend.dev` sender to only
   deliver to the email address on your Resend account — fine for local
   testing, not for production.

Once `RESEND_API_KEY` is set, the route sends a notification email to
`QUOTE_NOTIFICATION_EMAIL` with the full spec, plus a confirmation email back
to the requester.

To switch to a CRM (HubSpot, Salesforce) instead of/in addition to email,
add a second call inside the `POST` handler in `route.ts`.

## Admin backend

Staff can edit a product's name, description, price, and photo from `/admin`
without touching code — changes save straight to a Supabase Postgres database
and show up on the live site within seconds (no rebuild/redeploy needed).

**Without Supabase configured**, the public site runs fine off the static
catalog in `src/lib/categories.ts`, and `/admin/login` shows a clear
"not connected yet" message instead of crashing.

### Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard's **SQL Editor**, run
   [`supabase/schema.sql`](supabase/schema.sql), then
   [`supabase/seed.sql`](supabase/seed.sql) (populates the same 12
   categories / 48 products currently in `categories.ts`).
3. In **Project Settings → API**, copy the Project URL and the `anon`
   public key into `.env.local` (copy `.env.example` first):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```
4. Create staff logins in **Authentication → Users → Add user** (email +
   password). There's no public sign-up page — this is the only way to
   create an account, by design.
5. Sign in at `/admin`.

### How it works

- `src/lib/catalog.ts` is the single read path every page uses
  (`getCategories`, `getCategoryBySlug`, `getProductById`): it queries
  Supabase when configured, otherwise returns the static data from
  `categories.ts` untouched. Nothing on the public site needed to change
  when the admin backend was added — it was already going through this layer.
- **Auth**: `src/proxy.ts` (Next's middleware convention) redirects any
  `/admin/*` request without a valid Supabase session to `/admin/login`, and
  redirects an already-signed-in visitor away from `/admin/login`. Any
  authenticated user counts as staff — there's no separate roles table,
  matching "admin-invited accounts only."
- **Writes**: `src/app/admin/products/actions.ts` is a Server Action that
  validates the form, optionally uploads a new photo to the `product-images`
  Storage bucket, updates the `products` row, and calls `revalidatePath()` so
  the change is visible immediately.
- **Images**: uploaded photos replace `image_url` in the database with a
  Supabase Storage URL (`next.config.ts` allows that domain for
  `next/image`). The original `/products/items/*.jpg` files stay as the
  seeded defaults until replaced.

### Not yet built

Scoped out for now — ask if you want any of these:
- Editing category info (name/description/photo) or adding/removing
  categories or products (today: edit existing products only).
- Multiple staff roles/permissions (today: any staff login can edit anything).
- Editing a product's 3D shape/color (today: set at seed time, not
  admin-editable).

## Performance notes

- The 3D canvas (`Scene3D`) is code-split via `next/dynamic` with `ssr:false`
  and only mounted when the device isn't flagged as low-power
  (`prefers-reduced-motion` or `navigator.connection.saveData`) — users can
  still opt back in with a button.
- `prefers-reduced-motion` disables the hero's autoplay video, GSAP text
  reveal, and the pinned scroll sequence (jumps straight to the finished
  state) in addition to the global CSS animation-duration override.
