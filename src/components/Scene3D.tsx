"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Billboard,
  Environment,
  ContactShadows,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { GltfModel } from "./viewer/GltfModel";

// Canvas cannot read CSS custom properties, so the trade-catalog palette is
// mirrored here (see globals.css). Light studio: near-white sweep, ink frame,
// safety-orange hotspot markers ringed in ink.
const STUDIO_BG = "#f3f3f1";
const INK = "#151515";
const ACCENT = "#ff5a1f";

export interface Hotspot {
  id: string;
  position: [number, number, number];
  label: string;
  material: string;
  price: string;
}

interface Scene3DProps {
  /** Optional path to a .glb/.gltf model. Falls back to a procedural mesh when omitted. */
  modelUrl?: string;
  finishHex: string;
  hotspots: Hotspot[];
  /** Controlled open hotspot id. When omitted, Scene3D manages it internally. */
  activeHotspot?: string | null;
  onActiveHotspotChange?: (id: string | null) => void;
}

function FallbackChair({ finishHex }: { finishHex: string }) {
  const frameColor = INK;
  const legPositions: [number, number][] = [
    [-0.48, -0.47],
    [0.48, -0.47],
    [-0.48, 0.47],
    [0.48, 0.47],
  ];

  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.1, 0.14, 1.0]} />
        <meshStandardMaterial color={finishHex} roughness={0.65} metalness={0.05} />
      </mesh>

      <mesh position={[0, 1.05, -0.43]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 1.0, 0.12]} />
        <meshStandardMaterial color={finishHex} roughness={0.65} metalness={0.05} />
      </mesh>

      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.0, 16]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}

      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.75, 0]} castShadow>
          <boxGeometry args={[0.07, 0.07, 0.95]} />
          <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function HotspotMarker({
  hotspot,
  isActive,
  onToggle,
}: {
  hotspot: Hotspot;
  isActive: boolean;
  onToggle: (id: string | null) => void;
}) {
  return (
    <group position={hotspot.position}>
      {/* Invisible hit sphere, larger than the visible marker + ring, so the
          tap target stays usable on small phone viewports. */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onToggle(isActive ? null : hotspot.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      {/* Ink ring, always facing the camera; thicker when the marker is open. */}
      <Billboard>
        <mesh>
          <ringGeometry args={[0.058, isActive ? 0.085 : 0.072, 32]} />
          <meshBasicMaterial color={INK} toneMapped={false} />
        </mesh>
      </Billboard>

      {isActive && (
        <Html distanceFactor={8} center zIndexRange={[100, 0]} occlude={false}>
          <div className="panel w-48 -translate-y-12 p-3 text-left text-xs">
            <p className="text-sm font-semibold text-ink">{hotspot.label}</p>
            <p className="mt-1 text-xs text-ink-2">{hotspot.material}</p>
            <p className="type-data mt-2 border-t border-rule pt-2 text-sm text-ink">
              {hotspot.price}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Scene3D({
  modelUrl,
  finishHex,
  hotspots,
  activeHotspot: controlledHotspot,
  onActiveHotspotChange,
}: Scene3DProps) {
  const [internalHotspot, setInternalHotspot] = useState<string | null>(null);
  const isControlled = controlledHotspot !== undefined;
  const activeHotspot = isControlled ? controlledHotspot : internalHotspot;
  const setActiveHotspot = (id: string | null) => {
    if (!isControlled) setInternalHotspot(id);
    onActiveHotspotChange?.(id);
  };

  // Reset the cursor if the canvas unmounts while a marker is hovered.
  useEffect(() => () => {
    document.body.style.cursor = "";
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.4, 1.6, 3.2], fov: 35 }}
      onPointerMissed={() => setActiveHotspot(null)}
    >
      <color attach="background" args={[STUDIO_BG]} />
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Suspense fallback={null}>
        {modelUrl ? (
          <GltfModel url={modelUrl} finishHex={finishHex} position={[0, -0.5, 0]} />
        ) : (
          <FallbackChair finishHex={finishHex} />
        )}

        {hotspots.map((hotspot) => (
          <HotspotMarker
            key={hotspot.id}
            hotspot={hotspot}
            isActive={activeHotspot === hotspot.id}
            onToggle={setActiveHotspot}
          />
        ))}

        <Environment preset="apartment" />
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.35}
          scale={6}
          blur={2.4}
          far={2}
          color={INK}
        />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={2}
        maxDistance={6}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
