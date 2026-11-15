import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLLinesProps {
  color?: number;
}

export default function WebGLLines({ color = 0xffffff }: WebGLLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth || 300;
      const height = parent.clientHeight || 300;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);
    resize();

    camera.position.z = 4.2;

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.65,
    });

    const particlesCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      const r = 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const index: number[] = [];
    for (let i = 0; i < particlesCount; i++) {
      for (let j = i + 1; j < particlesCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 1.35) {
          index.push(i, j);
        }
      }
    }
    geometry.setIndex(index);

    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);

    // Subtle node dots at vertices
    const dotMat = new THREE.PointsMaterial({
      color,
      size: 3,
      transparent: true,
      opacity: 0.9,
    });
    const dots = new THREE.Points(geometry, dotMat);
    group.add(dots);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      group.rotation.y += 0.003;
      group.rotation.x += 0.0015;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dotMat.dispose();
    };
  }, [color]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

