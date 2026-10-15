import {
  Baby,
  BedDouble,
  Building2,
  Home,
  Lamp,
  Lock,
  Shirt,
  Sofa,
  SprayCan,
  Tag,
  Tv,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { ShapeKind, ShapeVariant } from "@/components/product-shapes";

export interface Product {
  /** Supabase row id. Only present when sourced from the database (admin editing needs it). */
  id?: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  shape: ShapeKind;
  accentHex: string;
  shapeVariant?: ShapeVariant;
  /**
   * Optional public .glb URL for the 360° viewer (e.g. "/models/task-chair.glb"
   * from public/models/, or a Supabase Storage URL via the model_url column).
   * When absent the viewer renders the procedural `shape` instead.
   */
  modelUrl?: string;
  /**
   * "cover" for scene photos (product shown in a room or close-up, no clean
   * cutout possible): cards fill the frame with them edge to edge. Default is a
   * cutout on white, shown whole on the studio-grey well.
   */
  imageFit?: "cover";
  /** True while the image is a "Photo coming soon" card (no real photo yet). */
  imagePending?: true;
}

export interface Category {
  slug: string;
  label: string;
  icon: LucideIcon;
  description: string;
  products: Product[];
}

// Photos that stay as full-frame scenes (see public/products/items/SOURCES.md);
// every other product photo is a white-background cutout with matching framing.
const SCENE_PHOTOS = new Set([
  "height-adjustable-desk",
  "move-in-essentials-kit",
  "twin-linen-set",
  "queen-linen-set",
  "accent-chair",
  "keyless-entry-lock",
  "starter-room-package",
  "overstock-dining-chair",
]);

// The stock photo for these showed a different item (e.g. toasters for the
// washer/dryer), so they show a "Photo coming soon" card until a real photo
// arrives. Replace public/products/items/<slug>.jpg and remove the slug here.
const PENDING_PHOTOS = new Set([
  "washer-dryer-combo",
  "lateral-file-cabinet",
  "coffee-table",
  "reception-bench",
  "foldable-storage-bench",
  "dinnerware-set",
  "lamp-clearance-bundle",
  "trash-can",
  "window-security-film",
  "mattress-protector",
  "security-door-lockbox",
]);

function product(
  slug: string,
  name: string,
  price: number,
  description: string,
  shape: ShapeKind,
  accentHex: string,
  shapeVariant?: ShapeVariant
): Product {
  return {
    slug,
    name,
    price,
    description,
    image: `/products/items/${slug}.jpg`,
    ...(SCENE_PHOTOS.has(slug) ? { imageFit: "cover" as const } : {}),
    ...(PENDING_PHOTOS.has(slug) ? { imagePending: true as const } : {}),
    shape,
    accentHex,
    shapeVariant,
  };
}

export const CATEGORIES: Category[] = [
  {
    slug: "dining",
    label: "Dining",
    icon: UtensilsCrossed,
    description: "Dining sets and seating built for daily institutional use or residential comfort.",
    products: [
      product("5-piece-wood-dining-set", "5-Piece Wood Dining Set", 649, "Solid wood table with four matching chairs.", "table", "#6b4226"),
      product("counter-height-bistro-table", "Counter-Height Bistro Table", 329, "Compact table for common areas and break rooms.", "table", "#8a5a34", { scale: [1, 0.6, 1] }),
      product("stackable-banquet-chair", "Stackable Banquet Chair (Set of 4)", 219, "Commercial-grade, stacks for easy storage.", "chair", "#23262b"),
      product("commercial-round-dining-table", "Commercial Round Dining Table – 48in", 389, "Laminate top rated for high-traffic dining halls.", "table", "#4b5563", { round: true }),
    ],
  },
  {
    slug: "living-room",
    label: "Living Room",
    icon: Sofa,
    description: "Seating and lounge furniture for common areas, offices, and residential units.",
    products: [
      product("3-seat-sectional", "3-Seat Sectional with Reversible Chaise", 899, "Performance fabric, stain resistant.", "sofa", "#6b7280"),
      product("track-arm-sofa", "Track-Arm Upholstered Sofa", 549, "Clean-lined sofa for lounges and lobbies.", "sofa", "#374151"),
      product("accent-chair", "Accent Chair – Performance Fabric", 279, "Durable upholstery rated for daily use.", "chair", "#c98a3e"),
      product("coffee-table", "Coffee Table – Solid Wood Top", 199, "Scratch-resistant finish, steel base.", "table", "#6b4226", { scale: [0.9, 0.22, 0.9] }),
    ],
  },
  {
    slug: "kids-room",
    label: "Kids Room",
    icon: Baby,
    description: "Durable, safety-rated furniture for children's and family programs.",
    products: [
      product("twin-bunk-bed", "Twin Bunk Bed – Metal Frame", 389, "Safety-rail certified, space-saving design.", "bunkBed", "#4b5563"),
      product("kids-study-desk-chair", "Kids' Study Desk & Chair Set", 159, "Adjustable height, rounded edges.", "desk", "#e0a35c"),
      product("5-drawer-dresser", "5-Drawer Dresser – Soft Close", 249, "Anti-tip hardware included.", "dresser", "#8a5a34", { scale: [0.9, 1.1, 0.5] }),
      product("foldable-storage-bench", "Foldable Storage Bench", 89, "Dual-purpose seating and toy storage.", "bench", "#c98a3e"),
    ],
  },
  {
    slug: "bedroom",
    label: "Bedroom",
    icon: BedDouble,
    description: "Bedroom packages sized for dorms, transitional units, and residential suites.",
    products: [
      product("twin-metal-bed-frame", "Twin Metal Bed Frame", 99, "No box spring required, easy assembly.", "bed", "#8a93a3", { scale: [1.1, 1, 1] }),
      product("queen-platform-bed-frame", "Queen Platform Bed Frame", 219, "Reinforced steel slats, 700lb rated.", "bed", "#374151", { scale: [1.5, 1, 1] }),
      product("6-drawer-dresser", "6-Drawer Dresser", 329, "Full-extension drawers, solid wood legs.", "dresser", "#6b4226", { scale: [1.2, 1.0, 0.55] }),
      product("nightstand-usb", "Nightstand with USB Charging", 79, "Built-in outlets for modern residents.", "dresser", "#8a5a34", { scale: [0.5, 0.55, 0.45] }),
    ],
  },
  {
    slug: "transitional-housing",
    label: "Transitional Housing",
    icon: Home,
    description: "Complete single-occupancy packages for shelters and transitional programs.",
    products: [
      product("starter-room-package", "Starter Room Package (Bed, Desk, Storage)", 540, "Everything needed for one resident, bundled.", "bed", "#c98a3e", { scale: [1.1, 1, 1] }),
      product("twin-xl-mattress", "Twin XL Mattress – Fire-Code Certified", 179, "Meets institutional fire-safety standards.", "bed", "#e0a35c", { headboard: false, scale: [1.05, 1, 1] }),
      product("compact-wardrobe", "Compact Wardrobe Unit", 149, "Fits tight footprints, no assembly tools needed.", "dresser", "#6b4226", { scale: [0.7, 1.4, 0.5] }),
      product("move-in-kit", "All-in-One Move-In Kit", 320, "Linens, housewares, and bedroom basics in one order.", "stack", "#8a5a34"),
    ],
  },
  {
    slug: "commercial",
    label: "Commercial",
    icon: Building2,
    description: "Office and common-area furniture built for daily institutional throughput.",
    products: [
      product("task-chair", "Task Chair – Adjustable Lumbar", 189, "8-hour rated, breathable mesh back.", "chair", "#23262b"),
      product("height-adjustable-desk", "Height-Adjustable Desk", 449, "Electric sit-stand base, laminate top.", "desk", "#4b5563"),
      product("lateral-file-cabinet", "4-Drawer Lateral File Cabinet", 259, "Lockable, fire-resistant rated.", "dresser", "#374151", { scale: [1.0, 1.3, 0.55] }),
      product("reception-bench", "Reception Bench – 3 Seat", 399, "Waiting-area seating, commercial-grade frame.", "bench", "#6b7280", { scale: [1.3, 1, 1] }),
    ],
  },
  {
    slug: "electronics",
    label: "Electronics",
    icon: Tv,
    description: "Essential electronics for common areas, offices, and residential units.",
    products: [
      product("led-television", "32in LED Television", 179, "HD display for common rooms and units.", "applianceFlat", "#16181c"),
      product("microwave", "Microwave – 0.9 cu ft", 89, "Compact countertop unit.", "applianceCube", "#23262b"),
      product("mini-refrigerator", "Mini Refrigerator – 3.2 cu ft", 139, "Energy Star rated, quiet operation.", "applianceTall", "#8a93a3", { scale: [0.75, 1.2, 0.7] }),
      product("washer-dryer-combo", "All-in-One Washer/Dryer Combo", 599, "Space-saving unit for shared facilities.", "applianceTall", "#d4d8df", { scale: [0.85, 1.5, 0.75] }),
    ],
  },
  {
    slug: "linens",
    label: "Linens",
    icon: Shirt,
    description: "Bulk linen packages rated for high-turnover institutional laundering.",
    products: [
      product("twin-linen-set", "Twin Linen Set (Sheets, Pillow, Blanket)", 38, "Commercial-wash rated fabric.", "stack", "#c98a3e"),
      product("queen-linen-set", "Queen Linen Set", 52, "Includes fitted sheet, flat sheet, pillowcases.", "stack", "#6b7280"),
      product("bath-towel-bundle", "Bath Towel Bundle (Set of 6)", 29, "Quick-dry, high-absorbency cotton blend.", "stack", "#e0a35c"),
      product("mattress-protector", "Mattress Protector – Waterproof", 19, "Noiseless, vinyl-free barrier layer.", "stack", "#8a93a3"),
    ],
  },
  {
    slug: "housewares",
    label: "Housewares",
    icon: Lamp,
    description: "Kitchen and household essentials for move-in-ready units.",
    products: [
      product("cookware-set", "12-Piece Cookware Set", 59, "Non-stick, dishwasher safe.", "stack", "#374151"),
      product("dinnerware-set", "Dinnerware Set – Service for 4", 34, "Stackable, chip-resistant stoneware.", "stack", "#f4f1ec"),
      product("trash-can", "Trash Can – 13 Gallon", 22, "Step-open lid, odor-sealing.", "bin", "#4b5563"),
      product("move-in-essentials-kit", "Move-In Essentials Kit", 75, "Cookware, dinnerware, and basics bundled.", "stack", "#c98a3e"),
    ],
  },
  {
    slug: "security",
    label: "Security",
    icon: Lock,
    description: "Door hardware and unit-level security fixtures for institutional facilities.",
    products: [
      product("keyless-entry-lock", "Keyless Entry Door Lock", 129, "Keypad entry, audit-trail logging.", "panel", "#23262b"),
      product("security-door-lockbox", "Security Door Lockbox", 69, "Heavy-gauge steel, pry-resistant.", "panel", "#4b5563"),
      product("window-security-film", "Window Security Film Kit", 45, "Shatter-resistant, covers one standard window.", "panel", "#8a93a3"),
      product("smoke-co-detector", "Unit Smoke & CO Detector", 34, "Dual-sensor, 10-year battery.", "panel", "#f4f1ec", { round: true }),
    ],
  },
  {
    slug: "janitorial",
    label: "Janitorial",
    icon: SprayCan,
    description: "Facility-wide cleaning supplies and maintenance consumables.",
    products: [
      product("cleaning-cart", "Commercial Cleaning Cart", 189, "Multi-shelf, rolls through standard doorways.", "cart", "#4b5563"),
      product("janitorial-supply-kit", "Janitorial Supply Starter Kit", 99, "Core supplies for one facility wing.", "stack", "#6b7280"),
      product("mop-bucket-system", "Microfiber Mop & Bucket System", 54, "Wringer bucket, washable mop heads.", "cart", "#c98a3e", { scale: [0.7, 0.7, 0.7] }),
      product("bulk-trash-liners", "Bulk Trash Liners (Case of 200)", 39, "Heavy-duty, tear-resistant.", "stack", "#23262b"),
    ],
  },
  {
    slug: "clearance",
    label: "Clearance",
    icon: Tag,
    description: "Discounted overstock and open-box furniture, while supplies last.",
    products: [
      product("overstock-dining-chair", "Overstock Dining Chair (Assorted)", 49, "Mixed finishes, limited quantities.", "chair", "#8a5a34"),
      product("open-box-sectional", "Open-Box Sectional – As-Is", 399, "Minor cosmetic wear, fully functional.", "sofa", "#6b7280"),
      product("clearance-dresser", "Clearance Dresser – Floor Model", 179, "Display unit, small surface marks.", "dresser", "#6b4226", { scale: [1.0, 1.0, 0.55] }),
      product("lamp-clearance-bundle", "Assorted Lamp Clearance Bundle", 25, "Mixed styles while supplies last.", "lamp", "#e0a35c"),
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
