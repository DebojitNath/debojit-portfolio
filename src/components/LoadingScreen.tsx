import React, { useEffect, useRef, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const TICKS = 56;
const MARK_EVERY = 8;
const barW = 604;
const tickW = 5.4;
const gap = (barW - TICKS * tickW) / (TICKS - 1);
const pitch = tickW + gap;

const PHASES: [number, string][] = [
  [0, 'INITIALIZING CORE SYSTEMS'],
  [24, 'ESTABLISHING SECURE UPLINK'],
  [52, 'SYNCHRONIZING NODE ARRAY'],
  [78, 'DECRYPTING PAYLOAD STREAM'],
  [100, 'UPLINK ESTABLISHED'],
];

function getPhase(pct: number): string {
  let text = PHASES[0][1];
  for (const [k, v] of PHASES) {
    if (pct >= k) text = v;
  }
  return text;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [scale, setScale] = useState(1);
  const [percent, setPercent] = useState(0);
  const [dots, setDots] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const hazeRef = useRef<HTMLElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const grain2Ref = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLElement | null)[]>([]);

  const realProgressRef = useRef(0);
  const displayProgressRef = useRef(0);
  const lastLitRef = useRef(-1);

  // 1. Viewport dynamic scale to fit 1200x800 design
  useEffect(() => {
    const handleResize = () => {
      const s = Math.min(window.innerWidth / 1200, window.innerHeight / 800);
      setScale(s);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Procedural noise generation (exactly as in specification)
  useEffect(() => {
    const N = 160;
    const make = (fn: (d: Uint8ClampedArray, o: number) => void) => {
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const ctx = c.getContext('2d');
      if (!ctx) return '';
      const img = ctx.createImageData(N, N);
      const d = img.data;
      for (let i = 0; i < N * N; i++) fn(d, i * 4);
      ctx.putImageData(img, 0, 0);
      return c.toDataURL();
    };

    const g = () => (Math.random() + Math.random() + Math.random() + Math.random()) / 4;

    if (grainRef.current) {
      const url1 = make((d, o) => {
        const v = 128 + (g() - 0.5) * 300;
        d[o] = d[o + 1] = d[o + 2] = Math.max(0, Math.min(255, v));
        d[o + 3] = 255;
      });
      grainRef.current.style.backgroundImage = `url(${url1})`;
    }

    if (grain2Ref.current) {
      const url2 = make((d, o) => {
        const v = Math.random();
        d[o] = d[o + 1] = d[o + 2] = 255;
        d[o + 3] = v < 0.86 ? 0 : Math.round(((v - 0.86) / 0.14) * 190);
      });
      grain2Ref.current.style.backgroundImage = `url(${url2})`;
    }
  }, []);

  // 3. Real Asset Preloader (Astronaut 46.6MB model + Planet & Mountain layers)
  useEffect(() => {
    let isCancelled = false;

    const preloadAll = async () => {
      let modelPercent = 0;
      let imagesPercent = 0;

      // Track images
      const images = [
        '/shapes/planet.png',
        '/shapes/mountain1.png',
        '/shapes/mountain2.png',
        '/shapes/mountain3.png',
      ];
      let loadedImages = 0;

      const loadImagesPromise = Promise.all(
        images.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              loadedImages++;
              imagesPercent = (loadedImages / images.length) * 100;
              resolve();
            };
            img.onerror = () => {
              loadedImages++;
              imagesPercent = (loadedImages / images.length) * 100;
              resolve();
            };
          });
        })
      );

      // Track 46.6MB Astronaut model stream
      const loadModelPromise = (async () => {
        try {
          const response = await fetch('/models/astronaut.glb');
          if (!response.body) {
            modelPercent = 100;
            return;
          }
          const contentLength = response.headers.get('content-length');
          const totalBytes = contentLength ? parseInt(contentLength, 10) : 46616640;
          const reader = response.body.getReader();
          let loadedBytes = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done || isCancelled) break;
            loadedBytes += value?.length || 0;
            modelPercent = Math.min(100, (loadedBytes / totalBytes) * 100);
            if (!isCancelled) {
              realProgressRef.current = modelPercent * 0.85 + imagesPercent * 0.15;
            }
          }
          modelPercent = 100;
        } catch (err) {
          console.warn('Preload stream fallback:', err);
          modelPercent = 100;
        }
      })();

      await Promise.all([loadImagesPromise, loadModelPromise]);
      if (!isCancelled) {
        realProgressRef.current = 100;
      }
    };

    preloadAll();

    // Safety fallback: ensure loading concludes within 12s even on stalled connections
    const timeout = setTimeout(() => {
      realProgressRef.current = 100;
    }, 12000);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  // 4. Smooth Animation Loop & Progress Timeline
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();
    let completeTriggered = false;

    // Minimum cinematic playback time (2.6s) so on fast connections it doesn't flash
    const minTime = 2600;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const minProgress = Math.min(100, (elapsed / minTime) * 100);
      const targetProgress = Math.max(minProgress * 0.7, realProgressRef.current);

      // Ease display progress towards target
      if (displayProgressRef.current < targetProgress) {
        const step = Math.max(0.4, (targetProgress - displayProgressRef.current) * 0.08);
        displayProgressRef.current = Math.min(targetProgress, displayProgressRef.current + step);
      }

      // If assets are 100% loaded and min time elapsed, reach 100%
      if (realProgressRef.current >= 100 && elapsed >= minTime) {
        displayProgressRef.current = Math.min(100, displayProgressRef.current + 1.2);
      }

      const shown = Math.min(100, Math.round(displayProgressRef.current));
      setPercent(shown);

      // Skewed ticks lighting
      const lit = Math.round((shown / 100) * TICKS);
      if (lit !== lastLitRef.current) {
        for (let i = 0; i < TICKS; i++) {
          const el = tickRefs.current[i];
          if (!el) continue;
          const on = i < lit;
          if (el.classList.contains('on') !== on) {
            el.classList.toggle('on', on);
          }
        }

        if (lit > lastLitRef.current && lastLitRef.current >= 0 && lit > 0) {
          const flashedTick = tickRefs.current[lit - 1];
          if (flashedTick) {
            flashedTick.classList.remove('flash');
            void flashedTick.offsetWidth;
            flashedTick.classList.add('flash');
          }
          if (hazeRef.current) {
            hazeRef.current.classList.remove('pulse');
            void hazeRef.current.offsetWidth;
            hazeRef.current.classList.add('pulse');
          }
        }

        if (hazeRef.current) {
          const litWidth = lit > 0 ? (lit - 1) * pitch + tickW + gap / 2 : 0;
          hazeRef.current.style.setProperty('--lit-w', `${litWidth}px`);
        }

        if (lit === TICKS && plateRef.current) {
          plateRef.current.classList.remove('hit');
          void plateRef.current.offsetWidth;
          plateRef.current.classList.add('hit');
        }

        lastLitRef.current = lit;
      }

      // Terminal dots animation
      const d = shown >= 100 ? 0 : Math.floor((elapsed / 380) % 4);
      setDots('...'.slice(0, d));

      // Completion sequence
      if (shown >= 100 && !completeTriggered) {
        completeTriggered = true;
        // Hold for 700ms at UPLINK ESTABLISHED, then dissolve
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 650);
        }, 700);
      }

      if (!completeTriggered || shown < 100) {
        animId = requestAnimationFrame(update);
      }
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  // Lock body scroll while loading
  useEffect(() => {
    if (!isDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDone]);

  if (isDone) return null;

  const currentPhase = getPhase(percent);

  return (
    <div
      ref={containerRef}
      className={`uplink-container ${fadeOut ? 'fade-out' : ''}`}
      style={{ '--s': scale } as React.CSSProperties}
    >
      <div className="pool" />

      <div className="scene">
        <div className="stage" ref={stageRef}>
          {/* Progress glow haze */}
          <div className="haze">
            <i ref={hazeRef} />
          </div>

          {/* Readout plate & corner brackets */}
          <div className="plate" ref={plateRef} />
          <div className="brk tr" />
          <div className="brk bl" />
          <div className="readout">
            <b id="num">{percent}</b>
            <u>%</u>
          </div>

          {/* Uplink label, tick progress bar, and status */}
          <div className="barlabel">UPLINK</div>
          <div className="bar">
            {Array.from({ length: TICKS }).map((_, i) => (
              <i
                key={i}
                ref={(el) => {
                  tickRefs.current[i] = el;
                }}
                className={`tick ${(i + 1) % MARK_EVERY === 0 ? 'mk' : ''}`}
              />
            ))}
          </div>

          <div className="status">
            {currentPhase}
            <span className="dots">{dots}</span>
          </div>

          {/* Corner target reticles */}
          <div className="marker m-tl">
            <i className="h a-h" /><i className="v a-v" />
            <i className="h b-h" /><i className="v b-v" />
            <i className="h c-h" /><i className="v c-v" />
            <i className="h d-h" /><i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="marker m-tr">
            <i className="h a-h" /><i className="v a-v" />
            <i className="h b-h" /><i className="v b-v" />
            <i className="h c-h" /><i className="v c-v" />
            <i className="h d-h" /><i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="marker m-bl">
            <i className="h a-h" /><i className="v a-v" />
            <i className="h b-h" /><i className="v b-v" />
            <i className="h c-h" /><i className="v c-v" />
            <i className="h d-h" /><i className="v d-v" />
            <i className="dia" />
          </div>
          <div className="marker m-br">
            <i className="h a-h" /><i className="v a-v" />
            <i className="h b-h" /><i className="v b-v" />
            <i className="h c-h" /><i className="v c-v" />
            <i className="h d-h" /><i className="v d-v" />
            <i className="dia" />
          </div>

          {/* Side telemetry rails */}
          <div className="rail left">
            <div className="wire" />
            <div className="cap a" />
            <div className="cap b" />
            <div className="mod">
              <div className="hatch" />
              <div className="ret" />
              <div className="dot" />
              <div className="slab" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
            </div>
          </div>

          <div className="rail right">
            <div className="wire" />
            <div className="cap a" />
            <div className="cap b" />
            <div className="mod">
              <div className="hatch" />
              <div className="ret" />
              <div className="dot" />
              <div className="slab" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
              <i className="led" />
            </div>
          </div>
        </div>
      </div>

      {/* CRT scanlines & analog noise overlays */}
      <div className="scan" />
      <div className="grain mul" ref={grainRef} />
      <div className="grain add" ref={grain2Ref} />
    </div>
  );
}
