"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface GltfModelProps {
  url: string;
  finishHex: string;
  position?: [number, number, number];
}

/**
 * Loads a .glb (Draco-compressed or not) and recolours any mesh whose name
 * contains "upholstery" or "fabric" to the active finish — see
 * public/models/README.md for the naming convention.
 *
 * Used by the fullscreen ProductViewer and the home-page 3D room.
 */
export function GltfModel({ url, finishHex, position }: GltfModelProps) {
  // `true` enables the Draco decoder (loaded on demand from Google's CDN).
  const { scene } = useGLTF(url, true);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !child.material) return;
      child.castShadow = true;
      const name = child.name.toLowerCase();
      if (name.includes("upholstery") || name.includes("fabric")) {
        const mat = child.material as THREE.MeshStandardMaterial;
        mat.color = new THREE.Color(finishHex);
      }
    });
  }, [cloned, finishHex]);

  return <primitive object={cloned} position={position} />;
}
