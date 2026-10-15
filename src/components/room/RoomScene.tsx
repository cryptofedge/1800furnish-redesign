"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";
import { ProductShape } from "@/components/product-shapes";
import { GltfModel } from "@/components/viewer/GltfModel";
import { formatCurrency } from "@/lib/quote-data";
import type { Product } from "@/lib/categories";
import { ROOM, type RoomPlacement } from "./room-layout";

export interface RoomItem {
  product: Product;
  placement: RoomPlacement;
}

interface RoomSceneProps {
  items: RoomItem[];
  hoveredSlug: string | null;
  onHover: (slug: string | null) => void;
  onSelect: (product: Product, origin: { x: number; y: number }) => void;
  /** Render loop on/off (off while scrolled out of view or while the 360° viewer is open). */
  active: boolean;
  /** Slow idle sway; off under prefers-reduced-motion. */
  sway: boolean;
  onReady?: () => void;
}

// Palette (canvas can't read CSS variables). A styled, lived-in unit: light
// oak floor, warm white walls with a soft sage accent wall, oatmeal rug.
const OUTLINE = "#2b2f36";
const ACCENT = "#ff5a1f";
const FLOOR = "#d9c3a2"; // light oak
const PLANK_LINE = "#b49770";
const WALL = "#f2efea"; // warm white
const ACCENT_WALL = "#dce2d9"; // soft sage (back wall)
const TRIM = "#fbf9f5";
const RUG = "#cfc5b6"; // oatmeal
const RUG_BORDER = "#ab9f8f";

// ---------------------------------------------------------------------------
// Camera: yaw-only orbit around the room corner. Drag sideways to turn; no
// wheel/pinch zoom so the page never gets trapped while scrolling.

const BASE_YAW = 0.72; // looking in from the front-right
const YAW_RANGE = 0.55;
const PHI = 1.06; // polar angle from straight up
const TARGET: [number, number, number] = [-0.1, 0.85, -0.5];
const ROOM_RADIUS = 4.4; // bounding sphere of floor + walls

function RoomCamera({ sway }: { sway: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const domElement = useThree((s) => s.gl.domElement);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const state = useRef({ yaw: 0, tYaw: 0, dragging: false, lastX: 0, lastInteract: 0, pointerId: -1 });

  useEffect(() => {
    const s = state.current;
    const el = domElement;
    const touch = () => {
      s.lastInteract = performance.now();
    };
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.pointerId = e.pointerId;
      s.lastX = e.clientX;
      touch();
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== s.pointerId) return;
      const dx = e.clientX - s.lastX;
      s.lastX = e.clientX;
      s.tYaw = THREE.MathUtils.clamp(s.tYaw - dx * 0.006, -YAW_RANGE, YAW_RANGE);
      touch();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId === s.pointerId) s.dragging = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [domElement]);

  useFrame((frame, rawDt) => {
    const s = state.current;
    const dt = Math.min(rawDt, 0.05);
    if (sway && !s.dragging && performance.now() - s.lastInteract > 3000) {
      // Ease toward a gentle side-to-side sway.
      const swayYaw = Math.sin(frame.clock.elapsedTime * 0.18) * 0.32;
      s.tYaw += (swayYaw - s.tYaw) * (1 - Math.exp(-dt * 0.8));
    }
    s.yaw += (s.tYaw - s.yaw) * (1 - Math.exp(-dt * 8));

    // Fit the room inside whichever field of view is tighter.
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const radius = (ROOM_RADIUS / Math.sin(Math.min(vFov, hFov) / 2)) * 0.7;

    const theta = BASE_YAW + s.yaw;
    const sinPhi = Math.sin(PHI);
    camera.position.set(
      TARGET[0] + radius * sinPhi * Math.sin(theta),
      TARGET[1] + radius * Math.cos(PHI),
      TARGET[2] + radius * sinPhi * Math.cos(theta)
    );
    camera.lookAt(TARGET[0], TARGET[1], TARGET[2]);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Grounded: measures its children (after their own scale) and shifts them so
// the footprint is centered on the origin with the base on the floor. Reports
// the height so the callout can float just above the piece.

function Grounded({ children, onHeight }: { children: ReactNode; onHeight: (h: number) => void }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const o = outer.current;
    const g = inner.current;
    if (!o || !g) return;
    o.position.set(0, 0, 0);
    o.updateWorldMatrix(true, true);
    // Measure in this group's own space (parents only rotate about y in 90°
    // steps, so transforming the world box back is exact).
    const box = new THREE.Box3().setFromObject(g);
    if (box.isEmpty()) return;
    box.applyMatrix4(new THREE.Matrix4().copy(o.matrixWorld).invert());
    const center = box.getCenter(new THREE.Vector3());
    o.position.set(-center.x, -box.min.y, -center.z);
    onHeight(box.max.y - box.min.y);
  }, [onHeight]);

  return (
    <group ref={outer}>
      <group ref={inner}>{children}</group>
    </group>
  );
}

// Adds crisp outline edges to every mesh inside, drawing-sheet style; turns
// them orange while the piece is highlighted.
/** Soft edge lines (drawing-style detail); full orange when the piece is highlighted. */
function Outlined({
  children,
  highlighted,
  baseOpacity = 0.22,
}: {
  children: ReactNode;
  highlighted: boolean;
  baseOpacity?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.LineBasicMaterial | null>(null);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;
    const mat = new THREE.LineBasicMaterial({ color: OUTLINE, transparent: true, opacity: baseOpacity });
    material.current = mat;
    const added: THREE.LineSegments[] = [];
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh && !(obj.userData.__outline)) {
        const lines = new THREE.LineSegments(new THREE.EdgesGeometry(obj.geometry, 25), mat);
        lines.userData.__outline = true;
        lines.raycast = () => {}; // outlines never intercept clicks
        obj.add(lines);
        added.push(lines);
      }
    });
    return () => {
      for (const l of added) {
        l.parent?.remove(l);
        l.geometry.dispose();
      }
      mat.dispose();
      material.current = null;
    };
    // Outlines are built once; the opacity is applied (and updated) below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mat = material.current;
    if (!mat) return;
    mat.color.set(highlighted ? ACCENT : OUTLINE);
    mat.opacity = highlighted ? 1 : baseOpacity;
  }, [highlighted, baseOpacity]);

  return <group ref={group}>{children}</group>;
}

function Piece({
  item,
  index,
  highlighted,
  onHover,
  onSelect,
}: {
  item: RoomItem;
  index: number;
  highlighted: boolean;
  onHover: (slug: string | null) => void;
  onSelect: (product: Product, origin: { x: number; y: number }) => void;
}) {
  const { product, placement } = item;
  const [height, setHeight] = useState(1);
  const lift = useRef<THREE.Group>(null);
  const scale = placement.scale ?? 1;

  useFrame((_, dt) => {
    const g = lift.current;
    if (!g) return;
    const target = highlighted ? 0.06 : 0;
    g.position.y += (target - g.position.y) * (1 - Math.exp(-Math.min(dt, 0.05) * 10));
  });

  const select = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // that was a drag to turn the room, not a click
    onSelect(product, { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
  };

  return (
    <group position={[placement.position[0], 0, placement.position[1]]} rotation-y={placement.rotation ?? 0}>
      <group ref={lift}>
        <group
          onClick={select}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(product.slug);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = "";
          }}
        >
          <Grounded onHeight={setHeight}>
            <group scale={scale}>
              <Outlined highlighted={highlighted}>
                {product.modelUrl ? (
                  <GltfModel url={product.modelUrl} finishHex={placement.color ?? product.accentHex} />
                ) : (
                  <ProductShape kind={product.shape} color={placement.color ?? product.accentHex} variant={product.shapeVariant} />
                )}
              </Outlined>
            </group>
          </Grounded>
        </group>

        <Html
          position={[
            placement.labelOffset?.[0] ?? 0,
            height + 0.35 + (placement.labelOffset?.[1] ?? 0),
            placement.labelOffset?.[2] ?? 0,
          ]}
          center
          zIndexRange={[20, 0]}
        >
          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={(e) => onSelect(product, { x: e.clientX, y: e.clientY })}
              onPointerEnter={() => onHover(product.slug)}
              onPointerLeave={() => onHover(null)}
              onFocus={() => onHover(product.slug)}
              onBlur={() => onHover(null)}
              aria-label={`${String(index + 1).padStart(2, "0")}: view ${product.name} up close`}
              className="type-data flex h-7 min-w-7 items-center justify-center border border-ink bg-well px-1 text-[11px] text-ink transition-colors sm:h-9 sm:min-w-9 sm:px-1.5 sm:text-xs"
              style={highlighted ? { boxShadow: `inset 0 -3px 0 ${ACCENT}` } : undefined}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
            {highlighted && (
              <div className="pointer-events-none absolute bottom-full mb-2 w-44 border border-ink bg-well text-left">
                <div className="relative aspect-[4/3] w-full border-b border-rule bg-studio">
                  <Image src={product.image} alt="" fill sizes="176px" className="object-contain p-2 mix-blend-multiply" />
                </div>
                <div className="px-2.5 py-1.5">
                  <p className="text-xs font-semibold leading-tight text-ink">{product.name}</p>
                  <p className="type-data mt-0.5 text-[11px] text-ink-2">{formatCurrency(product.price)} / unit</p>
                </div>
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------

/** Plank seams along the floor, with staggered butt joints. */
function FloorPlanks() {
  const { width, depth } = ROOM;
  const geometry = useMemo(() => {
    const step = 0.24;
    const pts: number[] = [];
    for (let x = -width / 2 + step; x < width / 2 - 0.01; x += step) {
      pts.push(x, 0.003, -depth / 2, x, 0.003, depth / 2);
    }
    let row = 0;
    for (let x = -width / 2; x < width / 2 - 0.01; x += step, row++) {
      for (let z = -depth / 2 + 0.5 + (row % 3) * 0.47; z < depth / 2; z += 1.45) {
        pts.push(x, 0.003, z, x + step, 0.003, z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [width, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <lineSegments geometry={geometry} raycast={() => null}>
      <lineBasicMaterial color={PLANK_LINE} transparent opacity={0.6} />
    </lineSegments>
  );
}

function Plant({ position }: { position: [number, number, number] }) {
  const leaves: [number, number, number, number][] = [
    [0, 0.66, 0, 0.27],
    [0.15, 0.82, 0.06, 0.21],
    [-0.13, 0.85, -0.05, 0.22],
    [0.03, 1.04, 0.01, 0.18],
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0.21, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.42, 28]} />
        <meshStandardMaterial color="#ece8e1" roughness={0.55} />
      </mesh>
      {leaves.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={i % 2 ? "#6f9763" : "#557d4b"} roughness={0.85} flatShading />
        </mesh>
      ))}
    </group>
  );
}

/** Framed print: warm paper with a soft sun and a sage block. */
function WallArt({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.95, 0.66, 0.035]} />
        <meshStandardMaterial color="#3a332d" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.019]}>
        <planeGeometry args={[0.85, 0.56]} />
        <meshStandardMaterial color="#f5f0e7" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 0.05, 0.021]}>
        <circleGeometry args={[0.14, 40]} />
        <meshStandardMaterial color="#e3956a" roughness={0.9} />
      </mesh>
      <mesh position={[0.17, -0.08, 0.021]}>
        <planeGeometry args={[0.32, 0.2]} />
        <meshStandardMaterial color="#86a091" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.62, 1.08, 0.04]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.48, 0.94]} />
        <meshStandardMaterial color="#c9dce7" emissive="#e7f1f7" emissiveIntensity={0.45} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.035, 0.94, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0.03]}>
        <boxGeometry args={[1.48, 0.035, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      {/* Sill */}
      <mesh position={[0, -0.57, 0.06]} castShadow>
        <boxGeometry args={[1.76, 0.05, 0.14]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Structure() {
  const { width, depth, height } = ROOM;
  const wallT = 0.12;
  return (
    <group>
      <Outlined highlighted={false} baseOpacity={0.12}>
        {/* Floor slab */}
        <mesh position={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[width, 0.08, depth]} />
          <meshStandardMaterial color={FLOOR} roughness={0.75} />
        </mesh>
        {/* Back wall (sage accent) */}
        <mesh position={[0, height / 2, -depth / 2 - wallT / 2]} receiveShadow>
          <boxGeometry args={[width, height, wallT]} />
          <meshStandardMaterial color={ACCENT_WALL} roughness={0.95} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-width / 2 - wallT / 2, height / 2, 0]} receiveShadow>
          <boxGeometry args={[wallT, height, depth + wallT * 2]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
      </Outlined>
      <FloorPlanks />
      {/* Baseboards */}
      <mesh position={[0, 0.05, -depth / 2 + 0.012]} receiveShadow>
        <boxGeometry args={[width, 0.1, 0.024]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      <mesh position={[-width / 2 + 0.012, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.024, 0.1, depth]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      <Window position={[-0.65, 1.74, -depth / 2 + 0.02]} />
      <WallArt position={[1.15, 1.62, -depth / 2 + 0.03]} />
      {/* Rug with a darker border */}
      <mesh position={[0.55, 0.006, 0.2]} receiveShadow>
        <boxGeometry args={[2.4, 0.012, 1.8]} />
        <meshStandardMaterial color={RUG_BORDER} roughness={1} />
      </mesh>
      <mesh position={[0.55, 0.008, 0.2]} receiveShadow>
        <boxGeometry args={[2.22, 0.014, 1.62]} />
        <meshStandardMaterial color={RUG} roughness={1} />
      </mesh>
      <Plant position={[2.55, 0, -1.05]} />
    </group>
  );
}

function Studio() {
  return (
    <>
      <hemisphereLight args={["#f4f7fb", "#d9c3a2", 0.55]} />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.75}
        color="#fff3e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.0} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fff1df" position={[6, 3, 4]} rotation-y={-Math.PI / 3} scale={[6, 3, 1]} />
      </Environment>
    </>
  );
}

export function RoomScene({ items, hoveredSlug, onHover, onSelect, active, sway, onReady }: RoomSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 28, near: 0.1, far: 100, position: [8, 6, 8] }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => onReady?.()}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      // pan-y: vertical swipes still scroll the page on phones; sideways drags turn the room.
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <Studio />
        <Structure />
        {items.map((item, i) => (
          <Piece
            key={item.product.slug}
            item={item}
            index={i}
            highlighted={hoveredSlug === item.product.slug}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </Suspense>
      <RoomCamera sway={sway} />
    </Canvas>
  );
}
