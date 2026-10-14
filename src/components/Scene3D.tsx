"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { GltfModel } from "./viewer/GltfModel";

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
}

function FallbackChair({ finishHex }: { finishHex: string }) {
  const frameColor = "#2a2d33";
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
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onToggle(isActive ? null : hotspot.id);
        }}
      >
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={isActive ? "#f0c38a" : "#e0a35c"} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#e0a35c" transparent opacity={0.18} />
      </mesh>

      {isActive && (
        <Html distanceFactor={8} center zIndexRange={[100, 0]} occlude={false}>
          <div className="glass-panel w-48 -translate-y-12 rounded-xl p-3 text-left text-xs shadow-xl">
            <p className="text-sm font-semibold text-slate-200">{hotspot.label}</p>
            <p className="mt-1 text-xs text-slate-400">{hotspot.material}</p>
            <p className="mt-2 text-sm font-semibold text-amber-300">
              {hotspot.price}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export function Scene3D({ modelUrl, finishHex, hotspots }: Scene3DProps) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.4, 1.6, 3.2], fov: 35 }}
      onPointerMissed={() => setActiveHotspot(null)}
    >
      <color attach="background" args={["#12151a"]} />
      <ambientLight intensity={0.55} />
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
          opacity={0.55}
          scale={6}
          blur={2.4}
          far={2}
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
