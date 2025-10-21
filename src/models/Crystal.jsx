import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import crystalScene from "../assets/3d/crystal.glb";

export const Crystal = forwardRef(function Crystal({ ...props }, forwardedRef) {
  const localRef = useRef();
  const { scene } = useGLTF(crystalScene);
  const animRef = useRef();
  const animStartRef = useRef(0);
  const animatingRef = useRef(false);
  const lastPosKeyRef = useRef("");

  // Sparkles setup
  const sparkles = useMemo(() => {
    const count = 6;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.35 + Math.random() * 0.25;
      const height = -0.2 + Math.random() * 0.4;
      arr.push({
        ref: { current: null },
        offset: new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius),
        delay: Math.random() * 0.25,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    scene.traverse((obj) => {
      obj.frustumCulled = false;
      // Keep original material colors/textures from glTF; no emissive/override tweaks
    });
  }, [scene]);

  // Trigger appear animation on mount and when position changes
  useEffect(() => {
    const key = JSON.stringify(props.position || []);
    if (key !== lastPosKeyRef.current) {
      lastPosKeyRef.current = key;
      animStartRef.current = performance.now();
      animatingRef.current = true;
    }
  }, [props.position]);

  useFrame(() => {
    // Continuous slow spin
    if (animRef.current) {
      animRef.current.rotation.y += 0.01;
    }

    // Appear animation: rise up and scale in (slower)
    if (animatingRef.current && animRef.current) {
      const duration = 1100;
      const t = Math.min(1, (performance.now() - animStartRef.current) / duration);
      // easeOutCubic
      const p = 1 - Math.pow(1 - t, 3);
      const startYOffset = -1.0;
      const yOffset = startYOffset * (1 - p);
      const minScale = 0.4;
      const s = minScale + (1 - minScale) * p;
      animRef.current.position.y = yOffset;
      animRef.current.scale.set(s, s, s);

      // Sparkles pulse during appear
      for (const sp of sparkles) {
        const m = sp.ref.current;
        if (!m) continue;
        const localT = Math.min(1, Math.max(0, (t - sp.delay) / 0.5));
        const opacity = Math.sin(localT * Math.PI) * 0.4;
        const scale = 0.6 + localT * 0.9;
        m.position.copy(sp.offset);
        m.scale.set(scale, scale, scale);
        if (m.material) m.material.opacity = opacity;
      }
      if (t >= 1) {
        animatingRef.current = false;
        animRef.current.position.y = 0;
        animRef.current.scale.set(1, 1, 1);
        for (const sp of sparkles) {
          const m = sp.ref.current;
          if (m && m.material) m.material.opacity = 0;
        }
      }
    }
  });

  return (
    <mesh
      ref={(node) => {
        localRef.current = node;
        if (forwardedRef) {
          if (typeof forwardedRef === "function") forwardedRef(node);
          else forwardedRef.current = node;
        }
      }}
      {...props}
    >
      <group ref={animRef}>
        <primitive object={scene} />
        {sparkles.map((sp, i) => (
          <mesh key={i} ref={(node) => (sp.ref.current = node)} position={sp.offset} renderOrder={9999}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={'#ffffff'} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </mesh>
  );
});

useGLTF.preload(crystalScene);
