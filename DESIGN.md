# Merkabanooks design system — "trade catalog"

The site should read like a printed contract-furniture catalog (think
Steelcase / Knoll trade catalogs), not a startup landing page. Buyers are
procurement officers ordering in bulk: they want the product, the facts and the
price, fast. The owner explicitly rejected the generic "AI website" look.

Tokens and building blocks live in `src/app/globals.css`. Use them; don't
hand-roll colors, radii or shadows.

## Never use (the look we are moving away from)

- Dark backgrounds for whole pages, frosted glass, `backdrop-blur`, glows,
  gradients, gradient borders, drop shadows (`shadow-*`).
- Pill shapes for buttons, chips or tags (`rounded-full` is only for things
  that are physically round: color swatches, status dots).
- Serif display headlines, emoji, decorative icons in tinted rounded squares.
- Little uppercase "eyebrow" kickers in accent color above every heading.
- Centered-everything layouts; hover-only reveals of information.
- The old tokens: `charcoal-*`, `slate-*`, `amber-*`, `wood-*`, `blue-*`,
  `glass-panel`, `glass-pill`, `btn-gradient-border`, `font-display`,
  `text-foreground`, `bg-background`.

## Color

| Token | Use |
|---|---|
| `paper` | Page ground (`bg-paper`): a soft fuchsia blush. |
| `well` | White: product photo wells, cards, form fields, side panels. |
| `ink` | Primary text, 2px section rules, dark bands (footer). |
| `ink-2` | Secondary text, descriptions. |
| `ink-3` | Meta text, captions, placeholders. Never for body copy. |
| `rule` | 1px hairlines between cells and around panels (blush-tinted). |
| `accent` | Safety orange. **Fills only, actions only** (primary buttons, the active state marker). Text on it is always `text-ink`. |
| `accent-ink` | Orange for text/links on paper or white (contrast-safe). Use sparingly. |
| `ok` / `warn` / `danger` | Status only (live / coming soon / errors). |

One accent. If something is orange, it should be something you can press or
the current selection.

## Type

- **Display** — `.type-display` + a size (`text-5xl`…`text-8xl` for page
  heroes, `text-3xl`/`text-4xl` for section titles, `text-2xl` for card-group
  titles). Condensed, heavy, uppercase. Headlines only.
- **Body** — default Archivo, `text-base`/`text-sm`, `text-ink` or
  `text-ink-2`. Keep running text ≤ ~65ch (`max-w-[62ch]`).
- **Label** — `.type-label` for field labels, spec-table headers, small section
  labels. Not an accent-colored eyebrow.
- **Data** — `.type-data` (mono, tabular) for prices (`$649`), unit counts,
  product counts, spec values, item index numbers (`01`, `02`).
- Product names: `font-semibold text-ink`, normal width, sentence case.

## Shape & lines

- Square corners. Radius tokens are 0 site-wide; don't add arbitrary radii.
- Structure comes from rules, not boxes: `.section-rule` (2px ink) opens a
  section; `border-rule` hairlines separate items.
- Grids of items use `.catalog-grid` (shared 1px hairlines) with `.cell`
  children. No gaps with floating cards.

## Building blocks (globals.css)

| Class | What |
|---|---|
| `.btn .btn-primary` | Main action (orange plate, ink text; hover → ink). One per view region. |
| `.btn .btn-secondary` | Other actions (ink outline). |
| `.btn-tool` | Small square controls (zoom, swatch toggles, filters). Supports `aria-pressed` / `aria-checked` → ink border + orange underline bar. |
| `.link` | Inline text link with orange underline. |
| `.catalog-grid` + `.cell` | Hairline grid of white cells. |
| `.panel` | Standalone white panel with hairline (forms, side rails). |
| `.tag` | Small rectangular mono tag (e.g. `360°`, `Coming soon`). |
| `.field` | Input / select / textarea. |
| `.section-rule` | 2px ink rule at the top of a section. |

## Layout

- Container: `mx-auto w-full max-w-7xl px-4 sm:px-8` (16px phone gutter).
- Section rhythm: `py-16 sm:py-24`; a section starts with `.section-rule`, then
  a header row: title (`.type-display`) left, short lede (`text-ink-2`) right
  or below; optional `.type-data` index number when the order is real
  (catalog category order, process steps).
- Product photos sit **on white** (`bg-well`, `object-contain`, padding), not
  cropped edge-to-edge, so products read like catalog cut-outs. Room/lifestyle
  photos (category banners, hero) may be `object-cover`, square corners.
- Mobile first: everything stacks to one column at ~400px; no horizontal page
  scroll; tap targets ≥ 44px.

## Motion

Quiet. Short color/opacity transitions (≤150ms) on hover. The 360° viewer's
open/close spring and the home-page headline reveal are the only "moments".
Everything respects `prefers-reduced-motion`.

## Voice

Plain, specific, procurement-friendly. Name things the way a buyer would
("Request a quote", "Price per unit", "Dimensions"). No hype words.
