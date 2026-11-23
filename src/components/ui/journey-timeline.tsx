import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, ExternalLink } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";

export interface JourneyImage {
  src: string;
  caption: string;
}

export interface JourneyMilestone {
  id: string;
  date: string;
  category: string;
  accent: "orange" | "purple" | "cyan" | "teal";
  title: string;
  description: string;
  images?: JourneyImage[];
}

interface ImageSliderProps {
  images: JourneyImage[];
  title: string;
  isCardHovered: boolean;
  onOpenLightbox: (img: JourneyImage) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  title,
  isCardHovered,
  onOpenLightbox,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-slide every 3.2s when not manually hovered
  useEffect(() => {
    if (images.length <= 1 || isSliderHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, images.length, isSliderHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
      onClick={() => onOpenLightbox(images[currentIndex])}
      className="group/slider relative w-full aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-xl overflow-hidden bg-black/70 border border-white/10 hover:border-white/25 transition-all duration-300 cursor-zoom-in select-none shadow-lg shadow-black/60"
    >
      {/* Sliding Images */}
      {images.map((img, idx) => {
        const offset = idx - currentIndex;
        return (
          <div
            key={img.src}
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{
              transform: `translateX(${offset * 100}%)`,
              opacity: offset === 0 ? 1 : 0,
              pointerEvents: offset === 0 ? "auto" : "none",
            }}
          >
            <img
              src={img.src}
              alt={img.caption || title}
              loading="lazy"
              className="w-full h-full object-cover object-center transform group-hover/slider:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        );
      })}

      {/* Atmospheric darkening overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

      {/* Top right zoom badge */}
      <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 border border-white/15 text-white/80 opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-md">
        <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
      </div>

      {/* Slide Navigation Arrows (visible on hover if >1 image) */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-200 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-200 backdrop-blur-md cursor-pointer hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Bottom Caption & Dot Indicators */}
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between pointer-events-none bg-gradient-to-t from-black/90 to-transparent">
        <span className="text-[11px] font-sans font-medium text-slate-200 drop-shadow truncate pr-2">
          {images[currentIndex].caption}
        </span>

        {/* Dots */}
        {images.length > 1 && (
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {images.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(dotIdx);
                }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === currentIndex
                    ? "w-4 h-1.5 bg-orange-400"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface JourneyTimelineProps {
  milestones: JourneyMilestone[];
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ milestones }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<JourneyImage | null>(null);

  // Close lightbox modal on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    if (lightboxImage) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [lightboxImage]);

  const accentStyles = {
    orange: {
      dot: "bg-orange-400 ring-orange-500/20",
      tag: "text-orange-400",
      border: "hover:border-orange-500/40",
      glow: "hover:shadow-orange-500/10",
    },
    purple: {
      dot: "bg-purple-400 ring-purple-500/20",
      tag: "text-purple-400",
      border: "hover:border-purple-500/40",
      glow: "hover:shadow-purple-500/10",
    },
    cyan: {
      dot: "bg-cyan-400 ring-cyan-500/20",
      tag: "text-cyan-400",
      border: "hover:border-cyan-500/40",
      glow: "hover:shadow-cyan-500/10",
    },
    teal: {
      dot: "bg-teal-400 ring-teal-500/20",
      tag: "text-teal-400",
      border: "hover:border-teal-500/40",
      glow: "hover:shadow-teal-500/10",
    },
  };

  return (
    <>
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 via-purple-500 to-transparent">
        {milestones.map((item, index) => {
          const accent = accentStyles[item.accent] || accentStyles.orange;
          const isHovered = hoveredIndex === index;
          const isFaded = hoveredIndex !== null && !isHovered;
          const hasImages = item.images && item.images.length > 0;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative pl-12 transition-all duration-300 ease-out ${
                isFaded ? "blur-[2px] opacity-50 scale-[0.99]" : "scale-100 opacity-100"
              }`}
            >
              {/* Timeline Node Indicator */}
              <div
                className={`absolute left-2.5 top-3 w-3.5 h-3.5 rounded-full ring-4 transition-transform duration-300 ${accent.dot} ${
                  isHovered ? "scale-125 ring-8" : "scale-100"
                }`}
              />

              {/* Milestone Card with Aceternity GlowingEffect & Focus Integration */}
              <div className="relative rounded-2xl">
                <GlowingEffect
                  spread={45}
                  glow={true}
                  disabled={false}
                  proximity={70}
                  inactiveZone={0.01}
                  borderWidth={1.5}
                />

                <div
                  className={`relative z-10 p-6 sm:p-7 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl transition-all duration-300 shadow-xl shadow-black/50 ${accent.border} ${accent.glow} ${
                    isHovered ? "border-white/30 shadow-2xl scale-[1.01]" : ""
                  }`}
                >
                  {hasImages ? (
                    /* Two-column layout when card has photographic proof */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Photo Slider with automatic slide animation */}
                      <div className="md:col-span-5 w-full">
                        <ImageSlider
                          images={item.images!}
                          title={item.title}
                          isCardHovered={isHovered}
                          onOpenLightbox={setLightboxImage}
                        />
                      </div>

                      {/* Right: Milestone Story & Details */}
                      <div className="md:col-span-7 flex flex-col justify-center font-sans">
                        <span className={`text-xs font-mono uppercase tracking-wider block mb-1 font-semibold ${accent.tag}`}>
                          {item.date} • {item.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-300/85 mt-2.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Text layout for milestones without photos */
                    <div className="font-sans">
                      <span className={`text-xs font-mono uppercase tracking-wider block mb-1 font-semibold ${accent.tag}`}>
                        {item.date} • {item.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-300/85 mt-2.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cosmic Full-Screen Lightbox Modal for Inspection */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[92vh] w-full bg-neutral-950 border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
              <span className="text-sm font-semibold text-slate-100 font-sans truncate pr-4">
                {lightboxImage.caption}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative flex-1 min-h-0 flex items-center justify-center bg-black/60 p-3 sm:p-5 overflow-auto">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-h-[76vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JourneyTimeline;

