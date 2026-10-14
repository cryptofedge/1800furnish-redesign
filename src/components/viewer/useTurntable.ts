"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Imperative handle so the modal's keyboard handler and buttons can drive the camera. */
export interface TurntableApi {
  rotateBy(yaw: number, pitch: number): void;
  zoomBy(factor: number): void;
  reset(): void;
}

interface TurntableOptions {
  /** Point the camera orbits around (usually the model's vertical centre). */
  target: [number, number, number];
  /** Camera distance that frames the whole model. Zoom limits derive from it. */
  fitRadius: number;
  /** Slow idle spin after 3s without interaction. Off under prefers-reduced-motion. */
  autoRotate: boolean;
  apiRef?: RefObject<TurntableApi | null>;
}

interface TurntableState {
  theta: number;
  phi: number;
  radius: number;
  tTheta: number;
  tPhi: number;
  tRadius: number;
  vTheta: number;
  vPhi: number;
  minRadius: number;
  maxRadius: number;
  lastInteract: number;
  lastMoveAt: number;
  dragging: boolean;
  pointers: Map<number, { x: number; y: number }>;
  pinchDist: number;
}

// Polar angle limits (radians from straight up): never under the floor, never top-down,
// so the piece can't flip. Yaw is unlimited — full 360°.
const MIN_PHI = 0.35;
const MAX_PHI = 1.45;
const HOME = { theta: 0.65, phi: 1.1 };
const IDLE_MS = 3000;
const AUTO_SPEED = 0.22; // rad/s
const ROTATE_PER_PX = 0.0075;
const TILT_PER_PX = 0.005;
// Caps on release velocity (rad/s) so a hard flick carries about a quarter
// turn, not several — "a little inertia".
const MAX_V_THETA = 5;
const MAX_V_PHI = 2.5;

export const TURNTABLE_KEY_STEP = 0.3;

function clampPhi(phi: number) {
  return THREE.MathUtils.clamp(phi, MIN_PHI, MAX_PHI);
}

/**
 * A purpose-built orbit controller: drag / touch to spin, pinch + wheel to zoom,
 * damped follow with inertia after release, idle auto-rotate, keyboard driving.
 * Written instead of OrbitControls so inertia, idle timing and key handling
 * behave exactly as specified. The canvas element needs `touch-action: none`
 * (set via the <Canvas style> prop in ViewerStage).
 */
export function useTurntable({ target, fitRadius, autoRotate, apiRef }: TurntableOptions) {
  const camera = useThree((s) => s.camera);
  const domElement = useThree((s) => s.gl.domElement);

  const stateRef = useRef<TurntableState | null>(null);
  if (stateRef.current === null) {
    stateRef.current = {
      theta: HOME.theta,
      phi: HOME.phi,
      radius: fitRadius,
      tTheta: HOME.theta,
      tPhi: HOME.phi,
      tRadius: fitRadius,
      vTheta: 0,
      vPhi: 0,
      minRadius: fitRadius * 0.6,
      maxRadius: fitRadius * 2.4,
      lastInteract: 0,
      lastMoveAt: 0,
      dragging: false,
      pointers: new Map(),
      pinchDist: 0,
    };
  }

  // Re-frame when the measured model (or viewport aspect) changes.
  useEffect(() => {
    const s = stateRef.current!;
    s.minRadius = fitRadius * 0.6;
    s.maxRadius = fitRadius * 2.4;
    s.radius = fitRadius;
    s.tRadius = fitRadius;
  }, [fitRadius]);

  useEffect(() => {
    const s = stateRef.current!;
    const el = domElement;
    const clampRadius = (r: number) => THREE.MathUtils.clamp(r, s.minRadius, s.maxRadius);
    const touch = () => {
      s.lastInteract = performance.now();
    };

    const api: TurntableApi = {
      rotateBy(yaw, pitch) {
        touch();
        s.vTheta = 0;
        s.vPhi = 0;
        s.tTheta += yaw;
        s.tPhi = clampPhi(s.tPhi + pitch);
      },
      zoomBy(factor) {
        touch();
        s.tRadius = clampRadius(s.tRadius * factor);
      },
      reset() {
        touch();
        s.vTheta = 0;
        s.vPhi = 0;
        // Unwind full turns so the reset spins the short way round.
        s.theta = s.theta % (Math.PI * 2);
        s.tTheta = HOME.theta;
        s.tPhi = HOME.phi;
        s.tRadius = fitRadius;
      },
    };
    if (apiRef) apiRef.current = api;

    const onPointerDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      s.dragging = true;
      s.vTheta = 0;
      s.vPhi = 0;
      s.lastMoveAt = performance.now();
      touch();
      if (s.pointers.size === 2) {
        const [a, b] = [...s.pointers.values()];
        s.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const prev = s.pointers.get(e.pointerId);
      if (!prev) return;
      const now = performance.now();
      const dt = Math.max(16, now - s.lastMoveAt) / 1000;
      s.lastMoveAt = now;
      touch();

      if (s.pointers.size === 2) {
        s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...s.pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (s.pinchDist > 0 && dist > 0) s.tRadius = clampRadius(s.tRadius * (s.pinchDist / dist));
        s.pinchDist = dist;
        return;
      }

      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const dTheta = -dx * ROTATE_PER_PX;
      const dPhi = -dy * TILT_PER_PX;
      s.tTheta += dTheta;
      s.tPhi = clampPhi(s.tPhi + dPhi);
      // Smoothed, capped release velocity for inertia.
      s.vTheta = THREE.MathUtils.clamp(s.vTheta * 0.5 + (dTheta / dt) * 0.5, -MAX_V_THETA, MAX_V_THETA);
      s.vPhi = THREE.MathUtils.clamp(s.vPhi * 0.5 + (dPhi / dt) * 0.5, -MAX_V_PHI, MAX_V_PHI);
    };

    const onPointerUp = (e: PointerEvent) => {
      s.pointers.delete(e.pointerId);
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      if (s.pointers.size === 0) {
        s.dragging = false;
        // Only keep inertia if the finger was still moving when it lifted.
        if (performance.now() - s.lastMoveAt > 80) {
          s.vTheta = 0;
          s.vPhi = 0;
        }
      }
      s.pinchDist = 0;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      touch();
      s.tRadius = clampRadius(s.tRadius * Math.exp(e.deltaY * 0.0012));
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("wheel", onWheel);
      if (apiRef) apiRef.current = null;
    };
  }, [domElement, apiRef, fitRadius]);

  useFrame((_, rawDt) => {
    const s = stateRef.current!;
    const dt = Math.min(rawDt, 0.05);
    const now = performance.now();

    if (!s.dragging) {
      // Inertia: carry release velocity, then damp it out.
      if (Math.abs(s.vTheta) > 1e-4 || Math.abs(s.vPhi) > 1e-4) {
        s.tTheta += s.vTheta * dt;
        s.tPhi = clampPhi(s.tPhi + s.vPhi * dt);
        const decay = Math.exp(-dt * 3.2);
        s.vTheta *= decay;
        s.vPhi *= decay;
      } else if (autoRotate && now - s.lastInteract > IDLE_MS) {
        s.tTheta += AUTO_SPEED * dt;
      }
    }

    // Damped follow toward targets.
    const k = 1 - Math.exp(-dt * 12);
    s.theta += (s.tTheta - s.theta) * k;
    s.phi += (s.tPhi - s.phi) * k;
    s.radius += (s.tRadius - s.radius) * k;

    const sinPhi = Math.sin(s.phi);
    camera.position.set(
      target[0] + s.radius * sinPhi * Math.sin(s.theta),
      target[1] + s.radius * Math.cos(s.phi),
      target[2] + s.radius * sinPhi * Math.cos(s.theta)
    );
    camera.lookAt(target[0], target[1], target[2]);
  });
}
