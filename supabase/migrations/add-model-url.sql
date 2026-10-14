-- 360° product viewer: optional 3D model per product.
--
-- Set model_url to a public .glb URL (e.g. "/models/task-chair.glb" served from
-- public/models/, or a Supabase Storage public URL). Leave it NULL and the
-- viewer falls back to the procedural stand-in shape, so nothing breaks for
-- products without a model. Safe to run more than once.

alter table products add column if not exists model_url text;
