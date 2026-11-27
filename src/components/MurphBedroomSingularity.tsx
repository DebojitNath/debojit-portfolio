import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import XpContactWindow from './XpContactWindow';
import {
  XP_WINDOW_PALETTES,
  DEFAULT_XP_PALETTE_ID,
  XpPaletteId,
} from '../config/xpWindowConfig';
import {
  BEDROOM_PALETTES,
  BEDROOM_FILTERS,
  DEFAULT_PALETTE_ID,
  DEFAULT_RECOLOR_STRENGTH,
  DEFAULT_FILTER_STRENGTH,
  FILM_GRAIN_OPACITY,
  VIGNETTE_OPACITY,
  BRIGHTNESS_DRIFT_DURATION_SEC,
  BRIGHTNESS_DRIFT_MIN,
  BRIGHTNESS_DRIFT_MAX,
  PaletteId,
  FilterId,
  BedroomPalette,
  buildCssFilter,
} from '../config/bedroomLookConfig';

const MODEL_PATH = '/models/murphs_bedroom.glb';

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

// Create a soft circular grain texture so sand specks aren't hard squares
function createSandGrainTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.45, 'rgba(255, 255, 255, 0.6)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Fine, matte falling sand dust tinted subtly by the active palette's light beam
function SandDust({
  count = 420,
  opacity = 1,
  beamColor,
}: {
  count?: number;
  opacity?: number;
  beamColor: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const grainTexture = useMemo(() => createSandGrainTexture(), []);

  const { positions, speeds, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const base = new THREE.Color(beamColor);
    const earth = new THREE.Color('#C2A070');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.2;
      spd[i] = 0.14 + Math.random() * 0.28;

      const mix = new THREE.Color().copy(earth).lerp(base, (i % 3) * 0.35 + 0.25);
      col[i * 3] = mix.r;
      col[i * 3 + 1] = mix.g;
      col[i * 3 + 2] = mix.b;
    }
    return { positions: pos, speeds: spd, colors: col };
  }, [count, beamColor]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i] * delta * 0.24;
      pos[i * 3] += Math.sin(t * 0.4 + i * 0.7) * 0.0008;
      pos[i * 3 + 2] += Math.cos(t * 0.3 + i * 0.5) * 0.0006;

      if (pos[i * 3 + 1] < -1.5) {
        pos[i * 3 + 1] = 1.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        map={grainTexture}
        vertexColors
        transparent
        opacity={0.55 * opacity}
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Soft volumetric light beam cone so the light beam is the brightest element in the scene
function VolumetricLightBeam({
  color,
  opacity,
}: {
  color: string;
  opacity: number;
}) {
  const beamTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.18)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  if (!beamTexture || opacity <= 0.01) return null;

  return (
    <mesh position={[0.45, 0.65, 0.25]} rotation={[0.15, 0, 0.42]}>
      <coneGeometry args={[1.65, 4.2, 32, 1, true]} />
      <meshBasicMaterial
        color={color}
        map={beamTexture}
        transparent
        opacity={0.28 * opacity}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function classifyMeshRole(meshName: string): 'wood' | 'wall' | 'accent' | 'secondary' {
  const n = meshName.toLowerCase();
  if (
    n.includes('wall') ||
    n.includes('ceiling') ||
    n.includes('window')
  ) {
    return 'wall';
  }
  if (
    n.includes('shelf') ||
    n.includes('table') ||
    n.includes('door') ||
    n.includes('ladder') ||
    n.includes('bed_frame') ||
    n.includes('cabinet') ||
    n.includes('chest') ||
    n.includes('floor') ||
    n.includes('chair')
  ) {
    return 'wood';
  }
  if (
    n.includes('bedsheet') ||
    n.includes('blanket') ||
    n.includes('pillow') ||
    n.includes('lamp') ||
    n.includes('photo')
  ) {
    return 'secondary';
  }
  return 'accent';
}

interface RoomSceneProps {
  progress: number; // 0.0 to 1.0 (corresponds to contactProgress 1.0 -> 2.0)
  palette: BedroomPalette;
  recolorStrength: number;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  overlayBoxRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  isFieldFocused: boolean;
}

function RoomContent({
  progress,
  palette,
  recolorStrength,
  mouseRef,
  reducedMotion,
  overlayBoxRef,
  isMobile,
  isFieldFocused,
}: RoomSceneProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const roomGroupRef = useRef<THREE.Group>(null);
  const originalColorsRef = useRef<Map<THREE.Material, THREE.Color>>(new Map());

  // Filter out stray outlier nodes and cache original material colors once
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      const name = child.name.toLowerCase();
      if (name.includes('globe')) {
        child.visible = false;
      }
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat && 'color' in mat && (mat as THREE.MeshStandardMaterial).color) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            if (!originalColorsRef.current.has(mat)) {
              originalColorsRef.current.set(mat, stdMat.color.clone());
            }
          }
        });
      }
    });
  }, [scene]);

  // Step 1: Recolor materials cleanly using palette + recolorStrength
  useEffect(() => {
    if (!scene) return;
    const woodTarget = new THREE.Color(palette.woodColor);
    const wallTarget = new THREE.Color(palette.wallColor);
    const accentTarget = new THREE.Color(palette.accentColor);
    const secondaryTarget = new THREE.Color(palette.secondaryAccentColor);
    const strength = THREE.MathUtils.clamp(recolorStrength, 0, 1);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const role = classifyMeshRole(mesh.name);
        let target = accentTarget;
        if (role === 'wood') target = woodTarget;
        else if (role === 'wall') target = wallTarget;
        else if (role === 'secondary') target = secondaryTarget;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          const orig = originalColorsRef.current.get(mat);
          if (orig && 'color' in mat) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.color.copy(orig).lerp(target, strength);
            stdMat.needsUpdate = true;
          }
        });
      }
    });
  }, [scene, palette, recolorStrength]);

  // Smooth interpolated progress for cinematic damping
  const smoothProgress = useRef(progress);

  useFrame((state, delta) => {
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      progress,
      4.5,
      delta
    );

    const p = smoothProgress.current;
    if (!roomGroupRef.current) return;

    // Phase 1 (p: 0 -> 0.35): Appears from a dot & grows with bookshelf facing front
    // Phase 2 (p: 0.35 -> 0.70): Glides cleanly through the shelf bay (below plank, above spaceship) into the room
    // Phase 3 (p: 0.70 -> 1.00): Zooms directly onto the laptop screen on the study desk
    let currentScale = 0.003;
    if (p < 0.35) {
      const t = p / 0.35;
      const eased = Math.pow(t, 2.2);
      currentScale = THREE.MathUtils.lerp(0.003, 1.0, eased);
    } else if (p < 0.70) {
      const t = (p - 0.35) / 0.35;
      currentScale = THREE.MathUtils.lerp(1.0, 1.15, t);
    } else {
      currentScale = 1.15;
    }
    roomGroupRef.current.scale.setScalar(currentScale);

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    if (p >= 0.35 && p < 0.70) {
      const t = (p - 0.35) / 0.35;
      const forwardEase = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      targetZ = forwardEase * 5.4;
      const passDip = Math.sin(t * Math.PI) * -0.10;
      targetY = passDip + forwardEase * -0.06;
    } else if (p >= 0.70) {
      const t = (p - 0.70) / 0.30;
      const laptopEase = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      // Frame the laptop large and centered with bezels visible around it
      targetX = THREE.MathUtils.lerp(0, -1.366, laptopEase);
      targetY = THREE.MathUtils.lerp(-0.06, 0.690, laptopEase);
      targetZ = THREE.MathUtils.lerp(5.4, 8.95, laptopEase);
    }

    // 1. Subtle bookshelf cursor parallax when up close outside (p: 0.32 -> 0.65)
    const enterTilt = THREE.MathUtils.smoothstep(p, 0.32, 0.42);
    const leaveShelfTilt = 1 - THREE.MathUtils.smoothstep(p, 0.58, 0.70);
    const shelfCursorFactor = !reducedMotion ? enterTilt * leaveShelfTilt : 0;

    // 2. Wide cursor look-around once past the bookshelf inside the room (peaks at p ~ 0.72 so side walls are visible),
    //    then smoothly settles to 0 (completely static) as camera zooms onto the laptop screen
    const enterRoomLook = THREE.MathUtils.smoothstep(p, 0.60, 0.70);
    const settleLaptopLook = 1 - THREE.MathUtils.smoothstep(p, 0.74, 0.95);
    const lookAroundFactor = !reducedMotion ? enterRoomLook * settleLaptopLook : 0;

    const pointerX = -mouseRef.current.x * 0.08 * shelfCursorFactor;
    const pointerY = mouseRef.current.y * 0.05 * shelfCursorFactor;
    const pointerYaw = mouseRef.current.x * 0.08 * shelfCursorFactor;
    const pointerPitch = -mouseRef.current.y * 0.05 * shelfCursorFactor;

    roomGroupRef.current.position.z = targetZ;
    roomGroupRef.current.position.x = THREE.MathUtils.damp(
      roomGroupRef.current.position.x,
      targetX + pointerX,
      4.5,
      delta
    );
    roomGroupRef.current.position.y = THREE.MathUtils.damp(
      roomGroupRef.current.position.y,
      targetY + pointerY,
      4.5,
      delta
    );

    roomGroupRef.current.rotation.y = THREE.MathUtils.damp(
      roomGroupRef.current.rotation.y,
      pointerYaw,
      3.5,
      delta
    );
    roomGroupRef.current.rotation.x = THREE.MathUtils.damp(
      roomGroupRef.current.rotation.x,
      pointerPitch,
      3.5,
      delta
    );
    roomGroupRef.current.rotation.z = 0;

    // Rotate camera smoothly inside the room so moving cursor reveals the left/right side walls
    state.camera.rotation.order = 'YXZ';
    const targetCamYaw = -mouseRef.current.x * 0.45 * lookAroundFactor;
    const targetCamPitch = -mouseRef.current.y * 0.18 * lookAroundFactor;
    state.camera.rotation.y = THREE.MathUtils.damp(state.camera.rotation.y, targetCamYaw, 3.2, delta);
    state.camera.rotation.x = THREE.MathUtils.damp(state.camera.rotation.x, targetCamPitch, 3.2, delta);
    state.camera.rotation.z = 0;

    // Project exact 3D LCD_2 bounds onto the 2D overlay DOM element at 60fps (desktop only; mobile uses flat full-width)
    const boxEl = overlayBoxRef.current;
    if (boxEl) {
      if (!isMobile && progress >= 0.70 && p >= 0.68) {
        roomGroupRef.current.updateMatrixWorld();
        const leftEdge = new THREE.Vector3(1.066, -0.5996, -4.365).applyMatrix4(roomGroupRef.current.matrixWorld).project(state.camera);
        const rightEdge = new THREE.Vector3(1.310, -0.5996, -4.365).applyMatrix4(roomGroupRef.current.matrixWorld).project(state.camera);
        const topEdge = new THREE.Vector3(1.1878, -0.519, -4.385).applyMatrix4(roomGroupRef.current.matrixWorld).project(state.camera);
        const bottomEdge = new THREE.Vector3(1.1878, -0.680, -4.345).applyMatrix4(roomGroupRef.current.matrixWorld).project(state.camera);
        const centerPt = new THREE.Vector3(1.1878, -0.5996, -4.365).applyMatrix4(roomGroupRef.current.matrixWorld).project(state.camera);

        const vw = state.size.width;
        const vh = state.size.height;
        const xPx = ((centerPt.x + 1) / 2) * vw;
        const yPx = ((1 - centerPt.y) / 2) * vh;
        const wPx = Math.abs((rightEdge.x - leftEdge.x) / 2) * vw;
        const hPx = Math.abs((topEdge.y - bottomEdge.y) / 2) * vh;

        const scaleX = wPx / 580;
        const scaleY = hPx / 382;
        const scale = Math.min(scaleX, scaleY) * 1.055;
        // Keep locked to the laptop screen's exact tilt even when inputs are focused
        const tiltDeg = 13.5;

        const fadeOpacity = THREE.MathUtils.clamp((p - 0.68) / 0.10, 0, 1);

        boxEl.style.display = 'block';
        boxEl.style.opacity = fadeOpacity.toFixed(3);
        boxEl.style.left = `${xPx.toFixed(1)}px`;
        boxEl.style.top = `${(yPx + 7 * scale).toFixed(1)}px`;
        boxEl.style.transform = `translate(-50%, -50%) perspective(950px) rotateX(${tiltDeg}deg) scale(${scale.toFixed(4)})`;
        boxEl.style.pointerEvents = progress >= 0.96 ? 'auto' : 'none';
      } else {
        boxEl.style.opacity = '0';
        boxEl.style.display = 'none';
        boxEl.style.pointerEvents = 'none';
      }
    }
  });

  const dustOpacity = Math.min(1, Math.max(0, (progress - 0.4) * 3));

  return (
    <group ref={roomGroupRef}>
      <group rotation={[0, -Math.PI * 0.5, 0]}>
        <group position={[-2.255, -1.456, 0.091]}>
          <primitive object={scene} />
        </group>
      </group>

      {progress > 0.4 && (
        <>
          <VolumetricLightBeam color={palette.lightBeamColor} opacity={dustOpacity} />
          <SandDust opacity={dustOpacity} beamColor={palette.lightBeamColor} />
          {/* Warm interior floor-bounce light so the ceiling and ceiling fan are clearly visible */}
          <pointLight
            position={[0.0, -0.35, -2.35]}
            intensity={2.6}
            color={palette.wallColor}
            distance={9}
          />
        </>
      )}
    </group>
  );
}

interface MurphBedroomSingularityProps {
  contactProgress: number; // 0.0 to 2.0
}

export default function MurphBedroomSingularity({ contactProgress }: MurphBedroomSingularityProps) {
  const reducedMotion = usePrefersReducedMotion();
  const mouseRef = useRef({ x: 0, y: 0 });
  const overlayBoxRef = useRef<HTMLDivElement>(null);
  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  const [xpPaletteId, setXpPaletteId] = useState<XpPaletteId>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('xpPalette') as XpPaletteId | null;
      if (p && XP_WINDOW_PALETTES[p]) return p;
    }
    return DEFAULT_XP_PALETTE_ID;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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

  const paletteId: PaletteId = DEFAULT_PALETTE_ID;
  const filterId: FilterId = BEDROOM_PALETTES[DEFAULT_PALETTE_ID].defaultFilter;
  const recolorStrength = DEFAULT_RECOLOR_STRENGTH;
  const filterStrength = DEFAULT_FILTER_STRENGTH;

  const activePalette = BEDROOM_PALETTES[paletteId];
  const activeFilter = BEDROOM_FILTERS[filterId];

  // Normalized room progress: 0.0 at contactProgress 1.0 -> 1.0 at contactProgress 2.0
  const roomProgress = THREE.MathUtils.clamp((contactProgress - 1.0) / 1.0, 0, 1);
  const containerOpacity = THREE.MathUtils.clamp((contactProgress - 0.96) / 0.04, 0, 1);
  const isVisible = contactProgress >= 0.95;

  // Keep the void background pure black; palette shadowColor stays inside the 3D room shadows
  const bgColor = '#000000';

  const cssFilter = useMemo(
    () => buildCssFilter(activeFilter, filterStrength),
    [activeFilter, filterStrength]
  );

  // Subtle inline SVG noise texture for 6-8% film grain
  const grainDataUri =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

  return (
    <div
      className="absolute inset-0 z-20 w-full h-full pointer-events-none transition-opacity duration-150"
      style={{
        backgroundColor: bgColor,
        opacity: containerOpacity,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {/* Slow brightness drift keyframes */}
      <style>{`
        @keyframes bedroomBrightnessDrift {
          0%, 100% { opacity: ${BRIGHTNESS_DRIFT_MIN}; }
          50% { opacity: ${BRIGHTNESS_DRIFT_MAX}; }
        }
      `}</style>

      {/* ================================================================= */}
      {/* STEP 2: FILTERED SCENE CONTAINER ONLY (UI / form cards stay outside) */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          filter: cssFilter,
          animation:
            !reducedMotion && filterStrength > 0.01
              ? `bedroomBrightnessDrift ${BRIGHTNESS_DRIFT_DURATION_SEC}s ease-in-out infinite`
              : 'none',
        }}
      >
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0, 4.2], fov: 46, near: 0.01, far: 200 }}
          gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
        >
          <color attach="background" args={[bgColor]} />

          {/* STEP 1: Non-black shadows + brightest light beam */}
          <ambientLight
            intensity={activePalette.ambientIntensity}
            color={activePalette.shadowColor}
          />
          <hemisphereLight
            args={[activePalette.wallColor, activePalette.shadowColor, activePalette.hemisphereIntensity]}
          />

          {/* Brightest element: Primary Light Beam */}
          <directionalLight
            position={[4.5, 6.5, 3.8]}
            intensity={activePalette.beamIntensity}
            color={activePalette.lightBeamColor}
          />
          <spotLight
            position={[2.8, 3.5, 2.2]}
            angle={0.55}
            penumbra={0.65}
            intensity={activePalette.beamIntensity * 1.3}
            color={activePalette.lightBeamColor}
            distance={14}
          />

          {/* Soft upward fill so the ceiling & underside of the fan aren't pitch dark */}
          <directionalLight
            position={[0, -5, 1]}
            intensity={0.75}
            color={activePalette.wallColor}
          />

          {/* Soft shadow-tinted fill so dark corners stay in palette shadow tone */}
          <directionalLight
            position={[-5, 3, -3]}
            intensity={0.95}
            color={activePalette.accentColor}
          />

          <React.Suspense fallback={null}>
            <RoomContent
              progress={roomProgress}
              palette={activePalette}
              recolorStrength={recolorStrength}
              mouseRef={mouseRef}
              reducedMotion={reducedMotion}
              overlayBoxRef={overlayBoxRef}
              isMobile={isMobile}
              isFieldFocused={isFieldFocused}
            />
          </React.Suspense>
        </Canvas>

        {/* Color Wash Overlay (soft-light or multiply) */}
        {filterStrength > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: activeFilter.washBackground,
              mixBlendMode: activeFilter.washBlendMode,
              opacity: activeFilter.washOpacity * filterStrength,
            }}
          />
        )}

        {/* VHS Memory Extras: Faint Scanlines & Edge Color Split */}
        {activeFilter.scanlines && filterStrength > 0.01 && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px, transparent 1px, transparent 3px)',
                opacity: activeFilter.scanlineOpacity * filterStrength,
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset ${(activeFilter.edgeSplitPx * filterStrength).toFixed(2)}px 0 0 rgba(255, 60, 120, 0.22), inset -${(activeFilter.edgeSplitPx * filterStrength).toFixed(2)}px 0 0 rgba(60, 220, 255, 0.22)`,
              }}
            />
          </>
        )}

        {/* Subtle Film Grain (7%) */}
        {filterStrength > 0.01 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: grainDataUri,
              mixBlendMode: 'overlay',
              opacity: FILM_GRAIN_OPACITY * filterStrength,
            }}
          />
        )}

        {/* Gentle Vignette fading into the black void */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 48%, #000000 100%)',
            opacity: VIGNETTE_OPACITY,
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* SIMPLE CONTACT BOX ON THE LAPTOP SCREEN (Appears instantly at max zoom, resolution-independent) */}
      {/* ================================================================= */}
      {/* ================================================================= */}
      {/* DESKTOP: XP CONTACT WINDOW LOCKED TO 3D LAPTOP SCREEN             */}
      {/* ================================================================= */}
      <div
        ref={overlayBoxRef}
        className="absolute z-30 origin-center transition-[transform] duration-200 ease-out"
        style={{
          display: 'none',
          width: '580px',
          height: '396px',
          pointerEvents: 'none',
        }}
      >
        <XpContactWindow
          paletteId={xpPaletteId}
          onPaletteChange={setXpPaletteId}
          reducedMotion={reducedMotion}
          onFieldFocusChange={setIsFieldFocused}
        />
      </div>

      {/* ================================================================= */}
      {/* MOBILE: FULL-WIDTH FLAT XP CONTACT WINDOW (No 3D tilt)            */}
      {/* ================================================================= */}
      {isMobile && roomProgress >= 0.68 && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center p-3 transition-opacity duration-300"
          style={{
            opacity: THREE.MathUtils.clamp((roomProgress - 0.68) / 0.10, 0, 1),
            pointerEvents: roomProgress >= 0.90 ? 'auto' : 'none',
          }}
        >
          <XpContactWindow
            paletteId={xpPaletteId}
            onPaletteChange={setXpPaletteId}
            isMobile
            reducedMotion={reducedMotion}
          />
        </div>
      )}
    </div>
  );
}

// Preload model
useGLTF.preload(MODEL_PATH);
