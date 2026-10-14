"use client";

import { Suspense, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { ProductShape, type ShapeKind, type ShapeVariant } from "@/components/product-shapes";
import { GltfModel } from "./GltfModel";
import { DimensionLines } from "./DimensionLines";
import { useTurntable, type TurntableApi } from "./useTurntable";

export interface ViewerStageProps {
  modelUrl?: string;
  shape: ShapeKind;
  variant?: ShapeVariant;
  finishHex: string;
  showDimensions: boolean;
  autoRotate: boolean;
  apiRef: RefObject<TurntableApi | null>;
}

interface Measure {
  size: THREE.Vector3;
  radius: number;
}

/**
 * Measures whatever it wraps and shifts it so the model is centred on X/Z with
 * its base resting on y = 0. Reports the bounding size upward so the camera,
 * floor ring and dimension lines can size themselves to the real model.
 */
function Centered({
  children,
  measureKey,
  onMeasure,
}: {
  children: ReactNode;
  measureKey: string;
  onMeasure: (m: Measure) => void;
}) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const g = inner.current;
    if (!o || !g) return;
    o.position.set(0, 0, 0);
    o.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(g);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    o.position.set(-center.x, -box.min.y, -center.z);
    onMeasure({ size, radius: size.length() / 2 });
  }, [measureKey, onMeasure]);

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

function Turntable({ measure, autoRotate, apiRef }: { measure: Measure; autoRotate: boolean; apiRef: RefObject<TurntableApi | null> }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / s.size.height);
  // Fit the bounding sphere inside whichever field of view is tighter
  // (vertical on desktop, horizontal on a phone in portrait).
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const fitRadius = (measure.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.05;

  useTurntable({
    target: [0, measure.size.y / 2, 0],
    fitRadius,
    autoRotate,
    apiRef,
  });
  return null;
}

function LoadingBadge() {
  const { progress, active } = useProgress();
  return (
    <Html center zIndexRange={[30, 0]}>
      <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2 text-xs text-slate-300">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        {active ? `Loading model ${Math.round(progress)}%` : "Preparing viewer"}
      </div>
    </Html>
  );
}

function Studio({ ringRadius }: { ringRadius: number }) {
  return (
    <>
      <ambientLight intensity={0.25} />
      <spotLight
        position={[3, 6, 4]}
        angle={0.5}
        penumbra={0.9}
        intensity={60}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.6} color="#f0c38a" />

      {/* Built from light panels, so no HDRI file has to load. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 2, 0]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[5, 2, 0]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#e0a35c" position={[0, 1, -6]} scale={3} />
      </Environment>

      <ContactShadows position={[0, 0, 0]} opacity={0.7} scale={ringRadius * 5} blur={2.2} far={ringRadius * 2} />

      {/* Glowing floor ring: a crisp line plus a soft halo under it. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.003}>
        <ringGeometry args={[ringRadius * 0.98, ringRadius, 96]} />
        <meshBasicMaterial color="#e0a35c" transparent opacity={0.55} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <ringGeometry args={[ringRadius * 0.86, ringRadius * 1.12, 96]} />
        <meshBasicMaterial color="#c98a3e" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

function StageContents({ modelUrl, shape, variant, finishHex, showDimensions, autoRotate, apiRef }: ViewerStageProps) {
  const [measure, setMeasure] = useState<Measure | null>(null);
  const measureKey = modelUrl ?? `${shape}:${JSON.stringify(variant ?? {})}`;
  const ringRadius = measure ? Math.max(0.6, Math.hypot(measure.size.x, measure.size.z) * 0.62) : 0.9;

  return (
    <>
      <Centered measureKey={measureKey} onMeasure={setMeasure}>
        {modelUrl ? (
          <GltfModel url={modelUrl} finishHex={finishHex} />
        ) : (
          <ProductShape kind={shape} color={finishHex} variant={variant} />
        )}
      </Centered>

      <Studio ringRadius={ringRadius} />

      {measure && showDimensions && <DimensionLines size={measure.size} />}
      {measure && <Turntable measure={measure} autoRotate={autoRotate} apiRef={apiRef} />}
    </>
  );
}

export function ViewerStage(props: ViewerStageProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 32, position: [2.5, 1.6, 3.2], near: 0.05, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{ touchAction: "none" }}
    >
      <color attach="background" args={["#0b0d10"]} />
      <fog attach="fog" args={["#0b0d10", 8, 18]} />
      <Suspense fallback={<LoadingBadge />}>
        <StageContents {...props} />
      </Suspense>
    </Canvas>
  );
}
