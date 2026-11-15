import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/astronaut.glb";
// Scaled bigger so the 3D astronaut is prominent, detailed, and cinematic
const TARGET_HEIGHT = 2.15;
// Exact user pose: Head in South-West (bottom-left), Legs in North-East (top-right), Back pointing below/down
const BASE_ROTATION: [number, number, number] = [
  (-60 * Math.PI) / 180,    // X: Back pointing below/down, chest facing up toward viewer
  (-25 * Math.PI) / 180,    // Y: Dynamic zero-G 3D angle
  (130 * Math.PI) / 180,    // Z: Head in South-West (~7:30), Legs in North-East (~1:30)
];

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

type ModelProps = { calm: boolean; followPointer: boolean };

function AstronautModel({ calm, followPointer }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);
  const tilt = useRef<THREE.Group>(null);

  // Play the built-in floating skeletal animation loop with relaxed zero-G timescale
  useEffect(() => {
    if (!actions) return;
    const action = actions['floating'] || actions['idle'] || actions[Object.keys(actions)[0]];
    if (action) {
      action.reset().fadeIn(0.5).play();
      action.timeScale = 0.55; // Gentle, weightless limb drift
    }
  }, [actions]);

  // Scale and center the model once, whatever size/units it was exported in.
  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = TARGET_HEIGHT / (size.y || 1);
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
    };
  }, [scene]);

  // Serene weightless zero-G physics
  useFrame((state, delta) => {
    const g = tilt.current;
    if (!g) return;
    const t = state.clock.getElapsedTime();

    // Natural harmonic breathing and drift (slow and graceful, zero stiffness)
    const westDrift = Math.sin(t * 0.22) * 0.16;  // Slow, relaxed yaw
    const pitchDrift = Math.cos(t * 0.18) * 0.08; // Gentle recline sway
    const rollDrift = Math.sin(t * 0.15) * 0.06;  // Micro zero-G roll

    const pointerX = followPointer && !calm ? state.pointer.x * 0.22 : 0;
    const pointerY = followPointer && !calm ? -state.pointer.y * 0.14 : 0;

    const targetY = pointerX + (calm ? 0 : westDrift);
    const targetX = pointerY + (calm ? 0 : pitchDrift);
    const targetZ = calm ? 0 : rollDrift;

    // Fluid zero-G damping
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 1.2, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 1.2, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetZ, 1.0, delta);
  });

  return (
    <Float
      speed={calm ? 0 : 0.85}
      rotationIntensity={calm ? 0 : 0.2}
      floatIntensity={calm ? 0 : 0.65}
      floatingRange={[-0.12, 0.12]}
    >
      <group ref={tilt} position={[0.12, 0.1, 0]}>
        <group ref={group} rotation={BASE_ROTATION}>
          <primitive object={scene} scale={scale} position={offset} />
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

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("3D Astronaut failed to load, falling back to 2D vector:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

type AstronautSceneProps = {
  className?: string;
};

function ThreeCanvasView({ calm, followPointer }: { calm: boolean; followPointer: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.8], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Soft space ambient fill */}
      <ambientLight intensity={0.42} color="#f8fafc" />

      {/* Right Sunset Key: Brilliant magenta/rose beam from the bright right sky */}
      <directionalLight position={[5, 1.5, 2.5]} intensity={3.5} color="#ff3b77" />

      {/* Right-Rear Rim: Electric magenta/fuchsia edge glow outlining the right contours */}
      <directionalLight position={[5.5, 2.5, -3.5]} intensity={4.2} color="#e040fb" />

      {/* Front-Left Neutral Space Fill: Keeps the suit's authentic white fabric crisp */}
      <directionalLight position={[-4.5, 1.2, 3.5]} intensity={1.5} color="#ffffff" />

      {/* Warm Sunset Environment reflections for helmet visor and suit fittings */}
      <Environment preset="sunset" environmentIntensity={0.8} />

      <Suspense fallback={null}>
        <AstronautModel calm={calm} followPointer={followPointer} />
      </Suspense>
    </Canvas>
  );
}

export default function AstronautScene({
  className = "",
}: AstronautSceneProps) {
  const calm = usePrefersReducedMotion();
  const [webgl] = useState(hasWebGL);
  const followPointer =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  if (!webgl) return null;

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <ModelErrorBoundary fallback={null}>
        <Suspense fallback={null}>
          <ThreeCanvasView calm={calm} followPointer={followPointer} />
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
}

try {
  useGLTF.preload(MODEL_URL);
} catch {
  // Preload is optional
}
