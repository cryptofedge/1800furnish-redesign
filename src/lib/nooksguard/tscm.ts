import type { SecurityCategory } from "./types";

const img = (slug: string) => `/nooksguard/products/${slug}.webp`;

// Source: catalog pages 85–92 (20 models in the catalog; 18 listed here).
//
// Intentionally omitted: NGTS-W2 and NGTS-W3 handheld WiFi inspectors. The
// catalog advertises a "WiFi countermeasure" / "interference countermeasure
// against target signals" feature — active WiFi interference, which the FCC
// treats like jamming (47 U.S.C. §§302a, 333; cf. the 2014 Marriott WiFi
// blocking fine). Same reasoning as the removed Signal Jamming family; don't
// re-add without a legal sign-off.
//
// Near-identical variants share a card: the P / PU pairs (U adds endoscope +
// laser lens detection) and the M6 / M14 / M24 monitors (spectrum ceiling only).
// Unsupported marketing claims in the catalog ("military/police-grade") are left
// out. Product images: catalog pages 86–91
// (2026-10-15); paired variants (T10/T10W, H67/H67R, H55/H55R, P6/P14/P24) share
// the catalog's single render.

const PORTABLE_SHARED = [
  { label: "Detection", value: "WiFi, Bluetooth, 2/3/4/5G cellular, full spectrum" },
  { label: "Thermal imaging", value: "Yes" },
  { label: "Alerts", value: "GPS trackers, audio bugs, Bluetooth tags, WiFi spy cameras" },
  { label: "Platform", value: "10-inch touch display, integrated antennas, report export" },
  { label: "U version adds", value: "Endoscope + laser camera-lens detection" },
];

export const tscmCategory: SecurityCategory = {
  slug: "tscm",
  label: "TSCM & Counter-Surveillance",
  shortLabel: "Counter-Surveillance",
  description:
    "Detection equipment for the full counter-surveillance workflow: hidden-camera detectors for hotel groups, meeting-room phone and wearable detection, handheld and portable signal detectors with thermal imaging up to 24 GHz, desktop speech protection, and 24/7 spectrum monitors for permanently secured rooms. Counter-surveillance equipment is regulated in many jurisdictions; deployment must comply with local laws and licensing requirements.",
  productCount: 18,
  status: "live",
  tiers: [
    {
      id: "camera",
      label: "Camera Detection",
      description: "Find hidden pinhole cameras, the most common privacy threat in hospitality.",
      products: [
        {
          slug: "ngts-c1",
          image: img("ngts-c1"),
          model: "NGTS-C1",
          name: "Hotel-Group Camera Detector",
          specs: [
            { label: "Detection", value: "WiFi / 4G camera auto-alert with identification" },
            { label: "False alarms", value: "Filters out phone activity" },
            { label: "Reporting", value: "Instant reports: store self-check + HQ platform" },
            { label: "Management", value: "Fleet-scale digital management for chains" },
            { label: "Best fit", value: "Hotel groups, chain operations" },
          ],
        },
        {
          slug: "ngts-c2",
          image: img("ngts-c2"),
          model: "NGTS-C2",
          name: "Multi-Mode Camera Detector",
          specs: [
            { label: "Scan", value: "One-key scan with tracker-check mode" },
            { label: "Known devices", value: "Whitelist management" },
            { label: "Size", value: "Pocket-sized, simple operation" },
            { label: "Best fit", value: "Hotels, rentals, fitting rooms, offices" },
          ],
        },
      ],
    },
    {
      id: "terminal",
      label: "Smart Terminal Detection",
      description: "Detect and locate phones, tablets, laptops and wearables to enforce no-phone meetings.",
      products: [
        {
          slug: "ngts-t10",
          image: img("ngts-t10"),
          model: "NGTS-T10",
          name: "Smart Terminal Detector",
          specs: [
            { label: "Detection", value: "Bluetooth 5.0" },
            { label: "Devices", value: "Phones, laptops, tablets, wearables" },
            { label: "Identification", value: "Brand-level, incl. Apple model detection" },
            { label: "Locating", value: "Signal-feature locating, visual + audio feedback" },
            { label: "Hardware", value: "4-antenna array, 10-inch class display" },
          ],
        },
        {
          slug: "ngts-t10w",
          image: img("ngts-t10w"),
          model: "NGTS-T10W",
          name: "Smart Terminal Detector (+WiFi)",
          specs: [
            { label: "Detection", value: "Bluetooth 5.0 + WiFi" },
            { label: "Devices", value: "Phones, laptops, tablets, wearables, WiFi-only devices" },
            { label: "Identification", value: "Brand-level, incl. Apple model detection" },
            { label: "Locating", value: "Signal-feature locating, visual + audio feedback" },
            { label: "Based on", value: "All NGTS-T10 capability" },
          ],
        },
      ],
    },
    {
      id: "handheld",
      label: "Handheld Signal Detectors",
      description:
        "All-carrier cellular, WiFi, Bluetooth and 1 MHz–12 GHz spectrum detection with GPS-tracker and FM-bug alerts. R versions add thermal imaging.",
      products: [
        {
          slug: "ngts-h67",
          image: img("ngts-h67"),
          model: "NGTS-H67",
          name: "6.67-inch Signal Detector",
          specs: [
            { label: "Cellular", value: "2/3/4/5G, all carriers" },
            { label: "WiFi", value: "2.4 / 5.8 GHz incl. hidden hotspots, camera alerts" },
            { label: "Bluetooth", value: "Name, MAC, vendor, strength" },
            { label: "Spectrum", value: "1 MHz – 12 GHz" },
            { label: "Alerts", value: "FM bugs, GPS trackers" },
          ],
        },
        {
          slug: "ngts-h67r",
          image: img("ngts-h67r"),
          model: "NGTS-H67R",
          name: "6.67-inch Signal Detector + Thermal",
          specs: [
            { label: "Detection", value: "All NGTS-H67 capability" },
            { label: "Thermal imaging", value: "256 x 192 infrared" },
            { label: "Temperature", value: "Image temperature measurement" },
            { label: "Confirmation", value: "Signal + heat dual confirmation" },
          ],
        },
        {
          slug: "ngts-h55",
          image: img("ngts-h55"),
          model: "NGTS-H55",
          name: "5.5-inch Signal Detector",
          specs: [
            { label: "Detection", value: "WiFi, Bluetooth, cellular, spectrum" },
            { label: "Core", value: "Same full-signal core as H67, compact body" },
            { label: "Antenna", value: "Micro-pointer directional antenna support" },
            { label: "Alerts", value: "GPS trackers, FM bugs" },
          ],
        },
        {
          slug: "ngts-h55r",
          image: img("ngts-h55r"),
          model: "NGTS-H55R",
          name: "5.5-inch Signal Detector + Thermal",
          specs: [
            { label: "Detection", value: "All NGTS-H55 capability" },
            { label: "Thermal imaging", value: "256 x 192 infrared" },
            { label: "Temperature", value: "Image temperature measurement" },
            { label: "Confirmation", value: "Signal + heat dual confirmation" },
          ],
        },
      ],
    },
    {
      id: "portable",
      label: "Portable Detectors with Thermal Imaging",
      description:
        "One 10-inch platform for professional sweeps. Choose the spectrum ceiling; the U version adds endoscope inspection and laser lens detection for physical searches.",
      products: [
        {
          slug: "ngts-p6",
          image: img("ngts-p6"),
          model: "NGTS-P6 / PU6",
          name: "Portable Detector, 6 GHz",
          specs: [{ label: "Spectrum", value: "1 MHz – 6 GHz" }, ...PORTABLE_SHARED],
        },
        {
          slug: "ngts-p14",
          image: img("ngts-p14"),
          model: "NGTS-P14 / PU14",
          name: "Portable Detector, 14 GHz",
          specs: [{ label: "Spectrum", value: "1 MHz – 14 GHz" }, ...PORTABLE_SHARED],
        },
        {
          slug: "ngts-p24",
          image: img("ngts-p24"),
          model: "NGTS-P24 / PU24",
          name: "Portable Detector, 24 GHz",
          specs: [{ label: "Spectrum", value: "1 MHz – 24 GHz" }, ...PORTABLE_SHARED],
        },
      ],
    },
    {
      id: "room",
      label: "Speech Protection & Long-Term Monitoring",
      description: "Protect conversations and watch a secured room around the clock.",
      products: [
        {
          slug: "ngts-s1",
          image: img("ngts-s1"),
          model: "NGTS-S1",
          name: "Desktop Speech Protection Terminal",
          specs: [
            { label: "Function", value: "Controls the acoustic environment against recording devices" },
            { label: "Form", value: "Discreet desktop terminal" },
            { label: "Power", value: "Built-in supply, continuous power adjustment" },
            { label: "Operation", value: "Simple, remote control, stable long-term running" },
            { label: "Best fit", value: "Boardrooms, negotiations, training rooms" },
          ],
        },
        {
          slug: "ngts-m-series",
          image: img("ngts-m-series"),
          model: "NGTS-M6 / M14 / M24",
          name: "Desktop Long-Term Signal Monitoring System",
          specs: [
            { label: "Spectrum", value: "M6: 6 GHz · M14: 14 GHz · M24: 24 GHz" },
            { label: "Cellular", value: "All 2G / 3G / 4G / 5G protocols" },
            { label: "WiFi / BT", value: "2.4 / 5.8 GHz WiFi, Bluetooth" },
            { label: "Alerts", value: "Classified, incl. suspected cameras and bugs" },
            { label: "Display", value: "Real-time spectrum with waterfall" },
            { label: "Operation", value: "24/7 continuous monitoring" },
          ],
        },
      ],
    },
  ],
};
