"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Grid, Html, Lightformer } from "@react-three/drei";
import * as THREE from "three";
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

// Palette (canvas can't read CSS variables): see globals.css.
const INK = "#151515";
const ACCENT = "#ff5a1f";
const FLOOR = "#f7f7f5";
const WALL = "#eeefec"; // light blush-grey, to sit on the fuchsia-blush page
const RUG = "#dfe3e0";

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
function Outlined({ children, highlighted }: { children: ReactNode; highlighted: boolean }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.LineBasicMaterial | null>(null);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;
    const mat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.55 });
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
  }, []);

  useEffect(() => {
    const mat = material.current;
    if (!mat) return;
    mat.color.set(highlighted ? ACCENT : INK);
    mat.opacity = highlighted ? 1 : 0.55;
  }, [highlighted]);

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
                  <GltfModel url={product.modelUrl} finishHex={product.accentHex} />
                ) : (
                  <ProductShape kind={product.shape} color={product.accentHex} variant={product.shapeVariant} />
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
              aria-label={`${String(index + 1).padStart(2, "0")}: open ${product.name} in the 360° viewer`}
              className="type-data flex h-7 min-w-7 items-center justify-center border border-ink bg-well px-1 text-[11px] text-ink transition-colors sm:h-9 sm:min-w-9 sm:px-1.5 sm:text-xs"
              style={highlighted ? { boxShadow: `inset 0 -3px 0 ${ACCENT}` } : undefined}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
            {highlighted && (
              <div className="pointer-events-none absolute bottom-full mb-2 w-max max-w-[14rem] border border-ink bg-well px-2.5 py-1.5 text-left">
                <p className="text-xs font-semibold leading-tight text-ink">{product.name}</p>
                <p className="type-data mt-0.5 text-[11px] text-ink-2">
                  {formatCurrency(product.price)} / unit · 360°
                </p>
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------

function Structure() {
  const { width, depth, height } = ROOM;
  const wallT = 0.12;
  return (
    <group>
      {/* Floor slab with a 0.5 m drafting grid */}
      <Outlined highlighted={false}>
        <mesh position={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[width, 0.08, depth]} />
          <meshStandardMaterial color={FLOOR} roughness={0.9} />
        </mesh>
        {/* Back wall */}
        <mesh position={[0, height / 2, -depth / 2 - wallT / 2]} receiveShadow>
          <boxGeometry args={[width, height, wallT]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-width / 2 - wallT / 2, height / 2, 0]} receiveShadow>
          <boxGeometry args={[wallT, height, depth + wallT * 2]} />
          <meshStandardMaterial color={WALL} roughness={0.95} />
        </mesh>
        {/* Window in the back wall, above the dresser */}
        <mesh position={[-0.65, 1.75, -depth / 2 + 0.005]}>
          <boxGeometry args={[1.5, 0.95, 0.01]} />
          <meshStandardMaterial color="#f4f7f8" roughness={0.3} />
        </mesh>
        {/* Rug */}
        <mesh position={[0.55, 0.006, 0.2]} receiveShadow>
          <boxGeometry args={[2.3, 0.012, 1.7]} />
          <meshStandardMaterial color={RUG} roughness={1} />
        </mesh>
      </Outlined>
      <Grid
        position={[0, 0.002, 0]}
        args={[width, depth]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#d4d5d0"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#b9bbb5"
        fadeDistance={40}
      />
    </group>
  );
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[6, 3, 4]} rotation-y={-Math.PI / 3} scale={[6, 3, 1]} />
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
