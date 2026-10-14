# Nooksguard Security Solutions — build progress

Full catalog has **~116 products across 14 categories**. Status below —
pick up any "pending" category by following the pattern in `ngvj.ts`.

**Live now:** `/security` (hub) + `/security/ngvj` (14 products, 4 tiers) + `/security/audio-protection` (3 units, 1 tier) + `/security/ngz-3825t` (1 unit, 1 tier) + `/security/ngmw` (2 units, 1 tier) + `/security/ngfs` (4 units, 2 tiers) + `/security/ngts-ct` (4 units, 2 tiers, **no images yet**) + `/security/ngpx` (9 units, 3 tiers, **no images yet**) + `/security/threat-detection` (11 units, 4 tiers, **no images yet**) + `/security/nghwt` (12 units, 4 tiers, **no images yet**) + `/security/nguv` (13 units, 3 tiers, **no images yet**)

| # | Category (slug) | Products | Status | Catalog source pages |
|---|---|---|---|---|
| 1 | Compact X-Ray Inspection (`ngz`) | 5 | ⏳ pending — **images need fixing first, see below** | 4–13 |
| 2 | NGVJ Security Screening Series (`ngvj`) | 14 | ✅ **done** | 14–20 |
| 3 | Fast CT Inspection (`ngts-ct`) | 4 | ✅ **done** (specs only — images pending: re-extract pages 21/23/25/27) | 21–28 |
| 4 | Multi-Energy X-Ray Inspection (`ngz-3825t`) | 1 | ✅ **done** | 29–32 |
| 5 | Portable X-Ray Inspection (`ngpx`) | 9 | ✅ **done** (specs only — images pending: re-extract pages 34–42) | 33–44 |
| 6 | Walk-Through Metal Detectors (`nghwt`) | 12 | ✅ **done** (specs only — images pending: pages 46–50, 55–58; competitor-comparison page 52 intentionally omitted) | 45–58 |
| 7 | Handheld Metal Detectors (`nghh`) | 16 | ⏳ pending | 59–65 |
| 8 | Millimeter Wave Body Scanners (`ngmw`) | 2 | ✅ **done** | 66–69 |
| 9 | Foot & Shoe Security Screening (`ngfs`) | 4 | ✅ **done** | 70–71 |
| 10 | Under Vehicle Surveillance Systems (`nguv`) | 13 | ✅ **done** (specs only — images pending: pages 73–76, 78–79) | 72–79 |
| 11 | Security & Threat Detection (`threat-detection`) | 11 | ✅ **done** (specs only — images pending: pages 81–84) | 80–84 |
| 12 | TSCM & Counter-Surveillance (`tscm`) | 20 | ⏳ pending | 85–92 |
| 13 | Signal Jamming Solutions (`ngjm`) | 2 | ⛔ **removed from site** — RF jammers are illegal to market/sell in the US (FCC, 47 U.S.C. §§302a, 333) except to authorized federal agencies. Owner decision 2026-10-14; do not re-add without legal sign-off | 93–96 |
| 14 | Anti-Recording / Audio Protection (`audio-protection`) | 3 | ✅ **done** | 97–98 |

Page 99 is the closing compliance/contact page (no products).

**Recommended next pick:** Handheld Metal Detectors (`nghh`, 16 products,
pages 59–65), then TSCM & Counter-Surveillance (`tscm`, 20, pages 85–92).
The
watermark-blocked `ngz` (5, see below) needs corrected images first.
(`ngjm` was removed for legal reasons, see the table.)

**Image backlog:** `ngts-ct`, `ngpx`, `threat-detection`, `nghwt`, and `nguv` shipped specs-only because the source
PDF wasn't on the machine. When it's available, extract and review those
images first.

## How to add a category (the pattern `ngvj.ts` already proves out)

1. Read the relevant pages from
   [`nooksguard-source/catalog-text.txt`](../../../nooksguard-source/catalog-text.txt)
   (search for `===== PAGE N =====`).
2. Re-extract images for those pages (see
   [`nooksguard-source/README.md`](../../../nooksguard-source/README.md)) —
   **view each one before using it**, this catalog has real rebranding bugs
   (see that file's "Known image quality issues" section).
3. Copy the good images into `public/nooksguard/products/<slug>.png`.
4. Create `src/lib/nooksguard/<category-slug>.ts` exporting a
   `SecurityCategory` (same shape as `ngvj.ts`) — group products into
   `tiers` the way the source PDF does (or a single tier if the category
   isn't naturally tiered).
5. In `categories.ts`: import it and replace that category's `stub(...)`
   entry with the real import, same as `ngvjCategory` is wired in now.
6. `npm run build && npm run lint`, then spot-check the page in the browser
   before committing.

## Known issue to resolve before publishing NGZ

The NGZ series (category 1) has full spec data ready to go (see source pages
4–13), but all 5 product photos have a "FURNISH me.inc" watermark baked in
instead of Nooksguard branding — don't wire those images in as-is. Either
get corrected renders from the client or crop/retouch first.
