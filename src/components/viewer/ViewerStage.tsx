"use client";

import { Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, Line, useProgress } from "@react-three/drei";
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

// Very light studio grey (between the paper and well tokens). Canvas can't
// read CSS variables, so the value is spelled out here.
const STUDIO_BG = "#f3f3f1";

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
      <div className="panel flex items-center gap-3 whitespace-nowrap px-4 py-2 text-xs font-semibold text-ink">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ink" aria-hidden="true" />
        {active ? (
          <span>
            Loading model <span className="type-data font-normal">{Math.round(progress)}%</span>
          </span>
        ) : (
          "Preparing viewer"
        )}
      </div>
    </Html>
  );
}

function Studio({ ringRadius }: { ringRadius: number }) {
  // Floor ring as a screen-space line, so it stays a crisp 1px hairline at any
  // camera distance instead of aliasing like a sub-pixel mesh band.
  const ringPoints = useMemo(() => {
    const pts: [number, number, number][] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(a) * ringRadius, 0.003, Math.sin(a) * ringRadius]);
    }
    return pts;
  }, [ringRadius]);

  return (
    <>
      {/* Light photo-studio set: soft, neutral (no coloured fills). */}
      <ambientLight intensity={0.45} />
      <spotLight
        position={[3, 6, 4]}
        angle={0.5}
        penumbra={0.9}
        intensity={50}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#ffffff" />

      {/* Built from light panels, so no HDRI file has to load. */}
      <Environment resolution={256}>
        {/* Mid grey (not the near-white backdrop) so the Lightformers still read
            as highlights instead of a uniform fill that flattens shading. */}
        <color attach="background" args={["#8a8a86"]} />
        <Lightformer form="rect" intensity={2.5} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-5, 2, 0]} rotation-y={Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[5, 2, 0]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 2, -6]} scale={[6, 3, 1]} />
      </Environment>

      {/* The floor is light, so the contact shadow carries the grounding. */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        color="#151515"
        scale={ringRadius * 5}
        blur={2.2}
        far={ringRadius * 2}
      />

      {/* Turntable footprint: a single thin ink hairline on the floor. */}
      <Line points={ringPoints} color="#151515" lineWidth={1} transparent opacity={0.25} />
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
      <color attach="background" args={[STUDIO_BG]} />
      <fog attach="fog" args={[STUDIO_BG, 8, 18]} />
      <Suspense fallback={<LoadingBadge />}>
        <StageContents {...props} />
      </Suspense>
    </Canvas>
  );
}
