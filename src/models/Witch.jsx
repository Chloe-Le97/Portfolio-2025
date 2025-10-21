import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import witchScene from "../assets/3d/witch.glb";

// Model: Flying Witch
// Source: https://sketchfab.com/3d-models/flying-witch-e1d759b3ed3e4eeb9f7912931bf12b35
// Author: walczak (CC-BY-4.0)
export function Witch({ isRotating, ...props }) {
  const ref = useRef();
  const { scene, animations } = useGLTF(witchScene);
  const { actions } = useAnimations(animations, ref);

  // Control animation like Plane
  useEffect(() => {
    const action = actions && (actions["Take 001"] || Object.values(actions)[0]);
    if (!action) return;
    if (isRotating) action.play();
    else action.stop();
  }, [actions, isRotating]);

  // Position the model and rotate 60° right
  useEffect(() => {
    scene.traverse((obj) => {
      obj.frustumCulled = false;
    });
    scene.position.y += 0.6;
    scene.scale.setScalar(0.35);
    scene.rotation.y -= Math.PI / 1.5;
  }, [scene]);

  // Gentle flight movement akin to Plane/Bird feel (subtle bob/sway)
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    // Bob up/down slightly
    ref.current.position.y = (props.position?.[1] ?? 0) + Math.sin(t * 1.2) * 0.05;
    // Subtle sway left/right
    ref.current.position.x = (props.position?.[0] ?? 0) + Math.cos(t * 0.8) * 0.05;
  });

  return (
    <mesh {...props} ref={ref}>
      <primitive object={scene} />
    </mesh>
  );
}

useGLTF.preload(witchScene);
