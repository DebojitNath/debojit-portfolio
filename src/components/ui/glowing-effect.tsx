import React, { useEffect, useRef, useState, useCallback } from "react";

export interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  blur = 6,
  inactiveZone = 0.01,
  proximity = 64,
  spread = 40,
  variant = "default",
  glow = true,
  className = "",
  disabled = false,
  movementDuration = 0.2,
  borderWidth = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [opacity, setOpacity] = useState(0);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (disabled) return;
      const el = containerRef.current?.parentElement;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Distance from mouse to the card rectangle
      const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
      const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= proximity) {
        // Compute relative coordinate on the card
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Proximity fade factor (1 at card edge, 0 at proximity distance)
        const factor = Math.max(0, 1 - dist / proximity);
        setPosition({ x, y });
        setOpacity(factor);
      } else {
        setOpacity(0);
      }
    },
    [disabled, proximity]
  );

  useEffect(() => {
    if (disabled) {
      setOpacity(0);
      return;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [disabled, handlePointerMove]);

  if (disabled) return null;

  // Cosmic color gradient matching the portfolio palette
  const gradientColor =
    variant === "white"
      ? `radial-gradient(${spread * 2.8}px circle at ${position?.x ?? 0}px ${position?.y ?? 0}px, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.3) 40%, transparent 100%)`
      : `radial-gradient(${spread * 3.2}px circle at ${position?.x ?? 0}px ${position?.y ?? 0}px, #f97316 0%, #ec4899 30%, #a855f7 55%, #06b6d4 80%, transparent 100%)`;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-[1px] rounded-[inherit] overflow-hidden transition-opacity duration-300 ease-out z-0 select-none ${className}`}
      style={{
        opacity,
      }}
    >
      {/* Ambient outer bloom glow */}
      {glow && (
        <div
          className="absolute -inset-1 rounded-[inherit] pointer-events-none opacity-70"
          style={{
            background: gradientColor,
            filter: `blur(${blur}px)`,
            transition: `opacity ${movementDuration}s ease-out`,
          }}
        />
      )}

      {/* Crisp masked border trace following cursor */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background: gradientColor,
          padding: `${borderWidth}px`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
};

export default GlowingEffect;
