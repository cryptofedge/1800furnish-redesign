// The home-page hero: real room photos with numbered markers on the pieces
// that have a close match in the catalog. Rooms are tabs; numbering runs on
// across rooms in this order (living area 01–03, bedroom 04–06, ...).
//
// Coordinates are percentages of the whole photo (not of the on-screen crop),
// so markers stay on their pieces at every screen size. To move a marker,
// change `at`; `box` is the piece's outline, which lights up on hover and can
// be clicked like the marker (where boxes overlap, the later one wins). Only
// list products that have a real photo (not a "Photo coming soon" card): the
// hover card shows the catalog photo.

import type { Product } from "@/lib/categories";

export interface RoomPhotoSpec {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Which part of the photo stays in view when the frame crops it: [x, y], 0 = left/top, 1 = right/bottom. */
  focus: [number, number];
}

export interface RoomHotspot {
  slug: string;
  /** Marker position: % of the photo's width and height. */
  at: [number, number];
  /** The piece's outline: % [left, top, width, height] of the photo. */
  box: [number, number, number, number];
}

export interface Room {
  id: string;
  label: string;
  photo: RoomPhotoSpec;
  hotspots: RoomHotspot[];
}

export const ROOMS: Room[] = [
  {
    id: "living",
    label: "Living area",
    photo: {
      src: "/products/living-room.jpg",
      width: 1920,
      height: 1280,
      alt: "Living area with a grey sofa, a low wood sideboard and a small dining table",
      focus: [0.35, 0.62],
    },
    hotspots: [
      // Low wood sideboard, left edge.
      { slug: "6-drawer-dresser", at: [8.5, 70], box: [0, 64.6, 10.6, 20.5] },
      // Grey three-seat sofa.
      { slug: "track-arm-sofa", at: [30, 52], box: [11, 46.8, 51.8, 32] },
      // Wood dining table with two chairs, right.
      { slug: "5-piece-wood-dining-set", at: [86, 57], box: [74.6, 49.8, 24.8, 21] },
    ],
  },
  {
    id: "bedroom",
    label: "Bedroom",
    photo: {
      src: "/products/bedroom.jpg",
      width: 1920,
      height: 982,
      alt: "Bedroom with a queen bed in white bedding, a wood dresser and plants",
      focus: [0.7, 0.5],
    },
    hotspots: [
      // Queen bed: the marker sits on the headboard.
      { slug: "queen-platform-bed-frame", at: [49, 39.5], box: [19.6, 36.7, 57.1, 57.1] },
      // Sheets and pillows on the bed.
      { slug: "queen-linen-set", at: [50, 70], box: [20, 43.6, 56.8, 50.3] },
      // Light wood dresser, right.
      { slug: "clearance-dresser", at: [87.5, 65], box: [70.4, 48.2, 29.6, 32.8] },
    ],
  },
];

export interface RoomItem {
  product: Product;
  hotspot: RoomHotspot;
  /** The `Room.id` this piece is in. */
  room: string;
}
