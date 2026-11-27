import React from 'react';

interface BlurRevealTextProps {
  text: string;
  show: boolean;
  baseDelayMs?: number;
  stepDelayMs?: number;
  className?: string;
}

export function BlurRevealText({
  text,
  show,
  baseDelayMs = 80,
  stepDelayMs = 35,
  className = '',
}: BlurRevealTextProps) {
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <span className={className}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.split('').map((char, cIdx) => {
            const delay = baseDelayMs + charIndex * stepDelayMs;
            charIndex++;
            return (
              <span
                key={cIdx}
                className="inline-block"
                style={{
                  opacity: show ? 1 : 0,
                  filter: show ? 'blur(0px)' : 'blur(14px)',
                  transform: show ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.95)',
                  transitionProperty: 'opacity, filter, transform',
                  transitionDuration: '650ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${delay}ms`,
                  willChange: 'opacity, filter, transform',
                }}
              >
                {char}
              </span>
            );
          })}
          {wIdx < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
