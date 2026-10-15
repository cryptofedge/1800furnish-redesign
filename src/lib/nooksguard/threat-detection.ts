import type { SecurityCategory } from "./types";

const img = (slug: string) => `/nooksguard/products/${slug}.webp`;

// Source: catalog pages 80–84.
//
// Product images: catalog pages 81–84 (2026-10-15). Page 81's explosive-detector
// artwork is labeled "Illustrative device rendering" in the catalog, so those five
// images carry an imageNote shown on the card. NGRD-3000 has no image on purpose:
// the catalog reuses a "Gas Detector Alarm" render for this radiation device.

export const threatDetectionCategory: SecurityCategory = {
  slug: "threat-detection",
  label: "Security & Threat Detection",
  shortLabel: "Threat Detection",
  description:
    "Instruments for the threats a scanner can't see: trace explosive and narcotics detectors, dangerous liquid screening, portable and wearable radiation monitors, and chemical warfare agent and multi-gas detectors. Built for airports, metro stations, customs and border checkpoints, courthouses, embassies, stadiums, emergency response, and industrial safety teams.",
  productCount: 11,
  status: "live",
  tiers: [
    {
      id: "explosive",
      label: "Explosive Detection Devices",
      description: "Portable and handheld trace explosive and narcotics detectors.",
      products: [
        {
          slug: "nged-6",
          image: img("nged-6"),
          imageNote: "Illustrative rendering",
          model: "NGED-6",
          name: "Portable Trace Explosive Detector",
          specs: [
            { label: "Sensitivity", value: "≤ 10⁻¹² g (TNT)" },
            { label: "Start-up time", value: "<= 10 sec" },
            { label: "Weight", value: "500 g" },
            { label: "Battery life", value: ">= 12 hours" },
            { label: "Data storage", value: "1.1M records" },
          ],
        },
        {
          slug: "nged-4800",
          image: img("nged-4800"),
          imageNote: "Illustrative rendering",
          model: "NGED-4800",
          name: "Explosive & Narcotics Detector",
          specs: [
            { label: "Sensitivity", value: "Nanogram level" },
            { label: "Start-up time", value: "<= 10 sec" },
            { label: "False alarm rate", value: "<= 1%" },
            { label: "Battery life", value: ">= 12 hours" },
            { label: "Alarm sound", value: ">= 95 dB" },
          ],
        },
        {
          slug: "nged-3",
          image: img("nged-3"),
          imageNote: "Illustrative rendering",
          model: "NGED-3",
          name: "Multi-Functional Prohibited Item Detector",
          specs: [
            { label: "Technology", value: "Ion Mobility Spectrometry" },
            { label: "Sensitivity", value: "ng ~ pg (TNT 200 pg)" },
            { label: "Analysis time", value: "2-32 sec" },
            { label: "Data storage", value: ">= 300,000 records" },
            { label: "Battery", value: "> 5 hrs continuous" },
          ],
        },
        {
          slug: "nged-4",
          image: img("nged-4"),
          imageNote: "Illustrative rendering",
          model: "NGED-4",
          name: "Quantum Trace Explosive & Drug Detector",
          specs: [
            { label: "Technology", value: "Photoionization + IMS" },
            { label: "Sensitivity", value: "ng / pg level" },
            { label: "Analysis time", value: "<= 3 sec" },
            { label: "False alarm rate", value: "<= 1%" },
            { label: "Weight", value: "4.8 kg" },
          ],
        },
        {
          slug: "nged-410",
          image: img("nged-410"),
          imageNote: "Illustrative rendering",
          model: "NGED-410",
          name: "Handheld Raman Substance Identifier",
          specs: [
            { label: "Detection speed", value: "Seconds" },
            { label: "Sample prep", value: "None required" },
            { label: "Method", value: "Non-contact, non-destructive" },
            { label: "Resolution", value: "6 cm-1" },
            { label: "Mixture detection", value: "Up to 5 components" },
          ],
        },
      ],
    },
    {
      id: "liquid",
      label: "Liquid & Bottle Inspection",
      description: "Desktop dangerous-liquid screening in about a second, without opening the container.",
      products: [
        {
          slug: "nglq-1800",
          image: img("nglq-1800"),
          model: "NGLQ-1800",
          name: "Desktop Dangerous Liquid Detector",
          specs: [
            { label: "Method", value: "UWB microwave + thermal conductivity" },
            { label: "Detection speed", value: "1 second" },
            { label: "Detectable liquids", value: "40+ types, incl. low-alcohol spirits" },
            { label: "Containers", value: "Plastic, glass, ceramic" },
            { label: "Bottle diameter", value: "30-200 mm" },
            { label: "Weight", value: "<= 6.8 kg" },
          ],
        },
        {
          slug: "nglq-2800",
          image: img("nglq-2800"),
          model: "NGLQ-2800",
          name: "Desktop Dangerous Liquid Inspector",
          specs: [
            { label: "Method", value: "UWB microwave + thermal conductivity" },
            { label: "Detection speed", value: "1 sec (insulated); < 5 sec (metal)" },
            { label: "Detectable liquids", value: "40+ types, incl. acids" },
            { label: "Containers", value: "Metal, plastic, glass, ceramic" },
            { label: "Display", value: "7 in foldable touchscreen" },
            { label: "Weight", value: "<= 12 kg" },
          ],
        },
      ],
    },
    {
      id: "radiation",
      label: "Radiation Monitoring Equipment",
      description: "Portable inspection and wearable personal dose monitoring.",
      products: [
        {
          slug: "ngrd-3000",
          model: "NGRD-3000",
          name: "Portable Radiation Inspection Device",
          specs: [
            { label: "Dose rate range", value: "0.01-200 uGy/h" },
            { label: "Cumulative dose", value: "0-9.99 Sv" },
            { label: "Energy response", value: "35 keV-3.0 MeV" },
            { label: "Positioning", value: "Built-in GPS" },
            { label: "Battery life", value: "> 8 hours" },
            { label: "Weight", value: "~1800 g" },
          ],
        },
        {
          slug: "ngrd-alm",
          image: img("ngrd-alm"),
          model: "NGRD-ALM",
          name: "Wearable Radiation Alarm",
          specs: [
            { label: "Detector", value: "Scintillation crystal + SiPM" },
            { label: "Dose rate range", value: "0.01 uSv/h - 150 mSv/h" },
            { label: "Energy range", value: "35 keV-3 MeV" },
            { label: "Protection", value: "IP67" },
            { label: "Battery life", value: "> 40 hours" },
            { label: "Weight", value: "<= 50 g" },
          ],
        },
      ],
    },
    {
      id: "chemical-gas",
      label: "Chemical & Gas Detection",
      description: "Chemical warfare agent alarms and configurable multi-gas detection.",
      products: [
        {
          slug: "ngcg-300",
          image: img("ngcg-300"),
          model: "NGCG-300",
          name: "Chemical Warfare Agent Alarm",
          specs: [
            { label: "Detects", value: "G/V-series nerve agents, AC, COCl2" },
            { label: "Display", value: "2.4 in HD color screen" },
            { label: "Sensor", value: "High-performance array" },
            { label: "Protection", value: "Dustproof, explosion-proof, waterproof" },
            { label: "Weight", value: "<= 350 g" },
            { label: "Dimensions", value: "<= 179 x 76 x 49 mm" },
          ],
        },
        {
          slug: "ngcg-multi",
          image: img("ngcg-multi"),
          model: "NGCG-MULTI",
          name: "Multi-Gas Composite Detector",
          specs: [
            { label: "Detectable gases", value: "PID/LEL/CO/H2S/O2 (configurable)" },
            { label: "Sampling", value: "Active pump, 500 mL/min" },
            { label: "Response time", value: "<= 20 sec (T90)" },
            { label: "Data storage", value: "300,000 records" },
            { label: "Protection", value: "IP67; Ex ia IIC T4 Ga" },
            { label: "Weight", value: "<= 750 g" },
          ],
        },
      ],
    },
  ],
};
