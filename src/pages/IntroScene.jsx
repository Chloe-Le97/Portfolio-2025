import { Environment, useTexture } from "@react-three/drei";
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
  texture.mapping = THREE.EquirectangularReflectionMapping; 
  texture.colorSpace = THREE.SRGBColorSpace;
	const glassMaterialRef = useRef();

  useEffect(() => {
    camera.position.z = 5;

    // zoom effect
    gsap.to(camera.position, {
      z: -1.5,
      duration: 3,
      ease: "power2.inOut",
      onComplete: onComplete,
    });
  }, [camera, onComplete]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (

      <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      
      {/* Chất liệu thủy tinh trong suốt */}
      <meshPhysicalMaterial
	// Thuộc tính chính tạo hiệu ứng Thủy Tinh (Crystal Clear)
	transparent
	transmission={1} 
	ior={1.5}        // Chỉ số khúc xạ tiêu chuẩn
	thickness={0.2}  // Độ dày
	clearcoat={1}
	clearcoatRoughness={0}
	
	// Thuộc tính đồng bộ với Magic Orb
	color={'#E0F7FF'}      // Màu nền trắng tinh khiết hơn, để Transmission chi phối
	roughness={0.25}    // Giữ nguyên độ nhám
	metalness={0.1}    // Giữ nguyên độ kim loại (tăng cường phản xạ)
	
	// Thêm Emissive để tạo hiệu ứng phát sáng mờ ảo Icy Blue
	emissive={'#B8F3FF'} // Dùng màu Emissive của quả cầu phép thuật
	emissiveIntensity={0.4} // Giảm nhẹ độ sáng để nó chỉ là một lớp glow mờ ảo
	
	// Dùng texture bluesky làm envMap (như bạn đã làm)
	envMap={texture} />

    </mesh>
  );
}

export default function IntroScene({ onComplete, presetTexture }) {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ fov: 45, near: 0.1, far: 100 }} gl={{ alpha: true }} style={{ background: "transparent" }}>
	  <Environment preset="night" background={false} blur={0.5} /> 
        
        <ambientLight intensity={1} color={'#ffffff'}/> 
        <pointLight position={[5, 5, 5]} intensity={50} color={'#ffffff'} />
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
