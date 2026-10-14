# 3D product models

Two places use `.glb` models:

- **Home-page viewer** (`Scene3D` via `<ProductConfigurator />`) — renders a
  procedural chair until you pass `modelUrl`.
- **360° product viewer** (`ProductViewer`, opened from any product card on
  `/categories/*`) — renders the product's procedural `shape` until the
  product has a `modelUrl`.

## Spec

- **Format:** `.glb` (binary glTF, single file — avoid `.gltf` + separate
  textures for production, it's extra round trips).
- **Scale:** export at real-world **meters**. The 360° viewer measures the
  model's bounding box to frame the camera and to draw the "Show dimensions"
  overlay, so a 0.9 m-tall chair should be 0.9 units tall.
- **Origin:** anywhere — the viewer re-centres the model and rests it on the
  floor automatically. `Scene3D` on the home page does not, so centre it near
  the origin for that use.
- **Draco compression:** recommended for anything over ~2MB —
  `gltf-transform optimize input.glb output.glb --compress draco`. Both viewers
  load the Draco decoder on demand (from Google's CDN), nothing to configure.
- **Material naming:** name any mesh/material that should respond to the
  finish switcher so it contains `upholstery` or `fabric` (case-insensitive),
  e.g. `Upholstery_Seat`, `Fabric_Back`. `GltfModel` (in
  `src/components/viewer/GltfModel.tsx`) matches on that substring and
  recolours it to the active finish at runtime.

## Wiring a model into a product (360° viewer)

Drop the file here, e.g. `public/models/task-chair.glb`, then either:

- **Static catalog** (`src/lib/categories.ts`): add `modelUrl: "/models/task-chair.glb"`
  to that product's entry, or
- **Supabase**: run `supabase/migrations/add-model-url.sql` once, then set the
  product's `model_url` column to `/models/task-chair.glb` (or a Supabase
  Storage public URL).

Products without a model keep working — they just show the procedural shape.

## Wiring a model into the home-page viewer

```tsx
<Scene3D modelUrl="/models/dormitory-chair.glb" finishHex={activeFinish.hex} hotspots={HOTSPOTS} />
```

Preload it (optional, avoids a pop-in on first interaction):

```tsx
useGLTF.preload("/models/dormitory-chair.glb");
```
