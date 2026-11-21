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
  mouseRef: React.RefObject<{ x: number; y: number }>;
  contactProgress: number;
}

function BlackHoleModel({ reducedMotion, mouseRef, contactProgress }: BlackHoleModelProps) {
  const group = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  // Disable frustum culling so large scaling never clips geometry prematurely
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = false;
      }
    });
  }, [scene]);

  // Auto-play the built-in accretion disk swirling animation loop
  useEffect(() => {
    if (!actions) return;
    const action = actions['Take 001'] || actions[Object.keys(actions)[0]];
    if (action) {
      action.reset().fadeIn(0.6).play();
      action.timeScale = reducedMotion ? 0.2 : 0.75;
    }
  }, [actions, reducedMotion]);

  // Restore the exact previous initial size (targetDiameter = 12.5)
  const { baseScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetDiameter = 12.5;
    const s = targetDiameter / maxDim;
    return {
      baseScale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  useFrame((state, delta) => {
    const g = tiltGroup.current;
    const modelGroup = group.current;
    if (!g || !modelGroup) return;

    const t = state.clock.getElapsedTime();
    // Gentle celestial breathing drift
    const driftY = Math.sin(t * 0.25) * 0.04;
    const driftX = Math.cos(t * 0.2) * 0.02;

    // Smooth, gentle cursor tracking (fades out as black hole engulfs the screen)
    const mouseActiveFactor = Math.max(0, 1 - contactProgress * 1.6);
    const mouse = mouseRef.current || { x: 0, y: 0 };
    const pointerX = !reducedMotion ? mouse.x * 0.14 * mouseActiveFactor : 0;
    const pointerY = !reducedMotion ? mouse.y * 0.18 * mouseActiveFactor : 0;

    const p = contactProgress;

    // =========================================================================
    // SATURN ANALOGY TRANSITION:
    //   Stage 1 (p 0→0.35): Top-slightly-side view → edge-on (ring cuts horizon)
    //                        pitch: +0.28 → 0.0  |  growth: 1.0 (no scaling yet)
    //   Stage 2 (p 0.35→0.85): Edge-on → bottom view AND black hole grows
    //                        pitch: 0.0 → -1.10  |  growth: 1.0 → 3.8
    //   Stage 3 (p > 0.85):  Fully engulfs screen
    //                        pitch: -1.10, growth: 3.8
    //
    // ZOOM METHOD: Pure FOV compression (camera stays fixed, FOV narrows = zoom in)
    // No Z push-back, no position shift — avoids model drifting up the screen.
    // =========================================================================
    let basePitch = 0;
    let growth = 1.0;

    if (p <= 0.35) {
      // Stage 1: tilt to horizon (no size change)
      const stage1 = p / 0.35;
      basePitch = THREE.MathUtils.lerp(0.28, 0.0, stage1);
      growth = 1.0;
    } else if (p <= 0.85) {
      // Stage 2: tilt past edge-on to bottom view + zoom in
      const stage2 = (p - 0.35) / 0.50;
      basePitch = THREE.MathUtils.lerp(0.0, -1.10, stage2);
      growth = THREE.MathUtils.lerp(1.0, 3.8, stage2);
    } else {
      // Stage 3: fully engulfed
      basePitch = -1.10;
      growth = 3.8;
    }

    const targetPitch = basePitch - pointerY + driftX;
    const targetYaw = Math.PI + pointerX + driftY;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 2.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 2.2, delta);

    // ---- PURE SCALE ZOOM (no position change, no Z drift) ----
    // Model position is LOCKED. Only scale grows.
    // y = 1.2 pushes model UP so the accretion disk fills the full canvas
    // (previously at -0.6 the bottom was transparent → starfield showed through)
    modelGroup.scale.setScalar(baseScale * growth);
    g.position.set(0, 1.2, 0); // Pushed up — eliminates the cut line at bottom

    // ---- CAMERA: fully fixed, no movement ----
    // lookAt matches the model's Y so it stays perfectly centered on screen
    state.camera.position.set(0, 1.8, 8.5);
    state.camera.lookAt(0, 1.2, 0);
  });

  return (
    <group ref={tiltGroup} position={[0, 1.2, 0]}>
      <group ref={group} scale={baseScale} position={offset} dispose={null}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export interface BlackHoleSceneProps {
  scrollProgress?: number;
  contactProgress?: number;
}

export default function BlackHoleScene({ contactProgress = 0 }: BlackHoleSceneProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  // Smooth global cursor tracking
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

  useEffect(() => {
    setWebglSupported(hasWebGL());
  }, []);

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-slate-500">
        WebGL not supported on this device.
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none bg-black">
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(147, 51, 234, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, rgba(244, 63, 94, 0.06) 60%, transparent 85%)',
        }}
      />

      {/* Interactive 3D Canvas — always rendered */}
      <div className="w-full h-full relative z-10">
        <BlackHoleErrorBoundary>
          <Canvas
            camera={{ position: [0, 1.8, 8.5], fov: 42, near: 0.001, far: 2000 }}
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
              <BlackHoleModel
                reducedMotion={reducedMotion}
                mouseRef={mouseRef}
                contactProgress={contactProgress}
              />
            </Suspense>
          </Canvas>
        </BlackHoleErrorBoundary>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
