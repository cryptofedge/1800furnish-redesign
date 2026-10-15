# Product photo sources

## Processing (2026-10-15)

So the catalog looks like one set, every photo uses one of two treatments:

- **Cutouts (29):** trimmed and re-framed on a 1200x900 white canvas at the
  same scale with a soft ground shadow; the site multiplies them onto its
  studio-grey wells. Seven of them (3-seat-sectional, 5-piece-wood-dining-set,
  nightstand-usb, open-box-sectional, track-arm-sofa, bath-towel-bundle,
  cookware-set) had their room background removed first, locally, with
  `@imgly/background-removal-node` (run from a scratch folder; not a project
  dependency).
- **Scenes (19):** photos that can't be cut out cleanly (product in a room,
  cropped at the frame edge, or a close-up) stay as-is and fill their card
  edge to edge. The list lives in `SCENE_PHOTOS` in `src/lib/categories.ts`.

The original photos are in git history (before commit "Matching product photos").

**Photo coming soon (11):** washer-dryer-combo, lateral-file-cabinet,
coffee-table, reception-bench, foldable-storage-bench, dinnerware-set,
lamp-clearance-bundle, trash-can, window-security-film, mattress-protector and
security-door-lockbox had stock photos of a different item (toasters, a desk
and chair, a sofa, an office chair, kids' beds, pots and vegetables, a
warehouse, kitchen shelves, a door lock, a pile of fabric, another brand's home
safe). They
now show a "Photo coming soon" card (`PENDING_PHOTOS` in
`src/lib/categories.ts`) until a real photo of the product is supplied.

Product photos in this folder come from two places:

- **The client's own retail store** — 33 items, matched to the closest real product and checked by two independent reviewers (right product type and specifics; no third-party logos, watermarks or price stickers). Normalized to ≤1200px progressive JPEG.
- **Unsplash stock photos** (the original set) — the remaining 15 items, where the store had no true match. Replace these when real product photos exist.

## From the client's store

| File | Store product name |
|---|---|
| `twin-bunk-bed.jpg` | Furniture Twin Bunk Bed AC (Included Mattress) |
| `twin-metal-bed-frame.jpg` | TWIN METAL FRAME |
| `task-chair.jpg` | Furniture Seating V |
| `cleaning-cart.jpg` | Janitor Cart with Vinyl Zippered Bag, Black |
| `twin-linen-set.jpg` | White bed sheets 4PC |
| `queen-linen-set.jpg` | White Bed Sheets |
| `track-arm-sofa.jpg` | Ruth Upholstered Track Arm Faux Leather Sofa Grey - CT |
| `twin-xl-mattress.jpg` | Nylon Staph Waterproof Check Mattress (7″ Memory Foam) |
| `compact-wardrobe.jpg` | Ezra Iron Wardrobe Tall |
| `led-television.jpg` | 32-inch LED HD TV |
| `cookware-set.jpg` | Stainless Steel Cookware Set, 12 Pcs |
| `clearance-dresser.jpg` | Double Dresser w/6 Drawers 139 - VF |
| `5-piece-wood-dining-set.jpg` | 5-piece Dining Set Cappuccino |
| `5-drawer-dresser.jpg` | Metal Tall Dresser with 5 Drawers |
| `6-drawer-dresser.jpg` | Wooden 6 Drawer Dresser TOV-223 |
| `mini-refrigerator.jpg` | 3.1 Cu. Ft. Compact Double Door Refrigerator, Stainless Look |
| `janitorial-supply-kit.jpg` | Wet Mop Kit with 35 Qt. Yellow Mop Bucket, Wet Floor Sign, Mop Head, and Handle 41-WB |
| `bulk-trash-liners.jpg` | 55 Gallon Black Trash Bags, 36x60, 22mic, 150 Bags per Carton |
| `commercial-round-dining-table.jpg` | 36" Walnut Melamine Round Cafe Table 339-WB |
| `nightstand-usb.jpg` | Fluted Nightstand with Charging Station |
| `move-in-kit.jpg` | Welcome Kit |
| `bath-towel-bundle.jpg` | Economy Cotton Bath Towel 8 lb. - 12/Pack |
| `overstock-dining-chair.jpg` | Seating Black Finish Cross Back Chair with Padded Seat II 44 - WS |
| `open-box-sectional.jpg` | Gray Sectional with cup holders |
| `counter-height-bistro-table.jpg` | 30" Standard Height Cafe Table with Particleboard Core, X Base |
| `stackable-banquet-chair.jpg` | 880 lb. Capacity Ultra-Compact Stack Chair with Chrome Frame 49-RFP |
| `accent-chair.jpg` | Rilynn Upholstered Track Arms Chair Grey - CT |
| `kids-study-desk-chair.jpg` | Adjustable Height Square Natural Plastic Classroom Activity Table with (4) 10 1/2" Chairs 164-WB |
| `microwave.jpg` | 1.1 CU FT Microwave Oven - Stainless Steel |
| `smoke-co-detector.jpg` | Hardwired Interconnectable Smoke Alarm with 9V Backup Battery 18-WS |
| `3-seat-sectional.jpg` | Ezra Reversible Sleeper Sectional with Storage, cupholder and wireless charger - AJ |
| `queen-platform-bed-frame.jpg` | Platform Bed |
| `mop-bucket-system.jpg` | 35 Qt. Yellow Mop Bucket & Side Press Wringer Combo 38-WB |

## Still stock (no true match on the store)

| File | Why the closest store product was rejected |
|---|---|
| `security-door-lockbox.jpg` | Product is a wall-mount key cabinet safe (holds 71 keys), not a door lockbox |
| `starter-room-package.jpg` | Shows only a single twin captain's bed with 3 under-bed drawers and a bookcase headboard; no desk is present |
| `coffee-table.jpg` | Top is plain white (laminate-looking), not a solid wood top |
| `foldable-storage-bench.jpg` | Outdoor/patio convertible bench-to-picnic-table with a backrest and brown metal frame - a different product type from a storage bench |
| `dinnerware-set.jpg` | Items are wooden (acacia/walnut-grain) bowls and plates, not stoneware; the catalog explicitly says chip-resistant stoneware |
| `trash-can.jpg` | Capacity is 18 gallon, not 13 gallon (larger than the catalog item) |
| `reception-bench.jpg` | Only 2 seats; catalog item is explicitly a 3-seat bench |
| `height-adjustable-desk.jpg` | Fixed-height industrial desk with a welded black metal sled/loop frame; no electric lift columns, control pad, or telescoping legs visible |
| `mattress-protector.jpg` | Source product is a crib mattress encasement sold as a 4-pack, a different size class from a standard mattress protector |
| `move-in-essentials-kit.jpg` | Shows only cookware (12-piece stainless pot/pan set); no dinnerware or household basics, so it depicts just one component of the bundled kit |
| `lamp-clearance-bundle.jpg` | Shows a single black torchiere floor lamp, not an assortment or bundle of mixed-style lamps as the catalog title implies |
| `lateral-file-cabinet.jpg` | Only one drawer, not four |
| `keyless-entry-lock.jpg` | Product is a wall-mount key cabinet safe (a steel box), not a door lock that installs on a door |
| `washer-dryer-combo.jpg` | No candidate product exists on the store |
| `window-security-film.jpg` | No candidate product exists on the store |
