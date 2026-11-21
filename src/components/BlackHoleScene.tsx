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
    const targetDiameter = 12.5;
    const s = targetDiameter / maxDim;
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Subtle tilt: while above it is slightly tilted towards us, and while scrolling down in the last section it becomes straight
  useFrame((state, delta) => {
    const g = tiltGroup.current;
    if (!g) return;

    const t = state.clock.getElapsedTime();
    // Gentle celestial breathing drift
    const driftY = Math.sin(t * 0.22) * 0.02;
    const driftX = Math.cos(t * 0.18) * 0.01;

    const pointerX = !reducedMotion ? state.pointer.x * 0.12 : 0;
    const pointerY = !reducedMotion ? state.pointer.y * 0.06 : 0;

    // Normalize progress as the user descends into the bottom contact / singularity section (0 -> 1)
    const bottomFactor = THREE.MathUtils.clamp((scrollProgress - 0.7) / 0.3, 0, 1);

    // "while scrolling down in the below last section it is straight, and while above it is slightly titled towards us"
    // "the first one was down to straight, make it up to straight"
    const basePitch = THREE.MathUtils.lerp(0.14, 0.0, bottomFactor);
    const targetPitch = basePitch - pointerY + driftX;
    const targetYaw = pointerX + driftY;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 2.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 2.2, delta);
  });

  return (
    <group ref={tiltGroup} position={[0, -0.6, 0]}>
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
    <div className="w-full h-[500px] sm:h-[620px] md:h-[720px] relative overflow-hidden flex items-center justify-center select-none">
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(147, 51, 234, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, rgba(244, 63, 94, 0.06) 60%, transparent 85%)',
        }}
      />

      {/* Interactive 3D Canvas with the first black hole's framing */}
      <div className="w-full h-full relative z-10">
        <BlackHoleErrorBoundary>
          <Canvas
            camera={{ position: [0, 1.8, 8.5], fov: 42 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            {/* Ambient starlight */}
            <ambientLight intensity={1.4} />

            {/* Accretion Disk Rim Lights */}
            <pointLight position={[0, 4, 6]} intensity={3.5} color="#e0e7ff" />
            <pointLight position={[-8, -2, -4]} intensity={4.0} color="#c084fc" />
            <pointLight position={[8, 3, 2]} intensity={4.0} color="#38bdf8" />
            <pointLight position={[0, -6, 4]} intensity={2.5} color="#fb923c" />

            <Suspense fallback={null}>
              <BlackHoleModel reducedMotion={reducedMotion} scrollProgress={scrollProgress} />
            </Suspense>
          </Canvas>
        </BlackHoleErrorBoundary>
      </div>

      {/* Bottom gradient fade so the canvas blends into the dark page footer seamlessly */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.85) 45%, transparent 100%)',
        }}
      />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
