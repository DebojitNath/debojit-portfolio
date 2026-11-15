import AstronautScene from './AstronautScene';

interface FloatingAstronautProps {
  mousePos?: { x: number; y: number };
}

export default function FloatingAstronaut({ mousePos }: FloatingAstronautProps) {
  return (
    <div 
      className="relative w-[140%] sm:w-[150%] -left-[8%] sm:-left-[10%] h-[560px] sm:h-[640px] flex items-center justify-center overflow-visible mt-2 sm:mt-4 lg:mt-6 pointer-events-none"
      style={{
        transform: mousePos ? `translate(${mousePos.x * 28}px, ${mousePos.y * 20}px)` : undefined,
        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <AstronautScene className="w-full h-full pointer-events-none" />
    </div>
  );
}
