import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ShaderAnimationProps {
  isActive?: boolean;
  className?: string;
}

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359

  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  float random(in float x) {
    return fract(sin(x) * 1e4);
  }

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  varying vec2 vUv;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec2 fMosaicScal = vec2(4.0, 2.0);
    vec2 vScreenSize = vec2(256.0, 256.0);
    uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
    uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

    float t = time * 0.06 + random(uv.x) * 0.4;
    float lineWidth = 0.0008;

    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 1.0 - length(uv));
      }
    }

    gl_FragColor = vec4(color[2], color[1], color[0], 1.0);
  }
`;

export function ShaderAnimation({ isActive = true, className = '' }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(isActive);
  const loopStateRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.Camera | null;
    uniforms: {
      time: { value: number };
      resolution: { value: THREE.Vector2 };
    } | null;
    animationId: number | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    isActiveRef.current = isActive;
    const state = loopStateRef.current;
    if (isActive && state.renderer && state.scene && state.camera && state.uniforms && state.animationId === null) {
      const animate = () => {
        if (!isActiveRef.current || !state.renderer || !state.scene || !state.camera || !state.uniforms) {
          state.animationId = null;
          return;
        }
        state.animationId = requestAnimationFrame(animate);
        state.uniforms.time.value += 0.05;
        state.renderer.render(state.scene, state.camera);
      };
      animate();
    }
  }, [isActive]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: false, powerPreference: 'high-performance' });
    } catch {
      geometry.dispose();
      material.dispose();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    loopStateRef.current = {
      renderer,
      scene,
      camera,
      uniforms,
      animationId: null,
    };

    const onResize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height, false);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onResize();
    window.addEventListener('resize', onResize, false);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(container);
    }

    const animate = () => {
      if (!isActiveRef.current) {
        loopStateRef.current.animationId = null;
        return;
      }
      loopStateRef.current.animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };

    if (isActiveRef.current) {
      animate();
    }

    return () => {
      if (loopStateRef.current.animationId !== null) {
        cancelAnimationFrame(loopStateRef.current.animationId);
        loopStateRef.current.animationId = null;
      }
      window.removeEventListener('resize', onResize, false);
      resizeObserver?.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      loopStateRef.current.renderer = null;
      loopStateRef.current.scene = null;
      loopStateRef.current.camera = null;
      loopStateRef.current.uniforms = null;
    };
  }, []);

  return <div ref={containerRef} className={`w-full h-full absolute inset-0 ${className}`} />;
}
