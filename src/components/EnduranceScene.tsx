import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/endurance.glb";
// Scaled so the Endurance ring is bold, prominent, and fits gracefully beside the timeline
const TARGET_SIZE = 2.8;

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
  const sparkLightRef = useRef<THREE.PointLight>(null);
  const { scene } = useGLTF(MODEL_URL);

  // Apply battle-damaged / explosion breach aesthetics to the Endurance 3D model
  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.frustumCulled = false;
        const mesh = obj as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(0.3, mat.roughness ?? 0.4);
          mat.metalness = Math.min(0.85, mat.metalness ?? 0.6);
        }
      }

      // 1. Blow out / vaporize one connector module completely to create a gaping ring breach
      if (obj.name === "Connector.008" || obj.name.startsWith("Connector.008_")) {
        obj.visible = false;
      }

      // 2. Displace & tilt adjacent module Connector.006 as if violently blasted outward
      if (obj.name === "Connector.006") {
        obj.position.x += 160;
        obj.position.y += 90;
        obj.rotation.z += 0.38;
        obj.rotation.x -= 0.28;
      }

      // 3. Blow off door hatch Doors.003 into floating space
      if (obj.name === "Doors.003") {
        obj.position.z += 220;
        obj.position.y -= 100;
        obj.rotation.y += 0.85;
        obj.rotation.z += 0.45;
      }

      // 4. Scorch and char nearby hull plating with molten carbon burn & glowing embers
      if (
        obj.name.includes("Connector.006") ||
        obj.name.includes("Connector.002") ||
        obj.name.includes("Doors.003") ||
        obj.name.includes("DockingPortT2.001")
      ) {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          if (mesh.material) {
            const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
            mat.color.setRGB(0.12, 0.08, 0.07); // Scorched blackened armor
            mat.emissive.setRGB(0.95, 0.28, 0.02); // Molten orange heat glow
            mat.emissiveIntensity = 0.75;
            mat.roughness = 0.95;
            mat.metalness = 0.15;
            mesh.material = mat;
          }
        }
      }
    });
  }, [scene]);

  // Center and scale the model automatically
  const { scale, offset, breachCoord } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = TARGET_SIZE / maxDim;
    return {
      scale: s,
      offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
      breachCoord: [0.95 * s * 1400, -0.2 * s * 1400, 0.4 * s * 1400] as [number, number, number],
    };
  }, [scene]);

  // Interstellar Damaged Rotation: Centrifugal ring spin with an off-axis gyroscopic precession/wobble
  useFrame((state, delta) => {
    const spinner = spinGroup.current;
    const tilter = tiltGroup.current;
    const spark = sparkLightRef.current;
    if (!spinner || !tilter) return;

    // Continuous centrifugal ring spin
    const spinSpeed = calm ? 0 : 0.45;
    spinner.rotation.y += spinSpeed * delta;

    // Authentic post-explosion gyroscopic nutation / tumbling wobble
    const t = state.clock.getElapsedTime();
    const wobbleX = calm ? 0 : Math.sin(t * 1.7) * 0.06;
    const wobbleZ = calm ? 0 : Math.cos(t * 1.4) * 0.045;
    spinner.rotation.x = wobbleX;
    spinner.rotation.z = wobbleZ;

    // Interactive pointer tilt
    const idlePitch = Math.sin(t * 0.25) * 0.07;
    const idleRoll = Math.cos(t * 0.2) * 0.05;

    const pointerX = followPointer && !calm ? state.pointer.x * 0.25 : 0;
    const pointerY = followPointer && !calm ? -state.pointer.y * 0.18 : 0;

    const targetX = pointerY + (calm ? 0 : idlePitch);
    const targetZ = -pointerX * 0.45 + (calm ? 0 : idleRoll);

    tilter.rotation.x = THREE.MathUtils.damp(tilter.rotation.x, targetX, 1.5, delta);
    tilter.rotation.z = THREE.MathUtils.damp(tilter.rotation.z, targetZ, 1.5, delta);

    // Hazard electrical arc spark flickering at the ruptured module
    if (spark && !calm) {
      const isArcing = Math.random() > 0.84;
      spark.intensity = isArcing ? 2.5 + Math.random() * 3.5 : 0.35 + Math.sin(t * 6) * 0.2;
      spark.color.set(isArcing && Math.random() > 0.65 ? "#38bdf8" : "#f97316");
    }
  });

  return (
    <Float
      speed={calm ? 0 : 0.85}
      rotationIntensity={calm ? 0 : 0.18}
      floatIntensity={calm ? 0 : 0.45}
      floatingRange={[-0.06, 0.06]}
    >
      {/* Base presentation tilt presenting the ring and breach in dramatic 3D angle */}
      <group
        rotation={[
          (34 * Math.PI) / 180,
          (24 * Math.PI) / 180,
          (-16 * Math.PI) / 180
        ]}
      >
        <group ref={tiltGroup}>
          <group ref={spinGroup}>
            <primitive object={scene} scale={scale} position={offset} />
            {/* Ruptured module electrical hazard spark light */}
            <pointLight
              ref={sparkLightRef}
              position={breachCoord}
              distance={2.8}
              color="#f97316"
              intensity={1.2}
            />
          </group>
        </group>
      </group>
    </Float>
  );
}

/* ========================================================================= */
/* SVG FORMAT FLOATING SPACE DEBRIS FIELD                                    */
/* Authentic vector shards: scorched hull plating, solar cell fragments,     */
/* sheared space-frame girders, ruptured hatches, and drifting ember sparks. */
/* ========================================================================= */

interface SpaceDebrisProps {
  pointer: { x: number; y: number };
  calm: boolean;
}

const SpaceDebrisField: React.FC<SpaceDebrisProps> = ({ pointer, calm }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible select-none">
      {/* Ambient CSS Keyframe Animations for Natural Zero-G Tumble & Drift */}
      <style>{`
        @keyframes debrisDrift1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          50% {
            transform: translate3d(14px, -18px, 0) rotate(22deg) scale(1.05);
          }
        }
        @keyframes debrisDrift2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(0.95);
          }
          50% {
            transform: translate3d(-18px, 20px, 0) rotate(-35deg) scale(1.02);
          }
        }
        @keyframes debrisDrift3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-12px, -22px, 0) rotate(45deg);
          }
        }
        @keyframes debrisDrift4 {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(16px, 16px, 0) rotate(-18deg);
          }
        }
        @keyframes sparkPulse {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.25);
          }
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIS 1: Scorched Armor Hull Plate Shard (Top-Right of Ship) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-[8%] right-[10%] w-16 sm:w-20 md:w-24 h-auto z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${pointer.x * 22}px, ${pointer.y * 18}px, 0)`,
          animation: calm ? "none" : "debrisDrift1 12s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 100 80" className="w-full h-auto drop-shadow-[0_4px_14px_rgba(249,115,22,0.35)]">
          <defs>
            <linearGradient id="hullGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="45%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <radialGradient id="scorch1" cx="35%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Jagged angular armor plating */}
          <polygon points="12,18 84,6 94,46 62,74 20,62 6,36" fill="url(#hullGrad1)" stroke="#cbd5e1" strokeWidth="1.2" />
          {/* Carbon explosion burn pattern */}
          <circle cx="36" cy="38" r="24" fill="url(#scorch1)" />
          {/* Structural rivets */}
          <circle cx="22" cy="24" r="1.5" fill="#f8fafc" />
          <circle cx="42" cy="18" r="1.5" fill="#f8fafc" />
          <circle cx="64" cy="14" r="1.5" fill="#f8fafc" />
          {/* Exposed fracture seam with glowing molten tear */}
          <polyline points="62,74 68,60 82,56 94,46" fill="none" stroke="#f97316" strokeWidth="1.8" strokeDasharray="4,2" />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIS 2: Shattered Photovoltaic Solar Array (Bottom-Left)    */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute bottom-[14%] left-[6%] w-14 sm:w-18 md:w-20 h-auto z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -14}px, 0)`,
          animation: calm ? "none" : "debrisDrift2 14s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 90 70" className="w-full h-auto drop-shadow-[0_4px_16px_rgba(56,189,248,0.3)]">
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
          </defs>
          {/* Sheared solar tile */}
          <polygon points="10,14 82,18 70,64 16,52" fill="url(#solarGrad)" stroke="#38bdf8" strokeWidth="1.2" />
          {/* Silicon cell grid lines */}
          <line x1="28" y1="15" x2="30" y2="54" stroke="#bae6fd" strokeWidth="0.8" opacity="0.65" />
          <line x1="46" y1="16" x2="48" y2="57" stroke="#bae6fd" strokeWidth="0.8" opacity="0.65" />
          <line x1="64" y1="17" x2="66" y2="61" stroke="#bae6fd" strokeWidth="0.8" opacity="0.65" />
          <line x1="14" y1="33" x2="76" y2="39" stroke="#bae6fd" strokeWidth="0.8" opacity="0.65" />
          {/* Shattered fracture corner */}
          <polygon points="66,17 82,18 76,34" fill="#fb7185" opacity="0.45" />
          <polyline points="66,17 76,34 82,18" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIS 3: Sheared Space-Frame Structural Truss (Behind Ship)  */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-[22%] left-[10%] w-20 sm:w-24 md:w-28 h-auto z-0 transition-transform duration-500 ease-out opacity-85"
        style={{
          transform: `translate3d(${pointer.x * -28}px, ${pointer.y * -20}px, 0)`,
          animation: calm ? "none" : "debrisDrift3 16s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 110 50" className="w-full h-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <defs>
            <linearGradient id="trussGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          {/* Longitudinal titanium girders */}
          <line x1="8" y1="14" x2="96" y2="20" stroke="url(#trussGrad)" strokeWidth="3" strokeLinecap="round" />
          <line x1="14" y1="34" x2="88" y2="38" stroke="url(#trussGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Diagonal cross-lattice braces */}
          <line x1="14" y1="15" x2="30" y2="35" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="30" y1="35" x2="48" y2="17" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="48" y1="17" x2="66" y2="36" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="66" y1="36" x2="82" y2="19" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="82" y1="19" x2="94" y2="38" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Sheared torn electrical wires sparking at end */}
          <path d="M 96,20 Q 104,15 108,24" fill="none" stroke="#f97316" strokeWidth="1.4" />
          <path d="M 88,38 Q 96,44 102,39" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIS 4: Ruptured Circular Airlock Ring (Near Breach)        */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute bottom-[20%] right-[14%] w-12 sm:w-16 h-auto z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${pointer.x * 16}px, ${pointer.y * 14}px, 0)`,
          animation: calm ? "none" : "debrisDrift4 11s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 70 70" className="w-full h-auto drop-shadow-[0_2px_12px_rgba(249,115,22,0.4)]">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>
          {/* Ruptured bulkhead ring */}
          <path d="M 16,35 A 19,19 0 1,1 54,35 A 19,19 0 0,1 36,54" fill="none" stroke="url(#ringGrad)" strokeWidth="4" strokeLinecap="round" />
          {/* Sheared glowing contact points */}
          <circle cx="36" cy="54" r="2.2" fill="#fed7aa" />
          <circle cx="16" cy="35" r="2.2" fill="#fed7aa" />
          <line x1="36" y1="54" x2="42" y2="62" stroke="#ea580c" strokeWidth="1.8" />
          <line x1="16" y1="35" x2="8" y2="40" stroke="#ea580c" strokeWidth="1.8" />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DEBRIS 5 & 6: Twisted Titanium Conduit Pipe & Shards          */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-[48%] right-[4%] w-10 sm:w-12 h-auto z-10 transition-transform duration-400 ease-out"
        style={{
          transform: `translate3d(${pointer.x * 26}px, ${pointer.y * 22}px, 0)`,
          animation: calm ? "none" : "debrisDrift2 10s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 60 50" className="w-full h-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          <path d="M 8,12 Q 32,4 42,24 T 54,44" fill="none" stroke="#e2e8f0" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 12,16 Q 34,10 42,24" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>
      </div>

      <div
        className="absolute bottom-[36%] left-[18%] w-8 sm:w-10 h-auto z-10 transition-transform duration-400 ease-out opacity-80"
        style={{
          transform: `translate3d(${pointer.x * -14}px, ${pointer.y * -16}px, 0)`,
          animation: calm ? "none" : "debrisDrift1 13s ease-in-out infinite"
        }}
      >
        <svg viewBox="0 0 40 40" className="w-full h-auto">
          {/* Sharp triangular hull fragment */}
          <polygon points="6,8 34,14 18,34" fill="#64748b" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="14" y1="12" x2="22" y2="28" stroke="#f97316" strokeWidth="1" />
        </svg>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING MOLTEN SPARKS & MICRO-EMBER PARTICLES                */}
      {/* Drifting zero-G embers glowing against deep cosmic void       */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#f97316] z-20 pointer-events-none"
        style={{ animation: calm ? "none" : "sparkPulse 3.2s ease-in-out infinite" }}
      />
      <div
        className="absolute top-[44%] right-[16%] w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#38bdf8] z-20 pointer-events-none"
        style={{ animation: calm ? "none" : "sparkPulse 2.1s ease-in-out infinite 0.8s" }}
      />
      <div
        className="absolute bottom-[28%] left-[26%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] z-10 pointer-events-none"
        style={{ animation: calm ? "none" : "sparkPulse 4.5s ease-in-out infinite 1.4s" }}
      />
      <div
        className="absolute bottom-[48%] left-[12%] w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_#fb7185] z-10 pointer-events-none"
        style={{ animation: calm ? "none" : "sparkPulse 3.8s ease-in-out infinite 0.4s" }}
      />
    </div>
  );
};

/* ========================================================================= */
/* SCENE CONTAINER & CANVAS                                                  */
/* ========================================================================= */

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const followPointer =
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  // Track pointer across the section for volumetric debris parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!followPointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
    >
      {/* Cosmic atmospheric aura behind the spacecraft */}
      <div className="absolute inset-0 m-auto w-4/5 h-4/5 rounded-full bg-radial from-orange-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Floating SVG Format Space Debris Field */}
      <SpaceDebrisField pointer={mousePos} calm={calm} />

      {/* 3D Broken Interstellar Endurance Model */}
      <div className="relative z-10 w-full h-full">
        <EnduranceErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <ThreeCanvasView calm={calm} followPointer={followPointer} inView={inView} />
          </Suspense>
        </EnduranceErrorBoundary>
      </div>
    </div>
  );
}

try {
  useGLTF.preload(MODEL_URL);
} catch {
  // Preload is optional
}
