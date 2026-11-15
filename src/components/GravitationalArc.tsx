import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GravitationalArc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const resize = () => {
      const width = window.innerWidth;
      const height = 550;
      renderer.setSize(width, height, false);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      const aspect = width / height;
      camera.left = -aspect;
      camera.right = aspect;
      camera.bottom = -1;
      camera.top = 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);
    resize();

    // High density grid spanning full width
    const cols = 180;
    const rows = 55;
    const count = cols * rows;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);

    let idx = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // u from -aspect*1.4 to aspect*1.4
        const u = (x / (cols - 1)) * 2 - 1; // normalized -1 to 1
        const v = y / (rows - 1); // 0 (bottom) to 1 (top)

        const i3 = idx * 3;
        positions[i3] = u * 3.2; // Wide span covering all screens
        positions[i3 + 1] = v * 2 - 1; // -1 to 1
        positions[i3 + 2] = 0;

        const i2 = idx * 2;
        uvs[i2] = u * 1.6;
        uvs[i2 + 1] = v;

        idx++;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        arcColor1: { value: new THREE.Color('#9333ea') }, // Deep electric violet
        arcColor2: { value: new THREE.Color('#38bdf8') }, // Bright cyan/white highlight
        coreColor: { value: new THREE.Color('#f43f5e') }, // Sunset coral accent
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vIntensity;
        uniform float time;

        void main() {
          vUv = uv;

          // Massive black hole center peeking from BELOW the bottom screen edge (0.0, -0.7)
          vec2 center = vec2(0.0, -0.65);
          float dist = distance(vUv, center);
          
          // Large radius so it sweeps across the full width (left and right)
          float arcRadius = 1.35;
          float arcThickness = 0.35;

          float diff = abs(dist - arcRadius);
          float intensity = smoothstep(arcThickness, 0.0, diff);

          // Dynamic wave ripple along the event horizon curve
          float wave = sin(vUv.x * 4.5 - time * 1.8) * 0.18;
          intensity = clamp(intensity + wave * intensity, 0.0, 1.0);

          vIntensity = intensity;

          // Point sizes scale dramatically near the rim (up to 8px)
          gl_PointSize = mix(0.5, 8.0, intensity);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 arcColor1;
        uniform vec3 arcColor2;
        uniform vec3 coreColor;
        varying vec2 vUv;
        varying float vIntensity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;

          // Discard very faint dots to maintain crisp black singularity
          if (vIntensity < 0.05) discard;

          // Three-color gradient along the curve
          vec3 finalColor = mix(arcColor1, arcColor2, vIntensity);
          if (vIntensity > 0.75) {
            finalColor = mix(finalColor, coreColor, (vIntensity - 0.75) * 4.0);
          }

          gl_FragColor = vec4(finalColor, vIntensity * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      material.uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] pointer-events-none overflow-hidden flex items-end justify-center">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Deep purple/magenta ambient underglow rising from the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-900/30 via-indigo-950/20 to-transparent blur-[80px] pointer-events-none" />

      {/* The pitch-black event horizon silhouette peaking from below */}
      <div 
        className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[80vw] h-[350px] rounded-t-[50%] bg-[#06040d] border-t border-purple-500/30 shadow-[0_-25px_70px_rgba(147,51,234,0.35)] pointer-events-none z-10"
      />
    </div>
  );
}
