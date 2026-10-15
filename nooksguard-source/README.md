# Nooksguard catalog source material

Source: `Nooksguard_2026_Complete_Product_Catalog_Final.pdf` (99 pages, 218
embedded images, ~82.5MB — too large to commit, lives on the user's machine
at `~/Downloads/`).

- `catalog-text.txt` — full extracted text of all 99 pages (via `pypdf`),
  committed here so future sessions don't need the original PDF just to read
  specs. Page breaks are marked `===== PAGE N =====`.

## Re-extracting images

This machine has no Python. Use the Node script in this folder instead
(PDF.js, installed in a throwaway folder so it never touches the project):

```bash
mkdir -p /tmp/pdftool && cd /tmp/pdftool && npm init -y && npm install pdfjs-dist@4.10.38
cp <project>/nooksguard-source/extract-images.mjs /tmp/pdftool/
node extract-images.mjs "<path to the PDF>" out <project>/node_modules/sharp 21-28,33-65,80-92
```

Every page also carries a 300x320 Nooksguard corner mark; ignore those.

Original Python route (needs `pip install pypdf`):

Images were NOT committed (218 files, ~68MB). To re-extract from the
original PDF:

```python
from pypdf import PdfReader
reader = PdfReader(r"<path to the PDF>")
for i, page in enumerate(reader.pages):
    for j, img in enumerate(page.images):
        with open(f"out/p{i+1:03d}_{j}_{img.name}", "wb") as f:
            f.write(img.data)
```

Requires `pip install pypdf` (pure Python, no poppler/system deps needed —
unlike `pdftoppm`/`pdfimages`, which aren't installed in this environment).

## ⚠️ Known image quality issues

Not every embedded image is cleanly Nooksguard-branded:

- **NGZ series (Compact X-Ray)** product renders (pages 4, 6, 8, 10, 12) have
  a **"FURNISH me.inc" watermark** baked into the machine's side panel
  instead of the Nooksguard logo — a stock OEM render that wasn't correctly
  rebranded before this PDF was assembled. Do not publish these as-is.
- **NGVJ150180** (page 18, tier 3/4 freight unit) shows the unbranded OEM
  model code **"VKJ-150180"** printed on the unit instead of "NGVJ-150180".
  Minor, but inconsistent with the rest of the NGVJ series.
- Other categories haven't been individually checked yet — review each
  image before wiring it into a category (see `PROGRESS.md`).

The NGVJ series' other 13 images (used for the live `/security/ngvj` page)
were spot-checked and are cleanly branded.

Found while importing the remaining families (2026-10-15):

- **Handheld (pages 62–64):** NGHH-160 shows "V160" printed on the unit,
  NGHH-140 is a marketing banner reading "PD140", NGHH-2022 is branded
  "VIKINGDETECTOR VK-2022", NGHH-1002 and NGHH-3003 are branded
  "Goldcentry". None are used on the site.
- **Threat detection (page 83):** the NGRD-3000 radiation device is shown with
  a "Gas Detector Alarm" label (same render as the NGCG-300 gas detector on
  page 84). Not used.
- **Threat detection (page 81):** the catalog captions the explosive-detector
  artwork "Illustrative device rendering"; the site tags those five images
  "Illustrative rendering".
- **Portable X-ray (page 36):** the NGPX-125 image has a broken black
  background block; it was flood-filled to white before use.
- **TSCM (pages 86–91):** several device screens show a Chinese-language UI.
  Used as-is; replace if Nooksguard has English-UI renders.

Recommend asking Nooksguard for corrected renders for the NGZ series, or
cropping/retouching before publishing.
