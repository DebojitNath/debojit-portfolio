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

  // Compute base bounding box and normalize scale
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

    // Cursor influence (fades out gracefully during final immersion so text is easy to read)
    const mouseActiveFactor = Math.max(0, 1 - contactProgress * 1.5);
    const mouse = mouseRef.current || { x: 0, y: 0 };
    const pointerX = !reducedMotion ? mouse.x * 0.14 * mouseActiveFactor : 0;
    const pointerY = !reducedMotion ? mouse.y * 0.18 * mouseActiveFactor : 0;

    // =========================================================================
    // 1. TILT TO TOP VIEW:
    //    Starts at your preferred -0.12, then tilts into a top-down vortex view (~1.25 rad)
    // =========================================================================
    const tiltRate = THREE.MathUtils.clamp((contactProgress - 0.05) / 0.65, 0, 1);
    const basePitch = THREE.MathUtils.lerp(-0.12, 1.25, tiltRate);
    const targetPitch = basePitch - pointerY + driftX;
    const targetYaw = Math.PI + pointerX + driftY;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 2.2, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 2.2, delta);

    // =========================================================================
    // 2. ZERO-CLIPPING EXPANSION:
    //    Scales up smoothly while pushing back along Z so the front rim NEVER
    //    intersects or gets sliced by the camera near clipping plane.
    // =========================================================================
    const expandRate = THREE.MathUtils.clamp((contactProgress - 0.15) / 0.70, 0, 1);
    const scaleFactor = THREE.MathUtils.lerp(1.0, 2.8, expandRate);
    modelGroup.scale.setScalar(baseScale * scaleFactor);

    // Push Z backwards proportionally to counteract expansion and prevent camera clipping line
    const targetPosZ = THREE.MathUtils.lerp(0, -14.0, expandRate);
    const targetPosY = THREE.MathUtils.lerp(-0.6, 0.0, expandRate);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetPosZ, 2.5, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetPosY, 2.5, delta);

    // Keep camera at safe distance
    const targetCamY = THREE.MathUtils.lerp(1.8, 0.8, expandRate);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetCamY, 2.5, delta);
    state.camera.position.z = 10.5;
    state.camera.lookAt(0, g.position.y * 0.5, g.position.z * 0.5);
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

  // Fade to totally black as singularity core consumes the viewport (0.72 -> 0.90)
  const blackoutOpacity = THREE.MathUtils.clamp((contactProgress - 0.72) / 0.18, 0, 1);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center select-none">
      {/* Radiant atmospheric accretion glow behind the 3D model */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(147, 51, 234, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, rgba(244, 63, 94, 0.06) 60%, transparent 85%)',
          opacity: 1 - blackoutOpacity,
        }}
      />

      {/* Interactive 3D Canvas with safe near clipping plane to eliminate any sliced lines */}
      <div className="w-full h-full relative z-10">
        <BlackHoleErrorBoundary>
          <Canvas
            camera={{ position: [0, 1.8, 10.5], fov: 42, near: 0.05, far: 2000 }}
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
                contactProgress={contactProgress}
              />
            </Suspense>
          </Canvas>
        </BlackHoleErrorBoundary>
      </div>

      {/* Seamless event horizon blackout overlay: turns totally black once inside */}
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
