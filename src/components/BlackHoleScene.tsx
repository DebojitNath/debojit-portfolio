import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useLenis } from 'lenis/react';
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
  mouseRef: React.RefObject<{ x: number; y: number }>;
  scrollFactorRef: React.RefObject<number>;
}

function BlackHoleModel({ reducedMotion, mouseRef, scrollFactorRef }: BlackHoleModelProps) {
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
    // Scale so the full black hole circle & razor-sharp accretion disk span the viewport
    const targetDiameter = 12.5;
    const s = targetDiameter / maxDim;
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Dynamic interactive tilt:
  // 1. While above: slightly tilted towards us (basePitch = 0.20)
  // 2. In the bottom section: perfectly straight (basePitch = 0.0), matching the screenshot!
  // 3. Cursor actively controls 3D rotation across the entire page
  useFrame((state, delta) => {
    const g = tiltGroup.current;
    if (!g) return;

    // Read real-time scroll factor (0 = above, 1 = scrolled to bottom)
    const factor = scrollFactorRef.current ?? 1;

    // Upward (0.20) to Straight (0.0)
    const basePitch = THREE.MathUtils.lerp(0.20, 0.0, factor);

    // Active cursor tilt anywhere on the screen
    const mouse = mouseRef.current || { x: 0, y: 0 };
    const pointerX = !reducedMotion ? mouse.x * 0.38 : 0;
    const pointerY = !reducedMotion ? mouse.y * 0.26 : 0;

    const targetPitch = basePitch - pointerY;
    const targetYaw = pointerX;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 3.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 3.2, delta);

    // Camera drops level with the equator (y = 0) at the bottom to form the razor-sharp straight line
    const targetCamY = THREE.MathUtils.lerp(0.9, 0.0, factor);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 2.8, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={tiltGroup} position={[0, 0, 0]}>
      <group ref={group} scale={scale} position={offset} dispose={null}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export interface BlackHoleSceneProps {
  scrollProgress?: number;
}

export default function BlackHoleScene({ scrollProgress }: BlackHoleSceneProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Global cursor position tracking (-1 to 1) so mouse actively rotates the 3D model
  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Precise scroll tracking:
  // factor = 0 when above, factor = 1 when scrolled down into the bottom section
  const scrollFactorRef = useRef(1);

  // 1. Lenis reactive update
  useLenis(({ progress }) => {
    const factor = THREE.MathUtils.clamp((progress - 0.70) / 0.28, 0, 1);
    scrollFactorRef.current = factor;
  });

  // 2. Viewport rect fallback update (works with or without Lenis)
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // 0 when container is lower down, 1 when reached bottom of page
      const factor = THREE.MathUtils.clamp((windowH - rect.top) / (rect.height * 0.95), 0, 1);
      scrollFactorRef.current = factor;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // If explicit scrollProgress prop passed, keep synced
  useEffect(() => {
    if (typeof scrollProgress === 'number') {
      scrollFactorRef.current = THREE.MathUtils.clamp((scrollProgress - 0.70) / 0.28, 0, 1);
    }
  }, [scrollProgress]);

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
    <div
      ref={containerRef}
      className="w-full h-[540px] sm:h-[660px] md:h-[780px] relative overflow-hidden flex items-center justify-center select-none"
    >
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(147, 51, 234, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, rgba(244, 63, 94, 0.06) 60%, transparent 85%)',
        }}
      />

      {/* Interactive 3D Canvas centered on equatorial plane */}
      <div className="w-full h-full relative z-10">
        <BlackHoleErrorBoundary>
          <Canvas
            camera={{ position: [0, 0.9, 8.2], fov: 42 }}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            {/* Ambient starlight */}
            <ambientLight intensity={1.5} />

            {/* Accretion Disk Rim Lights */}
            <pointLight position={[0, 4, 6]} intensity={3.8} color="#e0e7ff" />
            <pointLight position={[-8, -2, -4]} intensity={4.2} color="#c084fc" />
            <pointLight position={[8, 3, 2]} intensity={4.2} color="#38bdf8" />
            <pointLight position={[0, -6, 4]} intensity={2.8} color="#fb923c" />

            <Suspense fallback={null}>
              <BlackHoleModel
                reducedMotion={reducedMotion}
                mouseRef={mouseRef}
                scrollFactorRef={scrollFactorRef}
              />
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
