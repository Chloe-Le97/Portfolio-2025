import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { bluesky } from "../assets/images";
import Home from "./Home";
import IntroScene from "./IntroScene";

export default function SceneManager() {
  const [showHome, setShowHome] = useState(false);
  const [preloaded, setPreloaded] = useState(false);
  const [introTexture, setIntroTexture] = useState(null);
  const [finishedLoading, setFinishedLoading] = useState(false);
  // Preload critical assets (texture + GLBs) with native loaders so we know exactly when ready

  useEffect(() => {
    let mounted = true;
    const texLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    const loadTex = () => new Promise((resolve, reject) => {
      texLoader.load(
        bluesky,
        (tex) => { tex.colorSpace = THREE.SRGBColorSpace; resolve(tex); },
        undefined,
        reject
      );
    });
    const glb = (p) => new Promise((resolve, reject) => {
      gltfLoader.load(p, () => resolve(true), undefined, reject);
    });

    return () => { mounted = false; };
	
  }, []);

  const handleIntroComplete = () => {

setShowHome(true);
  };
  
  return (
    <>
      {/* Persistent background image (loads first and is shared by intro + home) */}
      {/* <img
        src={bluesky}
        alt="sky"
        className='fixed inset-0 -z-10 w-full h-full object-cover sky-image'
        decoding='async'
        fetchpriority='high'
      /> */}
      {!showHome && <IntroScene onComplete={handleIntroComplete} presetTexture={introTexture} />}

        <div 
		// className='fade-in-quick'
		style={{
			opacity: showHome ? 1 : 0,
			transition: "opacity 0.5s ease-in-out",
		}}
		>
          <Home showHome={showHome}/>
        </div>
    </>
  );
}
