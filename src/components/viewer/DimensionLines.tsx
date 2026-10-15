"use client";

import { Html, Line } from "@react-three/drei";
import type * as THREE from "three";

const PAD = 0.08;
// accent-ink from the palette (canvas can't read CSS variables).
const LINE = "#9f3208";

function fmt(meters: number) {
  return `${Math.round(meters * 39.37)} in · ${Math.round(meters * 100)} cm`;
}

/**
 * Width / depth / height guide lines drawn just outside the model's bounding
 * box (model is assumed centred on X/Z with its base at y = 0).
 */
export function DimensionLines({ size }: { size: THREE.Vector3 }) {
  const hx = size.x / 2;
  const hz = size.z / 2;
  const h = size.y;

  const guides: { from: [number, number, number]; to: [number, number, number]; label: string; at: [number, number, number] }[] = [
    { from: [-hx, 0.005, hz + PAD], to: [hx, 0.005, hz + PAD], label: `W ${fmt(size.x)}`, at: [0, 0.005, hz + PAD + 0.14] },
    { from: [hx + PAD, 0.005, -hz], to: [hx + PAD, 0.005, hz], label: `D ${fmt(size.z)}`, at: [hx + PAD + 0.16, 0.005, 0] },
    { from: [hx + PAD, 0, hz + PAD], to: [hx + PAD, h, hz + PAD], label: `H ${fmt(size.y)}`, at: [hx + PAD + 0.16, h / 2, hz + PAD] },
  ];

  return (
    <group>
      {guides.map((g) => (
        <group key={g.label}>
          <Line points={[g.from, g.to]} color={LINE} lineWidth={1.5} transparent opacity={0.9} />
          <mesh position={g.from}>
            <sphereGeometry args={[0.012, 10, 10]} />
            <meshBasicMaterial color={LINE} />
          </mesh>
          <mesh position={g.to}>
            <sphereGeometry args={[0.012, 10, 10]} />
            <meshBasicMaterial color={LINE} />
          </mesh>
          <Html position={g.at} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
            <span className="tag whitespace-nowrap border-ink font-medium">
              {g.label}
            </span>
          </Html>
        </group>
      ))}
    </group>
  );
}
