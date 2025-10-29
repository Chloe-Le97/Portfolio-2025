import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import witchScene from "../assets/3d/witch.glb";

// Model: Flying Witch
// Source: https://sketchfab.com/3d-models/flying-witch-e1d759b3ed3e4eeb9f7912931bf12b35
// Author: walczak (CC-BY-4.0)
export function Witch({ isRotating, currentStage, outerRef, ...props }) {
  const ref = useRef();
  const { scene, animations } = useGLTF(witchScene);
  const { actions } = useAnimations(animations, ref);
  const orbMeshRef = useRef(null);
  const glowLightRef = useRef(null);
  const orbCandidatesRef = useRef([]);

  // Control animation like Plane
  useEffect(() => {
    const action = actions && (actions["Take 001"] || Object.values(actions)[0]);
    if (!action) return;
    if (isRotating) action.play();
    else action.stop();
  }, [actions, isRotating]);

  // Absolute transforms to avoid cumulative changes on re-mount
  useEffect(() => {
    scene.traverse((obj) => {
      obj.frustumCulled = false;
      if (obj.isMesh && obj.material) {
        obj.castShadow = true;
        obj.receiveShadow = false;
        // Keep original material look; no emissive override to avoid skin tint
        // Try to identify the orb/globe mesh by common naming or by near-spherical bounds
        const name = (obj.name || "").toLowerCase();
        const matName = (obj.material.name || "").toLowerCase();
        const looksLikeOrbByName = ["sphere", "ball", "orb", "globe"].some(k => name.includes(k) || matName.includes(k));
        let looksLikeOrbByShape = false;
        try {
          const box = new THREE.Box3().setFromObject(obj);
          const size = box.getSize(new THREE.Vector3());
          const maxSide = Math.max(size.x, size.y, size.z);
          const minSide = Math.min(size.x, size.y, size.z);
          const variance = maxSide > 0 ? (maxSide - minSide) / maxSide : 1;
          looksLikeOrbByShape = variance < 0.2 && maxSide < 1.2; // fairly round and not huge
        } catch {}

        if (looksLikeOrbByName || looksLikeOrbByShape) {
          orbCandidatesRef.current.push(obj);
        }
      }
    });
    // Set fixed offsets (not additive) so navigation does not accumulate
    scene.position.y = 0.6;
    scene.scale.setScalar(0.35);
    // Fixed yaw: slightly more to the right (~99°)
    const yaw = -Math.PI * 0.6;
    scene.rotation.set(scene.rotation.x, yaw, scene.rotation.z);

    // After initial transforms, pick the best orb candidate (lowest world Y)
    if (!orbMeshRef.current && orbCandidatesRef.current.length > 0) {
      let chosen = null;
      let lowestY = Infinity;
      const tmp = new THREE.Vector3();
      for (const m of orbCandidatesRef.current) {
        try {
          m.getWorldPosition(tmp);
          if (tmp.y < lowestY) {
            lowestY = tmp.y;
            chosen = m;
          }
        } catch {}
      }
      if (chosen) {
        orbMeshRef.current = chosen;
        const mat = chosen.material;
        if (mat && mat.isMeshStandardMaterial) {
          try {
            mat.emissive = new THREE.Color('#74c7ff');
            mat.emissiveIntensity = 1.6;
          } catch {}
        } else {
          try {
            const baseColor = mat && mat.color ? mat.color.clone() : new THREE.Color('#a8d8ff');
            chosen.material = new THREE.MeshPhysicalMaterial({
				color: baseColor,
				roughness: 0.05,       
				metalness: 0.15,        
				emissive: new THREE.Color('#B8F3FF'), 
				emissiveIntensity: 0.8,     
				transmission: 0.8,
				ior: 1.3,
				thickness: 0.1,
				clearcoat: 1, 
				clearcoatRoughness: 0
            });
          } catch {}
        }
      }
    }
  }, [scene]);

  // Enhanced flight movement: stronger bob/sway with slight forward drift and banking
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const baseX = props.position?.[0] ?? 0;
    const baseY = props.position?.[1] ?? 0;
    const baseZ = props.position?.[2] ?? 0;

    // Emphasize vertical bob (more up/down)
    const bob = Math.sin(t * 1.6) * 0.20; // increased
    // Keep sway moderate
    const sway = Math.cos(t * 1.0) * 0.09; // reduced slightly
    // Minimize forward/back drift
    const driftZ = Math.sin(t * 0.7 + Math.PI / 4) * 0.02; // reduced

    ref.current.position.set(baseX + sway, baseY + bob, baseZ + driftZ);

    // Slight banking/roll tied to sway and bob
    const roll = -sway * 0.35; // slightly softer roll
    const pitch = bob * 0.2;   // softer pitch so strong bob doesn't over-tilt
    ref.current.rotation.z = roll;
    ref.current.rotation.x = pitch;

    // Keep the glow light stuck to the orb, if detected
    if (glowLightRef.current) {
      const p = new THREE.Vector3();
      if (orbMeshRef.current) {
        orbMeshRef.current.getWorldPosition(p);
        glowLightRef.current.position.copy(p);
      } else if (ref.current) {
        // Fallback offset near expected orb location relative to the witch
        ref.current.getWorldPosition(p);
        p.x += 0.25; p.y -= 0.15; p.z += 0.15;
        glowLightRef.current.position.copy(p);
      }
    }
  });

  return (
    <mesh
      {...props}
      ref={(node) => {
        ref.current = node;
        if (outerRef) {
          if (typeof outerRef === "function") outerRef(node);
          else outerRef.current = node;
        }
      }}
    >
      <primitive object={scene} />
      {/* Local blue light that follows the orb to create a glow */}
      <pointLight ref={glowLightRef} color={'#74c7ff'} intensity={3.2} distance={2.8} decay={2} />
    </mesh>
  );
}

useGLTF.preload(witchScene);
