# Merkabanooks design system — "trade catalog"

The site should read like a printed contract-furniture catalog (think
Steelcase / Knoll trade catalogs), not a startup landing page. Buyers are
procurement officers ordering in bulk: they want the product, the facts and the
price, fast. The owner explicitly rejected the generic "AI website" look.

Tokens and building blocks live in `src/app/globals.css`. Use them; don't
hand-roll colors, radii or shadows.

## Never use (the look we are moving away from)

- Dark backgrounds for whole pages, frosted glass, `backdrop-blur`, glows,
  gradients, gradient borders, soft blurred drop shadows (`shadow-*`). The
  only shadow allowed is the hard, unblurred ink offset on buttons and
  lifted cards (see "Swagger layer").
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
| `paper` | Page ground (`bg-paper`): plain white, no background grid (owner's pick). |
| `well` | White: product photo wells, cards, form fields, side panels. |
| `ink` | Primary text, 2px section rules, dark bands (footer). |
| `ink-2` | Secondary text, descriptions. |
| `ink-3` | Meta text, captions, placeholders. Never for body copy. |
| `rule` | 1px hairlines between cells and around panels (neutral grey). |
| `mist` | Light neutral grey: footer band, hover fills, overlay backdrops. Never black. |
| `studio` | Soft studio grey: product photo wells and alternating full-bleed section bands (Nooksguard, quote). |
| `accent` | Safety orange. **Fills only**: actions (primary buttons, the active state marker) plus the one ticker band on the home page. Text on it is always `text-ink`. |
| `accent-ink` | Orange for text/links on paper or white (contrast-safe). Use sparingly. |
| `ok` / `warn` / `danger` | Status only (live / coming soon / errors). |

One accent. If something is orange, it should be something you can press,
the current selection, or the home-page ticker band.

## Type

- **Display** — `.type-display` + a size (`text-5xl`…`text-8xl` for page
  heroes, `text-3xl`/`text-4xl` for section titles, `text-2xl` for card-group
  titles). Condensed, heavy, uppercase. Headlines only. Home-page section
  titles run `text-4xl sm:text-5xl lg:text-6xl`; the home hero headline is
  fluid (`clamp`) with one `.type-outline` word.
- **Body** — default Archivo, `text-base`/`text-sm`, `text-ink` or
  `text-ink-2`. Keep running text ≤ ~65ch (`max-w-[62ch]`).
- **Label** — `.type-label` for field labels, spec-table headers, small section
  labels. Not an accent-colored eyebrow.
- **Data** — `.type-data` (mono, tabular) for prices (`$649`), unit counts,
  product counts, spec values, item index numbers (`01`, `02`).
- Product names: `font-semibold text-ink`, normal width, sentence case.

## Shape & lines

- Square corners. Radius tokens are 0 site-wide; don't add arbitrary radii.
- Structure comes from rules, not boxes: `.section-rule` (3px ink) opens a
  section; `border-rule` hairlines separate items.
- Grids of items use `.catalog-grid` (shared 1px hairlines) with `.cell`
  children. No gaps with floating cards.

## Building blocks (globals.css)

| Class | What |
|---|---|
| `.btn .btn-primary` | Main action: orange plate, 2px ink border, hard ink offset shadow. Hover lifts, press flattens. One per view region. |
| `.btn .btn-secondary` | Other actions: white plate, 2px ink outline, same lift on hover. |
| `.btn-tool` | Small square controls (zoom, swatch toggles, filters). Supports `aria-pressed` / `aria-checked` → ink border + orange underline bar. |
| `.link` | Inline text link with orange underline. |
| `.catalog-grid` + `.cell` | Hairline grid of white cells. |
| `.panel` | Standalone white panel with hairline (forms, side rails). |
| `.tag` | Small rectangular mono tag (e.g. `Zoom`, `360°` only for a real 3D model, `Coming soon`). |
| `.field` | Input / select / textarea. |
| `.section-rule` | 3px ink rule at the top of a section. |

### Swagger layer

Bold moves the owner asked for ("make it with swagg"). Use one or two per
view, not everywhere.

| Class | What |
|---|---|
| `.type-outline` | Outlined display type for the single word that should hit hardest (hero: "rebuild."). |
| `.lift` | On a `.cell`: hover pops the card out with an ink outline and hard offset shadow. Product cards, category cards, the hero parts list. |
| `.nav-link` | Header nav link; an orange bar wipes in underneath on hover. |
| `.marquee` / `<Ticker>` | Full-bleed orange ticker band of true statements in display type, with a pause button (WCAG 2.2.2). Home page only. |
| Footer wordmark | Oversized `MERKABANOOKS` sized to run the full container width. |
| `.btn-badge` / `<NooksguardButton>` | Logo button: white plate, ink border, hard shadow, the Nooksguard emblem as a tile flush left. In the header (emblem only below `lg`), the phone menu, and the Nooksguard section. |

### Nooksguard on the home page

Nooksguard has its own home-page section right after the hero: the full
Nooksguard logo with its lettering (`public/nooksguard/logo-lockup.webp`,
on its own navy background, the only dark area allowed) as the section
title and a link to the catalog, the brand line, live model and family
counts from the data, the logo button, and a hairline grid of every product
family (live first, coming-soon last). Small buttons use the emblem only,
because the lettering is unreadable at button size.

## Layout

- Container: `mx-auto w-full max-w-7xl px-4 sm:px-8` (16px phone gutter).
- Section rhythm: `py-16 sm:py-24`; a section starts with `.section-rule`, then
  a header row: title (`.type-display`) left, short lede (`text-ink-2`) right
  or below; optional `.type-data` index number when the order is real
  (catalog category order, process steps).
- The page stays white; selected home sections sit on full-bleed `bg-studio`
  bands so the long page has rhythm and white cards stand out.
- Product photos sit in **studio wells** (`bg-studio` + `object-contain` +
  padding + `mix-blend-multiply` on the image), so white photo backgrounds melt
  into the grey and products read like catalog cut-outs. Inside a transformed
  wrapper (zoom), put `bg-studio` on the wrapper too, or the blend has nothing
  to multiply with. Room/lifestyle photos (category banners, sector cards) are
  `object-cover`, square corners.
- Every "Who we serve" sector card carries a real photo.
- The hero 3D room is styled, not schematic: light oak plank floor, warm white
  walls with a sage back wall, baseboards, window, rug, plant and a framed
  print; each piece is colored to match its real product photo
  (`room-layout.ts` `color`); edge lines are soft and only turn orange on hover.
- Mobile first: everything stacks to one column at ~400px; no horizontal page
  scroll; tap targets ≥ 44px.

## Motion

Short transitions (≤160ms) on hover: color, plus the hard-shadow lift on
buttons and cards. The product viewer's open/close spring, the home-page headline
reveal and the ticker are the only "moments". Everything respects
`prefers-reduced-motion` (the ticker stands still, lifts don't move).

## Voice

Plain, specific, procurement-friendly. Name things the way a buyer would
("Request a quote", "Price per unit", "Dimensions"). No hype words.
