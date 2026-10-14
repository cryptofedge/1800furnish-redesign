import type { SecurityCategory } from "./types";
import { ngvjCategory } from "./ngvj";
import { ngz3825tCategory } from "./ngz-3825t";
import { audioProtectionCategory } from "./audio-protection";
import { ngmwCategory } from "./ngmw";
import { ngfsCategory } from "./ngfs";
import { ngtsCtCategory } from "./ngts-ct";
import { ngpxCategory } from "./ngpx";
import { threatDetectionCategory } from "./threat-detection";
import { nghwtCategory } from "./nghwt";

function stub(
  slug: string,
  label: string,
  shortLabel: string,
  description: string,
  productCount: number
): SecurityCategory {
  return { slug, label, shortLabel, description, productCount, status: "coming-soon", tiers: [] };
}

export const SECURITY_CATEGORIES: SecurityCategory[] = [
  stub(
    "ngz",
    "Compact X-Ray Inspection",
    "Compact X-Ray",
    "Bag and parcel X-ray screening for daily checkpoints, from handbag-size tunnels up to large-channel cargo units.",
    5
  ),
  ngvjCategory,
  ngtsCtCategory,
  ngz3825tCategory,
  ngpxCategory,
  nghwtCategory,
  stub(
    "nghh",
    "Handheld Metal Detectors",
    "Handheld Detectors",
    "Sixteen handheld wand configurations across four tiers, from ultra-sensitive flagship to cost-efficient mass deployment.",
    16
  ),
  ngmwCategory,
  ngfsCategory,
  stub(
    "nguv",
    "Under Vehicle Surveillance Systems",
    "Vehicle Surveillance",
    "Flush and surface-mount scanning lanes, 3D dual-view systems, and a full family of handheld inspection mirrors and video poles.",
    13
  ),
  threatDetectionCategory,
  stub(
    "tscm",
    "TSCM & Counter-Surveillance",
    "Counter-Surveillance",
    "Hidden camera detection, smart terminal and WiFi inspection, and handheld/portable signal detectors for the full TSCM workflow.",
    20
  ),
  // Signal Jamming (ngjm, catalog pages 93–96) intentionally omitted: RF jammers
  // can't be marketed or sold in the US except to authorized federal agencies
  // (FCC, 47 U.S.C. §§302a, 333). Don't re-add without a legal sign-off.
  audioProtectionCategory,
];

export function getSecurityCategory(slug: string): SecurityCategory | undefined {
  return SECURITY_CATEGORIES.find((c) => c.slug === slug);
}

export const SECURITY_PRODUCT_TOTAL = SECURITY_CATEGORIES.reduce((sum, c) => sum + c.productCount, 0);
