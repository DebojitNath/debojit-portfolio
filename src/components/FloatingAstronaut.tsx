import AstronautScene from './AstronautScene';

interface FloatingAstronautProps {
  mousePos?: { x: number; y: number };
}

export default function FloatingAstronaut({ mousePos }: FloatingAstronautProps) {
  return (
    <div 
      className="relative w-full h-[550px] sm:h-[650px] lg:h-[720px] xl:h-[800px] flex items-center justify-center overflow-visible pointer-events-none"
      style={{
        transform: mousePos ? `translate(${mousePos.x * 20}px, ${mousePos.y * 14}px)` : undefined,
        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <AstronautScene className="w-full h-full pointer-events-none" />
    </div>
  );
}
