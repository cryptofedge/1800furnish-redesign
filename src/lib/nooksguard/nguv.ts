import type { SecurityCategory } from "./types";

// Source: catalog pages 72–79.
//
// No product images yet: the source PDF wasn't available when this category was
// built. Re-extract pages 73–76 and 78–79 and review each render before use.

export const nguvCategory: SecurityCategory = {
  slug: "nguv",
  label: "Under Vehicle Surveillance Systems",
  shortLabel: "Vehicle Surveillance",
  description:
    "Every vehicle-underside inspection scenario in one line: fixed dual-mode scanning lanes with license plate recognition, a 3D dual-view system that exposes threats hidden above bumpers and beams, a rapid-deployment portable kit, and a full family of handheld inspection mirrors and video poles. Built for government, military, transportation, and corporate checkpoints.",
  productCount: 13,
  status: "live",
  tiers: [
    {
      id: "scanning",
      label: "Automated Scanning Systems",
      description:
        "Dual-mode 4096P chassis imaging at speed, with license plate recognition. Systems include scanner, LPR camera, server, control box, and speed ramp.",
      products: [
        {
          slug: "nguv-110f",
          model: "NGUV-110F",
          name: "Flush Mount Dual Mode Scanning System",
          specs: [
            { label: "Install", value: "Flush, < 5 cm dig, < 3 cm above ground" },
            { label: "Scan speed", value: "Fwd 0-100 km/h / Bwd 0-25 km/h" },
            { label: "Resolution", value: "> 10000 x 4096, > 180 deg view" },
            { label: "Capture rate", value: "> 99.9%" },
            { label: "Load bearing", value: "60 tonnes" },
            { label: "Protection", value: "IP68, -40C to 70C" },
            { label: "LPR", value: "Front/rear, bi-directional, > 99.5%" },
          ],
        },
        {
          slug: "nguv-110s",
          model: "NGUV-110S",
          name: "Surface Mount Dual Mode Scanning System",
          specs: [
            { label: "Install", value: "Surface mount, no civil work" },
            { label: "Height", value: "7 cm total, integrated ramps" },
            { label: "Scan speed", value: "Fwd 0-45 km/h / Bwd 0-15 km/h" },
            { label: "Resolution", value: "> 10000 x 4096, > 180 deg view" },
            { label: "Load bearing", value: "40 tonnes" },
            { label: "Protection", value: "IP68, 304 stainless protector" },
          ],
        },
        {
          slug: "nguv-110p",
          model: "NGUV-110P",
          name: "Portable Dual Mode Scanning System",
          specs: [
            { label: "Deployment", value: "Wheeled mobile server cart" },
            { label: "Battery", value: "48V/11Ah, > 8 hours" },
            { label: "Monitor", value: "27 in IPS 1080P in cart lid" },
            { label: "Scan speed", value: "Fwd 0-45 km/h / Bwd 0-15 km/h" },
            { label: "Scanner", value: "590 x 300 x 69 mm, 22 kg" },
            { label: "Load bearing", value: "40 tonnes" },
          ],
        },
        {
          slug: "nguv-260",
          model: "NGUV-260",
          name: "3D Dual-View Scanning System",
          specs: [
            { label: "Views", value: "Tilted front + back, combined 3D" },
            { label: "Sensor", value: "4K image sensor" },
            { label: "Scan speed", value: "Bidirectional 0-60 km/h" },
            { label: "Resolution", value: "> 6000 x 4096, > 99.9%" },
            { label: "Load / height", value: "20 tonnes / 8 mm above ground" },
            { label: "Protection", value: "IP68, -40C to 70C" },
            { label: "Triggers", value: "Embedded, loop, radar/laser" },
          ],
        },
      ],
    },
    {
      id: "mirrors",
      label: "Handheld Inspection Mirrors",
      description: "Telescopic convex mirrors with LED illumination for rapid manual checks at gates, patrols, and event entrances.",
      products: [
        {
          slug: "nguv-m2",
          model: "NGUV-M2",
          name: "20cm Round Mirror",
          specs: [
            { label: "Magnification", value: "1.5x" },
            { label: "Pole", value: "500-1100 mm" },
            { label: "Light", value: "9-LED flashlight" },
            { label: "Weight", value: "0.6 kg, one-hand use" },
          ],
        },
        {
          slug: "nguv-m16",
          model: "NGUV-M16",
          name: "16cm Compact Mirror",
          specs: [
            { label: "Magnification", value: "1.5x" },
            { label: "Pole", value: "520-1600 mm" },
            { label: "Light", value: "Built-in bottom LED" },
            { label: "Weight", value: "0.42 kg" },
          ],
        },
        {
          slug: "nguv-m3",
          model: "NGUV-M3",
          name: "30cm Wheeled Mirror",
          specs: [
            { label: "Magnification", value: "2x" },
            { label: "Pole", value: "900-1200 mm" },
            { label: "Wheels", value: "Universal casters" },
            { label: "Light", value: "9-LED flashlight" },
          ],
        },
        {
          slug: "nguv-m3z",
          model: "NGUV-M3Z",
          name: "30cm Dual-Axle Mirror",
          specs: [
            { label: "Magnification", value: "2x" },
            { label: "Pole", value: "510-1070 mm" },
            { label: "Wheels", value: "Dual-axle casters" },
            { label: "Light", value: "Multi-function flashlight" },
          ],
        },
        {
          slug: "nguv-m4",
          model: "NGUV-M4",
          name: "40cm T-Grip Mirror",
          specs: [
            { label: "Magnification", value: "2x" },
            { label: "Pole", value: "T-grip, 550-1080 mm" },
            { label: "Wheels", value: "Dual-axle casters" },
            { label: "Best fit", value: "Trucks & buses" },
          ],
        },
        {
          slug: "nguv-m5",
          model: "NGUV-M5",
          name: "30cm Square Mirror",
          specs: [
            { label: "Magnification", value: "2x" },
            { label: "Pole", value: "500-1100 mm" },
            { label: "Light", value: "Long LED light bar" },
            { label: "Wheels", value: "Universal casters" },
          ],
        },
      ],
    },
    {
      id: "video-poles",
      label: "Video Inspection Poles",
      description: "When a mirror isn't enough: camera poles with screens record what the officer sees.",
      products: [
        {
          slug: "nguv-v1",
          model: "NGUV-V1",
          name: "Video Inspection Pole",
          specs: [
            { label: "Capture", value: "Video recording + photo" },
            { label: "Camera", value: "Night vision, waterproof lens" },
            { label: "Screen", value: "Top-mounted, live view" },
            { label: "Pole", value: "1200-1400 mm" },
          ],
        },
        {
          slug: "nguv-v2",
          model: "NGUV-V2",
          name: "Night Vision Inspection Pole",
          specs: [
            { label: "Capture", value: "Night vision photo documentation" },
            { label: "Camera", value: "Waterproof lens" },
            { label: "System", value: "Multimedia storage" },
            { label: "Pole", value: "1200-1400 mm" },
          ],
        },
        {
          slug: "nguv-v3",
          model: "NGUV-V3",
          name: "Dual-Camera HD Inspection Pole",
          specs: [
            { label: "Camera", value: "Dual cameras" },
            { label: "Screen", value: "Large HD screen" },
            { label: "Capture", value: "Photo + recording" },
            { label: "Pole", value: "500-1100 mm" },
          ],
        },
      ],
    },
  ],
};
