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

  // Aceternity UI style letter-by-letter kinetic animation renderer
  const renderStaggeredLetters = (text: string, isIncoming: boolean) => {
    return (
      <span className="inline-flex items-center">
        {text.split(' ').map((wordPart, wordIdx, allWords) => (
          <span key={`w-${wordIdx}`} className="inline-flex whitespace-nowrap">
            {wordPart.split('').map((char, charIdx) => {
              const delay = isIncoming
                ? wordIdx * 0.12 + charIdx * 0.032
                : 0;
              return (
                <span
                  key={`c-${charIdx}`}
                  className={`inline-block ${isIncoming ? 'letter-flip-in' : ''}`}
                  style={
                    isIncoming
                      ? {
                          animation: 'aceternityLetterIn 0.38s cubic-bezier(0.16, 1, 0.3, 1) both',
                          animationDelay: `${delay}s`
                        }
                      : undefined
                  }
                >
                  {char}
                </span>
              );
            })}
            {wordIdx < allWords.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      {/* Aceternity UI Staggered Motion Blur & Glass Shimmer Keyframes */}
      <style>{`
        @keyframes aceternityWordOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-24px) scale(0.96);
            filter: blur(8px);
          }
        }
        @keyframes aceternityLetterIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.88);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes glassShimmerSweep {
          0% {
            transform: translateX(-120%) skewX(-15deg);
            opacity: 0;
          }
          20% {
            opacity: 0.65;
          }
          100% {
            transform: translateX(250%) skewX(-15deg);
            opacity: 0;
          }
        }
        .flip-word-out {
          animation: aceternityWordOut 420ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Hidden Measurer layer to accurately calculate natural pixel sizes */}
      <span
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] invisible pointer-events-none opacity-0 select-none whitespace-nowrap font-extrabold tracking-tight text-[clamp(1.05rem,4.5vw,1.75rem)] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
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

      {/* Futuristic Cosmic Glass Capsule (High-Contrast Obsidian Frosted Glass) */}
      <span
        tabIndex={0}
        role="button"
        aria-label="Toggle pause on click or hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`group relative inline-flex items-center justify-center h-full rounded-2xl backdrop-blur-3xl bg-black/65 hover:bg-black/75 border border-white/25 hover:border-white/40 border-t-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.3)] text-white font-extrabold tracking-tight transform hover:scale-[1.015] hover:-rotate-0.5 transition-all duration-500 ease-out cursor-default select-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-[#030308] ${className}`}
        style={{
          width: currentWordWidth ? `${currentWordWidth}px` : 'auto',
          transitionProperty: 'width, transform, background-color, border-color, box-shadow',
          transitionDuration: '500ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Ambient Cosmic Aura Glow behind the glass capsule */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500/25 via-purple-500/35 to-cyan-400/25 blur-xl opacity-80 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none" />

        {/* Top Gloss Reflection for real glass depth */}
        <div className="absolute inset-x-0 top-0 h-[45%] rounded-t-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        {/* Dynamic Glass Shimmer Light Sweep on each word change */}
        {isFlipping && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[glassShimmerSweep_0.65s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
          </div>
        )}

        {/* Permanent in-flow Ghost Spacer guaranteeing ZERO baseline or vertical height shifts */}
        <span
          className="invisible select-none pointer-events-none opacity-0 whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 leading-none"
          aria-hidden="true"
        >
          {words[targetIndex]}
        </span>

        {/* Word Container */}
        {prefersReducedMotion ? (
          <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-none">
            {words[0]}
          </span>
        ) : (
          <span className="absolute inset-0 flex items-center justify-center overflow-visible z-20 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-none">
            {/* Outgoing word during transition */}
            <span
              key={`current-${currentIndex}`}
              className={`whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 absolute ${
                isFlipping ? 'flip-word-out' : 'opacity-100'
              }`}
            >
              {renderStaggeredLetters(words[currentIndex], false)}
            </span>

            {/* Incoming word with Aceternity UI kinetic letter blur slide-in */}
            {isFlipping && nextIndex !== null && (
              <span
                key={`next-${nextIndex}`}
                className="whitespace-nowrap px-4 sm:px-6 py-1.5 sm:py-2 absolute text-white"
              >
                {renderStaggeredLetters(words[nextIndex], true)}
              </span>
            )}
          </span>
        )}
      </span>
    </>
  );
};

export default FlipWords;
