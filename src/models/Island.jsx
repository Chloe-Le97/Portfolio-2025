/**
 * IMPORTANT: Loading glTF models into a Three.js scene is a lot of work.
 * Before we can configure or animate our model’s meshes, we need to iterate through
 * each part of our model’s meshes and save them separately.
 *
 * But luckily there is an app that turns gltf or glb files into jsx components
 * For this model, visit https://gltf.pmnd.rs/
 * And get the code. And then add the rest of the things.
 * YOU DON'T HAVE TO WRITE EVERYTHING FROM SCRATCH
 */

import { a } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import islandScene from "../assets/3d/island.glb";
import { Crystal } from "./Crystal";

export function Island({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentStage,
  currentFocusPoint,
  isWheelBlocked,
  requestedStage,
  onStageAligned,
  ...props
}) {
  const islandRef = useRef();
  // Get access to the Three.js renderer and viewport
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  // Drag/touch disabled flag
  const enableDrag = false;

  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping (lower = less inertia)
  const dampingFactor = 0.9;
  // Timeout to detect end of wheel interaction
  const wheelEndTimeout = useRef(null);
  // Maximum radians per frame for rotation speed (safety cap)
  const MAX_ROT_SPEED = 0.025;

  const clampSpeed = (v) => Math.max(-MAX_ROT_SPEED, Math.min(MAX_ROT_SPEED, v));

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    if (!enableDrag) return;
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    if (!enableDrag) return;
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    if (!enableDrag) return;
    event.stopPropagation();
    event.preventDefault();
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed (applied in useFrame for smoothness)
      rotationSpeed.current = clampSpeed(delta * 0.004 * Math.PI);
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);
      rotationSpeed.current = clampSpeed(rotationSpeed.current + 0.0025);
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);
      rotationSpeed.current = clampSpeed(rotationSpeed.current - 0.0025);
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    if (!enableDrag) return;
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }
  
  const handleTouchEnd = (e) => {
    if (!enableDrag) return;
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }
  
  const handleTouchMove = (e) => {
    if (!enableDrag) return;
    e.stopPropagation();
    e.preventDefault();
  
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;
  
      lastX.current = clientX;
      rotationSpeed.current = clampSpeed(delta * 0.004 * Math.PI);
    }
  }

  // Handle mouse wheel/trackpad scroll to rotate island
  const handleWheel = (e) => {
    if (isWheelBlocked) return; // panel consumes scroll until end
    e.stopPropagation();
    // Prevent page scroll while interacting with the canvas
    e.preventDefault();

    // While scrolling, mark as rotating so Plane animation matches dragging
    setIsRotating(true);
    if (wheelEndTimeout.current) clearTimeout(wheelEndTimeout.current);

    // Normalize wheel delta across devices and accumulate speed
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16; // lines -> pixels
    if (e.deltaMode === 2) delta *= window.innerHeight; // pages -> pixels

    // Clamp extreme spikes
    const MAX_WHEEL = 80; // pixels per event
    const clampedPixels = Math.max(-MAX_WHEEL, Math.min(MAX_WHEEL, delta));

    const rotationDelta = clampedPixels * 0.0006; // slower wheel sensitivity
    rotationSpeed.current = clampSpeed(rotationSpeed.current + rotationDelta);

    // After wheel inactivity, stop rotating to allow inertia/damping and stop plane animation
    wheelEndTimeout.current = setTimeout(() => {
      setIsRotating(false);
    }, 300);
  }

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    if (enableDrag) {
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointerup", handlePointerUp);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchend", handleTouchEnd);
      canvas.addEventListener("touchmove", handleTouchMove);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // Also listen on window so rotation can continue even when not hovering canvas
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Remove event listeners when component unmounts
    return () => {
      if (enableDrag) {
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointermove", handlePointerMove);
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchend", handleTouchEnd);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("wheel", handleWheel);
      if (wheelEndTimeout.current) clearTimeout(wheelEndTimeout.current);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove, handleTouchStart, handleTouchEnd, handleTouchMove, handleWheel, handleKeyDown, handleKeyUp]);

  // This function is called on each frame update
  useFrame(() => {
    // If a stage is requested, interpolate rotation toward that stage
    if (requestedStage) {
      const targets = {
        1: 4.5,
        2: 2.5,
        3: 1.05,
        4: 5.65,
      };
      const targetY = targets[requestedStage];
      if (typeof targetY === "number") {
        const current = islandRef.current.rotation.y;
        let diff = ((targetY - current + Math.PI) % (2 * Math.PI)) - Math.PI;
        const step = Math.sign(diff) * Math.min(Math.abs(diff), 0.03);
        islandRef.current.rotation.y += step;
        if (Math.abs(diff) < 0.02) {
          islandRef.current.rotation.y = targetY;
          if (onStageAligned) onStageAligned();
        }
      }
    } else {
      // Apply rotation speed every frame for smoothness
      rotationSpeed.current = clampSpeed(rotationSpeed.current);
      islandRef.current.rotation.y += rotationSpeed.current;

      // Damping for inertia smoothing
      rotationSpeed.current *= dampingFactor;
      if (Math.abs(rotationSpeed.current) < 0.0005) {
        rotationSpeed.current = 0;
      }
    }

    // Determine the current stage based on island's orientation
    const rotation = islandRef.current.rotation.y;
    const normalizedRotation =
      ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    switch (true) {
      case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
        setCurrentStage(4);
        break;
      case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
        setCurrentStage(3);
        break;
      case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
        setCurrentStage(2);
        break;
      case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
        setCurrentStage(1);
        break;
      default:
        setCurrentStage(null);
    }
  });

  return (
    // {Island 3D model from: https://sketchfab.com/3d-models/foxs-islands-163b68e09fcc47618450150be7785907}
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />

      {/* Floating crystal that appears over the active island section */}
      {currentStage && (
        <Crystal
          // Approximate anchor points above small islands for each stage
          position={
            currentStage === 1
              ? [2.2, 2.5, 0.6]
              : currentStage === 2
              ? [-1.8, 2.3, -0.4]
              : currentStage === 3
              ? [0.4, 2.4, -1.8]
              : [1.6, 2.2, -0.8]
          }
          scale={[0.3, 0.3, 0.3]}
        />
      )}
    </a.group>
  );
}
