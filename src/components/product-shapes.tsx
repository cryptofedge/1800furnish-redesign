import { Color, DoubleSide } from "three";

const FRAME = "#2a2d33";

export type ShapeKind =
  | "chair"
  | "table"
  | "sofa"
  | "bed"
  | "bunkBed"
  | "dresser"
  | "desk"
  | "applianceFlat"
  | "applianceCube"
  | "applianceTall"
  | "bin"
  | "cart"
  | "stack"
  | "panel"
  | "lamp"
  | "bench";

export interface ShapeVariant {
  scale?: [number, number, number];
  headboard?: boolean;
  round?: boolean;
}

interface ShapeProps {
  color: string;
  variant?: ShapeVariant;
}

function Legs({
  positions,
  height,
  radius = 0.035,
}: {
  positions: [number, number][];
  height: number;
  radius?: number;
}) {
  return (
    <>
      {positions.map(([x, z], i) => (
        <mesh key={i} position={[x, height / 2 - 0.5, z]} castShadow>
          <cylinderGeometry args={[radius, radius, height, 16]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </>
  );
}

function Chair({ color }: ShapeProps) {
  const legPositions: [number, number][] = [
    [-0.48, -0.47],
    [0.48, -0.47],
    [-0.48, 0.47],
    [0.48, 0.47],
  ];
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.14, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.55, -0.43]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[1.05, 1.0, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
      </mesh>
      <Legs positions={legPositions} height={1.0} />
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.07, 0.07, 0.95]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Table({ color, variant }: ShapeProps) {
  const h = variant?.scale?.[1] ?? 0.45;
  const round = variant?.round;
  const legPositions: [number, number][] = [
    [-0.55, -0.4],
    [0.55, -0.4],
    [-0.55, 0.4],
    [0.55, 0.4],
  ];
  return (
    <group>
      {round ? (
        <mesh position={[0, h, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.75, 0.08, 32]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
        </mesh>
      ) : (
        <mesh position={[0, h, 0]} castShadow>
          <boxGeometry args={[1.3, 0.08, 0.85]} />
          <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
        </mesh>
      )}
      <Legs positions={legPositions} height={h * 2} radius={0.04} />
    </group>
  );
}

function Sofa({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0.05]} castShadow>
        <boxGeometry args={[1.6, 0.35, 0.85]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0} />
      </mesh>
      <mesh position={[0, 0.55, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.6, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.75} metalness={0} />
      </mesh>
      {[-0.75, 0.75].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.05]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.85]} />
          <meshStandardMaterial color={color} roughness={0.75} metalness={0} />
        </mesh>
      ))}
      <Legs
        positions={[
          [-0.7, -0.35],
          [0.7, -0.35],
          [-0.7, 0.35],
          [0.7, 0.35],
        ]}
        height={0.18}
        radius={0.03}
      />
    </group>
  );
}

function Bed({ color, variant }: ShapeProps) {
  const headboard = variant?.headboard ?? true;
  const width = variant?.scale?.[0] ?? 1.3;
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[width, 0.1, 1.9]} />
        <meshStandardMaterial color={FRAME} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[width - 0.08, 0.3, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0} />
      </mesh>
      {headboard && (
        <mesh position={[0, 0.65, -0.95]} castShadow>
          <boxGeometry args={[width, 0.8, 0.1]} />
          <meshStandardMaterial color={color} roughness={0.7} metalness={0} />
        </mesh>
      )}
    </group>
  );
}

function BunkBed({ color }: ShapeProps) {
  return (
    <group scale={[0.75, 0.75, 0.75]}>
      <group position={[0, -0.3, 0]}>
        <Bed color={color} variant={{ headboard: false }} />
      </group>
      <group position={[0, 0.75, 0]}>
        <Bed color={color} variant={{ headboard: false }} />
      </group>
      {[
        [-0.6, -0.9],
        [0.6, -0.9],
        [-0.6, 0.9],
        [0.6, 0.9],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.6, 12]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Dresser({ color, variant }: ShapeProps) {
  const [w, h, d] = variant?.scale ?? [1.0, 1.0, 0.55];
  const drawerCount = 3;
  const drawerColor = "#" + new Color(color).multiplyScalar(0.84).getHexString();
  return (
    <group>
      <mesh position={[0, h / 2 - 0.5, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Drawer fronts: a slightly deeper shade of the body, with a metal pull each. */}
      {Array.from({ length: drawerCount }).map((_, i) => {
        const y = h / 2 - 0.5 - h / 2 + ((i + 0.5) * h) / drawerCount;
        return (
          <group key={i} position={[0, y, d / 2]}>
            <mesh position={[0, 0, 0.006]} castShadow>
              <boxGeometry args={[w * 0.88, (h / drawerCount) * 0.82, 0.012]} />
              <meshStandardMaterial color={drawerColor} roughness={0.55} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[Math.min(0.24, w * 0.25), 0.028, 0.02]} />
              <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Desk({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.5, 0.06, 0.75]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
      </mesh>
      {[-0.68, 0.68].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} castShadow>
          <boxGeometry args={[0.06, 0.45, 0.6]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function ApplianceFlat({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.4, 0.8, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color={FRAME} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

function ApplianceCube({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.9, 0.55, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.33]} castShadow>
        <boxGeometry args={[0.75, 0.42, 0.02]} />
        <meshStandardMaterial color={FRAME} roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  );
}

function ApplianceTall({ color, variant }: ShapeProps) {
  const [w, h, d] = variant?.scale ?? [0.75, 1.5, 0.7];
  return (
    <group>
      <mesh position={[0, h / 2 - 0.5, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[w / 2 - 0.04, h / 2 - 0.5, d / 2 + 0.01]} castShadow>
        <boxGeometry args={[0.03, h * 0.6, 0.03]} />
        <meshStandardMaterial color={FRAME} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

function Bin({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.28, 0.7, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.04, 24]} />
        <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

function Cart({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[1.0, 0.04, 0.55]} />
        <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.6} />
      </mesh>
      {[
        [-0.4, -0.22],
        [0.4, -0.22],
        [-0.4, 0.22],
        [0.4, 0.22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.4, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color={FRAME} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.75, -0.2]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 12]} />
        <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

function Stack({ color }: ShapeProps) {
  const layers = [0, 1, 2, 3];
  return (
    <group>
      {layers.map((i) => (
        <mesh key={i} position={[i * 0.015, i * 0.12, -i * 0.01]} rotation={[0, i * 0.03, 0]} castShadow>
          <boxGeometry args={[0.95, 0.1, 0.75]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color : "#f4f1ec"}
            roughness={0.9}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Panel({ color, variant }: ShapeProps) {
  const round = variant?.round;
  return (
    <group>
      {round ? (
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
        </mesh>
      ) : (
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.55, 0.75, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.5} />
        </mesh>
      )}
      {!round &&
        Array.from({ length: 9 }).map((_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          return (
            <mesh
              key={i}
              position={[(col - 1) * 0.14, 0.45 - row * 0.14, 0.06]}
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
              <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.6} />
            </mesh>
          );
        })}
    </group>
  );
}

function Lamp({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, -0.42, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.08, 24]} />
        <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.75, 12]} />
        <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <coneGeometry args={[0.35, 0.45, 24, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function Bench({ color }: ShapeProps) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[1.3, 0.12, 0.45]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0} />
      </mesh>
      <Legs
        positions={[
          [-0.55, -0.15],
          [0.55, -0.15],
          [-0.55, 0.15],
          [0.55, 0.15],
        ]}
        height={0.5}
        radius={0.03}
      />
    </group>
  );
}

const RENDERERS: Record<ShapeKind, (props: ShapeProps) => React.JSX.Element> = {
  chair: Chair,
  table: Table,
  sofa: Sofa,
  bed: Bed,
  bunkBed: BunkBed,
  dresser: Dresser,
  desk: Desk,
  applianceFlat: ApplianceFlat,
  applianceCube: ApplianceCube,
  applianceTall: ApplianceTall,
  bin: Bin,
  cart: Cart,
  stack: Stack,
  panel: Panel,
  lamp: Lamp,
  bench: Bench,
};

export function ProductShape({
  kind,
  color,
  variant,
}: {
  kind: ShapeKind;
  color: string;
  variant?: ShapeVariant;
}) {
  const Renderer = RENDERERS[kind];
  return (
    <group position={[0, -0.3, 0]}>
      <Renderer color={color} variant={variant} />
    </group>
  );
}
