// The home-page hero room: a single-occupancy transitional-housing unit
// furnished with real catalog products. Order sets the callout numbers (01–06).
//
// Room space: floor at y = 0, centered on the origin, ROOM.width along x and
// ROOM.depth along z. The back wall is at z = -depth/2 (facing +z), the left
// wall at x = -width/2 (facing +x); the camera looks in from the front-right.
//
// The procedural shapes in product-shapes.tsx aren't modeled to real-world
// scale, so each piece gets its own scale to keep the room's proportions
// believable. Every piece is re-grounded (base on the floor, centered) after
// scaling, so `position` is simply the footprint center.

export const ROOM = { width: 6, depth: 5, height: 2.6 } as const;

export interface RoomPlacement {
  slug: string;
  position: [number, number];
  /** Rotation about the vertical axis, radians. Shapes face +z by default. */
  rotation?: number;
  scale?: number | [number, number, number];
  /** Nudges the numbered callout (in the piece's own rotated frame) so labels of neighbouring pieces don't overlap. */
  labelOffset?: [number, number, number];
}

export const ROOM_LAYOUT: RoomPlacement[] = [
  // Head of the bed against the back wall.
  { slug: "twin-metal-bed-frame", position: [1.15, -1.45] },
  { slug: "nightstand-usb", position: [2.25, -2.22] },
  { slug: "6-drawer-dresser", position: [-0.65, -2.2] },
  // Back-left corner.
  { slug: "compact-wardrobe", position: [-2.45, -2.12], scale: 1.3 },
  // Desk along the left wall; the desk shape is low, so it's stretched to a
  // real working height.
  // Desk and chair stand close together, so their callouts are pushed apart:
  // the desk's toward the back wall, the chair's toward the viewer.
  { slug: "height-adjustable-desk", position: [-2.6, 0.45], rotation: Math.PI / 2, scale: [0.9, 1.5, 0.9], labelOffset: [0.85, 0, 0] },
  // Chair pulled up to the desk, facing the wall.
  { slug: "task-chair", position: [-1.8, 0.45], rotation: -Math.PI / 2, scale: 0.6, labelOffset: [0.7, 0, 0] },
];

export const ROOM_SLUGS = ROOM_LAYOUT.map((p) => p.slug);
