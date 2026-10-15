export interface SecuritySpec {
  label: string;
  value: string;
}

export interface SecurityProduct {
  slug: string;
  model: string;
  name: string;
  tagline?: string;
  image?: string;
  /** Shown as a tag on the image, e.g. when the catalog calls it an illustration. */
  imageNote?: string;
  specs: SecuritySpec[];
  bullets?: string[];
}

export interface SecurityTier {
  id: string;
  label: string;
  description?: string;
  products: SecurityProduct[];
}

export interface SecurityCategory {
  slug: string;
  label: string;
  shortLabel: string;
  description: string;
  productCount: number;
  tiers: SecurityTier[];
  /** "live" categories have full product data below; "coming-soon" are stubbed pending data entry. */
  status: "live" | "coming-soon";
}
