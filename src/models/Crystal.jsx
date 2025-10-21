import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import crystalScene from "../assets/3d/crystal.glb";

export function Crystal({ ...props }) {
  const ref = useRef();
  const { scene } = useGLTF(crystalScene);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        if (obj.material.emissive) {
          obj.material.emissive.setHex(0x7fd3ff);
          obj.material.emissiveIntensity = Math.max(obj.material.emissiveIntensity || 0, 0.6);
        }
      }
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = (props.position?.[1] ?? 0) + Math.sin(t * 1.5) * 0.15;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <primitive object={scene} />
    </mesh>
  );
}

useGLTF.preload(crystalScene);
