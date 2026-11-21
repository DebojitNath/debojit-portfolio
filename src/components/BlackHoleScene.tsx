import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = '/models/blackhole.glb';

function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

class BlackHoleErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[BlackHoleScene] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback || null;
    return this.props.children;
  }
}

interface BlackHoleModelProps {
  reducedMotion: boolean;
  scrollProgress: number;
}

function BlackHoleModel({ reducedMotion, scrollProgress }: BlackHoleModelProps) {
  const group = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  // Auto-play the built-in accretion disk swirling animation loop
  useEffect(() => {
    if (!actions) return;
    const action = actions['Take 001'] || actions[Object.keys(actions)[0]];
    if (action) {
      action.reset().fadeIn(0.6).play();
      action.timeScale = reducedMotion ? 0.2 : 0.75; // Majestic, hypnotic swirl rate
    }
  }, [actions, reducedMotion]);

  // Compute bounding box and normalize scale to fit the stage perfectly
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Scale to a prominent cinematic diameter spanning the viewport
    const targetDiameter = 12.8;
    const s = targetDiameter / maxDim;
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Dynamic high-angle top-down perspective that steepens as the user scrolls down
  useFrame((state, delta) => {
    const g = tiltGroup.current;
    if (!g) return;

    const t = state.clock.getElapsedTime();
    // Gentle celestial breathing drift
    const driftY = Math.sin(t * 0.22) * 0.04;
    const driftX = Math.cos(t * 0.18) * 0.02;

    const pointerX = !reducedMotion ? state.pointer.x * 0.22 : 0;
    const pointerY = !reducedMotion ? state.pointer.y * 0.12 : 0;

    // Normalize progress as the user descends into the bottom contact / singularity section (0 -> 1)
    const bottomFactor = THREE.MathUtils.clamp((scrollProgress - 0.45) / 0.55, 0, 1);

    // Looking from UP towards it: pitch forward so the upper accretion disk faces camera from above
    // Smoothly steepens from 0.38 rad (~22 deg) to 0.72 rad (~41 deg) as you scroll down
    const basePitch = THREE.MathUtils.lerp(0.38, 0.72, bottomFactor);
    const targetPitch = basePitch + pointerY + driftX;
    const targetYaw = pointerX + driftY;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 2.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 2.2, delta);

    // Elevate camera higher up as the user scrolls down, gazing down into the singularity
    const targetCamY = THREE.MathUtils.lerp(3.8, 5.8, bottomFactor);
    const targetCamZ = THREE.MathUtils.lerp(8.4, 7.2, bottomFactor);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 2.2, delta);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetCamZ, 2.2, delta);
    state.camera.lookAt(0, -0.85, 0);
  });

  return (
    <group ref={tiltGroup} position={[0, -1.0, 0]}>
      <group ref={group} scale={scale} position={offset} dispose={null}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export interface BlackHoleSceneProps {
  scrollProgress?: number;
}

export default function BlackHoleScene({ scrollProgress = 1.0 }: BlackHoleSceneProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-[520px] flex items-center justify-center text-xs font-mono text-slate-500">
        WebGL not supported on this device.
      </div>
    );
  }

  return (
    <div className="w-full h-[520px] sm:h-[640px] md:h-[750px] relative overflow-hidden flex items-center justify-center select-none">
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(147, 51, 234, 0.25) 0%, rgba(56, 189, 248, 0.14) 35%, rgba(244, 63, 94, 0.07) 60%, transparent 85%)',
        }}
      />

      {/* Interactive 3D Canvas */}
      <div className="w-full h-full relative z-10">
        <BlackHoleErrorBoundary>
          <Canvas
            camera={{ position: [0, 4.5, 7.8], fov: 42 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            {/* Ambient starlight */}
            <ambientLight intensity={1.5} />

            {/* Accretion Disk Lights illuminating from high above and flanks */}
            <pointLight position={[0, 6, 6]} intensity={4.0} color="#e0e7ff" />
            <pointLight position={[-8, 2, -4]} intensity={4.5} color="#c084fc" />
            <pointLight position={[8, 4, 3]} intensity={4.5} color="#38bdf8" />
            <pointLight position={[0, -4, 4]} intensity={2.5} color="#fb923c" />

            <Suspense fallback={null}>
              <BlackHoleModel reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>
        </BlackHoleErrorBoundary>
      </div>

      {/* Bottom gradient fade so the canvas blends into the dark page footer seamlessly */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.85) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
