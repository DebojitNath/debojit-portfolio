import React, { useState, useEffect } from "react";
import { ZoomIn, X } from "lucide-react";

export interface CardType {
  title: string;
  src: string;
  subtitle?: string;
}

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    onSelect,
  }: {
    card: CardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    onSelect: (card: CardType) => void;
  }) => {
    const isHovered = hovered === index;
    const isFaded = hovered !== null && !isHovered;

    return (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => onSelect(card)}
        className={`group relative rounded-2xl bg-neutral-900/90 border border-white/10 hover:border-orange-500/40 overflow-hidden h-64 sm:h-72 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer shadow-xl shadow-black/60 ${
          isFaded ? "blur-[2.5px] scale-[0.98] opacity-50" : "scale-100 opacity-100"
        }`}
      >
        {/* Image layer */}
        <img
          src={card.src}
          alt={card.title}
          loading="lazy"
          className="object-cover object-center absolute inset-0 w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Ambient top & bottom darkening for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 pointer-events-none" />

        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Hover zoom indicator pill */}
        <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/15 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md">
          <ZoomIn className="w-4 h-4 text-orange-400" />
        </div>

        {/* Caption & Title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end pointer-events-none">
          {card.subtitle && (
            <span className="text-[11px] font-mono uppercase tracking-wider text-orange-400 font-semibold mb-1 drop-shadow-md">
              {card.subtitle}
            </span>
          )}
          <div className="text-base sm:text-lg font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-sans leading-snug">
            {card.title}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "FocusCard";

export function FocusCards({ cards }: { cards: CardType[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCard(null);
    };
    if (selectedCard) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [selectedCard]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {cards.map((card, index) => (
          <Card
            key={`${card.title}-${index}`}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onSelect={setSelectedCard}
          />
        ))}
      </div>

      {/* Cosmic Lightbox Modal for Full-Resolution Viewing */}
      {selectedCard && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCard(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[90vh] w-full bg-neutral-950 border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
              <div>
                {selectedCard.subtitle && (
                  <span className="text-xs font-mono uppercase tracking-widest text-orange-400 block">
                    {selectedCard.subtitle}
                  </span>
                )}
                <h4 className="text-lg font-bold text-white font-sans">
                  {selectedCard.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-auto">
              <img
                src={selectedCard.src}
                alt={selectedCard.title}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default FocusCards;
