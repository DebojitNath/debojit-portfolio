import { useState, useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import LoadingScreen from './components/LoadingScreen';
import CosmicBackground from './components/CosmicBackground';
import FloatingAstronaut from './components/FloatingAstronaut';
import WebGLLines from './components/WebGLLines';
import WebGLHalftone from './components/WebGLHalftone';
import BlackHoleScene from './components/BlackHoleScene';
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
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [world, setWorld] = useState<'focus' | 'drift'>('focus');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contactProgress, setContactProgress] = useState(0);
  const contactRef = useRef<HTMLElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

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
    layer3: 80, // Background horizon (spread lowest)
    layer2: 40,  // Midground ridges
    layer1: 0,  // Foreground rocks
  };

  // 2. Scroll Convergence (how fast they sink and hide behind each other on scroll)
  //    Adjust the multipliers (* 220, * 110, etc.) to control how fast each layer sinks.
  const mountainY3 = MOUNTAIN_SPREAD.layer3 + scrollProgress * 300; // Sinks fastest behind layer 2 & 1
  const mountainY2 = MOUNTAIN_SPREAD.layer2 + scrollProgress * 100; // Sinks behind layer 1
  const mountainY1 = MOUNTAIN_SPREAD.layer1 - scrollProgress * 50;  // Foreground rises slightly for depth
  // Track global scroll progress and section 5 contact immersion progress
  const contactProgressRef = useRef(0);

  useLenis(({ progress }) => {
    setScrollProgress(progress);
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
      return rect.top <= 25;
    };

    const onWheel = (e: WheelEvent) => {
      const isAtBottom = checkIsAtBottom();
      const isZoomed = contactProgressRef.current > 0;

      if (e.deltaY > 0) {
        // Scrolling DOWN
        if (isAtBottom && contactProgressRef.current < 1) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.05, Math.max(0.008, Math.abs(e.deltaY) * 0.00045));
          const next = Math.min(1, contactProgressRef.current + step);
          contactProgressRef.current = next;
          setContactProgress(next);
        }
      } else if (e.deltaY < 0) {
        // Scrolling UP: while zoomed in, keep black hole locked in place and reverse animation
        if (isZoomed) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.05, Math.max(0.008, Math.abs(e.deltaY) * 0.00045));
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

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY; // positive = swipe up = scroll down
      touchStartY = touchY;

      if (deltaY > 0) {
        if (isAtBottom && contactProgressRef.current < 1) {
          if (e.cancelable) e.preventDefault();
          e.stopImmediatePropagation();
          const step = Math.min(0.06, Math.max(0.01, deltaY * 0.002));
          const next = Math.min(1, contactProgressRef.current + step);
          contactProgressRef.current = next;
          setContactProgress(next);
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

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (isAtBottom && contactProgressRef.current < 1) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const next = Math.min(1, contactProgressRef.current + 0.05);
          contactProgressRef.current = next;
          setContactProgress(next);
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
      className={`min-h-screen w-full max-w-full overflow-x-hidden relative select-none font-sans transition-colors duration-700 ${world === 'focus'
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
        {/* SECTION 1: HERO VIEWPORT (Full Screen Width, Zero Gaps!) */}
        {/* --------------------------------------------------------- */}
        <section id="hero" className="min-h-screen relative flex flex-col justify-between w-full overflow-hidden">
          {world === 'focus' ? (
            <>
              {/* VIBRANT PURPLE COSMIC SKY AT TOP OF WEBPAGE */}
              <div
                className="absolute top-0 inset-x-0 h-[480px] pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 100% 90% at 50% -10%, rgba(138, 43, 226, 0.45) 0%, rgba(98, 25, 155, 0.35) 35%, rgba(55, 12, 95, 0.22) 65%, transparent 100%)',
                  opacity: Math.max(0, 1 - scrollProgress * 3.5),
                  willChange: 'opacity'
                }}
              />

              {/* SMOOTH ATMOSPHERIC SUNSET LIGHT (Shifted to right, brighter radiant sunset glow) */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 70% at 88% 34%, rgba(255, 115, 50, 0.55) 0%, rgba(244, 63, 94, 0.42) 28%, rgba(192, 38, 211, 0.28) 52%, rgba(107, 33, 168, 0.15) 72%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  opacity: Math.max(0, 1 - scrollProgress * 5.0),
                  willChange: 'opacity'
                }}
              />

              {/* SECONDARY INTENSE SUNSET CORE (Bright radiant corona along far right) */}
              <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                  background: 'radial-gradient(ellipse 50% 55% at 94% 32%, rgba(255, 145, 70, 0.45) 0%, rgba(244, 63, 94, 0.25) 35%, rgba(217, 70, 239, 0.14) 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 85%)',
                  opacity: Math.max(0, 1 - scrollProgress * 5.0),
                  willChange: 'opacity'
                }}
              />

              {/* ======================================================= */}
              {/* HERO SKY PLANET (Replaced weird ball with planet.png)    */}
              {/* ======================================================= */}
              <div
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                  opacity: Math.max(0, 1 - scrollProgress * 3.5),
                  willChange: 'opacity'
                }}
              >
                {/* COLOSSAL CELESTIAL PLANET (Shifted slightly right for optimal composition) */}
                <div
                  className="absolute top-[-2%] sm:top-[-4%] md:top-[-6%] left-[2%] sm:left-[5%] md:left-[7%] w-[850px] sm:w-[1150px] md:w-[1450px] lg:w-[1650px] xl:w-[1800px] pointer-events-none transition-transform duration-500 ease-out"
                  style={{
                    transform: `translate(${mousePos.x * 14}px, ${mousePos.y * 10}px)`
                  }}
                >
                  <img
                    src="/shapes/planet.png"
                    alt="Celestial Planet"
                    className="w-full h-auto object-contain filter drop-shadow-[0_0_60px_rgba(168,85,247,0.3)] select-none pointer-events-none opacity-95"
                    draggable={false}
                  />
                </div>
              </div>

              {/* HERO MAIN CONTENT GRID (Centered in max-w-7xl) */}
              <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-16 sm:pt-20 pb-24 sm:pb-28 my-auto relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  {/* Left Column: Bold Headline & Honest Student Bio */}
                  <div className="lg:col-span-7 flex flex-col items-start space-y-6">
                    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                      <GraduationCap className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                        4th Year Computer Science Undergrad
                      </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] font-sans">
                      <span>Hi, I'm Debojit</span>
                      <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-slate-300 mt-2">
                        A Developer Dedicated to Crafting
                      </span>

                      {/* The Signature Cutout White Pill */}
                      <span className="inline-block mt-3 px-6 py-2 rounded-2xl bg-white text-[#0a0518] font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl shadow-2xl shadow-purple-500/30 transform hover:-rotate-1 transition-transform cursor-default">
                        Interactive
                      </span>

                      <span className="block text-3xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-teal-200 mt-2">
                        AI & Software Solutions
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300/85 max-w-xl font-normal leading-relaxed pt-1">
                      Undergraduate CS student passionate about building intelligent systems, full-stack web applications, and creative digital experiences.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-4 font-mono">
                      <button
                        onClick={() => scrollTo('#projects')}
                        className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span>Explore Projects</span>
                        <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => scrollTo('#about')}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs tracking-wider uppercase backdrop-blur-md transition-all cursor-pointer"
                      >
                        <span>About Me</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: CLEAN SLEEK FLOATING ASTRONAUT */}
                  <div className="lg:col-span-5 relative flex items-center justify-center min-h-[420px]">
                    <FloatingAstronaut mousePos={mousePos} />
                  </div>

                </div>
              </div>

              {/* CUSTOM LAYERED PARALLAX MOUNTAINS (Zero Cursor Movement + Dynamic Scroll Convergence) */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
                {/* Layer 3 (Background Horizon): mountain3.png */}
                <img
                  src="/shapes/mountain3.png"
                  alt="Alien Mountain Layer 3"
                  className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-10 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(0, ${mountainY3}px, 0)`
                  }}
                  draggable={false}
                />

                {/* Layer 2 (Midground Ridges): mountain2.png */}
                <img
                  src="/shapes/mountain2.png"
                  alt="Alien Mountain Layer 2"
                  className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-20 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(0, ${mountainY2}px, 0)`
                  }}
                  draggable={false}
                />

                {/* Layer 1 (Foreground Spires / Rocks): mountain1.png */}
                <img
                  src="/shapes/mountain1.png"
                  alt="Alien Mountain Layer 1"
                  className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none z-30 transition-transform duration-300 ease-out"
                  style={{
                    transform: `translate3d(0, ${mountainY1}px, 0)`
                  }}
                  draggable={false}
                />

                {/* Mountain Bottom Base Blend: Seamlessly fades mountain bottom into black */}
                <div
                  className="absolute bottom-0 inset-x-0 h-20 sm:h-28 pointer-events-none z-35"
                  style={{
                    background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.85) 45%, transparent 100%)'
                  }}
                />
              </div>
            </>
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

        {/* GRADIENT BEDROCK: Overlaps the bottom of mountain PNGs so the cut line is completely eliminated */}
        {world === 'focus' && (
          <div
            className="w-full h-40 sm:h-48 md:h-56 relative z-20 pointer-events-none -mt-16 sm:-mt-20 md:-mt-24"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, #000000 28%, #000000 78%, transparent 100%)'
            }}
          />
        )}

        {/* --------------------------------------------------------- */}
        {/* SECTION 2: ABOUT                                          */}
        {/* --------------------------------------------------------- */}
        <section id="about" className="py-28 max-w-7xl mx-auto px-6 md:px-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">01 / Profile</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 font-sans">About Debojit</h2>
              <p className="text-base text-slate-300/80 mt-6 leading-relaxed">
                I am a 4th-year Computer Science undergraduate student preparing for software developer and AI engineer roles. I enjoy turning complex problem statements into clean code, practical web applications, and intuitive user experiences.
              </p>
              <div className="mt-8 flex flex-col gap-3 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>4th Year Computer Science Student</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Passionate about AI Engineering & Full-Stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Building real-world projects & learning daily</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-orange-500/30 transition-all">
                <Brain className="w-8 h-8 text-orange-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Machine Learning & AI</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                  Exploring LLM integration, agentic workflows, and applying machine learning algorithms to practical challenges.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-teal-500/30 transition-all">
                <Layers className="w-8 h-8 text-teal-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Full-Stack Development</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                  Building responsive web applications with React, TypeScript, Tailwind CSS, and cloud backends.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-rose-500/30 transition-all">
                <Terminal className="w-8 h-8 text-rose-400 mb-4" />
                <h3 className="text-lg font-bold text-white">Computer Science Core</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                  Strong foundational grounding in Data Structures, Algorithms, Object-Oriented Design, and Databases.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:border-amber-400/30 transition-all">
                <Compass className="w-8 h-8 text-amber-300 mb-4" />
                <h3 className="text-lg font-bold text-white">Creative Exploration</h3>
                <p className="text-xs text-slate-300/80 mt-2 leading-relaxed">
                  Blending clean engineering rigor with personal creativity, gaming lore, and dynamic motion design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 3: AEGIS-REMIXED BENTO PROJECTS                   */}
        {/* --------------------------------------------------------- */}
        <section id="projects" className="py-28 max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">02 / Portfolio</span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 font-mono text-white">
                Selected Bento Projects
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              Sample project architectures featuring interactive WebGL shaders and clean engineering modules.
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
                  <span>Autonomous Agent Engine</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">Sector.01</span>
              </header>

              <main className="relative z-20 mt-auto">
                <h3 className="text-3xl md:text-4xl tracking-tight leading-[1.1] mb-4 font-mono font-bold text-black">
                  Sample Project 01.<br />Agent Workflows.
                </h3>
                <p className="text-xs leading-relaxed font-sans max-w-[240px] text-black/70">
                  Sample multi-agent coordination system with state machine orchestration and clean rollback logic.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-orange-600 transition-colors cursor-pointer">
                  <span>View Repository</span>
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
                  <span>Cloud Telemetry Pipeline</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">Sector.02</span>
              </header>

              <main className="relative z-20 mt-auto">
                <h3 className="text-3xl md:text-4xl tracking-tight leading-[1.1] font-mono font-bold text-black mb-3">
                  Sample Project 02.<br />Backend Service.
                </h3>
                <p className="text-xs leading-relaxed font-sans max-w-[240px] text-black/80 font-medium">
                  Distributed logging and event processing pipeline designed for cloud deployments.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-black hover:text-amber-800 transition-colors cursor-pointer">
                  <span>Architecture Spec</span>
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
                  <span className="font-bold tracking-widest text-yellow-400">QUANTUM CORE</span>
                </div>
                <span className="text-xs opacity-50 uppercase tracking-widest font-mono">Sector.03</span>
              </header>

              <main className="relative z-20 mt-auto md:mt-0 md:self-end md:text-right max-w-md w-full">
                <h3 className="text-4xl md:text-5xl tracking-tight leading-[1.05] font-normal mb-4 uppercase font-mono text-white">
                  Sample Project 03.<br />Interactive Web.
                </h3>
                <p className="text-xs leading-relaxed text-white/70 md:ml-auto md:max-w-[260px] font-mono">
                  Custom GPU shader computations rendering volumetric wave fields and interactive particle physics.
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 md:justify-end hover:text-white transition-colors cursor-pointer">
                  <span>Run WebGL Simulation</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </main>
            </article>

          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* SECTION 4: JOURNEY                                        */}
        {/* --------------------------------------------------------- */}
        <section id="journey" className="py-28 max-w-7xl mx-auto px-6 md:px-12 font-mono">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">03 / Trajectory</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 text-white font-sans">The Journey</h2>
            <p className="text-sm font-mono text-slate-400 mt-3">
              Academic milestones, computer science foundation, and evolving interests.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-purple-500 before:to-transparent">

            <div className="relative pl-12 group">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-orange-400 ring-4 ring-orange-500/20 group-hover:scale-125 transition-transform" />
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl hover:border-orange-500/30 transition-all font-sans">
                <span className="text-xs font-mono text-orange-400 block mb-1">2026 • Present</span>
                <h3 className="text-xl font-bold text-white">4th Year Undergrad — AI & Software Engineering</h3>
                <p className="text-sm text-slate-300/80 mt-2 leading-relaxed">
                  Final year of Computer Science. Deepening skills in software engineering, applied AI, and building full-stack applications.
                </p>
              </div>
            </div>

            <div className="relative pl-12 group">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-purple-400 ring-4 ring-purple-500/20 group-hover:scale-125 transition-transform" />
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl hover:border-purple-500/30 transition-all font-sans">
                <span className="text-xs font-mono text-purple-400 block mb-1">Academic Core</span>
                <h3 className="text-xl font-bold text-white">Computer Science Fundamentals</h3>
                <p className="text-sm text-slate-300/80 mt-2 leading-relaxed">
                  Coursework in Data Structures, Algorithms, Operating Systems, Computer Networks, and Database Management Systems.
                </p>
              </div>
            </div>

            <div className="relative pl-12 group">
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-teal-400 ring-4 ring-teal-500/20 group-hover:scale-125 transition-transform" />
              <div className="p-6 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl hover:border-teal-500/30 transition-all font-sans">
                <span className="text-xs font-mono text-teal-400 block mb-1">Genesis</span>
                <h3 className="text-xl font-bold text-white">Starting the Coding Journey</h3>
                <p className="text-sm text-slate-300/80 mt-2 leading-relaxed">
                  Writing my first programs, discovering a love for problem solving, and building initial software projects.
                </p>
              </div>
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
                href="mailto:debojitnath9674@gmail.com"
                className="liquid-pill group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <span className="text-base select-none">✉️</span>
                <span className="group-hover:text-purple-200 transition-colors">Email</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-pill group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <span className="text-base select-none">💼</span>
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
                <span className="text-base select-none">💻</span>
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
              contactProgress={contactProgress}
            />
          </div>
        </section>

      </div>

    </div>
  );
}
