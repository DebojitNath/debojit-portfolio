# PREMIUM_LOOK_GUIDE.md
### Fonts + Motion Vocabulary for Debojit's Portfolio

> **Who reads this:** the coding agent working on my portfolio.
> **Why it exists:** I know what I want to *feel*, but I don't know the technical names for fonts and animations. This file is the dictionary between my feelings and your code.

---

## 0. Ground Rules for the Agent (read first)

1. **Do not invent.** Don't make up fonts, libraries, or animation names that aren't listed here or that you can't verify. If unsure, say "not sure" and ask me.
2. **Always give me options.** Before building anything visual, propose **2-3 choices** (A / B / C) with a one-line plain-English description of how each will *feel*. Wait for my pick.
3. **Mix, don't copy.** The references below are inspiration for a *feeling*, not templates to clone.
4. **One star per screen.** Pick ONE memorable moment per page (a headline reveal, a 3D object, a scroll effect). Keep everything else calm. Too many effects = cheap look, not premium.
5. **Explain simply.** I'm a CS student, not a frontend artist. Use plain words. When you use a term from this file, tell me the name so I learn it.
6. **Never hallucinate my facts.** Site copy (bio, projects, skills) must come from my resume / facts file only. If a fact is missing, leave a clear `TODO` placeholder.
7. **Quality floor, always on:** works on mobile, respects `prefers-reduced-motion`, keeps text readable, doesn't tank performance (aim smooth 60fps), keyboard focus visible.

---

## 1. What I Noticed in My Reference Sites

Here is what makes those sites feel "unique, subtle and lively". These are the *ingredients*:

| What I saw | Plain-English name | Why it feels premium |
|---|---|---|
| "The power of *digital* storytelling": thin sans mixed with a flowing italic serif | **Serif + sans pairing / italic accent contrast** | Two personalities in one headline: calm + expressive |
| "Hey! I'm **Adrian**, a **designer** and **developer**": some words light gray, some bold black | **Weight + tone contrast (two-tone headline)** | Eye gets guided word by word, like a spoken sentence |
| "we are *rare*" huge thin letters sitting *behind and around* a 3D diamond | **Text + 3D object layering (depth sandwich)** | Text feels like it lives in the same world as the object |
| Big condensed bold "MUSEUM" cropped by the card edge | **Oversized / cropped display type** | Confident, editorial, poster-like |
| Tiny monospace labels in corners, nav, "book a call" | **Micro-typography / UI chrome** | Gives a "tech instrument panel" feel |
| Glass-like pill nav, soft glows | **Glassmorphism + glow** | Depth without clutter |
| Lots of empty space | **Negative space / breathing room** | Premium = restraint |

**My current site (space theme, floating astronaut):** it already has the cosmic vibe. What it needs is *typographic personality* and *orchestrated text entrance*, not more stuff on screen.

---

## 2. Font Library (pick, mix, ask me)

Where to get them: **Google Fonts** (free), **Fontshare** (free, very trendy), **Fontsource** (npm install). Prefer fonts available as **variable fonts** (one file, many weights = smoother animation + faster load).

### 2A. Elegant Serifs (the "soft, luxury, editorial" feel)
| Font | Feel | Source |
|---|---|---|
| **Instrument Serif** | Modern, sharp italic. Very "2024 designer portfolio" | Google |
| **Fraunces** | Wonky, warm, quirky curves (has "soft" & "wonk" settings) | Google |
| **Playfair Display** | Classic high-contrast, fashion-magazine | Google |
| **Cormorant Garamond** | Ultra-thin, graceful, ethereal | Google |
| **Newsreader** | Refined, readable, bookish | Google |
| **DM Serif Display** | Chunky elegant, friendly | Google |
| **Bodoni Moda** | Dramatic fashion-runway contrast | Google |
| **Gloock** | Bold, characterful display serif | Google |
| **Italiana** | Delicate, thin, minimal luxury | Google |

### 2B. Modern Sans (clean, tech-premium)
| Font | Feel | Source |
|---|---|---|
| **Inter Tight** | Tighter, sharper Inter; neutral and crisp | Google |
| **Manrope** | Friendly geometric, great body font | Google |
| **Bricolage Grotesque** | Quirky, characterful, has width axis | Google |
| **Space Grotesk** | Techy, slightly retro-futuristic (space theme friendly) | Google |
| **Syne** | Artsy, wide, experimental headlines | Google |
| **Unbounded** | Rounded, wide, futuristic | Google |
| **Sora** | Clean, tech, AI-company look | Google |
| **Outfit** | Geometric, soft, modern | Google |
| **General Sans** | Smooth, minimal, startup-premium | Fontshare |
| **Satoshi** | Very popular "premium product" sans | Fontshare |
| **Clash Display** | Bold, sharp, high-impact headlines | Fontshare |
| **Cabinet Grotesk** | Friendly yet strong, trendy | Fontshare |
| **Switzer** | Neutral Swiss-style, ultra clean | Fontshare |

### 2C. Monospace (for small labels, tags, code-ish details)
| Font | Feel | Source |
|---|---|---|
| **JetBrains Mono** | Developer-native, sharp | Google |
| **IBM Plex Mono** | Technical, slightly formal | Google |
| **Space Mono** | Retro-space, quirky | Google |
| **Geist Mono** | Ultra clean, Vercel-style | Fontsource / Vercel |
| **DM Mono** | Soft, rounded mono | Google |

### 2D. Script / Accent (use VERY sparingly: one word max)
Use only for a single highlighted word like in "storytelling": **Instrument Serif Italic**, **Playfair Display Italic**, **Fraunces Italic**, **Pinyon Script**, **Caveat**.

### 2E. Pairing Recipes (Agent: offer these as options)

| Recipe name | Headline | Body | Labels | Vibe |
|---|---|---|---|---|
| **"Editorial Space"** | Instrument Serif (+ italic accent) | Inter Tight | JetBrains Mono | Premium, calm, cosmic |
| **"Tech Luxe"** | Clash Display | Satoshi | Geist Mono | Bold, modern AI-lab |
| **"Soft Dream"** | Fraunces | Manrope | DM Mono | Warm, dreamy, human |
| **"Future Wide"** | Unbounded | Sora | Space Mono | Sci-fi, game-like |
| **"Gallery Quiet"** | Cormorant Garamond | General Sans | IBM Plex Mono | Minimal, museum-like |
| **"Loud Poster"** | Bricolage Grotesque (bold, condensed) | Switzer | JetBrains Mono | Playful, confident |

> **Idea for my two-world structure (as options, not rules):** the *On Duty* world could use a cleaner pairing (e.g. Tech Luxe or Editorial Space), and *Off Duty* could break the rules (e.g. Soft Dream, or a deliberately off-balance look). Ask me before deciding.

### 2F. Typography Tricks That Create the "Subtle & Lively" Feel
- **Mixed weights in one line:** light + bold in the same sentence.
- **Mixed families in one line:** sans words with one *italic serif* word.
- **Two-tone text:** some words at 40% opacity, others at 100%.
- **Tight letter-spacing on big text** (`letter-spacing: -0.02em` to `-0.05em`) = confident, modern.
- **Wide letter-spacing on tiny labels** = "instrument panel" feel.
- **Fluid sizing with `clamp()`** so headings scale smoothly on every screen.
- **Variable font axes** (weight, width, optical size) so text can *morph* on hover/scroll.
- **Outlined text** (transparent fill, thin stroke) layered behind solid text for depth.
- **Oversized, cropped, or overlapping text** that partly hides behind an object (like "we are rare" behind the diamond).
- **Text-wrap balance** (`text-wrap: balance`) to avoid ugly one-word last lines.

---

## 3. Text Animation Dictionary ("make the fonts appear lively")

This is the most important section for the feeling I want. **Ask me which to use per heading.**

| # | Name | What I'd see | Feels like | Difficulty |
|---|---|---|---|---|
| T1 | **Line mask reveal** | Each line slides up from behind an invisible edge, like rising from a slot | Cinematic, premium (most "expensive" look) | Medium |
| T2 | **Word stagger reveal** | Words appear one after another with a tiny delay | Smooth, readable, elegant | Easy |
| T3 | **Character stagger reveal** | Letters pop in one-by-one with slight rise/fade | Playful, lively | Medium |
| T4 | **Blur-to-sharp fade** | Text starts blurry and sharpens into focus | Dreamy, subtle | Easy |
| T5 | **Scroll-scrubbed word fill** | As I scroll, words in a paragraph light up from gray to white | Storytelling, reading-guided | Medium |
| T6 | **Flip-word / rotating word** | One word cycles through others (slot-machine or vertical flip) | Dynamic identity | Medium |
| T7 | **Scramble / decode text** | Random characters resolve into the real word | Hacker, sci-fi, techy | Medium |
| T8 | **Typewriter** | Letters typed with a blinking cursor | Terminal, retro | Easy |
| T9 | **Variable-font weight morph** | Text thickens/thins when hovered or scrolled | Alive, organic | Medium-Hard |
| T10 | **Marquee / ticker** | Huge text scrolls endlessly sideways | Bold, rhythmic, editorial | Easy |
| T11 | **Gradient sweep / shimmer** | A light streak glides across the text | Shiny, premium, "AI product" | Easy |
| T12 | **Kinetic typography** | Text stretches, skews, or reacts to scroll speed | Experimental, awards-site | Hard |
| T13 | **Text on a 3D path or sphere** | Words curve around a shape | Immersive, WebGL feel | Hard |
| T14 | **Letter-spacing breathe** | Spacing slowly expands/contracts on entrance | Subtle, calm | Easy |
| T15 | **Hover letter swap / roll** | On hover, letters roll up and a duplicate rolls in | Tactile micro-interaction (great for nav links) | Medium |
| T16 | **Cursor-reactive text** | Letters push away or glow near the mouse | Interactive, playful | Hard |

### Combo idea for hero headings (offer as options)
- **Option A, "Cinematic":** T1 (line mask reveal) + T4 (blur-to-sharp) on the subtext
- **Option B, "Alive":** T3 (character stagger) + T6 (flip-word on the highlighted word) + T11 (soft shimmer)
- **Option C, "Techy":** T7 (scramble) for the title + T8 (typewriter) for the small label

---

## 4. General Motion & Effects Dictionary (beyond text)

### Scroll & Page Feel
| Name | What it is |
|---|---|
| **Smooth scroll (inertia scroll)** | Scrolling feels buttery, slightly delayed. *Lenis* does this |
| **Scroll-triggered reveal** | Things animate in as they enter the screen |
| **Pinning / sticky sections** | A section stays fixed while content animates inside it |
| **Scrubbing** | Animation progress is tied directly to scroll position |
| **Horizontal scroll section** | Vertical scroll moves content sideways (good for projects gallery) |
| **Parallax** | Background layers move slower than foreground = depth |
| **Page transitions** | Smooth wipe/fade/morph between pages (important for my multi-page + world-switch idea) |
| **Preloader** | Intro loading screen (counter, logo, "click anywhere to continue") |

### Reveal & Shape Effects
| Name | What it is |
|---|---|
| **Clip-path reveal** | An image/section is "unmasked" in a shape (circle, rectangle expanding) |
| **Image mask expand** | Small framed image grows to fullscreen on scroll |
| **Curtain / wipe** | A colored panel slides away to reveal content |
| **Morphing blob / shape** | A shape smoothly changes into another |

### Mouse & Hover (Micro-interactions)
| Name | What it is |
|---|---|
| **Custom cursor** | Replaced cursor (dot, ring, or text label that follows the mouse) |
| **Magnetic button** | Button gently pulls toward the cursor |
| **3D tilt card** | Card tilts in 3D following the mouse |
| **Spotlight / glow follow** | A soft light follows the cursor over cards |
| **Hover distortion** | Image ripples/warps on hover (needs shader) |
| **Underline draw / grow** | Link underline animates in smoothly |

### Depth & Atmosphere (great for my space theme)
| Name | What it is |
|---|---|
| **Floating / bobbing loop** | Object gently drifts up and down (my astronaut) |
| **Mouse parallax** | Layers shift slightly as the mouse moves |
| **Particle field / starfield** | Thousands of tiny moving dots (stars, dust) |
| **Film grain / noise overlay** | Subtle texture that kills the "flat digital" look |
| **Glassmorphism** | Frosted-glass panels with blur |
| **Glow / bloom** | Soft light halos around bright things |
| **Gradient mesh / aurora background** | Slow-moving blurred color clouds |
| **Fog / depth haze** | Distance fades into mist (liminal worlds) |
| **WebGL shader effects** | GPU-drawn ripples, noise, liquid, glitch, chromatic aberration |
| **3D model (GLB) scene** | Real 3D object rendered live with Three.js |

---

## 5. Tool / Library Cheat Sheet (verify before installing)

| Tool | What it's for | Notes |
|---|---|---|
| **GSAP** | The industry-standard animation engine (timelines, text, scroll) | Includes ScrollTrigger and SplitText; check the current license/availability before using |
| **Lenis** | Smooth scrolling | Pairs perfectly with GSAP ScrollTrigger |
| **Motion (formerly Framer Motion)** | React-friendly animations, page transitions, layout animations | Good if site is React/Next.js |
| **Three.js / React Three Fiber (R3F) + Drei** | 3D and WebGL scenes | For 3D objects, particles, shaders |
| **OGL** | Lightweight WebGL | Lighter alternative to Three.js for shader backgrounds |
| **Splitting.js** | Splits text into letters/words for animation | Simple alternative if not using GSAP SplitText |
| **Lottie** | Play After Effects-style icon animations | For small icon/loader animations |
| **React Bits** | Ready-made animated React components (text effects, backgrounds) | On my shortlist |
| **Vanta.js** | Quick animated backgrounds (fog, birds, waves) | On my shortlist; good for fast liminal/nature backgrounds |
| **Aceternity UI / Magic UI** | Copy-paste animated components | Good for quick experiments |
| **Theatre.js** | Visual timeline editor for 3D/camera animation | Good for cinematic scroll scenes |

> **Agent rule:** before suggesting a library, confirm it's actively maintained and compatible with my stack. If you're unsure of the current API, say so rather than guessing.

---

## 6. "Mix It" Recipes (offer as options when I ask for a section)

Each recipe = **font recipe + text animation + scene effects**. Mix and match across my pages.

### Recipe 1, "Quiet Cosmos" (calm premium; fits space landing)
- Fonts: Instrument Serif (italic accent) + Inter Tight + JetBrains Mono labels
- Text: T1 line mask reveal; T5 scroll-scrubbed paragraph
- Scene: slow starfield, floating astronaut loop, subtle grain, mouse parallax
- Smooth scroll: Lenis

### Recipe 2, "Glass Terminal" (techy; fits projects)
- Fonts: Sora or Clash Display + Geist Mono
- Text: T7 scramble on titles, T15 hover letter roll on nav
- Scene: glass cards, spotlight-follow glow, 3D tilt cards, magnetic buttons

### Recipe 3, "Liminal Drift" (unsettling; fits Off Duty / backrooms feel)
- Fonts: something off-balance, e.g. Fraunces or a plain system-like sans with oversized spacing
- Text: T4 blur-to-sharp, T14 letter-spacing breathe, slow flicker
- Scene: fog haze, heavy grain, slow camera drift, long page-transition fades

### Recipe 4, "Neon Arcade" (gaming sections)
- Fonts: Unbounded or Syne + Space Mono
- Text: T3 character stagger, T11 shimmer, T10 giant marquee
- Scene: glow/bloom, glitch or chromatic-aberration hover, custom cursor
- *Note:* different games may need different themes; ask me per game.

### Recipe 5, "Open Field" (nature; fits Contact)
- Fonts: Cormorant Garamond or Newsreader + Manrope
- Text: T2 soft word-stagger, T14 breathe
- Scene: slow parallax grass/tree layers, warm gradient light, gentle particles (pollen/dust)

---

## 7. How I Will Describe What I Want (Agent: translate these)

When I use feelings or rough words, map them like this and **confirm with me**:

| If I say... | Probably means... |
|---|---|
| "Smooth", "buttery" | Lenis smooth scroll + easing curves like `power3.out` / `expo.out` |
| "Text slides up like it's coming from nowhere" | Line mask reveal (T1) |
| "Words glowing one by one as I scroll" | Scroll-scrubbed word fill (T5) |
| "Alive", "breathing" | Slow looping float / letter-spacing breathe / variable-font morph |
| "Expensive", "premium" | More whitespace, fewer effects, better type pairing, slower easing |
| "Hacker-ish" | Scramble text, monospace, terminal cursor |
| "Dreamy" | Blur-to-sharp, soft gradient glow, grain, slow motion |
| "Cinematic" | Pinned scenes, camera-like parallax, big type, dark vignette |
| "Futuristic" | Wide fonts, glow, glass, shaders, 3D |
| "Unique but subtle" | One bold typographic choice + calm everything else |

---

## 8. Timing & Easing Cheat Sheet (what makes it feel *expensive*)

- **Cheap-looking:** fast (0.2s), linear or default `ease`, everything animates at once.
- **Premium-looking:** slower (0.8-1.4s for hero text), **ease-out curves** (start fast, settle softly), **staggered** (0.04-0.1s between words/letters), and **one thing at a time**.
- Good named easings to try: `expo.out`, `power3.out`, `power4.out`, `cubic-bezier(0.16, 1, 0.3, 1)`.
- Page-load order for a hero (a good default to offer): background fades in, then headline reveals, then subtext, then buttons and nav last.
- Keep hover effects fast (0.2-0.4s) so the site feels responsive; keep entrance effects slow so it feels cinematic.

---

## 9. Workflow I Want With the Agent

1. I tell you the page/section and the *feeling* I want.
2. You propose **2-3 options** from this file (fonts + text animation + scene effect), each described in one plain sentence.
3. I pick or say "mix A's font with C's animation".
4. You build it, naming each effect used so I learn the vocabulary.
5. I say "tweak X" and you only change X, without touching the rest.
6. You flag anything that may hurt performance or mobile experience.

**Starter prompt I can paste:**
> "Using PREMIUM_LOOK_GUIDE.md, give me 3 options for the hero headline of my landing page. For each, name the font pairing, the text animation (with its T-number), and one background effect. Keep it subtle and premium. Don't build anything until I choose."

---

## 10. Things to Avoid (the "templated / cheap" tells)

- Every section fading up the same way (generic and repetitive).
- Too many different fonts (stick to 2 families + 1 mono).
- Animating everything at once.
- Giant glowing gradients on every element.
- Text over busy imagery with poor contrast (always check readability).
- Autoplay sound without a user click.
- Heavy 3D/shaders without a lightweight fallback on mobile.
- Ignoring `prefers-reduced-motion` (provide a calmer version).

---

*End of file. If the agent is ever unsure about a term, font, or library here, it must ask me instead of guessing.*
