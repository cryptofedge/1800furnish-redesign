-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists categories (
  slug text primary key,
  label text not null,
  description text not null,
  icon text not null,          -- lucide-react icon name, e.g. "UtensilsCrossed"
  sort_order integer not null default 0
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null references categories(slug) on delete cascade,
  slug text not null,
  name text not null,
  price integer not null,       -- whole dollars, matches formatCurrency() usage
  description text not null,
  image_url text not null,
  shape text not null,          -- key into PRODUCT_SHAPES, see src/components/product-shapes.tsx
  accent_hex text not null default '#8a5a34',
  shape_variant jsonb,          -- optional { scale?, headboard?, round? }
  model_url text,               -- optional public .glb for the 360° viewer (null = procedural shape)
  updated_at timestamptz not null default now(),
  unique (category_slug, slug)
);

create index if not exists products_category_slug_idx on products(category_slug);

alter table categories enable row level security;
alter table products enable row level security;

-- Public (anon) read access — the storefront needs this.
create policy "Public read categories" on categories for select using (true);
create policy "Public read products" on products for select using (true);

-- Writes require a signed-in session. Since staff accounts are admin-invited
-- only (no public sign-up page), any authenticated user is a staff member.
create policy "Staff manage categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Staff manage products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket for product photos uploaded from the admin panel.
-- (Run once — the Supabase dashboard's Storage UI can also create this.)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images" on storage.objects for select
  using (bucket_id = 'product-images');
create policy "Staff upload product images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Staff update product images" on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
