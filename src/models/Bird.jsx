import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";

import birdScene from "../assets/3d/bird.glb";

// 3D Model from: https://sketchfab.com/3d-models/phoenix-bird-844ba0cf144a413ea92c779f18912042
export function Bird({
  origin = [0, 5, -8],
  scale = [1.8, 1.8, 1.8],
  path = "diagonal", // 'diagonal' | 'circle'
  speed = 1,
  radius = 6,
  yAmplitude = 0.2,
  ySpeed = 1.0,
  timeOffset = 0,
  yawOffset = 0, // radians to align model's forward with velocity
}) {
  const birdRef = useRef();
  const lastPosRef = useRef({ x: origin[0], y: origin[1], z: origin[2] });
  const dirRef = useRef(1); // for diagonal path movement direction

  // Load the 3D model and animations from the provided GLTF file
  const { scene, animations } = useGLTF(birdScene);
  // Clone the scene per instance so multiple birds can render simultaneously
  const localScene = useMemo(() => scene.clone(true), [scene]);

  // Get access to the animations for the bird
  const { actions } = useAnimations(animations, birdRef);

  // Safely play an animation when mounted (fallback to first available)
  useEffect(() => {
    const action = actions && (actions["Take 001"] || Object.values(actions)[0]);
    if (action && action.play) action.play();
    return () => {
      if (action && action.stop) action.stop();
    };
  }, [actions]);

  // Ensure the bird isn't clipped due to bounding or transparency order
  useEffect(() => {
    localScene.traverse((obj) => {
      obj.frustumCulled = false;
      if (obj.isMesh) {
        obj.renderOrder = 2; // draw after large island meshes
        if (obj.material && obj.material.transparent) {
          obj.material.depthWrite = false; // avoid hard cut with alpha textures
          obj.material.depthTest = true;
        }
      }
    });
  }, [localScene]);

  useEffect(() => {
    if (birdRef.current) birdRef.current.position.set(origin[0], origin[1], origin[2]);
  }, [origin]);

  useFrame(({ clock, camera }) => {
    if (!birdRef.current) return;
    const t = clock.elapsedTime + timeOffset;
    birdRef.current.position.y = origin[1] + Math.sin(t * ySpeed) * yAmplitude;

    if (path === "circle") {
      const angle = t * speed;
      const x = origin[0] + Math.cos(angle) * radius;
      const z = origin[2] + Math.sin(angle) * radius;
      const prev = lastPosRef.current;
      birdRef.current.position.x = x;
      birdRef.current.position.z = z;
      const dx = x - prev.x;
      const dz = z - prev.z;
      if (Math.abs(dx) + Math.abs(dz) > 1e-4) {
        birdRef.current.rotation.y = Math.atan2(-dz, dx) + yawOffset;
      }
      lastPosRef.current = { x, y: birdRef.current.position.y, z };
    } else {
      const step = 0.01 * speed;
      // Flip direction at bounds relative to camera x
      if (birdRef.current.position.x > camera.position.x + 12) dirRef.current = -1;
      else if (birdRef.current.position.x < camera.position.x - 12) dirRef.current = 1;

      const dx = step * dirRef.current;
      const dz = -step * dirRef.current;
      birdRef.current.position.x += dx;
      birdRef.current.position.z += dz;
      birdRef.current.rotation.y = Math.atan2(-dz, dx) + yawOffset;
      lastPosRef.current = {
        x: birdRef.current.position.x,
        y: birdRef.current.position.y,
        z: birdRef.current.position.z,
      };
    }
  });

  return (
    // to create and display 3D objects
    <mesh ref={birdRef} position={origin} scale={scale}>
      {/* use the primitive element when you want to directly embed a complex 3D
      model or scene */}
      <primitive object={localScene} />
    </mesh>
  );
}
