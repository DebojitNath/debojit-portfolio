import { useState } from 'react';
import { Sparkles, Compass, Radio, Github } from 'lucide-react';

export default function App() {
  const [activeWorld, setActiveWorld] = useState<'space' | 'off-duty'>('space');

  return (
    <div className={`min-h-screen transition-colors duration-700 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden ${
      activeWorld === 'space' 
        ? 'bg-[#030308] text-white' 
        : 'bg-[#0e0f0e] text-[#d4ded0]'
    }`}>
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {activeWorld === 'space' ? (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-700/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-emerald-800/10 rounded-full blur-[130px]" />
          </>
        )}
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            debojit.tech • signal online
          </span>
        </div>

        {/* World Switcher Preview */}
        <div className="flex items-center bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 text-xs">
          <button
            onClick={() => setActiveWorld('space')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeWorld === 'space'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Space</span>
          </button>
          <button
            onClick={() => setActiveWorld('off-duty')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeWorld === 'off-duty'
                ? 'bg-[#242b23] text-emerald-300 shadow-lg shadow-emerald-950/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Off Duty</span>
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 max-w-4xl mx-auto w-full my-auto py-16 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 mb-6 font-mono">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Genesis Build v0.1 • Deployment Ready</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight mb-6">
          {activeWorld === 'space' ? (
            <>
              Architecting in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-white font-medium">cosmic void</span>.
            </>
          ) : (
            <>
              Are we even in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-200 to-white font-medium">reality</span>?
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl font-light leading-relaxed mb-10">
          {activeWorld === 'space' ? (
            <>
              Personal portfolio of <span className="text-white font-normal">Debojit</span>. Software developer & AI engineer crafting cinematic digital experiences and high-performance applications.
            </>
          ) : (
            <>
              Beyond Code: exploring soundscapes, liminal spaces, cinema, and the worlds of RDR2, Elden Ring, and late-night frequencies.
            </>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
          <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            Domain: <strong className="text-white">debojit.tech</strong>
          </div>
          <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-neutral-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Status: <span className="text-white">Constructing Phase 1</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-xs text-neutral-500 font-mono">
        <div>© {new Date().getFullYear()} Debojit. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/DebojitNath/debojit-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>github.com/DebojitNath/debojit-portfolio</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

