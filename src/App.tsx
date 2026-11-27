import { useState, useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import LoadingScreen from './components/LoadingScreen';
import CosmicBackground from './components/CosmicBackground';
import FloatingAstronaut from './components/FloatingAstronaut';
import WebGLLines from './components/WebGLLines';
import WebGLHalftone from './components/WebGLHalftone';
import BlackHoleScene from './components/BlackHoleScene';
import EnduranceScene from './components/EnduranceScene';
import MurphBedroomSingularity from './components/MurphBedroomSingularity';
import { JourneyTimeline, JourneyMilestone } from './components/ui/journey-timeline';
import { FlipWords } from './components/ui/flip-words';
import { BlurRevealText } from './components/ui/blur-reveal-text';
import { activeHeroCopy } from './content/heroCopy';
import {
  Sparkles,
  Compass,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Github,
  Linkedin,
  Mail,
  ArrowDown,
  Shield,
  Activity,
  Send,
  Layers,
  Terminal,
  Brain,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const queryProgress = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('progress') : null;
  const initialContactProgress = queryProgress !== null ? parseFloat(queryProgress) : 0;

  const [isLoading, setIsLoading] = useState(initialContactProgress === 0);
  const [world, setWorld] = useState<'focus' | 'drift'>('focus');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(initialContactProgress > 0 ? 1 : 0);
  const heroScrollYRef = useRef(0);
  const smoothHeroExitRef = useRef(0);
  const heroFixedWrapRef = useRef<HTMLDivElement>(null);
  const heroSkyRef = useRef<HTMLDivElement>(null);
  const heroGlow1Ref = useRef<HTMLDivElement>(null);
  const heroGlow2Ref = useRef<HTMLDivElement>(null);
  const planetWrapRef = useRef<HTMLDivElement>(null);
  const heroBackdropRef = useRef<HTMLDivElement>(null);
  const topLineWrapRef = useRef<HTMLSpanElement>(null);
  const belowTextWrapRef = useRef<HTMLSpanElement>(null);
  const astroWrapRef = useRef<HTMLDivElement>(null);
  const mountainOpacityRef = useRef<HTMLDivElement>(null);
  const mountainLayer3Ref = useRef<HTMLImageElement>(null);
  const mountainLayer2Ref = useRef<HTMLImageElement>(null);
  const mountainLayer1Ref = useRef<HTMLImageElement>(null);
  const [contactProgress, setContactProgress] = useState(initialContactProgress);
  const contactRef = useRef<HTMLElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    if (initialContactProgress > 0) {
      setTimeout(() => {
        document.querySelector('#contact')?.scrollIntoView();
      }, 50);
    }
  }, [initialContactProgress]);

  // Chronological Journey Milestones with integrated photo slides and Focus effect
  const journeyMilestones: JourneyMilestone[] = [
    {
      id: 'hackathon-us-consulate',
      date: 'Aug 2026',
      category: 'Hackathon Win',
      accent: 'orange',
      title: '1st Place — U.S. Consulate AI Business Hackathon',
      description:
        'Led a 3-member team to 1st place in an AI business hackathon, securing official commendation and approval to advance the project to product development.',
      images: [
        {
          src: '/images/us-consulate2.png',
          caption: '1st Place Trophy & Team Presentation',
        },
        {
          src: '/images/us-consulate1.png',
          caption: 'Project Pitch to the Judges & Consulate Panel',
        },
        {
          src: '/images/us-consulate3.png',
          caption: 'Official Consulate Commendation & Award Ceremony',
        },
      ],
    },
    {
      id: 'oracle-certifications',
      date: 'Oct 2025',
      category: 'Oracle Certifications',
      accent: 'purple',
      title: 'Data Science Professional & AI Foundations Associate',
      description:
        'Practiced end-to-end ML workflows on OCI (data prep, model training/evaluation, AutoML, basic MLOps) and Generative AI fundamentals.',
      images: [
        {
          src: '/images/oracle-cert-ai-foundation.png',
          caption: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
        },
        {
          src: '/images/oracle-cert-data-science.png',
          caption: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
        },
      ],
    },
    {
      id: 'open-source-contributions',
      date: '2025',
      category: 'Open Source',
      accent: 'cyan',
      title: 'Open-Source Contributions & Tooling',
      description:
        'Contributed bug fixes, documentation improvements, and performance enhancements across open-source Python, NLP, and machine learning repositories on GitHub.',
    },
    {
      id: 'academic-foundation',
      date: 'Aug 2023 – July 2027',
      category: 'Academic Foundation',
      accent: 'teal',
      title: 'B.Tech in Computer Science Engineering (Class of 2027)',
      description:
        'RCC Institute of Information Technology, Kolkata. Core coursework in Data Structures & Algorithms, Database Management Systems, and Object-Oriented Programming.',
    },
  ];

  // Disable smooth scroll during loading screen and ensure page stays pinned to top
  useEffect(() => {
    if (isLoading) {
      lenis?.stop();
      window.scrollTo(0, 0);
    } else {
      lenis?.start();
    }
  }, [isLoading, lenis]);

  // Smooth mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // =========================================================================
  // MOUNTAIN SCROLL PARALLAX CONFIGURATION (Adjust these numbers to tweak!)
  // =========================================================================
  // 1. Initial Landing Page Spread (Y offset in px when at top of page)
  //    Higher number = sits lower down on the screen.
  const MOUNTAIN_SPREAD = {
    layer3: 85, // Background horizon (slightly lower at rest)
    layer2: 20, // Midground ridges
    layer1: 0,  // Foreground rocks (flush with bottom edge, no cut line)
  };

  // 2. Hero Scroll Exit (0 at top -> 1 over 110vh sticky range, zero-rerender 60fps ref animation)
  const applyHeroExit = (heroExit: number) => {
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    const planetExit = smoothstep(0, 1.0, heroExit);
    const planetMountainOpacity = 1 - smoothstep(0.06, 0.78, heroExit);
    const sideExit = smoothstep(0.25, 1.0, heroExit);
    const topLineExit = smoothstep(0.40, 1.0, heroExit);

    const mountainExit3 = smoothstep(0, 0.65, heroExit);
    const mountainExit2 = smoothstep(0.08, 0.85, heroExit);
    const mountainExit1 = smoothstep(0.16, 1.0, heroExit);

    if (heroFixedWrapRef.current) {
      heroFixedWrapRef.current.style.visibility = heroExit >= 1 ? 'hidden' : 'visible';
    }
    if (heroSkyRef.current) {
      heroSkyRef.current.style.opacity = `${Math.max(0, 1 - heroExit * 1.1)}`;
    }
    if (heroGlow1Ref.current) {
      heroGlow1Ref.current.style.opacity = `${Math.max(0, 1 - heroExit * 1.25)}`;
    }
    if (heroGlow2Ref.current) {
      heroGlow2Ref.current.style.opacity = `${Math.max(0, 1 - heroExit * 1.25)}`;
    }
    if (planetWrapRef.current) {
      planetWrapRef.current.style.transform = `translate3d(0, ${-planetExit * 115}vh, 0)`;
      planetWrapRef.current.style.opacity = `${planetMountainOpacity}`;
    }
    if (heroBackdropRef.current) {
      heroBackdropRef.current.style.transform = `translate3d(${-sideExit * 70}vw, 0, 0)`;
    }
    if (topLineWrapRef.current) {
      topLineWrapRef.current.style.transform = `translate3d(${-topLineExit * 70}vw, 0, 0)`;
    }
    if (belowTextWrapRef.current) {
      belowTextWrapRef.current.style.transform = `translate3d(${-sideExit * 70}vw, 0, 0)`;
    }
    if (astroWrapRef.current) {
      astroWrapRef.current.style.transform = `translate3d(${sideExit * 70}vw, 0, 0)`;
    }
    if (mountainOpacityRef.current) {
      mountainOpacityRef.current.style.opacity = `${planetMountainOpacity}`;
    }
    if (mountainLayer3Ref.current) {
      mountainLayer3Ref.current.style.transform = `translate3d(0, calc(${MOUNTAIN_SPREAD.layer3}px + ${mountainExit3 * 115}vh), 0)`;
    }
    if (mountainLayer2Ref.current) {
      mountainLayer2Ref.current.style.transform = `translate3d(0, calc(${MOUNTAIN_SPREAD.layer2}px + ${mountainExit2 * 110}vh), 0)`;
    }
    if (mountainLayer1Ref.current) {
      mountainLayer1Ref.current.style.transform = `translate3d(0, calc(${MOUNTAIN_SPREAD.layer1}px + ${mountainExit1 * 105}vh), 0)`;
    }
  };

  useEffect(() => {
    let rafId = 0;
    const tick = () => {
      const heroExitDistance = window.innerHeight * 1.1 || 900;
      const target = Math.min(1, Math.max(0, heroScrollYRef.current / heroExitDistance));
      const diff = target - smoothHeroExitRef.current;
      if (Math.abs(diff) > 0.0004) {
        smoothHeroExitRef.current += diff * 0.16;
        applyHeroExit(smoothHeroExitRef.current);
      } else if (smoothHeroExitRef.current !== target) {
        smoothHeroExitRef.current = target;
        applyHeroExit(target);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Track global scroll progress and section 5 contact immersion progress
  const contactProgressRef = useRef(initialContactProgress);
  const bedroomReadyRef = useRef(false);

  useLenis(({ progress, scroll }) => {
    setScrollProgress(progress);
    heroScrollYRef.current = scroll;
  });

  // When user reaches the black hole section at the bottom of the page,
  // the page stays in a static position (no extra space below), and
  // scrolling down directly controls the black hole growth and tilt.
  // Scrolling up reverses the animation completely until default size,
  // then seamlessly allows normal upward page scrolling.
  useEffect(() => {
    let touchStartY = 0;

    const checkIsAtBottom = () => {
      if (!contactRef.current) return false;
      const rect = contactRef.current.getBoundingClientRect();
      return rect.top <= 8;
    };

    const onWheel = (e: WheelEvent) => {
      const isAtBottom = checkIsAtBottom();
      const isZoomed = contactProgressRef.current > 0;
      const maxProgress = bedroomReadyRef.current ? 2.0 : 1.0;

      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (isAtBottom && contactProgressRef.current < maxProgress) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.04, Math.max(0.006, Math.abs(e.deltaY) * 0.00035));
          const next = Math.min(maxProgress, contactProgressRef.current + step);
          contactProgressRef.current = next;
          setContactProgress(next);
        } else if (isAtBottom && !bedroomReadyRef.current && contactProgressRef.current >= 1.0) {
          // Hold cleanly at the black loading screen while the 3D room loads
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP: while zoomed in, keep black hole locked in place and reverse animation smoothly
        if (isZoomed) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.04, Math.max(0.006, Math.abs(e.deltaY) * 0.00035));
          const next = Math.max(0, contactProgressRef.current - step);
          contactProgressRef.current = next;
          setContactProgress(next);
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const isAtBottom = checkIsAtBottom();
      const isZoomed = contactProgressRef.current > 0;
      const maxProgress = bedroomReadyRef.current ? 2.0 : 1.0;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // positive = swipe up = scroll down
      touchStartY = touchY;

      if (deltaY > 0) {
        if (isAtBottom && contactProgressRef.current < maxProgress) {
          if (e.cancelable) e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.06, Math.max(0.01, deltaY * 0.002));
          const next = Math.min(maxProgress, contactProgressRef.current + step);
          contactProgressRef.current = next;
          setContactProgress(next);
        } else if (isAtBottom && !bedroomReadyRef.current && contactProgressRef.current >= 1.0) {
          if (e.cancelable) e.preventDefault();
          e.stopImmediatePropagation();
        }
      } else if (deltaY < 0) {
        if (isZoomed) {
          if (e.cancelable) e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.06, Math.max(0.01, Math.abs(deltaY) * 0.002));
          const next = Math.max(0, contactProgressRef.current - step);
          contactProgressRef.current = next;
          setContactProgress(next);
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const isAtBottom = checkIsAtBottom();
      const isZoomed = contactProgressRef.current > 0;
      const maxProgress = bedroomReadyRef.current ? 2.0 : 1.0;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (isAtBottom && contactProgressRef.current < maxProgress) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const next = Math.min(maxProgress, contactProgressRef.current + 0.05);
          contactProgressRef.current = next;
          setContactProgress(next);
        } else if (isAtBottom && !bedroomReadyRef.current && contactProgressRef.current >= 1.0) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (isZoomed) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const next = Math.max(0, contactProgressRef.current - 0.05);
          contactProgressRef.current = next;
          setContactProgress(next);
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown, { capture: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('touchstart', onTouchStart, { capture: true });
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
      window.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  // Butter-smooth section scroll
  const scrollTo = (targetId: string) => {
    lenisRef.current?.start();
    contactProgressRef.current = 0;
    setContactProgress(0);
    if (lenis) {
      lenis.scrollTo(targetId, { offset: targetId === '#contact' ? 0 : -80, duration: 1.8 });
    } else {
      const el = document.querySelector(targetId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-clip relative select-none font-sans transition-colors duration-700 ${world === 'focus'
        ? 'bg-[#000000] text-[#f8fafc]'
        : 'bg-[#e5e9d6] text-[#1b2018]'
        }`}
    >
      {/* Sci-Fi Terminal Uplink Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* ========================================================= */}
      {/* BACKGROUND LAYERS                                         */}
      {/* ========================================================= */}
      {world === 'focus' ? (
        /* THREE.JS INTERACTIVE COSMIC CANVAS (Deep 3D Starfield & Primary Amber Sun) */
        <CosmicBackground scrollProgress={scrollProgress} contactProgress={contactProgress} mousePos={mousePos} />
      ) : (
        /* DRIFT WORLD: Uncanny Liminal Backrooms */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute inset-0 opacity-95"
            style={{
              background: 'radial-gradient(circle at 50% 15%, #fbfcee 0%, #e8edd7 45%, #d5dec2 85%, #b9c4a4 100%)'
            }}
          />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-amber-100/60 blur-[70px] animate-flicker pointer-events-none" />

          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #404a37 1px, transparent 1px), linear-gradient(to bottom, #404a37 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              transform: `perspective(600px) rotateX(45deg) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
            }}
          />

          <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-gradient-to-tr from-[#141a12] via-[#242c20]/60 to-transparent blur-[80px] opacity-80" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[350px] bg-gradient-to-tl from-[#141a12] via-[#242c20]/50 to-transparent blur-[90px] opacity-75" />
        </div>
      )}

      {/* ========================================================= */}
      {/* NAVIGATION / TOP BAR                                      */}
      {/* ========================================================= */}
      <header
        className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b transition-all duration-300 px-6 py-2.5 md:py-3 md:px-12 font-mono ${world === 'focus'
          ? 'bg-purple-950/20 border-purple-500/15 text-[#f8fafc] shadow-lg shadow-purple-950/20'
          : 'bg-white/60 border-black/5 text-stone-900 shadow-sm'
          }`}
      >
        <div className="w-full max-w-[1850px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold tracking-tight font-sans">
              Debojit <span className={world === 'focus' ? 'text-amber-400' : 'text-emerald-800'}>Nath</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-mono">
            {[
              { name: 'About', id: '#about' },
              { name: 'Projects', id: '#projects' },
              { name: 'Journey', id: '#journey' },
              { name: 'Contact', id: '#contact' },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollTo(item.id)}
                className={`transition-colors py-1 cursor-pointer ${world === 'focus'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-stone-700 hover:text-black font-semibold'
                  }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${world === 'focus'
                ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                : 'bg-black/5 border-black/10 text-stone-700 hover:text-black hover:bg-black/10'
                }`}
              title={soundEnabled ? 'Mute Atmosphere' : 'Enable Atmosphere'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* THE WORLD SLIDER / TOGGLE (Focus vs Drift) */}
            <div className={`flex items-center p-1 rounded-full backdrop-blur-xl border transition-all shadow-lg ${world === 'focus'
              ? 'bg-black/40 border-white/15 shadow-purple-950/40'
              : 'bg-white/60 border-black/10 shadow-stone-900/10'
              }`}>
              <button
                onClick={() => setWorld('focus')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${world === 'focus'
                  ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white shadow-md shadow-orange-500/30'
                  : 'text-stone-600 hover:text-black'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Focus</span>
              </button>

              <button
                onClick={() => setWorld('drift')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${world === 'drift'
                  ? 'bg-[#293325] text-[#d6e4cb] shadow-md shadow-stone-900/30'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Drift</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SCROLLABLE MAIN CONTENT                                   */}
      {/* ========================================================= */}
      <div className="relative z-20">

        {/* --------------------------------------------------------- */}
        {/* SECTION 1: HERO VIEWPORT (Fixed static screen while elements exit) */}
        {/* --------------------------------------------------------- */}
        <section
          id="hero"
          className={`relative w-full ${world === 'focus' ? 'h-[210vh] pointer-events-none' : 'min-h-screen flex flex-col justify-between overflow-hidden'}`}
        >
          {world === 'focus' ? (
            <div
              ref={heroFixedWrapRef}
              className="fixed inset-0 z-20 w-full h-screen overflow-hidden flex flex-col justify-between pointer-events-none"
            >
              {/* VIBRANT PURPLE COSMIC SKY AT TOP OF WEBPAGE */}
              <div
                ref={heroSkyRef}
                className="absolute top-0 inset-x-0 h-[480px] pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 100% 90% at 50% -10%, rgba(138, 43, 226, 0.45) 0%, rgba(98, 25, 155, 0.35) 35%, rgba(55, 12, 95, 0.22) 65%, transparent 100%)',
                  willChange: 'opacity'
                }}
              />

              {/* SMOOTH ATMOSPHERIC SUNSET LIGHT (Shifted to right, brighter radiant sunset glow) */}
              <div
                ref={heroGlow1Ref}
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 70% at 88% 34%, rgba(255, 115, 50, 0.55) 0%, rgba(244, 63, 94, 0.42) 28%, rgba(192, 38, 211, 0.28) 52%, rgba(107, 33, 168, 0.15) 72%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  willChange: 'opacity'
                }}
              />

              {/* SECONDARY INTENSE SUNSET CORE (Bright radiant corona along far right) */}
              <div
                ref={heroGlow2Ref}
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 50% 55% at 94% 32%, rgba(255, 145, 70, 0.45) 0%, rgba(244, 63, 94, 0.25) 35%, rgba(217, 70, 239, 0.14) 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  willChange: 'opacity'
                }}
              />

              {/* ======================================================= */}
              {/* HERO SKY PLANET (Moves up and fades out before boundary) */}
              {/* ======================================================= */}
              <div
                ref={planetWrapRef}
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                  willChange: 'transform, opacity'
                }}
              >
                {/* COLOSSAL CELESTIAL PLANET (Framing the left periphery naturally) */}
                <div
                  className="absolute top-[-5%] sm:top-[-7%] md:top-[-10%] left-[-8%] sm:left-[-5%] md:left-[-3%] lg:left-[-1%] w-[850px] sm:w-[1150px] md:w-[1450px] lg:w-[1650px] xl:w-[1800px] pointer-events-none transition-transform duration-500 ease-out"
                  style={{
                    transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 10}px)`
                  }}
                >
                  <img
                    src="/shapes/planet.png"
                    alt="Celestial Planet"
                    className={`w-full h-auto object-contain filter drop-shadow-[0_0_60px_rgba(168,85,247,0.3)] select-none pointer-events-none transition-all duration-1000 ease-out ${
                      isLoading ? 'opacity-0 -translate-y-8' : 'opacity-95 translate-y-0'
                    }`}
                    draggable={false}
                  />
                </div>
              </div>

              {/* HERO MAIN CONTENT GRID (Expands dynamically to fill big screens without empty side gaps) */}
              <div className="w-full max-w-[1850px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 2xl:px-24 pt-16 sm:pt-20 pb-20 sm:pb-28 my-auto relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">

                  {/* Left Column: Bold Headline (Below text slides left first; top line hooks behind) */}
                  <div className="lg:col-span-7 xl:col-span-6 relative -mt-4 lg:-mt-6">
                    <div className="flex flex-col items-start space-y-6 max-w-2xl xl:max-w-3xl relative">
                    {/* Atmospheric contrast backing moves with the headline */}
                    <div
                      ref={heroBackdropRef}
                      className="absolute -inset-x-8 -inset-y-10 rounded-3xl bg-radial from-black/75 via-black/35 to-transparent blur-2xl -z-10 pointer-events-none"
                      style={{
                        willChange: 'transform'
                      }}
                    />

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] font-sans">
                      {/* Visually hidden sentence for screen readers */}
                      <span className="sr-only">
                        {activeHeroCopy.srText}
                      </span>

                      {/* Visual presentation */}
                      <span aria-hidden="true">
                        <span
                          ref={topLineWrapRef}
                          className="block"
                          style={{
                            willChange: 'transform'
                          }}
                        >
                          <BlurRevealText
                            text={activeHeroCopy.line1}
                            show={!isLoading}
                            baseDelayMs={80}
                            stepDelayMs={36}
                            className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
                          />
                        </span>
                        <span
                          ref={belowTextWrapRef}
                          className="block"
                          style={{
                            willChange: 'transform'
                          }}
                        >
                          <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-slate-100 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mt-2">
                            <BlurRevealText
                              text={activeHeroCopy.line2}
                              show={!isLoading}
                              baseDelayMs={380}
                              stepDelayMs={30}
                            />
                          </span>

                          {/* Animated Flip Words Pill in Fixed-Height Stage (Locks 'from India' firmly in place) */}
                          <span
                            className="flex items-center my-2 sm:my-3 h-12 sm:h-16 md:h-20 lg:h-[5.25rem]"
                            style={{
                              opacity: !isLoading ? 1 : 0,
                              filter: !isLoading ? 'blur(0px)' : 'blur(14px)',
                              transform: !isLoading ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.97)',
                              transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 460ms, filter 700ms cubic-bezier(0.22, 1, 0.36, 1) 460ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 460ms',
                            }}
                          >
                            <FlipWords
                              words={activeHeroCopy.words}
                              className="text-[clamp(1.05rem,4.5vw,1.75rem)] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                            />
                          </span>

                          <span
                            className="block text-3xl sm:text-5xl md:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-amber-200 drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] mt-2"
                            style={{
                              opacity: !isLoading ? 1 : 0,
                              filter: !isLoading ? 'blur(0px)' : 'blur(14px)',
                              transform: !isLoading ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.97)',
                              transition: 'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 580ms, filter 700ms cubic-bezier(0.22, 1, 0.36, 1) 580ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 580ms',
                            }}
                          >
                            {activeHeroCopy.lastLine}
                          </span>
                        </span>
                      </span>
                    </h1>
                    </div>
                  </div>

                  {/* Right Column: CLEAN SLEEK FLOATING ASTRONAUT (Slides right past border on scroll) */}
                  <div
                    ref={astroWrapRef}
                    className="lg:col-span-5 xl:col-span-6 relative flex items-center justify-center w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] xl:min-h-[720px]"
                    style={{
                      willChange: 'transform'
                    }}
                  >
                    <div
                      className={`w-full h-full flex items-center justify-center transition-all duration-1000 ease-out delay-100 ${
                        isLoading ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
                      }`}
                    >
                      <FloatingAstronaut mousePos={mousePos} />
                    </div>
                  </div>

                </div>
              </div>

              {/* CUSTOM LAYERED PARALLAX MOUNTAINS (Fade in after load, slide down and fade out on scroll) */}
              <div
                className={`absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden transition-opacity duration-1000 ease-out ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div
                  ref={mountainOpacityRef}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    willChange: 'opacity'
                  }}
                >
                  {/* Layer 3 (Background Horizon): mountain3.png */}
                  <img
                    ref={mountainLayer3Ref}
                    src="/shapes/mountain3.png"
                    alt="Alien Mountain Layer 3"
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-10"
                    style={{
                      transform: `translate3d(0, ${MOUNTAIN_SPREAD.layer3}px, 0)`,
                      willChange: 'transform'
                    }}
                    draggable={false}
                  />

                  {/* Layer 2 (Midground Ridges): mountain2.png */}
                  <img
                    ref={mountainLayer2Ref}
                    src="/shapes/mountain2.png"
                    alt="Alien Mountain Layer 2"
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-20"
                    style={{
                      transform: `translate3d(0, ${MOUNTAIN_SPREAD.layer2}px, 0)`,
                      willChange: 'transform'
                    }}
                    draggable={false}
                  />

                  {/* Layer 1 (Foreground Spires / Rocks): mountain1.png */}
                  <img
                    ref={mountainLayer1Ref}
                    src="/shapes/mountain1.png"
                    alt="Alien Mountain Layer 1"
                    className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-30"
                    style={{
                      transform: `translate3d(0, ${MOUNTAIN_SPREAD.layer1}px, 0)`,
                      willChange: 'transform'
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* DRIFT HERO */
            <div className="max-w-4xl mx-auto w-full py-12 flex flex-col items-start space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-flicker" />
                <span className="text-xs font-mono uppercase tracking-widest text-stone-700 font-semibold">
                  Off Duty • Liminal Corridor 0.1
                </span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-tight text-[#161c14] leading-[1.05]">
                Are we even in <span className="italic font-light text-emerald-950 underline decoration-amber-600/40">reality</span>?
              </h1>

              <p className="text-lg sm:text-2xl text-stone-700/90 max-w-2xl font-light leading-relaxed">
                No meetings. No commit logs. Just an endless hallway of fluorescent hums, unfinished thoughts, the embers of an RDR2 campfire, and midnight frequencies.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full pt-6">
                <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold block mb-2">Sub-World 01</span>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900">Campfire Dust (RDR2)</h3>
                  <p className="text-xs text-stone-600 mt-2 font-mono">Arthur Morgan weeping in the rain. Elden Ring fog.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-2">Sub-World 02</span>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-900">Midnight Frequencies</h3>
                  <p className="text-xs text-stone-600 mt-2 font-mono">Tame Impala, The Weeknd, Lana Del Rey.</p>
                </div>

                <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-600 font-bold block mb-2">Sub-World 03</span>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-stone-950">Empty Cinema</h3>
                  <p className="text-xs text-stone-600 mt-2 font-mono">Flickering projectors, silent theaters, and cinema.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 2: ABOUT                                          */}
        {/* --------------------------------------------------------- */}
        <section id="about" className="py-28 max-w-[1700px] w-full mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">01 / Profile</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 font-sans">About Debojit</h2>
              <p className="text-base text-slate-300/80 mt-6 leading-relaxed">
                I'm an undergrad exploring the frontier of deep learning and agentic systems. As a fresher, my philosophy is simple: build cool, ambitious projects to truly understand how intelligent systems think, reason, and take action. Right now, I'm deep into autonomous AI agents, neural network architectures, and hands-on ML experimentation.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-orange-500/30 transition-all">
                <Brain className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Languages & Frameworks</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-mono">
                  Python, Java, SQL, PyTorch, and FastAPI. Working with Pandas, NumPy, Scikit-Learn, and Matplotlib.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-teal-500/30 transition-all">
                <Layers className="w-8 h-8 text-teal-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Consensus & Feedback Systems</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-mono">
                  Raft consensus engine with custom TCP RPCs, and active learning pipelines that retrain models from user feedback.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-rose-500/30 transition-all">
                <Terminal className="w-8 h-8 text-rose-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Coursework & Tools</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-mono">
                  DSA, DBMS, and OOP. Daily workflow in Git, GitHub, VS Code, MySQL, and Jupyter Notebook.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-amber-400/30 transition-all">
                <Compass className="w-8 h-8 text-amber-300 mb-4" />
                <h3 className="text-lg font-bold text-white">Certifications & Interests</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed font-mono">
                  Oracle Data Science Professional & AI Foundations Associate (Oct 2025). AI/ML research, gaming, and open-source contribution.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 3: REAL BENCHMARK PROJECTS                        */}
        {/* --------------------------------------------------------- */}
        <section id="projects" className="py-28 max-w-[1700px] w-full mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">02 / Portfolio</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 font-mono text-white">
                Featured Projects
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              PyTorch model compression, distributed consensus in async Python, and active learning systems.
            </p>
          </div>

          {/* THE BENTO CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full font-mono">

            {/* Card 1: Grainy / Light (Black Globe WebGL Lines) */}
            <article
              className="col-span-1 relative w-full min-h-[460px] rounded-[2rem] flex flex-col justify-between p-8 overflow-hidden shadow-2xl border border-transparent group"
              style={{
                background: 'linear-gradient(#f4f4f0, #f4f4f0) padding-box, linear-gradient(135deg, #ffffff 0%, #d1d5db 100%) border-box',
                color: '#111111'
              }}
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none opacity-[0.15]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'multiply'
                }}
              />

              <div className="absolute inset-0 z-0 top-1/4 pointer-events-none opacity-60 group-hover:opacity-85 transition-opacity">
                <WebGLLines color={0x111111} />
              </div>

              <header className="relative z-20 flex justify-between items-center text-sm tracking-tight font-normal">
                <div className="flex items-center gap-1.5 font-bold">
                  <Shield className="w-5 h-5 text-black" />
                  <span>PyTorch • Optimization</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">Oct 2026</span>
              </header>

              <main className="relative z-20 mt-auto">
                <h3 className="text-2xl md:text-3xl tracking-tight leading-[1.1] mb-3 font-mono font-bold text-black">
                  PyTorch Model<br />Compression Suite
                </h3>
                <p className="text-xs leading-relaxed font-sans max-w-[280px] text-black/80 font-normal">
                  PyTorch compression pipeline combining Knowledge Distillation, iterative pruning, and INT8 quantization. Improved inference latency by 1.8x and halved memory footprint (53% reduction) on benchmark models.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-orange-600 transition-colors">
                  <span>Distillation • Pruning • INT8</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </main>
            </article>

            {/* Card 2: Cybernetic Yellow Grid + Aura Asset */}
            <article
              className="col-span-1 relative w-full min-h-[460px] rounded-[2rem] flex flex-col justify-between p-8 overflow-hidden shadow-2xl border border-transparent group"
              style={{
                background: 'linear-gradient(#FDE047, #FDE047) padding-box, linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(202,138,4,0.4) 100%) border-box',
                color: '#111111'
              }}
            >
              <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none">
                <img
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/724142aa-44a6-48d3-9cf3-761e00d05b78_1600w.jpg"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  alt="Futuristic Deconstructed Pyramid"
                />
              </div>

              <div
                className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
                  backgroundSize: '1.5rem 1.5rem'
                }}
              />

              <header className="relative z-20 flex justify-between items-center text-sm tracking-tight font-normal">
                <div className="flex items-center gap-1.5 font-bold">
                  <Activity className="w-5 h-5 text-black" />
                  <span>Async Python • Distributed</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">Aug – Sept 2026</span>
              </header>

              <main className="relative z-20 mt-auto">
                <h3 className="text-2xl md:text-3xl tracking-tight leading-[1.1] font-mono font-bold text-black mb-3">
                  Raft Distributed<br />Consensus Engine
                </h3>
                <p className="text-xs leading-relaxed font-sans max-w-[280px] text-black/85 font-normal">
                  A distributed Raft consensus engine in async Python with custom TCP RPCs. Implements paper-faithful replication, WAL disk persistence (fsync), and linearizable reads (ReadIndex).
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-amber-800 transition-colors">
                  <span>Custom TCP RPCs • WAL fsync</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </main>
            </article>

            {/* Card 3: Black Halftone Shader Matrix (Full Width) */}
            <article
              className="col-span-1 md:col-span-2 relative w-full min-h-[400px] md:min-h-[360px] rounded-[2rem] flex flex-col md:flex-row justify-between p-8 overflow-hidden text-white shadow-2xl border border-transparent group"
              style={{
                background: 'linear-gradient(#0A0A0A, #0A0A0A) padding-box, linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%) border-box'
              }}
            >
              <div className="absolute inset-0 z-0 md:left-1/3 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <WebGLHalftone color1="#c084fc" color2="#38bdf8" gridSize={26} />
              </div>

              <header className="relative z-20 flex md:flex-col justify-between md:justify-start items-center md:items-start text-sm tracking-tight font-normal text-white/90 gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="font-bold tracking-widest text-yellow-400">ACTIVE LEARNING</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">July 2026</span>
              </header>

              <main className="relative z-20 mt-auto md:mt-0 md:self-end md:text-right max-w-md w-full">
                <h3 className="text-3xl md:text-4xl tracking-tight leading-[1.08] font-normal mb-3 font-mono text-white">
                  Voice Command<br />Intent Classifier
                </h3>
                <p className="text-xs leading-relaxed text-white/80 md:ml-auto md:max-w-[320px] font-mono">
                  A React and Flask app that classifies voice commands into intents. Built from the motivation that models should keep improving after deployment, implementing an active learning pipeline that retrains from user feedback.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 md:justify-end hover:text-white transition-colors">
                  <span>React & Flask • Active Learning Retraining</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </main>
            </article>

          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 4: JOURNEY                                        */}
        {/* --------------------------------------------------------- */}
        <section id="journey" className="py-28 max-w-[1700px] w-full mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 font-mono">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">03 / Trajectory</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 text-white font-sans">The Journey</h2>
            <p className="text-sm font-mono text-slate-400 mt-3">
              Academic milestones, computer science foundation, and evolving interests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-16 items-center">
            {/* Left Column: Timeline with Focus Cards and Category Photo Slider */}
            <div className="lg:col-span-7 xl:col-span-7">
              <JourneyTimeline milestones={journeyMilestones} />
            </div>

            {/* Right Column: 3D Interstellar Endurance Spacecraft */}
            <div className="lg:col-span-5 xl:col-span-5 relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex items-center justify-center">
              <EnduranceScene />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 5: GRAVITATIONAL HORIZON (BLACK HOLE IMMERSION)   */}
        {/* --------------------------------------------------------- */}
        <section
          id="contact"
          ref={contactRef}
          className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-between bg-transparent font-mono"
        >
          {/* Sleek Liquid Metal Pill Contact Dock & Gargantua Scroll Box */}
          <div
            className="relative z-20 flex flex-col items-center justify-center px-4 w-full max-w-xl mx-auto pt-4 sm:pt-6 pointer-events-auto font-mono transition-opacity duration-300"
            style={{
              opacity: Math.max(0, 1 - contactProgress * 3.0),
              pointerEvents: contactProgress > 0.05 ? 'none' : 'auto',
              transform: `translateY(${-contactProgress * 20}px)`
            }}
          >
            {/* Liquid Metal Capsule Dock */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {/* Email */}
              <a
                href="mailto:debojitnathwork@gmail.com"
                className="liquid-pill group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <Mail className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-purple-200 transition-colors">Email</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/debojit-nath-cse/"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-pill group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <Linkedin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-purple-200 transition-colors">LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/DebojitNath"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-pill group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <Github className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-purple-200 transition-colors">GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Gargantua Scroll Prompt Box (Fades away when zooming in!) */}
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-mono backdrop-blur-md shadow-lg shadow-purple-950/50 select-none">
              <span>Scroll towards Gargantua</span>
              <ArrowDown className="w-3 h-3 animate-bounce text-purple-400" />
            </div>
          </div>

          {/* 3D Black Hole Background Canvas - Static Fullscreen */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <BlackHoleScene
              scrollProgress={scrollProgress}
              contactProgress={Math.min(1.0, contactProgress)}
              isPaused={contactProgress >= 1.05}
            />
          </div>

          {/* Murph's Bedroom Singularity Scene (Option A — lazy-loaded after black hole full zoom) */}
          <MurphBedroomSingularity
            contactProgress={contactProgress}
            onReadyChange={(ready) => {
              bedroomReadyRef.current = ready;
            }}
          />
        </section>

      </div>

    </div>
  );
}
