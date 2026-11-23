import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/endurance.glb";
// Scaled so the Endurance ring is bold, prominent, and fits gracefully beside the timeline
const TARGET_SIZE = 3.2;

function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function usePrefersReducedMotion(): boolean {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

interface EnduranceModelProps {
  calm: boolean;
  followPointer: boolean;
}

function EnduranceModel({ calm, followPointer }: EnduranceModelProps) {
  const spinGroup = useRef<THREE.Group>(null);
  const tiltGroup = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  // Disable frustum culling so large rotations never clip geometry
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = false;
        // Ensure materials reflect space lighting cleanly
        const mesh = obj as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.25, mat.roughness ?? 0.4);
          mat.metalness = Math.min(0.85, mat.metalness ?? 0.6);
        }
      }
    });
  }, [scene]);

  // Center and scale the model automatically
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = TARGET_SIZE / maxDim;
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Cinematic Endurance rotation & gentle pointer reaction
  useFrame((state, delta) => {
    const spinner = spinGroup.current;
    const tilter = tiltGroup.current;
    if (!spinner || !tilter) return;

    // Authentic Interstellar centrifugal ring rotation (around its central Z/Y axis)
    const spinSpeed = calm ? 0 : 0.42; // radians/sec
    spinner.rotation.y += spinSpeed * delta;

    // Smooth subtle pointer tilt on hover
    const t = state.clock.getElapsedTime();
    const idlePitch = Math.sin(t * 0.25) * 0.08;
    const idleRoll = Math.cos(t * 0.2) * 0.06;

    const pointerX = followPointer && !calm ? state.pointer.x * 0.28 : 0;
    const pointerY = followPointer && !calm ? -state.pointer.y * 0.2 : 0;

    const targetX = pointerY + (calm ? 0 : idlePitch);
    const targetZ = -pointerX * 0.5 + (calm ? 0 : idleRoll);

    tilter.rotation.x = THREE.MathUtils.damp(tilter.rotation.x, targetX, 1.5, delta);
    tilter.rotation.z = THREE.MathUtils.damp(tilter.rotation.z, targetZ, 1.5, delta);
  });

  return (
    <Float
      speed={calm ? 0 : 0.8}
      rotationIntensity={calm ? 0 : 0.15}
      floatIntensity={calm ? 0 : 0.45}
      floatingRange={[-0.06, 0.06]}
    >
      {/* Base tilt angle presenting the ring in cinematic 3D perspective */}
      <group
        rotation={[
          (35 * Math.PI) / 180,  // Tilted 35 deg forward to reveal the circular ring structure
          (20 * Math.PI) / 180,  // Tilted 20 deg yaw
          (-15 * Math.PI) / 180  // Dynamic slant
        ]}
      >
        <group ref={tiltGroup}>
          <group ref={spinGroup}>
            <primitive object={scene} scale={scale} position={offset} />
          </group>
        </group>
      </group>
    </Float>
  );
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class EnduranceErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Endurance failed to load:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface EnduranceSceneProps {
  className?: string;
}

function ThreeCanvasView({
  calm,
  followPointer,
  inView,
}: {
  calm: boolean;
  followPointer: boolean;
  inView: boolean;
}) {
  return (
    <Canvas
      frameloop={inView ? "always" : "never"}
      dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.35) : 1}
      camera={{ position: [0, 0, 5.8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      {/* Ambient starlight */}
      <ambientLight intensity={0.55} color="#e2e8f0" />

      {/* Atmospheric hemisphere light for natural cosmic gradient */}
      <hemisphereLight args={["#a78bfa", "#0f172a", 0.9]} />

      {/* Primary Key Starlight (Crisp White/Cyan) */}
      <directionalLight position={[4, 5, 4]} intensity={2.8} color="#ffffff" />

      {/* Warm Rose/Orange Accretion Disk Rim Light (Matching Cosmic Theme) */}
      <directionalLight position={[-5, -2, -3]} intensity={3.2} color="#f97316" />

      {/* Electric Violet/Purple Edge Fill */}
      <directionalLight position={[3, -4, 2]} intensity={2.0} color="#c084fc" />

      <Suspense fallback={null}>
        <EnduranceModel calm={calm} followPointer={followPointer} />
      </Suspense>
    </Canvas>
  );
}

export default function EnduranceScene({ className = "" }: EnduranceSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calm = usePrefersReducedMotion();
  const [webgl] = useState(hasWebGL);
  const [inView, setInView] = useState(true);
  const followPointer =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  // Pause render loop completely when scrolled away from Journey section
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!webgl) return null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      {/* Cosmic atmospheric aura behind the spacecraft */}
      <div className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-full bg-radial from-purple-600/15 via-orange-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <EnduranceErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ThreeCanvasView calm={calm} followPointer={followPointer} inView={inView} />
        </Suspense>
      </EnduranceErrorBoundary>
    </div>
  );
}

try {
  useGLTF.preload(MODEL_URL);
} catch {
  // Preload is optional
}
