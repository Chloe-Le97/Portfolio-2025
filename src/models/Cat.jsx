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

import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

import catScene from "../assets/3d/cat.glb";

// 3D Model from: https://sketchfab.com/3d-models/fox-f372c04de44640fbb6a4f9e4e5845c78
export function Cat({ currentAnimation, ...props }) {
	const ref = useRef();
	// Load the 3D model and its animations
	const { scene, animations } = useGLTF(catScene);
	// Get animation actions associated with the plane
	const { actions } = useAnimations(animations, ref);
  
	//rotate the cat position 
	//increase size of the cat
	useEffect(() => {
		ref.current.rotation.y = Math.PI * 1.6;
		ref.current.scale.set(0.75, 0.75, 0.75);
	}, []);
	// Use an effect to control the plane's animation based on 'isRotating'
	// Note: Animation names can be found on the Sketchfab website where the 3D model is hosted.

	return (
	  <mesh {...props} ref={ref}>
		// use the primitive element when you want to directly embed a complex 3D
		model or scene
    <primitive object={scene} />
	  </mesh>
	);
}

useGLTF.preload(catScene);
