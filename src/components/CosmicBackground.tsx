import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmicBackgroundProps {
  scrollProgress: number; // 0 (top/hero) to 1 (bottom/contact)
  mousePos: { x: number; y: number };
}

// Procedural high-resolution circular glow star texture (eliminates square point artifacts)
function createCircleStarTexture(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const center = 32;
  const radius = 30;
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');      // Hot white center core
  gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)');  // Solid inner circle
  gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.55)');  // Soft inner aura
  gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.15)');  // Feathered stellar halo
  gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');    // 100% transparent edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function CosmicBackground({ scrollProgress, mousePos }: CosmicBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const mouseRef = useRef(mousePos);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2500);
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const starTexture = createCircleStarTexture();

    // Cosmic starlight color palette
    const palette = [
      new THREE.Color(0xffffff), // Crisp starlight white (dominant)
      new THREE.Color(0xffffff),
      new THREE.Color(0xf1f5f9), // Diamond ivory
      new THREE.Color(0xfef08a), // Warm stellar gold
      new THREE.Color(0x38bdf8), // Electric icy cyan
      new THREE.Color(0x818cf8), // Cosmic indigo
      new THREE.Color(0xc084fc), // Soft nebula lilac
      new THREE.Color(0xf472b6), // Stardust rose
    ];

    // Master group for coordinate alignment
    const universeGroup = new THREE.Group();
    scene.add(universeGroup);

    // =========================================================
    // LAYER 1: FINE DEEP STARDUST (4,800 tiny distant particles)
    // =========================================================
    const dustCount = 4800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      // Broad deep spatial distribution, strictly behind camera (Z: -120 to -1100)
      dustPositions[i3] = (Math.random() - 0.5) * 1500;
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 1500;
      dustPositions[i3 + 2] = -120 - Math.random() * 980;

      const col = palette[Math.floor(Math.random() * palette.length)];
      dustColors[i3] = col.r;
      dustColors[i3 + 1] = col.g;
      dustColors[i3 + 2] = col.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 3.0,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dustPoints = new THREE.Points(dustGeo, dustMat);
    universeGroup.add(dustPoints);

    // =========================================================
    // LAYER 2: RADIANT CIRCULAR STARS (1,800 prominent circular stars)
    // =========================================================
    const radiantCount = 1800;
    const radiantGeo = new THREE.BufferGeometry();
    const radiantPositions = new Float32Array(radiantCount * 3);
    const radiantColors = new Float32Array(radiantCount * 3);

    for (let i = 0; i < radiantCount; i++) {
      const i3 = i * 3;
      radiantPositions[i3] = (Math.random() - 0.5) * 1400;
      radiantPositions[i3 + 1] = (Math.random() - 0.5) * 1400;
      // Deep space Z to ensure no close stars flying past camera
      radiantPositions[i3 + 2] = -150 - Math.random() * 950;

      const col = palette[Math.floor(Math.random() * palette.length)];
      radiantColors[i3] = col.r;
      radiantColors[i3 + 1] = col.g;
      radiantColors[i3 + 2] = col.b;
    }

    radiantGeo.setAttribute('position', new THREE.BufferAttribute(radiantPositions, 3));
    radiantGeo.setAttribute('color', new THREE.BufferAttribute(radiantColors, 3));

    const radiantMat = new THREE.PointsMaterial({
      size: 6.5,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const radiantPoints = new THREE.Points(radiantGeo, radiantMat);
    universeGroup.add(radiantPoints);

    // Initial draw ranges: MAXIMUM at top purple section (all 6,600 stars active)
    let currentDust = dustCount;
    let currentRadiant = radiantCount;
    dustGeo.setDrawRange(0, currentDust);
    radiantGeo.setDrawRange(0, currentRadiant);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const scroll = scrollRef.current;
      const mouse = mouseRef.current;

      // 1. Dynamic Scroll-Based Star Count:
      // - Purple Section / Hero (scroll = 0): MAXIMUM stars (4,800 dust + 1,800 radiant = 6,600 stars)
      // - Below black box / About entry (scroll ~ 0.16): LOW stars (700 dust + 220 radiant = 920 stars)
      // - Scrolling further down (Projects -> Journey -> Bottom): Scales back up to HIGH towards the bottom
      let targetDust: number;
      let targetRadiant: number;

      if (scroll <= 0.16) {
        // From top purple section (MAXIMUM) down to below the black box (LOW)
        const t = Math.min(1, Math.max(0, (scroll - 0.02) / 0.14));
        targetDust = THREE.MathUtils.lerp(dustCount, 700, t);
        targetRadiant = THREE.MathUtils.lerp(radiantCount, 220, t);
      } else {
        // Below black box (LOW) ramping up to HIGH towards the bottom
        const t = (scroll - 0.16) / 0.84;
        const curve = Math.pow(t, 1.15);
        targetDust = THREE.MathUtils.lerp(700, dustCount, curve);
        targetRadiant = THREE.MathUtils.lerp(220, radiantCount, curve);
      }

      currentDust += (targetDust - currentDust) * 0.08;
      currentRadiant += (targetRadiant - currentRadiant) * 0.08;

      dustGeo.setDrawRange(0, Math.round(currentDust));
      radiantGeo.setDrawRange(0, Math.round(currentRadiant));

      // 2. Cosmic Motion (Zero stars swing close because all stars have Z <= -120 and rotation is bounded)
      // Roll rotation in screen plane
      universeGroup.rotation.z = elapsed * 0.006 + scroll * 0.12;
      // Gentle micro-tilt from cursor and scroll
      universeGroup.rotation.y = Math.sin(elapsed * 0.04) * 0.03 + mouse.x * 0.05;
      universeGroup.rotation.x = Math.cos(elapsed * 0.03) * 0.02 + mouse.y * 0.04;
      universeGroup.position.y = -scroll * 80;

      // 3. Smooth Camera Parallax
      camera.position.x += (mouse.x * 14 - camera.position.x) * 0.05;
      camera.position.y += (-mouse.y * 10 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, -300);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      radiantGeo.dispose();
      radiantMat.dispose();
      starTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}