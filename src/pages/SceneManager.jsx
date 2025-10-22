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
  const [bgOpacity, setBgOpacity] = useState(0.1);
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

    Promise.all([
      loadTex(),
      glb('/src/assets/3d/island.glb'),
      glb('/src/assets/3d/witch.glb'),
      glb('/src/assets/3d/sky.glb'),
      glb('/src/assets/3d/bird.glb'),
      glb('/src/assets/3d/crystal.glb'),
    ]).then(([tex]) => {
      if (!mounted) return;
      setIntroTexture(tex);
      setPreloaded(true);
	  	
	  // Increase bg opacity during loading to avoid white flash


    }).catch(() => {
      if (!mounted) return;
      setPreloaded(true);
    });
    return () => { mounted = false; };
	
	
  }, []);

  const handleIntroComplete = () => {
    setShowHome(true);

	console.log('intro complete');

  };

 

//   useEffect(() => {
//     let intervalId;

//     if (bgOpacity === 0) {
//       intervalId = setInterval(() => {
//         setBgOpacity(prev => {
//           const next = Math.min(1, prev + 0.1);
//           if (next >= 1 && intervalId) {
//             clearInterval(intervalId);
//           }
//           return next;
//         });
//       }, 80);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, []); // run only once on mount
  
  console.log(bgOpacity);
  
  return (
    <>
      {/* Persistent background image (loads first and is shared by intro + home) */}
      <img
        src={bluesky}
        alt="sky"
        className='fixed inset-0 -z-10 w-full h-full object-cover sky-image'
        decoding='async'
        fetchpriority='high'
      />
      {!preloaded && (
        <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-white/90 backdrop-blur-sm'>
          <div className='flex flex-col items-center gap-3 px-4 py-3 rounded-xl bg-white/90 shadow-md border border-black/10'>
            <div className='w-10 h-10 border-2 border-opacity-20 border-blue-500 border-t-blue-500 rounded-full animate-spin'></div>
            <div className='text-sm font-medium text-slate-700'>Loading...</div>
          </div>
        </div>
      )}
      {preloaded && !showHome && <IntroScene onComplete={handleIntroComplete} presetTexture={introTexture} bgOpacity={bgOpacity} />}
      {preloaded && showHome && (
        <div className='fade-in-quick'>
          <Home />
        </div>
      )}
    </>
  );
}
