# 360° product viewer — design notes

Short research pass before building `src/components/ProductViewer.tsx`.
Looked at how Vitra, Herman Miller, IKEA, and recent Awwwards 3D winners
handle product inspection, then picked the ideas worth adopting here.

## Ideas adopted

1. **Spin with inertia, auto-rotate when idle.** The pattern Apple's product
   pages popularised and most Awwwards 3D entries now follow: drag feels
   physical (velocity carries after release, then damps out), and the piece
   slowly turns on its own when nobody is touching it so it never looks like a
   frozen screenshot. Here: custom turntable controller (`useTurntable.ts`),
   3-second idle timer, auto-rotate stops the instant a pointer lands.

2. **Keep "inspect" and "configure" in the same frame, with price live.**
   Vitra (Emersya) and Herman Miller (3D Cloud) both update the price next to
   the model as the buyer changes options. Here: the glass panel shows name +
   price beside finish swatches, reusing the existing finish list from the
   home-page configurator.

3. **Touch-first, fullscreen, pinch to inspect materials.** IKEA's KALLAX
   planner is built touch-first; furniture 360 guidance (Cylindo) recommends a
   visible 360 indicator on the card plus fullscreen + zoom for upholstery
   detail. Here: a "360°" badge on every card, tap-to-expand, pinch/scroll zoom
   with clamped limits so the piece can never clip or vanish.

4. **Show dimensions on the model, not just in a table.** Planners from IKEA
   and Herman Miller overlay measurements; procurement buyers need W/D/H more
   than aesthetics. Here: a "Show dimensions" toggle draws width/depth/height
   lines from the model's actual bounding box (real for .glb, approximate for
   the procedural stand-ins).

5. **Respect reduced motion and performance budgets.** The 2026 Site-of-the-Day
   pattern is restraint: winners honour `prefers-reduced-motion` and keep
   mobile Lighthouse scores high. Here: the viewer is `next/dynamic` +
   `ssr:false`, only one WebGL canvas exists while it's open (grid previews
   swap to photos), and the existing low-power fallback stays with a
   "View in 3D anyway" opt-in.

## Deliberately not adopted

- Reflective floor (`MeshReflectorMaterial`): doubles the render cost on
  phones for a subtle effect. Used a contact shadow + glowing floor ring instead.
- HDRI environment files: the studio look is built from `Lightformer`s inside
  `<Environment>`, so nothing is fetched and the viewer works offline.
- AR / `<model-viewer>`: out of scope for this pass; the `.glb` plumbing
  (`modelUrl` on products, `model_url` column) is in place for it later.

## Sources

- [Vitra configurator case study (Emersya)](https://www.emersya.com/vitra/)
- [Herman Miller / DWR 3D visualization launch](https://www.retailtouchpoints.com/topics/digital-commerce/herman-miller-design-within-reach-launch-3d-product-visualization-online)
- [IKEA KALLAX configurator (Demodern)](https://demodern.com/projects/ikea-kallax-configurator)
- [360 views for furniture product pages (Cylindo)](https://blog.cylindo.com/360-views-for-high-converting-furniture-product-pages)
- [Awwwards: interactive products page (REFIRE)](https://www.awwwards.com/inspiration/interactive-products-page-refire)
- [2026 SOTD patterns: restraint, reduced motion, performance](https://svilenkovic.com/3d/sotd-2026-3d)
