import type { SecurityCategory } from "./types";

// No product images yet: the source PDF wasn't available when this category was
// built. Re-extract pages 21, 23, 25, 27 (see nooksguard-source/README.md), check
// each render for OEM branding, then add `image: img("ngts-620")` etc.

export const ngtsCtCategory: SecurityCategory = {
  slug: "ngts-ct",
  label: "Fast CT Inspection",
  shortLabel: "CT Inspection",
  description:
    "Nooksguard's NGTS series brings dual-energy CT to the checkpoint. Independent DR and CT detection systems produce rotatable 3D color images and CT slice views, while AI recognition and automatic explosives/narcotics detection give operators confident decisions at speed. Built for airports, seaports, customs, courts, prisons, government buildings, embassies, and large events.",
  productCount: 4,
  status: "live",
  tiers: [
    {
      id: "checkpoint",
      label: "Checkpoint CT",
      description: "Compact and high-speed channels for carry-on bags, small parcels, and busy passenger lanes.",
      products: [
        {
          slug: "ngts-620",
          model: "NGTS-620",
          name: "Fast CT Luggage / Object Inspection System",
          tagline: "Compact, high-throughput CT for carry-on bags and small parcels.",
          specs: [
            { label: "Channel size", value: "625 x 420 mm" },
            { label: "Conveyor speed", value: "0.2-0.3 m/s (adjustable)" },
            { label: "DR penetration", value: ">= 30 mm steel" },
            { label: "CT resolution", value: "Better than 2.5 mm line pairs" },
            { label: "Tube voltage", value: "160 kV DR / 160 kV CT" },
            { label: "Display", value: "Dual 27 in, 1920x1080" },
            { label: "Dimensions", value: "3770 x 1340 x 1665 mm" },
            { label: "Power", value: "AC220V, 50/60Hz" },
          ],
        },
        {
          slug: "ngts-750",
          model: "NGTS-750",
          name: "Fast CT Luggage / Object Inspection System",
          tagline: "Purpose-built for airports and high-traffic checkpoints at 0.3 m/s.",
          specs: [
            { label: "Channel size", value: "754 x 412 mm" },
            { label: "Conveyor speed", value: "0.3 m/s" },
            { label: "DR penetration", value: ">= 30 mm steel" },
            { label: "CT resolution", value: "Better than 2.5 mm line pairs" },
            { label: "Tube voltage", value: "160 kV DR / 160 kV CT" },
            { label: "Display", value: "Dual 27 in, 1920x1080" },
            { label: "Dimensions", value: "3190 x 1640 x 1720 mm" },
            { label: "Power", value: "AC220V, 50/60Hz" },
          ],
        },
      ],
    },
    {
      id: "large-channel",
      label: "Large-Channel CT",
      description: "1000 x 600 mm tunnels for oversized luggage and cargo, up to 0.5 m/s.",
      products: [
        {
          slug: "ngts-1000",
          model: "NGTS-1000",
          name: "Large-Channel CT Inspection System",
          tagline: "Oversized luggage and cargo screening with independent DR + dual-energy CT.",
          specs: [
            { label: "Channel size", value: "1000 x 600 mm" },
            { label: "Conveyor speed", value: "0.25-0.3 m/s (adjustable)" },
            { label: "DR penetration", value: ">= 30 mm steel" },
            { label: "CT resolution", value: "Better than 2.5 mm line pairs" },
            { label: "Tube voltage", value: "180 kV" },
            { label: "Display", value: "Dual screen, 1920x1080" },
            { label: "Dimensions", value: "3295 x 1980 x 2090 mm" },
            { label: "Power", value: "AC380V" },
          ],
        },
        {
          slug: "ngts-1000e",
          model: "NGTS-1000E",
          name: "Flagship High-Speed CT Inspection System",
          tagline: "Maximum-throughput cargo and luggage screening at 0.5 m/s.",
          specs: [
            { label: "Channel size", value: "1000 x 600 mm" },
            { label: "Conveyor speed", value: "0.5 m/s" },
            { label: "DR penetration", value: ">= 30 mm steel" },
            { label: "CT resolution", value: "Better than 2.5 mm line pairs" },
            { label: "Tube voltage", value: "180 kV DR" },
            { label: "Display", value: "Triple 27 in, 1920x1080" },
            { label: "Dimensions", value: "4490 x 2000 x 2100 mm" },
            { label: "Options", value: "Radiation & chemical gas detection" },
          ],
        },
      ],
    },
  ],
};
