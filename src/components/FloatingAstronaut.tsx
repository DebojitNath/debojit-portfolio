import AstronautScene from './AstronautScene';

interface FloatingAstronautProps {
  mousePos?: { x: number; y: number };
}

export default function FloatingAstronaut({ mousePos }: FloatingAstronautProps) {
  return (
    <div 
      className="relative w-full h-full min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] xl:min-h-[720px] flex items-center justify-center overflow-visible pointer-events-none"
      style={{
        transform: mousePos ? `translate(${mousePos.x * 18}px, ${mousePos.y * 12}px)` : undefined,
        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <AstronautScene className="w-full h-full pointer-events-none" />
    </div>
  );
}
