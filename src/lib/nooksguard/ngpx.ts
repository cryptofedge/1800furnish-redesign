import type { SecurityCategory } from "./types";

const img = (slug: string) => `/nooksguard/products/${slug}.webp`;

// Source: catalog pages 33–44. The catalog marks most figures with "*" (source
// ratings pending final configuration) or "TBC"; both are kept as-is so the
// site never states a provisional number as final.
//
// Product images: catalog pages 34–42 (2026-10-15). The NGPX-125 render had a
// broken black background in the PDF; it was cleaned to white.

export const ngpxCategory: SecurityCategory = {
  slug: "ngpx",
  label: "Portable X-Ray Inspection",
  shortLabel: "Portable X-Ray",
  description:
    "Nine field-deployable NGPX platforms spanning compact screening, wide-format capture, detailed review, high penetration, and specialist access. Each system pairs a digital detector, X-ray source, control terminal, and imaging software (zoom, enhancement, inversion, pseudo-color) in protective transport cases, with AI-assisted alerts and mobile review on selected configurations. Values marked * are source-material ratings subject to final configuration; TBC = to be confirmed before quotation.",
  productCount: 9,
  status: "live",
  tiers: [
    {
      id: "compact-mobile",
      label: "Compact & Specialist Access",
      description: "Light, fast-moving kits for small items, single-operator search, and confined spaces.",
      products: [
        {
          slug: "ngpx-60",
          image: img("ngpx-60"),
          model: "NGPX-60",
          name: "Compact Portable Imaging System",
          specs: [
            { label: "X-ray source", value: "Constant-potential*" },
            { label: "Rated output", value: "TBC" },
            { label: "Steel penetration", value: "13 mm*" },
            { label: "Active area", value: "305 x 254 mm*" },
            { label: "Best fit", value: "Rapid screening, training, small evidence items" },
          ],
        },
        {
          slug: "ngpx-80",
          image: img("ngpx-80"),
          model: "NGPX-80",
          name: "Lightweight Constant-Potential System",
          specs: [
            { label: "X-ray source", value: "Constant-potential" },
            { label: "Rated output", value: "80 kV*" },
            { label: "Steel penetration", value: "13 mm*" },
            { label: "Active area", value: "430 x 350 mm*" },
            { label: "Best fit", value: "Single-operator search, suspicious parcels" },
          ],
        },
        {
          slug: "ngpx-60a",
          image: img("ngpx-60a"),
          model: "NGPX-60A",
          name: "Articulated-Arm Special Configuration",
          specs: [
            { label: "X-ray source", value: "Configuration-dependent" },
            { label: "Rated output", value: "TBC" },
            { label: "Steel penetration", value: "TBC" },
            { label: "Active area", value: "TBC" },
            { label: "Best fit", value: "Confined spaces, specialist search" },
          ],
        },
      ],
    },
    {
      id: "imaging",
      label: "Balanced & Wide-Format Imaging",
      description: "Larger detectors for bags, electronics, parcels, and forensic overview imaging.",
      products: [
        {
          slug: "ngpx-125",
          image: img("ngpx-125"),
          model: "NGPX-125",
          name: "Balanced Digital Imaging System",
          specs: [
            { label: "X-ray source", value: "Constant-potential" },
            { label: "Rated output", value: "125 kV*" },
            { label: "Steel penetration", value: "35 mm*" },
            { label: "Active area", value: "430 x 430 mm*" },
            { label: "Best fit", value: "EOD support, electronics, evidence inspection" },
          ],
        },
        {
          slug: "ngpx-120l",
          image: img("ngpx-120l"),
          model: "NGPX-120L",
          name: "Large-Format Imaging System",
          specs: [
            { label: "X-ray source", value: "Constant-potential" },
            { label: "Rated output", value: "120 kV*" },
            { label: "Steel penetration", value: "32 mm*" },
            { label: "Active area", value: "650 x 430 mm*" },
            { label: "Best fit", value: "Large parcels, equipment, forensic imaging" },
          ],
        },
        {
          slug: "ngpx-150c",
          image: img("ngpx-150c"),
          model: "NGPX-150C",
          name: "Versatile Field System",
          specs: [
            { label: "X-ray source", value: "Constant-potential" },
            { label: "Rated output", value: "150 kV*" },
            { label: "Steel penetration", value: "50 mm*" },
            { label: "Active area", value: "430 x 350 mm*" },
            { label: "Best fit", value: "Suspicious devices, concealed objects" },
          ],
        },
      ],
    },
    {
      id: "eod",
      label: "Professional EOD & High Penetration",
      description: "Higher energy and pulsed sources for dense targets, thick-walled containers, and tactical teams.",
      products: [
        {
          slug: "ngpx-150hd",
          image: img("ngpx-150hd"),
          model: "NGPX-150HD",
          name: "Professional High-Definition System",
          specs: [
            { label: "X-ray source", value: "Constant-potential" },
            { label: "Rated output", value: "150 kV*" },
            { label: "Steel penetration", value: "50 mm*" },
            { label: "Active area", value: "430 x 430 mm*" },
            { label: "Best fit", value: "Professional EOD, dense targets, structural detail" },
          ],
        },
        {
          slug: "ngpx-270",
          image: img("ngpx-270"),
          model: "NGPX-270",
          name: "High-Penetration Pulsed System",
          specs: [
            { label: "X-ray source", value: "Pulsed" },
            { label: "Rated output", value: "270 kV*" },
            { label: "Steel penetration", value: "110 mm*" },
            { label: "Active area", value: "430 x 430 mm*" },
            { label: "Best fit", value: "EOD, thick-walled containers, dense concealment" },
          ],
        },
        {
          slug: "ngpx-200",
          image: img("ngpx-200"),
          model: "NGPX-200",
          name: "Tactical Pulsed System",
          specs: [
            { label: "X-ray source", value: "Pulsed" },
            { label: "Rated output", value: "TBC" },
            { label: "Steel penetration", value: "36 mm*" },
            { label: "Active area", value: "430 x 350 mm*" },
            { label: "Best fit", value: "Tactical EOD, mobile inspection, checkpoints" },
          ],
        },
      ],
    },
  ],
};
