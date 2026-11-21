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
    // 1. TILT & SIZE PROGRESSION (User Specification):
    //    Stage 1 (p <= 0.35): Behind ring goes down, frontal ring tilts up
    //                         until they lie on the same plane cutting horizon straight (pitch = 0).
    //                         Size stays at initial size (growth = 1.0).
    //    Stage 2 (p > 0.35):  Starts growing bigger from the straight horizon point
    //                         while frontal ring tilts further up into top view.
    // =========================================================================
    let basePitch = 0;
    let growth = 1.0;

    if (p <= 0.35) {
      // Reversed: tilts to horizon plane (pitch +0.28 -> 0.0)
      const stage1 = p / 0.35;
      basePitch = THREE.MathUtils.lerp(0.28, 0.0, stage1);
      growth = 1.0;
    } else if (p <= 0.85) {
      // Reversed: tilts into top-view (0.0 -> -1.10 rad) AND size grows (1.0 -> 3.8)
      const stage2 = (p - 0.35) / 0.50;
      basePitch = THREE.MathUtils.lerp(0.0, -1.10, stage2);
      growth = THREE.MathUtils.lerp(1.0, 3.8, stage2);
    } else {
      // Fully engulfs screen
      basePitch = -1.10;
      growth = 3.8;
    }

    const targetPitch = basePitch - pointerY + driftX;
    const targetYaw = Math.PI + pointerX + driftY;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 2.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 2.2, delta);

    // Apply scale growth
    modelGroup.scale.setScalar(baseScale * growth);

    // Push Z backwards as it grows to maintain clearance and prevent camera clipping line
    const targetPosZ = - (growth - 1.0) * 5.5;
    g.position.z = THREE.MathUtils.damp(g.position.z, targetPosZ, 2.5, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, -0.6, 2.5, delta);

    // Keep camera stable at original initial viewpoint
    state.camera.position.set(0, 1.8, 8.5);
    state.camera.lookAt(0, 0, g.position.z * 0.4);
  });

  return (
    <group ref={tiltGroup} position={[0, -0.6, 0]}>
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

  // Fade to totally black once the black hole covers the entire screen (0.80 -> 0.86)
  const blackoutOpacity = THREE.MathUtils.clamp((contactProgress - 0.80) / 0.08, 0, 1);
  const isBlackholeRemoved = blackoutOpacity >= 1;

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none bg-black">
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      {!isBlackholeRemoved && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(147, 51, 234, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, rgba(244, 63, 94, 0.06) 60%, transparent 85%)',
            opacity: 1 - blackoutOpacity,
          }}
        />
      )}

      {/* Interactive 3D Canvas (removed/hidden once screen is completely dark) */}
      {!isBlackholeRemoved && (
        <div
          className="w-full h-full relative z-10 transition-opacity duration-300"
          style={{ opacity: 1 - blackoutOpacity }}
        >
          <BlackHoleErrorBoundary>
            <Canvas
              camera={{ position: [0, 1.8, 8.5], fov: 42, near: 0.05, far: 2000 }}
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
      )}

      {/* Completely dark background screen: replaces black hole once it covers the screen */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-20"
        style={{
          opacity: blackoutOpacity,
        }}
      />
    </div>
  );
}

useGLTF.preload(MODEL_URL);
