import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { arrow, soundoff, soundon } from "../assets/icons";
import sakura from "../assets/sakura.mp3";
import { HomeInfo, Loader } from "../components";
import ProjectsPanel from "../components/ProjectsPanel";
import SkillsPanel from "../components/SkillsPanel";
import WorkExperience from "../components/WorkExperience";
import { Island, Sky, Witch } from "../models";
// Watcher to auto-hide crystal if it stays off-screen for 1s
function CrystalVisibilityWatcher({ position, onHide }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!position) return;
    const world = new THREE.Vector3(position[0], position[1], position[2]);
    const ndc = world.clone().project(camera);
    const inView = ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1 && ndc.z >= 0 && ndc.z <= 1;
    if (!inView) {
      onHide();
    }
  });

  return null;
}

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const ambientRef = useRef(new Audio(sakura));
  ambientRef.current.loop = true;
  ambientRef.current.volume = 0.15; // softer ambience
  const [isWheelBlocked, setIsWheelBlocked] = useState(false);
  const panelRef = useRef(null);
  const [requestedStage, setRequestedStage] = useState(null);
  const witchRef = useRef(null);
  const [crystalVisible, setCrystalVisible] = useState(false);
  const [panelReady, setPanelReady] = useState(false);
  const crystalRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    if (isPlayingMusic) {
      audioRef.current.play();
      ambientRef.current.play();
    }

    return () => {
      audioRef.current.pause();
      ambientRef.current.pause();
    };
  }, [isPlayingMusic]);

  // Reset Projects panel scroll when switching to stage 4
  useEffect(() => {
    if (currentStage === 4) {
      const el = panelRef.current;
      if (el) el.scrollTop = 0;
      // ensure after mount/transition
      requestAnimationFrame(() => {
        const el2 = panelRef.current;
        if (el2) el2.scrollTop = 0;
      });
    }
  }, [currentStage]);

  // When stage changes, show crystal and panels immediately (no delay)
  useEffect(() => {
    if (currentStage && currentStage >= 2 && currentStage <= 4) {
      setCrystalVisible(true);
      setPanelReady(true);
    } else {
      setCrystalVisible(false);
      setPanelReady(false);
    }
  }, [currentStage]);

  // Unified wheel handling: scroll panel first, then rotate model at edges
  useEffect(() => {
    const handleUnifiedWheel = (e) => {

     
      const panel = panelRef.current;
      if (!panel) {
        setIsWheelBlocked(false);
        return;
      }

      const hasScroll = panel.scrollHeight > panel.clientHeight + 1;
      if (!hasScroll) {
        setIsWheelBlocked(false);
        return;
      }

      // Clamp wheel delta to limit maximum scroll speed
      const MAX_WHEEL = 80; // pixels per event
      const rawDelta = e.deltaY;
      const clampedDelta = Math.max(-MAX_WHEEL, Math.min(MAX_WHEEL, rawDelta));

      // Compute next scrollTop with inverted panel behavior (wheel down -> content up)
      const maxTop = panel.scrollHeight - panel.clientHeight;
      const prevTop = panel.scrollTop;
      const panelDelta = -clampedDelta; // invert
      const nextTop = Math.max(0, Math.min(maxTop, prevTop + panelDelta));

      // If no movement is possible, pass through immediately
      if (nextTop === prevTop) {
        setIsWheelBlocked(false);
        return;
      }

      // Apply scroll
      panel.scrollTop = nextTop;

      // If we reached an edge due to this event, allow the same event to pass through
      const reachedBottomNow = nextTop === maxTop && panelDelta > 0;
      const reachedTopNow = nextTop === 0 && panelDelta < 0;
      if (reachedBottomNow || reachedTopNow) {
        setIsWheelBlocked(false);
        return;
      }

      // Otherwise, consume the event (keep scrolling panel)
      setIsWheelBlocked(true);
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return;
    };

    window.addEventListener("wheel", handleUnifiedWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", handleUnifiedWheel);
    };
  }, [currentStage]);

  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const adjustIslandForScreenSize = () => {
    let screenScale, screenPosition;

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43.4];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0, -6.5, -43.4];
    }

    return [screenScale, screenPosition];
  };

  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();
  const [islandScale, islandPosition] = adjustIslandForScreenSize();

  // Adjust 3D models when Projects panel is shown (stage 4)
  const isStage4 = currentStage === 4;
  const islandScaleAdj = islandScale;
  const islandPositionAdj = islandPosition;

  const biplaneScaleAdj = biplaneScale;
  const biplanePositionAdj = biplanePosition;

  // Screen-space upward offset (~20px). Applied to Island and Witch only (not Sky/Bird)
  const yScreenLift = 0.5; // tuned world-units approximation for ~20px at current camera

  return (
    <section className='w-full h-screen relative overflow-hidden fade-in-quick'>
      {currentStage === 1 && (
        <div className='absolute top-28 left-0 right-0 z-10 flex items-center justify-center -translate-y-[5px]'>
          <HomeInfo currentStage={currentStage} />
        </div>
      )}

      {/* Right side panels */}
      {currentStage === 2 && panelReady && (
        <div ref={panelRef} className='absolute right-0 top-0 h-full w-full md:w-[40%] z-20 bg-transparent overflow-y-auto p-4 md:p-6 -translate-y-5'>
          <SkillsPanel />
        </div>
      )}

      {currentStage === 3 && panelReady && (
        <div ref={panelRef} className='absolute right-0 top-[-20px] md:top-[-40px] h-full w-full md:w-[55%] lg:w-[50%] z-20 bg-transparent overflow-y-auto p-4 md:p-6 -translate-y-5'>
          <WorkExperience />
        </div>
      )}

      {/* Slide-in Projects panel on the right for stage 4 */}
      <div
        ref={currentStage === 4 && panelReady ? panelRef : null}
        className={`absolute right-0 top-0 h-full z-20 bg-white/80 backdrop-blur-sm overflow-y-auto p-2 md:p-4 transition-transform duration-500 ease-out -translate-y-5 ${
          currentStage === 4 && panelReady ? "translate-x-0 w-full md:w-[35%]" : "translate-x-full w-0"
        }`}
      >
        <ProjectsPanel />
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}           dpr={[1, 1.5]}
		gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      >
        <Suspense fallback={<Loader />}>
          {/* Softer, less saturated sky fog */}
          {/* <fogExp2 attach="fog" args={["#eef5ff", 0.0008]} /> */}
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.45} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
		    <hemisphereLight
            skyColor='#eaf2ff'
            groundColor='#000000'
            intensity={0.7}
          />


          {/* Original scene lighting restored; witch follow-light removed */}

          {/* Excluded from lift */}
         <Sky isRotating={isRotating} />
          {/* Lift Island and Witch upward by ~20px equivalent */}
          <Island
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            currentStage={currentStage}
            crystalRef={crystalRef}
            showCrystal={crystalVisible}
            position={[islandPositionAdj[0], islandPositionAdj[1] + yScreenLift, islandPositionAdj[2]]}
            rotation={[0.1, 4.7077, 0]}
            scale={islandScaleAdj}
            isWheelBlocked={isWheelBlocked || (crystalVisible && !panelReady)}
            requestedStage={requestedStage}
            onStageAligned={() => setRequestedStage(null)}
          />
          {/* Cat near the island */}

          {/* Crystal now rendered inside Island per stage */}
          <Witch
            isRotating={isRotating}
            currentStage={currentStage}
            outerRef={witchRef}
            position={[biplanePositionAdj[0] - 1.6, biplanePositionAdj[1] + yScreenLift + 1.6, biplanePositionAdj[2] + 1.0]}
            rotation={[0, 20.1, 0]}
            scale={biplaneScaleAdj}
          />
          {crystalVisible && crystalRef.current && (
            <CrystalVisibilityWatcher
              position={(function() {
                const p = new THREE.Vector3();
                crystalRef.current.getWorldPosition(p);
                return [p.x, p.y, p.z];
              })()}
              onHide={() => setCrystalVisible(false)}
            />
          )}
          {/* Subtle bloom with high threshold to catch only bright highlights */}
          <EffectComposer>
            <Bloom
              intensity={0.25}
              luminanceThreshold={1.5}
			  luminanceSmoothing={0.2}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <div className='absolute bottom-2 left-2'>
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt='jukebox'
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          className='w-10 h-10 cursor-pointer object-contain'
        />
      </div>

      {/* Bottom-centered scroll hint button (excluded from lift) */}
      {true && (
        <div className='absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center justify-center'>
          <button
            onClick={() => {
              // Prevent double-click spamming while a stage transition is in progress
              if (requestedStage) return;
              const next = currentStage && currentStage >= 1 && currentStage <= 4 ? (currentStage === 4 ? 1 : currentStage + 1) : 2;
              setRequestedStage(next);
            }}
            className='pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors glow-button'
            aria-label='Scroll to explore'
          >
            <img src={arrow} alt='' className='w-6 h-6 animate-bounce rotate-90' />
          </button>
          <span className='mt-2 text-sm text-slate-600'>Scroll to explore</span>
        </div>
      )}

      {currentStage === 4 && (
        <div className='absolute bottom-4 right-4 z-30'>
          <button
            onClick={() => setRequestedStage(1)}
            className='px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md text-sm font-medium hover:bg-white transition-colors'
          >
            Restart Journey
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
