import type { SecurityCategory } from "./types";

const img = (slug: string) => `/nooksguard/products/${slug}.webp`;

// Source: catalog pages 4–13 (one overview page + one technical-data page per
// model). The catalog doesn't tier this series, so it's a single row.
//
// Product images: pages 4, 6, 8, 10 and 12. Every render had a third-party
// logo baked into the machine's side panel; it was painted out to a plain panel
// (2026-10-15). No Nooksguard logo was added, so nothing on the machine is
// invented.

const SHARED = {
  lineResolution: { label: "Line resolution", value: "AWG38 (0.102 mm)" },
  source: { label: "X-ray source", value: "140-160 kV; 0.5-1.25 mA" },
  speed: { label: "Conveyor speed", value: "0.22 m/s" },
  display: { label: "Display", value: "21.5 in, 1920 x 1080" },
  power: { label: "Power", value: "AC220V 50Hz; 500 W" },
};

export const ngzCategory: SecurityCategory = {
  slug: "ngz",
  label: "Compact X-Ray Inspection",
  shortLabel: "Compact X-Ray",
  description:
    "Bag and parcel X-ray screening for daily checkpoints, from a 500 x 300 mm tunnel for hand luggage up to a 1000 x 1000 mm channel for oversized bags and cargo. A fully digital ASIC-based design with color / B&W material differentiation, 1–64x zoom and image enhancement. AI image recognition and dangerous-goods alarms can be configured to order.",
  productCount: 5,
  status: "live",
  tiers: [
    {
      id: "ngz-c",
      label: "NGZ C-Series",
      description:
        "All five share AWG38 line resolution, 1.0 mm spatial resolution, a 140-160 kV source, a 21.5 in HD display and noise under 55 dB at 1 m. Radiation leakage is under 0.5 μSv at 50 mm from the enclosure; single inspection dose under 5 μGy/h.",
      products: [
        {
          slug: "ngz-5030c",
          image: img("ngz-5030c"),
          model: "NGZ-5030C",
          name: "Compact X-Ray Inspection System",
          tagline: "Bags, parcels and hand luggage.",
          specs: [
            { label: "Channel size", value: "500 x 300 mm" },
            { label: "Penetration", value: "40 mm steel" },
            SHARED.speed,
            { label: "Conveyor height", value: "660 mm" },
            SHARED.lineResolution,
            SHARED.source,
            SHARED.display,
            { label: "Device size", value: "1475 x 784 x 1100 mm" },
            { label: "Weight", value: "245 kg" },
            SHARED.power,
          ],
        },
        {
          slug: "ngz-6550c",
          image: img("ngz-6550c"),
          model: "NGZ-6550C",
          name: "Compact X-Ray Inspection System",
          tagline: "Briefcases, mail parcels and hand luggage.",
          specs: [
            { label: "Channel size", value: "650 x 500 mm" },
            { label: "Penetration", value: "40 mm steel" },
            SHARED.speed,
            { label: "Conveyor height", value: "660 mm" },
            SHARED.lineResolution,
            SHARED.source,
            SHARED.display,
            { label: "Device size", value: "1876 x 934 x 1300 mm" },
            { label: "Weight", value: "300 kg" },
            SHARED.power,
          ],
        },
        {
          slug: "ngz-8065c",
          image: img("ngz-8065c"),
          model: "NGZ-8065C",
          name: "Mid-Capacity X-Ray Inspection System",
          tagline: "Handbags, parcels and express items.",
          specs: [
            { label: "Channel size", value: "800 x 650 mm" },
            { label: "Penetration", value: "38 mm steel" },
            SHARED.speed,
            { label: "Conveyor height", value: "310 mm" },
            SHARED.lineResolution,
            SHARED.source,
            SHARED.display,
            { label: "Device size", value: "2540 x 1160 x 1420 mm" },
            { label: "Weight", value: "530 kg" },
            SHARED.power,
          ],
        },
        {
          slug: "ngz-10080c",
          image: img("ngz-10080c"),
          model: "NGZ-10080C",
          name: "High-Throughput X-Ray Inspection System",
          tagline: "Larger bags and cargo parcels.",
          specs: [
            { label: "Channel size", value: "1000 x 800 mm" },
            { label: "Penetration", value: "42 mm steel" },
            SHARED.speed,
            { label: "Conveyor height", value: "310 mm" },
            SHARED.lineResolution,
            SHARED.source,
            SHARED.display,
            { label: "Device size", value: "2890 x 1360 x 1560 mm" },
            { label: "Weight", value: "650 kg" },
            SHARED.power,
          ],
        },
        {
          slug: "ngz-100100c",
          image: img("ngz-100100c"),
          model: "NGZ-100100C",
          name: "Large-Channel X-Ray Inspection System",
          tagline: "Oversized bags and cargo.",
          specs: [
            { label: "Channel size", value: "1000 x 1000 mm" },
            { label: "Penetration", value: "38 mm steel" },
            SHARED.speed,
            { label: "Conveyor height", value: "310 mm" },
            SHARED.lineResolution,
            SHARED.source,
            SHARED.display,
            { label: "Device size", value: "3300 x 1360 x 1760 mm" },
            { label: "Weight", value: "750 kg" },
            SHARED.power,
          ],
        },
      ],
    },
  ],
};
