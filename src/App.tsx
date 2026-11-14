import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  ArrowUpRight, 
  Terminal, 
  Layers, 
  Cpu, 
  Volume2, 
  VolumeX,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';

export default function App() {
  const [world, setWorld] = useState<'focus' | 'drift'>('focus');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);

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

  return (
    <div className={`min-h-screen relative overflow-hidden select-none transition-colors duration-1000 ${
      world === 'focus' 
        ? 'bg-[#090614] text-[#f8fafc]' 
        : 'bg-[#e7ebd9] text-[#1c221a]'
    }`}>

      {/* ========================================================= */}
      {/* BACKGROUND LAYERS                                         */}
      {/* ========================================================= */}
      {world === 'focus' ? (
        /* FOCUS WORLD: Painterly Cosmic Sky with Sunset Nebula & Parallax */
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base Sky Gradient: Deep space indigo to rich sunset crimson */}
          <div 
            className="absolute inset-0 transition-transform duration-700 ease-out opacity-90"
            style={{
              background: 'radial-gradient(circle at 75% 30%, #581c87 0%, #311042 30%, #150928 65%, #070410 100%)',
              transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(1.05)`
            }}
          />

          {/* Fiery Sunset Nebula Horizon (Right-side warm glow inspired by reference image) */}
          <div 
            className="absolute top-[-10%] right-[-5%] w-[850px] h-[750px] rounded-full blur-[140px] opacity-45 pointer-events-none transition-transform duration-1000 ease-out"
            style={{
              background: 'radial-gradient(circle, #ff6b35 0%, #f43f5e 40%, #7e22ce 75%, transparent 100%)',
              transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -20}px)`
            }}
          />

          {/* Celestial Moon / Planet (Top Left) */}
          <div 
            className="absolute top-16 left-[18%] w-36 h-36 rounded-full transition-transform duration-500 ease-out opacity-85"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #94a3b8 0%, #475569 45%, #1e293b 85%, #090d16 100%)',
              boxShadow: '0 0 45px rgba(148, 163, 184, 0.25), inset -8px -8px 20px rgba(0,0,0,0.85)',
              transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 12}px)`
            }}
          >
            {/* Subtle atmospheric ring */}
            <div className="absolute inset-[-15%] rounded-full border border-sky-400/20 blur-[1px] rotate-12" />
          </div>

          {/* Secondary Distant Moon (Top Right) */}
          <div 
            className="absolute top-28 right-[28%] w-14 h-14 rounded-full opacity-60 transition-transform duration-500 ease-out"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #cbd5e1 0%, #64748b 70%, #1e1b4b 100%)',
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`
            }}
          />

          {/* Distant Twinkling Stardust Field */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

          {/* Stylized Alien Mountain Silhouettes (Bottom Landscape) */}
          <svg 
            className="absolute bottom-0 left-0 right-0 w-full h-[320px] object-cover opacity-85 transition-transform duration-700 ease-out pointer-events-none"
            viewBox="0 0 1440 320" 
            fill="none" 
            preserveAspectRatio="none"
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 5}px) scale(1.02)`
            }}
          >
            {/* Back Mountain Ridge (Deep Burgundy/Plum) */}
            <path 
              d="M0,192L48,181.3C96,171,192,149,288,165.3C384,181,480,235,576,224C672,213,768,139,864,138.7C960,139,1056,213,1152,229.3C1248,245,1344,203,1392,181.3L1440,160L1440,320L0,320Z" 
              fill="#260b2d" 
              opacity="0.75"
            />
            {/* Mid Mountain Ridge (Dark Wine & Amber highlights) */}
            <path 
              d="M0,240L60,218.7C120,197,240,155,360,165.3C480,176,600,240,720,245.3C840,251,960,197,1080,176C1200,155,1320,165,1380,170.7L1440,176L1440,320L0,320Z" 
              fill="#180720"
            />
            {/* Foreground Alien Crags */}
            <path 
              d="M0,280L80,266.7C160,253,320,227,480,234.7C640,243,800,285,960,288C1120,291,1280,253,1360,234.7L1440,216L1440,320L0,320Z" 
              fill="#0d0412" 
            />
          </svg>
        </div>
      ) : (
        /* DRIFT WORLD: Uncanny Liminal Backrooms (Light, Fluorescent, Shadowed) */
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Institutional Pale Wall Tone with Sickly Fluorescent Tint */}
          <div 
            className="absolute inset-0 opacity-95"
            style={{
              background: 'radial-gradient(circle at 50% 20%, #fbfcee 0%, #e8edd7 45%, #d5dec2 85%, #b9c4a4 100%)'
            }}
          />

          {/* Flickering Fluorescent Tube Glow from Ceiling */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-amber-100/60 blur-[70px] animate-flicker pointer-events-none" />

          {/* Perspective Corridor Grid Lines (Evoking endless backroom hallways) */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #404a37 1px, transparent 1px), linear-gradient(to bottom, #404a37 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              transform: `perspective(600px) rotateX(45deg) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
            }}
          />

          {/* Ominous Dark Shadow Corridor at Bottom Left & Right */}
          <div className="absolute bottom-0 left-0 w-[450px] h-[350px] bg-gradient-to-tr from-[#141a12] via-[#242c20]/60 to-transparent blur-[80px] opacity-80" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[350px] bg-gradient-to-tl from-[#141a12] via-[#242c20]/50 to-transparent blur-[90px] opacity-75" />
        </div>
      )}

      {/* ========================================================= */}
      {/* NAVIGATION / TOP BAR                                      */}
      {/* ========================================================= */}
      <header className="relative z-30 flex items-center justify-between max-w-7xl mx-auto w-full px-6 py-6 md:px-12">
        {/* Name / Brand Identity */}
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            Debojit <span className={world === 'focus' ? 'text-amber-400' : 'text-emerald-800'}>Nath</span>
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
            world === 'focus' 
              ? 'border-white/10 text-white/50 bg-white/5' 
              : 'border-black/10 text-black/50 bg-black/5'
          }`}>
            v1.0
          </span>
        </div>

        {/* Center Nav Links (Professional Pages) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['About', 'Projects', 'Stack', 'Contact'].map((item) => (
            <button
              key={item}
              className={`transition-colors relative py-1 ${
                world === 'focus' 
                  ? 'text-slate-300 hover:text-white' 
                  : 'text-stone-700 hover:text-black font-semibold'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right Controls: Audio + World Switcher */}
        <div className="flex items-center gap-3">
          {/* Audio toggle button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              world === 'focus'
                ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                : 'bg-black/5 border-black/10 text-stone-700 hover:text-black hover:bg-black/10'
            }`}
            title={soundEnabled ? 'Mute Atmosphere' : 'Enable Atmosphere'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* THE WORLD SLIDER / TOGGLE (Focus vs Drift) */}
          <div className={`flex items-center p-1 rounded-full backdrop-blur-xl border transition-all shadow-lg ${
            world === 'focus' 
              ? 'bg-black/40 border-white/15 shadow-purple-950/40' 
              : 'bg-white/60 border-black/10 shadow-stone-900/10'
          }`}>
            <button
              onClick={() => setWorld('focus')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                world === 'focus'
                  ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white shadow-md shadow-orange-500/30'
                  : 'text-stone-600 hover:text-black'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Focus</span>
            </button>

            <button
              onClick={() => setWorld('drift')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                world === 'drift'
                  ? 'bg-[#293325] text-[#d6e4cb] shadow-md shadow-stone-900/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Drift</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN HERO CONTENT                                         */}
      {/* ========================================================= */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 pt-8 pb-16 flex-1 flex flex-col justify-center">
        {world === 'focus' ? (
          /* ======================================================= */
          /* WORLD 1: FOCUS (Vibrant Cosmic Hero)                    */
          /* ======================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Bold Typography & Punchline Pill */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              
              {/* Intro sub-label */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  Software Developer & AI Engineer
                </span>
              </div>

              {/* Main Headline with Custom White Cutout Pill */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]">
                <span>Hi, I'm Debojit</span>
                <span className="block text-2xl sm:text-4xl md:text-5xl font-light text-slate-300 mt-2">
                  Dedicated to Crafting
                </span>
                
                {/* The Signature Cutout White Pill (Inspired by Reference) */}
                <span className="inline-block mt-3 px-6 py-2 rounded-2xl bg-white text-[#0a0518] font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl shadow-2xl shadow-purple-500/30 transform hover:-rotate-1 transition-transform cursor-default">
                  Interactive
                </span>

                <span className="block text-3xl sm:text-5xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-teal-200 mt-2">
                  AI & Digital Experiences
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300/85 max-w-xl font-normal leading-relaxed pt-1">
                Synthesizing machine intelligence, responsive 3D WebGL interfaces, and high-throughput systems into memorable, visceral products.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white font-semibold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <span>Explore Selected Work</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-sm backdrop-blur-md transition-all">
                  <span>Resume / Dossier</span>
                </button>
              </div>
            </div>

            {/* Right Column: Zero-G Astronaut / Shards + Floating Role Capsules */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[440px]">
              
              {/* Zero-G Floating Astronaut Illustration with Parallax */}
              <div 
                className="relative w-72 h-72 sm:w-80 sm:h-80 transition-transform duration-300 ease-out animate-float"
                style={{
                  transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                }}
              >
                {/* Floating Outer Glass Shards (Zero-G Fragments) */}
                <div 
                  className="absolute -top-6 -left-4 w-10 h-10 border border-teal-300/40 bg-teal-400/10 backdrop-blur-md rotate-45 animate-float-slow"
                  style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}
                />
                <div 
                  className="absolute -bottom-8 right-6 w-14 h-8 border border-orange-400/40 bg-orange-500/10 backdrop-blur-md -rotate-12 animate-float"
                  style={{ transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)` }}
                />
                <div 
                  className="absolute top-1/2 -right-8 w-8 h-8 border border-purple-400/40 bg-purple-500/10 backdrop-blur-md rotate-12 animate-float-slow"
                />

                {/* Stylized Floating Zero-G Astronaut Visual Canvas */}
                <div className="w-full h-full rounded-3xl bg-gradient-to-b from-purple-900/30 to-black/60 border border-white/10 backdrop-blur-xl p-6 flex flex-col items-center justify-center text-center shadow-2xl shadow-orange-500/10 relative overflow-hidden group">
                  {/* Internal ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-cyan-500/20 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Zero-G Core Mascot Icon */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 p-1 mb-4 shadow-xl shadow-orange-500/30 relative z-10 animate-pulse-slow">
                    <div className="w-full h-full rounded-full bg-[#12071f] flex items-center justify-center border-2 border-orange-300/30">
                      <Cpu className="w-10 h-10 text-orange-300" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white relative z-10">Debojit Nath</h3>
                  <p className="text-xs text-orange-300/90 font-mono mt-1 relative z-10">debojit.tech • Zero-G Orbit</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-300 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 relative z-10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Engineered for 60 FPS Flow</span>
                  </div>
                </div>
              </div>

              {/* Floating Status Capsules (Right-side cards from reference) */}
              <div className="w-full mt-6 space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Full-Stack & Systems Architecture</p>
                      <p className="text-[11px] text-slate-400 font-mono">React • TypeScript • Cloud</p>
                    </div>
                  </div>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Interactive 3D & Creative Motion</p>
                      <p className="text-[11px] text-slate-400 font-mono">Three.js • WebGL • GSAP</p>
                    </div>
                  </div>
                  <Layers className="w-4 h-4 text-teal-400" />
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ======================================================= */
          /* WORLD 2: DRIFT (Uncanny Liminal / Backrooms Space)      */
          /* ======================================================= */
          <div className="max-w-4xl mx-auto w-full py-12 flex flex-col items-start space-y-8 animate-fade-in">
            
            {/* Warning / Liminal Tag */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-flicker" />
              <span className="text-xs font-mono uppercase tracking-widest text-stone-700 font-semibold">
                Off Duty • Liminal Corridor 0.1
              </span>
            </div>

            {/* Unsettling Liminal Headline */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-tight text-[#161c14] leading-[1.05]">
              Are we even in <span className="italic font-light text-emerald-950 underline decoration-amber-600/40">reality</span>?
            </h1>

            {/* Poetic Liminal Paragraph */}
            <p className="text-lg sm:text-2xl text-stone-700/90 max-w-2xl font-light leading-relaxed">
              No meetings. No commit logs. Just an endless hallway of fluorescent hums, unfinished thoughts, the embers of an RDR2 campfire, and midnight frequencies.
            </p>

            {/* Liminal Sub-World Portal Doors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full pt-6">
              
              {/* Door 1: RDR2 / Games */}
              <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold block mb-2">
                  Sub-World 01
                </span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  Campfire Dust (RDR2)
                </h3>
                <p className="text-xs text-stone-600 mt-2 font-mono leading-relaxed">
                  Arthur Morgan, weeping in the rain. Elden Ring fog and lost frontiers.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <span>Enter Corridor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Door 2: Spotify Frequencies */}
              <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold block mb-2">
                  Sub-World 02
                </span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                  Midnight Frequencies
                </h3>
                <p className="text-xs text-stone-600 mt-2 font-mono leading-relaxed">
                  Tame Impala, The Weeknd, Lana Del Rey. Soundscapes composed by a friend.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <span>Listen In</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Door 3: Cinema */}
              <div className="p-6 rounded-2xl bg-white/40 border border-black/10 backdrop-blur-md hover:bg-white/70 transition-all hover:-translate-y-1 cursor-pointer group">
                <span className="text-xs font-mono uppercase tracking-widest text-stone-600 font-bold block mb-2">
                  Sub-World 03
                </span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                  Empty Cinema
                </h3>
                <p className="text-xs text-stone-600 mt-2 font-mono leading-relaxed">
                  Flickering projectors, silent theaters, and cinema that lingers.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-stone-800">
                  <span>Open Door</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="relative z-30 max-w-7xl mx-auto w-full px-6 py-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 text-xs font-mono">
        <div className={world === 'focus' ? 'text-slate-400' : 'text-stone-600'}>
          © {new Date().getFullYear()} Debojit Nath • <span className="font-semibold">debojit.tech</span>
        </div>

        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/DebojitNath" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 transition-colors ${
              world === 'focus' ? 'text-slate-400 hover:text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 transition-colors ${
              world === 'focus' ? 'text-slate-400 hover:text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
          <a 
            href="#contact"
            className={`flex items-center gap-1.5 transition-colors ${
              world === 'focus' ? 'text-slate-400 hover:text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact</span>
          </a>
        </div>
      </footer>

    </div>
  );
}
