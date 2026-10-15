import type { SecurityCategory } from "./types";

const img = (slug: string) => `/nooksguard/products/${slug}.png`;

// Photo audit (2026-10-15): images follow the catalog's own placement on
// pages 15–18. The catalog prints the NGVJ6040D render for NGVJ6550D too, so
// that card reuses it with a note. The page frame lines baked into several
// renders and the OEM "VKJ-150180" text on the freight unit were retouched out.

export const ngvjCategory: SecurityCategory = {
  slug: "ngvj",
  label: "NGVJ Security Screening Series",
  shortLabel: "NGVJ Series",
  description:
    "Fourteen X-ray screening platforms across four tiers — from discreet entry-level scanners to zero-blind dual-view and specialized triple-view / backscatter systems.",
  productCount: 14,
  status: "live",
  tiers: [
    {
      id: "discreet",
      label: "Tier 1 — Discreet",
      description: "Compact, quiet screening for everyday spaces.",
      products: [
        {
          slug: "ngvj5030a",
          model: "NGVJ5030A",
          name: "Entry Single-View",
          image: img("ngvj5030a"),
          specs: [
            { label: "Tunnel", value: "500 x 300 mm" },
            { label: "Penetration", value: "8 mm steel" },
            { label: "Speed", value: "0.18 m/s" },
          ],
        },
        {
          slug: "ngvj5030c",
          model: "NGVJ5030C",
          name: "High-Penetration",
          image: img("ngvj5030c"),
          specs: [
            { label: "Tunnel", value: "500 x 300 mm" },
            { label: "Penetration", value: "34 mm steel" },
            { label: "Speed", value: "0.18 m/s" },
          ],
        },
        {
          slug: "ngvj5332",
          model: "NGVJ5332",
          name: "Compact Desktop",
          image: img("ngvj5332"),
          specs: [
            { label: "Tunnel", value: "530 x 320 mm" },
            { label: "Penetration", value: "22 mm steel" },
            { label: "Type", value: "Desktop" },
          ],
        },
        {
          slug: "ngvj6040",
          model: "NGVJ6040",
          name: "Entry Single-View",
          image: img("ngvj6040"),
          specs: [
            { label: "Tunnel", value: "600 x 400 mm" },
            { label: "Penetration", value: "22 mm steel" },
            { label: "Speed", value: "0.2 m/s" },
          ],
        },
      ],
    },
    {
      id: "workhorse",
      label: "Tier 2 — Workhorse / Throughput",
      description: "Dependable screening for higher-traffic checkpoints.",
      products: [
        {
          slug: "ngvj6550",
          model: "NGVJ6550",
          name: "Workhorse",
          image: img("ngvj6550"),
          specs: [
            { label: "Tunnel", value: "650 x 500 mm" },
            { label: "Penetration", value: "28 mm steel" },
            { label: "Speed", value: "0.22 m/s" },
          ],
        },
        {
          slug: "ngvj8065",
          model: "NGVJ8065",
          name: "Throughput",
          image: img("ngvj8065"),
          specs: [
            { label: "Tunnel", value: "800 x 650 mm" },
            { label: "Penetration", value: "30 mm steel" },
            { label: "Speed", value: "0.22 m/s" },
          ],
        },
        {
          slug: "ngvj100100",
          model: "NGVJ100100",
          name: "Throughput",
          image: img("ngvj100100"),
          specs: [
            { label: "Tunnel", value: "1000 x 1000 mm" },
            { label: "Penetration", value: "32 mm steel" },
            { label: "Speed", value: "0.22 m/s" },
          ],
        },
      ],
    },
    {
      id: "zero-blind",
      label: "Tier 3 — Zero-Blind",
      description: "Dual-source imaging that eliminates blind spots.",
      products: [
        {
          slug: "ngvj6040d",
          model: "NGVJ6040D",
          name: "Zero-Blind Dual-View",
          image: img("ngvj6040d"),
          specs: [
            { label: "Tunnel", value: "600 x 400 mm" },
            { label: "Sources", value: "2 (Dual-View)" },
            { label: "Speed", value: "0.2 m/s" },
          ],
        },
        {
          slug: "ngvj6550d",
          model: "NGVJ6550D",
          name: "Zero-Blind Dual-View",
          image: img("ngvj6040d"),
          imageNote: "Image shows NGVJ6040D",
          specs: [
            { label: "Tunnel", value: "650 x 500 mm" },
            { label: "Sources", value: "2 (Dual-View)" },
            { label: "Speed", value: "0.22 m/s" },
          ],
        },
        {
          slug: "ngvj7555d",
          model: "NGVJ7555D",
          name: "Zero-Blind Dual-View",
          image: img("ngvj7555d"),
          specs: [
            { label: "Tunnel", value: "750 x 550 mm" },
            { label: "Sources", value: "2 (Dual-View)" },
            { label: "Speed", value: "0.22 m/s" },
          ],
        },
        {
          slug: "ngvj150180",
          model: "NGVJ150180",
          name: "Heavy-Duty Freight",
          image: img("ngvj150180"),
          specs: [
            { label: "Tunnel", value: "1500 x 1800 mm" },
            { label: "Type", value: "Oversized freight" },
            { label: "Penetration", value: "High" },
          ],
        },
      ],
    },
    {
      id: "specialized",
      label: "Tier 4 — Specialized",
      description: "Triple-view and backscatter for advanced threat detection.",
      products: [
        {
          slug: "ngvj6550f",
          model: "NGVJ6550F",
          name: "Triple-View Specialized",
          image: img("ngvj6550f"),
          specs: [
            { label: "Tunnel", value: "650 x 500 mm" },
            { label: "Sources", value: "3 (Triple-View)" },
            { label: "Penetration", value: "Highest" },
          ],
        },
        {
          slug: "ngvj-bk6040",
          model: "NGVJ-BK6040",
          name: "Backscatter Specialized",
          image: img("ngvj-bk6040"),
          specs: [
            { label: "Tunnel", value: "600 x 400 mm" },
            { label: "Mode", value: "Backscatter + Transmission" },
            { label: "Penetration", value: "High" },
          ],
        },
        {
          slug: "ngvj-bk7555",
          model: "NGVJ-BK7555",
          name: "Backscatter Specialized",
          image: img("ngvj-bk7555"),
          specs: [
            { label: "Tunnel", value: "750 x 550 mm" },
            { label: "Mode", value: "Backscatter + Transmission" },
            { label: "Penetration", value: "High" },
          ],
        },
      ],
    },
  ],
};
