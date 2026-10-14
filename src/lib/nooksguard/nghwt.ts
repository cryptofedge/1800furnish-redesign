import type { SecurityCategory } from "./types";

// Source: catalog pages 45–58. The catalog's "Competitive Edge" page (52), which
// names CEIA and Garrett and makes unsubstantiated claims against them, is
// intentionally not reproduced on the site.
//
// No product images yet: the source PDF wasn't available when this category was
// built. Re-extract pages 46–50 and 55–58 and review each render before use.

export const nghwtCategory: SecurityCategory = {
  slug: "nghwt",
  label: "Walk-Through Metal Detectors",
  shortLabel: "Walk-Through WTMD",
  description:
    "Walk-through metal detection gates for every checkpoint, from volume-deployment entry gates and X-ray-adjacent units to airport-class flagship detection, a tool-free portable tower, and Android/IoT smart gates with centralized cloud management. Multi-zone alarm location, adjustable sensitivity, and safe-metal filtering keep lines moving at banks, hospitals, schools, courts, prisons, stadiums, and transit hubs.",
  productCount: 12,
  status: "live",
  tiers: [
    {
      id: "core",
      label: "NGHWT Core Series",
      description: "Five purpose-built gates, from budget volume deployment to airport-class and portable.",
      products: [
        {
          slug: "nghwt-600",
          model: "NGHWT-600",
          name: "Volume-Deployment Walk-Through Metal Detector",
          specs: [
            { label: "Positioning", value: "Entry tier, multi-checkpoint rollouts" },
            { label: "Zones", value: "6 / 12 / 18 switchable" },
            { label: "Alarm location", value: "Side LED light bars" },
            { label: "Outer size", value: "2220 x 810 mm" },
            { label: "Net weight", value: "50 kg" },
            { label: "Warranty", value: "1 year + 8-year parts supply" },
          ],
        },
        {
          slug: "nghwt-1618",
          model: "NGHWT-1618",
          name: "X-Ray-Companion Walk-Through Detector",
          specs: [
            { label: "Positioning", value: "Side-by-side with X-ray scanners" },
            { label: "Interference", value: "Patented zero-interference shielding" },
            { label: "Build", value: "ABS + PC + aluminium; IP43 option" },
            { label: "Safe-metal filter", value: "One-tap: buckles, keys, jewelry" },
            { label: "Tunnel", value: "750 x 2045 mm" },
            { label: "Battery", value: "20 h (optional)" },
          ],
        },
        {
          slug: "nghwt-2400",
          model: "NGHWT-2400",
          name: "Full-Touch Intelligence Security Gate",
          specs: [
            { label: "Display", value: "7 in bilingual touchscreen" },
            { label: "Presets", value: "54 scenario library" },
            { label: "Zones", value: "8 / 16 / 24 selectable" },
            { label: "Anti-vibration", value: "Panel strikes don't false-alarm" },
            { label: "Net weight", value: "60 kg" },
          ],
        },
        {
          slug: "nghwt-4500",
          model: "NGHWT-4500",
          name: "Airport-Class Walk-Through Detector",
          specs: [
            { label: "Sensitivity", value: "4090 level" },
            { label: "Frequency", value: "100 selectable bands" },
            { label: "Reset time", value: "0.2 seconds" },
            { label: "Flying-object detection", value: "Standard" },
            { label: "Random alarm", value: "Programmable 0-20%" },
            { label: "Access control", value: "Integrated turnstile interface" },
          ],
        },
        {
          slug: "nghwt-9000",
          model: "NGHWT-9000",
          name: "Rapid-Deployment Portable Security Tower",
          specs: [
            { label: "Setup", value: "5 min, one person, no tools" },
            { label: "Folded size", value: "107 x 66 x 71 cm (0.5 m3)" },
            { label: "Battery", value: "40 hours" },
            { label: "Protection", value: "IP55 + UV resistant" },
            { label: "Best fit", value: "Events, off-grid checkpoints" },
          ],
        },
      ],
    },
    {
      id: "multi-mode",
      label: "Multi-Mode Detection Gates",
      description: "Switch between full-metal, weapon-only, and mobile-phone detection modes.",
      products: [
        {
          slug: "nghwt-2025t",
          model: "NGHWT-2025T",
          name: "Intelligent Multi-AI Security Gate",
          specs: [
            { label: "Detection modes", value: "Prohibited item / item + phone / full metal" },
            { label: "Knife detection", value: "12 cm blade" },
            { label: "Display", value: "29-color large LCD" },
            { label: "Tunnel size", value: "1995 x 720 x 650 mm" },
            { label: "Weight", value: "~80 kg" },
            { label: "Standard", value: "GB15210-2018" },
          ],
        },
        {
          slug: "nghwt-2286d",
          model: "NGHWT-2286D",
          name: "Smart Android Touchscreen Security Gate",
          specs: [
            { label: "Platform", value: "Android 7.1, RK3288 quad-core" },
            { label: "Display", value: "28 in HD touchscreen" },
            { label: "Sensitivity", value: "0-9999 levels" },
            { label: "Zones", value: "6 / 12 / 18 selectable" },
            { label: "Overall size", value: "2345 x 915 x 600 mm" },
            { label: "Protection", value: "IP41" },
          ],
        },
      ],
    },
    {
      id: "smart-iot",
      label: "Smart / IoT Network Gates",
      description: "Touchscreen gates with cloud or LAN centralized management for multi-site operations.",
      products: [
        {
          slug: "nghwt-2286s",
          model: "NGHWT-2286S",
          name: "Android Smart Large-Screen Security Gate",
          specs: [
            { label: "Platform", value: "Android 7.1, quad-core, 2GB RAM" },
            { label: "Display", value: "28 in HD touchscreen" },
            { label: "Zones", value: "6 / 12 / 18 selectable" },
            { label: "Face recognition", value: "1080P camera, allow/deny lists" },
            { label: "Temperature scan", value: "IR, +/- 0.1C" },
            { label: "Overall size", value: "2345 x 915 x 600 mm" },
          ],
        },
        {
          slug: "nghwt-m8-plus",
          model: "NGHWT-M8-PLUS",
          name: "Smart IoT Network Security Gate",
          specs: [
            { label: "Display", value: "7.1 in touchscreen" },
            { label: "Zones", value: "8 continuous, no blind spots" },
            { label: "Sensitivity", value: "200 levels per zone" },
            { label: "Networking", value: "Cloud / LAN centralized management" },
            { label: "Programs", value: "30+ built-in" },
            { label: "Net weight", value: "65 kg" },
          ],
        },
      ],
    },
    {
      id: "classic",
      label: "Classic & Single-Pole Gates",
      description: "Reliable digital-pulse gates for everyday checkpoints, plus a compact column for narrow entries.",
      products: [
        {
          slug: "nghwt-2286",
          model: "NGHWT-2286",
          name: "Digital Pulse Metal Detector Gate",
          specs: [
            { label: "Sensitivity", value: "0-3999 levels" },
            { label: "Zones", value: "6 / 12 / 18 adjustable" },
            { label: "Pass rate", value: "> 100 per minute" },
            { label: "Channel", value: "1980 x 700 x 710 mm" },
            { label: "Gross weight", value: "72 kg" },
            { label: "Standard", value: "GB15210-2003" },
          ],
        },
        {
          slug: "nghwt-m8",
          model: "NGHWT-M8",
          name: "Ultra-High Sensitivity Metal Detector Gate",
          specs: [
            { label: "Sensitivity", value: "200 levels per zone" },
            { label: "Detects", value: "Magnetic / non-magnetic / mixed metal" },
            { label: "Protection", value: "IP55 (IEC 60529)" },
            { label: "Power", value: "AC 100-260V" },
            { label: "Gross weight", value: "80 kg" },
            { label: "Certification", value: "CE" },
          ],
        },
        {
          slug: "nghwt-2900d",
          model: "NGHWT-2900D",
          name: "Single-Pole Digital Pulse Metal Detector",
          specs: [
            { label: "Sensitivity", value: "4000-level, 0-3999 per zone" },
            { label: "Detection modes", value: "All / ferrous / non-ferrous metal" },
            { label: "Frequencies", value: "2,000 adjustable" },
            { label: "Display", value: "9 in color LCD" },
            { label: "Pass rate", value: "> 60 per minute" },
            { label: "Dimensions", value: "2170 x 120 x 450 mm" },
            { label: "Weight", value: "~30 kg" },
          ],
        },
      ],
    },
  ],
};
