import { useEffect, useRef, useState } from 'react';
import BoxLoader from './ui/box-loader';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const realProgressRef = useRef(0);

  // Real Asset Preloader (Astronaut model + Planet & Mountain layers)
  useEffect(() => {
    let isCancelled = false;

    const preloadAll = async () => {
      let modelPercent = 0;
      let imagesPercent = 0;

      const images = [
        '/shapes/planet.png',
        '/shapes/mountain1.png',
        '/shapes/mountain2.png',
        '/shapes/mountain3.png',
      ];
      let loadedImages = 0;

      const loadImagesPromise = Promise.all(
        images.map(
          (src) =>
            new Promise<void>((resolve) => {
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
            })
        )
      );

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

  // Wait for assets + minimum display time, then fade out cleanly
  useEffect(() => {
    let animId: number;
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;
    let doneTimer: ReturnType<typeof setTimeout> | null = null;
    const startTime = performance.now();
    let completeTriggered = false;
    const minTime = 1600;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (realProgressRef.current >= 100 && elapsed >= minTime && !completeTriggered) {
        completeTriggered = true;
        setFadeOut(true);
        fadeTimer = setTimeout(() => {
          setIsDone(true);
          onComplete?.();
        }, 650);
        return;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (fadeTimer) clearTimeout(fadeTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Lock all scroll mechanisms (wheel, touch, keyboard, overflow) while loading
  useEffect(() => {
    if (isDone) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      const blockedKeys = [
        'Space',
        'PageUp',
        'PageDown',
        'End',
        'Home',
        'ArrowLeft',
        'ArrowUp',
        'ArrowRight',
        'ArrowDown',
      ];
      if (blockedKeys.includes(e.code) || blockedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, { passive: false });

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isDone]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-650 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ transitionDuration: '650ms' }}
    >
      <BoxLoader />
    </div>
  );
}
