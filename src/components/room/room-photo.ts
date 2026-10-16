// The home-page hero: a real room photo with numbered markers on the pieces
// that have a close match in the catalog. Order sets the numbers (01, 02, ...).
//
// Coordinates are percentages of the whole photo (not of the on-screen crop),
// so markers stay on their pieces at every screen size. To move a marker,
// change `at`; `box` is the piece's outline, which lights up on hover and can
// be clicked like the marker. Only list products that have a real photo (not
// a "Photo coming soon" card): the hover card shows the catalog photo.

import type { Product } from "@/lib/categories";

export const ROOM_PHOTO = {
  src: "/products/living-room.jpg",
  width: 1920,
  height: 1280,
  alt: "Living area with a grey sofa, a low wood sideboard and a small dining table",
  /** Which part of the photo stays in view when the frame crops it: [x, y], 0 = left/top, 1 = right/bottom. */
  focus: [0.35, 0.62] as [number, number],
};

export interface RoomHotspot {
  slug: string;
  /** Marker position: % of the photo's width and height. */
  at: [number, number];
  /** The piece's outline: % [left, top, width, height] of the photo. */
  box: [number, number, number, number];
}

export const ROOM_HOTSPOTS: RoomHotspot[] = [
  // Low wood sideboard, left edge.
  { slug: "6-drawer-dresser", at: [8.5, 70], box: [0, 64.6, 10.6, 20.5] },
  // Grey three-seat sofa.
  { slug: "track-arm-sofa", at: [30, 52], box: [11, 46.8, 51.8, 32] },
  // Wood dining table with two chairs, right.
  { slug: "5-piece-wood-dining-set", at: [86, 57], box: [74.6, 49.8, 24.8, 21] },
];

export interface RoomItem {
  product: Product;
  hotspot: RoomHotspot;
}
