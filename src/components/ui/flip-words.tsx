import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';

export interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 2800,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [wordWidths, setWordWidths] = useState<number[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Track tab visibility
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Measure word dimensions to allow smooth pill width transitions and locked height (no layout shift)
  const measureWords = useCallback(() => {
    const widths: number[] = [];
    let tallest = 0;

    measureRefs.current.forEach((el) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        widths.push(Math.ceil(rect.width));
        if (rect.height > tallest) tallest = Math.ceil(rect.height);
      }
    });

    if (widths.length === words.length) {
      setWordWidths(widths);
      if (tallest > 0) setMaxHeight(tallest);
    }
  }, [words]);

  useLayoutEffect(() => {
    measureWords();
  }, [measureWords]);

  useEffect(() => {
    window.addEventListener('resize', measureWords);
    return () => window.removeEventListener('resize', measureWords);
  }, [measureWords]);

  // Main cycle timer
  useEffect(() => {
    // If reduced motion is preferred, keep static on the first word
    if (prefersReducedMotion || words.length <= 1) return;

    // Pause when hovered, focused, tab hidden, or currently flipping
    if (isHovered || isFocused || isTabHidden || isFlipping) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      const next = (currentIndex + 1) % words.length;
      setNextIndex(next);
      setIsFlipping(true);

      animTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(next);
        setNextIndex(null);
        setIsFlipping(false);
      }, 550); // 550ms animation duration
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, duration, isFlipping, isFocused, isHovered, isTabHidden, prefersReducedMotion, words.length]);

  // Clean up animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Active word width (either next word if flipping, or current word)
  const targetIndex = isFlipping && nextIndex !== null ? nextIndex : currentIndex;
  const currentWordWidth = wordWidths[targetIndex];

  return (
    <>
      {/* Dynamic Keyframes for smooth vertical 3D flip card rotation */}
      <style>{`
        @keyframes flipOutUp {
          0% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          100% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
        }
        @keyframes flipInDown {
          0% {
            transform: rotateX(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }
        .flip-word-container {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        .flip-word-out {
          animation: flipOutUp 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: 50% 50% -0.5em;
          backface-visibility: hidden;
        }
        .flip-word-in {
          animation: flipInDown 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: 50% 50% -0.5em;
          backface-visibility: hidden;
        }
      `}</style>

      {/* Hidden Measurer layer to accurately calculate natural pixel sizes */}
      <span
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] invisible pointer-events-none opacity-0 select-none whitespace-nowrap font-extrabold tracking-tight text-[clamp(1.15rem,5.2vw,1.875rem)] sm:text-5xl md:text-6xl"
      >
        {words.map((word, idx) => (
          <span
            key={`measurer-${idx}`}
            ref={(el) => {
              measureRefs.current[idx] = el;
            }}
            className="inline-block px-4 sm:px-6 py-1.5 sm:py-2"
          >
            {word}
          </span>
        ))}
      </span>

      {/* Visible Flip Pill */}
      <span
        tabIndex={0}
        role="button"
        aria-label="Toggle pause on click or hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`flip-word-container relative inline-flex items-center justify-center rounded-2xl bg-white text-[#0a0518] font-extrabold tracking-tight shadow-2xl shadow-purple-500/30 transform hover:-rotate-1 transition-all duration-500 ease-out cursor-default select-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#0a0518] ${className}`}
        style={{
          width: currentWordWidth ? `${currentWordWidth}px` : 'auto',
          height: maxHeight ? `${maxHeight}px` : 'auto',
          minHeight: '1.4em',
          transitionProperty: 'width, transform',
          transitionDuration: '550ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* If reduced motion is preferred, render the first word statically */}
        {prefersReducedMotion ? (
          <span className="whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2">
            {words[0]}
          </span>
        ) : (
          <span className="relative w-full h-full flex items-center justify-center overflow-visible">
            {/* Outgoing word during flipping, or stationary active word */}
            <span
              key={`current-${currentIndex}`}
              className={`whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 ${
                isFlipping ? 'flip-word-out absolute' : 'inline-block'
              }`}
            >
              {words[currentIndex]}
            </span>

            {/* Incoming word during flipping */}
            {isFlipping && nextIndex !== null && (
              <span
                key={`next-${nextIndex}`}
                className="whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 flip-word-in absolute"
              >
                {words[nextIndex]}
              </span>
            )}
          </span>
        )}
      </span>
    </>
  );
};

export default FlipWords;
