import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLHalftoneProps {
  color1?: string; // e.g. '#c084fc' or '#FBBF24'
  color2?: string; // e.g. '#818cf8' or '#FFFFFF'
  gridSize?: number;
}

export default function WebGLHalftone({
  color1 = '#c084fc',
  color2 = '#ffedd5',
  gridSize = 24,
}: WebGLHalftoneProps) {
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
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth || 300;
      const height = parent.clientHeight || 300;
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

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const scales: number[] = [];

    const spacing = 0.12;
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let y = -gridSize; y <= gridSize; y++) {
        positions.push(x * spacing, y * spacing, 0);
        scales.push(1);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(color1) },
        color2: { value: new THREE.Color(color2) },
      },
      vertexShader: `
        attribute float scale;
        varying vec2 vUv;
        varying float vScale;
        uniform float time;
        
        void main() {
          vUv = position.xy;
          float dist = length(position.xy);
          // Wave pulsating propagation
          float animatedScale = scale * (sin(dist * 5.0 - time * 2.2) * 0.5 + 0.5);
          vScale = animatedScale;
          
          gl_PointSize = animatedScale * 6.5; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying float vScale;
        
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;
          
          vec3 finalColor = mix(color2, color1, (vUv.y + 1.0) * 0.5);
          gl_FragColor = vec4(finalColor, vScale * 0.95);
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
  }, [color1, color2, gridSize]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

