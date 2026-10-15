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
import { nghhCategory } from "./nghh";
import { tscmCategory } from "./tscm";

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
  nghhCategory,
  ngmwCategory,
  ngfsCategory,
  // Under Vehicle Surveillance (nguv, catalog pages 72–79) intentionally
  // omitted: owner decided 2026-10-14 it doesn't fit the site.
  threatDetectionCategory,
  tscmCategory,
  // Signal Jamming (ngjm, catalog pages 93–96) intentionally omitted: RF jammers
  // can't be marketed or sold in the US except to authorized federal agencies
  // (FCC, 47 U.S.C. §§302a, 333). Don't re-add without a legal sign-off.
  audioProtectionCategory,
];

export function getSecurityCategory(slug: string): SecurityCategory | undefined {
  return SECURITY_CATEGORIES.find((c) => c.slug === slug);
}

export const SECURITY_PRODUCT_TOTAL = SECURITY_CATEGORIES.reduce((sum, c) => sum + c.productCount, 0);
