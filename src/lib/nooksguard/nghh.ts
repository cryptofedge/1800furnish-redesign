import type { SecurityCategory } from "./types";

// Source: catalog pages 59–65.
//
// The catalog counts 16 "models / configurations": 13 distinct models, with the
// flagship NGHH-2025 also sold in three color versions (-W, -O, -G) that share
// its specs. Those are shown as a "Colors" row on the one flagship card instead
// of four identical cards; productCount keeps the catalog's 16 and the category
// description says so, since the page shows 13 cards.
//
// Specs were cross-checked value by value against the catalog by independent
// reviewers on 2026-10-14 (no numeric errors; wording/completeness fixes applied).
//
// No product images yet: the source PDF wasn't available when this category was
// built. Re-extract pages 60–64 and review each render before use.

export const nghhCategory: SecurityCategory = {
  slug: "nghh",
  label: "Handheld Metal Detectors",
  shortLabel: "Handheld Detectors",
  description:
    "Handheld wands across four tiers, from an ultra-sensitive flagship that detects half of a No.10 staple to tactical pinpoint detectors, professional multi-mode wands, and cost-efficient models for high-volume deployment. Thirteen models, sixteen configurations counting the flagship's three color versions. Built for airports, prisons, government buildings, events, factory anti-theft, parcel screening, and confidential zones.",
  productCount: 16,
  status: "live",
  tiers: [
    {
      id: "flagship",
      label: "Flagship",
      description:
        "Ultra-high sensitivity, 200-hour runtime, and triple compliance: GB 12899-2018 Grade A, NIJ-0602.02 and NIJ-0602.03. Offered in three color configurations.",
      products: [
        {
          slug: "nghh-2025",
          model: "NGHH-2025",
          name: "Ultra-High Sensitivity Flagship",
          specs: [
            { label: "Sensitivity", value: "Half of a No.10 staple; 30 fine-step levels" },
            { label: "Detection range", value: ">= 300 mm" },
            { label: "Detection modes", value: "Ferrous / Non-ferrous / All-metal" },
            { label: "Display", value: "OLED digital readout" },
            { label: "Alarm", value: "Sound, light, vibration, headphone" },
            { label: "Power", value: "2xAA; rechargeable option; Type-C" },
            { label: "Runtime", value: "~200 h / ~30 days standby" },
            { label: "Protection", value: "IP53" },
            { label: "Temperature", value: "-40 to +70 C (4 h)" },
            { label: "Compliance", value: "GB 12899-2018 A, NIJ-0602.02 / .03" },
            { label: "Weight", value: "~260 g excl. battery" },
            { label: "Colors", value: "Glaze White (2025-W), Rosy Orange (2025-O), Space Gray (2025-G)" },
          ],
        },
      ],
    },
    {
      id: "premium",
      label: "Premium",
      description: "Tactical pinpoint precision for demanding field operations.",
      products: [
        {
          slug: "nghh-160",
          model: "NGHH-160",
          name: "Ultra-Sensitivity Pinpoint Wand",
          specs: [
            { label: "Sensitivity", value: "4 levels" },
            { label: "Display", value: "LCD depth display" },
            { label: "Scan area", value: "21 cm" },
            { label: "Frequency", value: "25-95 kHz" },
            { label: "Battery", value: "Lithium: 100 h runtime / 500 h standby" },
            { label: "Weight", value: "200 g, IP54" },
          ],
        },
        {
          slug: "nghh-160e",
          model: "NGHH-160E",
          name: "Pro Pinpoint with Type-C Lithium",
          specs: [
            { label: "Sensitivity", value: "4 levels" },
            { label: "Display", value: "LCD" },
            { label: "Certifications", value: "CE / FCC / RoHS" },
            { label: "Temperature", value: "-40 to +70 C" },
            { label: "Battery", value: "Type-C lithium, 500 h standby" },
            { label: "Weight", value: "200 g, IP54" },
          ],
        },
        {
          slug: "nghh-140",
          model: "NGHH-140",
          name: "Wide-Temp Tactical 3-Axis Detector",
          specs: [
            { label: "Sensitivity", value: "3 levels" },
            { label: "Identification", value: "ATD identification tone" },
            { label: "Sensor", value: "3-axis accelerometer" },
            { label: "Frequency", value: "25 kHz" },
            { label: "Battery", value: "Lithium: 150 h" },
            { label: "Weight", value: "400 g, IP54" },
          ],
        },
        {
          slug: "nghh-2022",
          model: "NGHH-2022",
          name: "5-Level Compact Wand",
          specs: [
            { label: "Sensitivity", value: "5 levels" },
            { label: "Modes", value: "ATD mode" },
            { label: "Charging", value: "USB Type-C" },
            { label: "Frequency", value: "25-95 kHz" },
            { label: "Battery", value: "Built-in 1800 mAh lithium" },
            { label: "Weight", value: "360 g" },
          ],
        },
      ],
    },
    {
      id: "performance",
      label: "Performance",
      description: "Mainstream professional models with versatile detection modes.",
      products: [
        {
          slug: "nghh-300c",
          model: "NGHH-300C",
          name: "Wide-Frequency Triple-Mode Detector",
          specs: [
            { label: "Sensitivity", value: "3 levels" },
            { label: "Frequency", value: "25-95 kHz" },
            { label: "Certifications", value: "CE / FCC / ISO 9001" },
            { label: "Temperature", value: "-25 to +60 C" },
            { label: "Battery", value: "2xAA / lithium, 500 h standby" },
            { label: "Weight", value: "250 g, IP54" },
          ],
        },
        {
          slug: "nghh-360",
          model: "NGHH-360",
          name: "Extended-Range 41 cm Probe",
          specs: [
            { label: "Sensitivity", value: "3 levels" },
            { label: "Probe", value: "41 cm, large scan coverage" },
            { label: "Frequency", value: "25-95 kHz" },
            { label: "Standby", value: "100 h" },
            { label: "Battery", value: "2xAA / lithium option" },
            { label: "Weight", value: "500 g, IP54" },
          ],
        },
        {
          slug: "nghh-008",
          model: "NGHH-008",
          name: "High-Frequency 35 kHz Super Wand",
          specs: [
            { label: "Processing", value: "VLF + DSP" },
            { label: "Frequency", value: "35 kHz" },
            { label: "Temperature", value: "-20 to +55 C" },
            { label: "Battery", value: "Built-in lithium" },
            { label: "Standby", value: "Up to 500 h" },
            { label: "Weight", value: "225 g, IP54" },
          ],
        },
        {
          slug: "nghh-300",
          model: "NGHH-300",
          name: "ATD Identification Wand",
          specs: [
            { label: "Identification", value: "ATD tone" },
            { label: "Modes", value: "Low-sensitivity mode" },
            { label: "Frequency", value: "22 kHz" },
            { label: "Battery", value: "9 V, 40 h continuous" },
            { label: "Weight", value: "264 g" },
          ],
        },
      ],
    },
    {
      id: "essential",
      label: "Essential",
      description: "Reliable, cost-efficient entry models for high-volume deployment.",
      products: [
        {
          slug: "nghh-1002",
          model: "NGHH-1002",
          name: "Cost-Efficient Compact Wand",
          specs: [
            { label: "Sensitivity", value: "2 levels" },
            { label: "Pin detection", value: "30-60 mm" },
            { label: "Durability", value: "1 m drop-tested" },
            { label: "Frequency", value: "22 kHz" },
            { label: "Battery", value: "9 V / 40 h" },
            { label: "Weight", value: "270 g" },
          ],
        },
        {
          slug: "nghh-3003",
          model: "NGHH-3003",
          name: "Audio + Vibration Alarm",
          specs: [
            { label: "Sensitivity", value: "2 levels" },
            { label: "Handgun detection", value: "150 mm" },
            { label: "Alarm", value: "Audio / vibration" },
            { label: "Frequency", value: "22 kHz" },
            { label: "Battery", value: "9 V / 40 h" },
            { label: "Weight", value: "270 g" },
          ],
        },
        {
          slug: "nghh-101h",
          model: "NGHH-101H",
          name: "Preset-Sensitivity Detector",
          specs: [
            { label: "Sensitivity", value: "Preset, no adjustment" },
            { label: "Alarm", value: "LED" },
            { label: "Operation", value: "Plug-and-play" },
            { label: "Frequency", value: "30 kHz" },
            { label: "Battery", value: "9 V: 30 h lithium / 28 h alkaline" },
            { label: "Weight", value: "225 g" },
          ],
        },
        {
          slug: "nghh-3003b1",
          model: "NGHH-3003B1",
          name: "Long-Wand Triple-Alarm Detector",
          specs: [
            { label: "Alarm", value: "Three alarm modes" },
            { label: "Environment", value: "Noisy-environment ready" },
            { label: "Probe", value: "Long patrol probe" },
            { label: "Frequency", value: "22 kHz" },
            { label: "Battery", value: "9 V / 40 h" },
            { label: "Weight", value: "270 g" },
          ],
        },
      ],
    },
  ],
};
