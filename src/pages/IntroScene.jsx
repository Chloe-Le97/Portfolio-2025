import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { bluesky } from "../assets/images";

function Sphere({ onComplete }) {
  const meshRef = useRef();
  const { camera } = useThree();
//   don't use the bluesky texture anymore, instead using a crystal texture with some glow and a Start text in the center

  const texture = useTexture(bluesky);
  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    camera.position.z = 5;

    // zoom effect
    gsap.to(camera.position, {
      z: -1.5,
      duration: 3,
      ease: "power2.inOut",
      onComplete: onComplete,
    });
  }, [camera, onComplete, texture]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

export default function IntroScene({ onComplete, presetTexture, bgOpacity }) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ fov: 45, near: 0.1, far: 100 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          {/* If a preloaded texture is provided, skip loading fallback entirely */}
          {presetTexture ? (
            <mesh>
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial map={presetTexture} />
            </mesh>
          ) : (
            <Sphere onComplete={onComplete} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
