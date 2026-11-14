# 05 — Animation Catalog

**This is a menu, not a to-do list.** Do not implement everything. For each page or sub-world, pick **3–5 signature effects** with the owner (options format, file 02), plus the shared basics below.

Tool names are *candidates*. Verify the tool is installed and check its current docs before using it. Libraries verified from their READMEs are listed in `06-tech-stack.md`.

## 0. Shared basics (site-wide, PROPOSED)

- Smooth (inertia) scroll
- One consistent easing family: long, smooth, confident curves (ease-out-expo style), never bouncy by default
- Consistent hover/focus states and button press feedback
- Reduced-motion alternative for every animation
- Loading/preload screen (DECIDED) and "click anywhere to continue"

## 1. Scroll

| Animation | Plain meaning | Candidate tools |
|---|---|---|
| Smooth/inertia scroll | Scroll glides instead of jumping | Lenis |
| Reveal on scroll | Elements appear as they enter the screen | GSAP ScrollTrigger |
| Staggered reveal | Items appear one after another | GSAP |
| Parallax | Layers move at different speeds for depth | GSAP + Lenis |
| Pinned section | A section sticks while content animates inside | ScrollTrigger |
| Scroll scrubbing | Animation progress follows scroll position | ScrollTrigger |
| Horizontal scroll section | Vertical scroll moves content sideways | ScrollTrigger |
| Scroll velocity skew | Content tilts based on scroll speed | Lenis velocity + GSAP |
| Scroll progress bar | A line shows how far down you are | Lenis progress |
| Image-sequence scroll | Frames play as you scroll | GSAP + canvas |
| Infinite marquee | Looping text/logo strip | GSAP / CSS |
| Scroll snapping | Sections lock into place | Lenis snap plugin |

## 2. Text

| Animation | Plain meaning | Candidate tools |
|---|---|---|
| Split-text reveal | Letters/words/lines animate in separately | GSAP SplitText, React Bits |
| Masked line reveal | Lines slide up from behind an invisible edge | GSAP SplitText |
| Typewriter | Text types itself | React Bits |
| Scramble/decode | Random characters settle into the word | GSAP, React Bits |
| Rotating words | One word cycles through options | React Bits |
| Scroll text fill | Dim text brightens as you read | ScrollTrigger |
| Count-up | Numbers animate to a value | GSAP |
| Shiny/gradient text | A light sweep across text | React Bits, CSS |
| Underline draw | Underline draws itself on hover | CSS, GSAP |
| Flicker text | Text flickers like faulty light (liminal) | CSS, GSAP |

## 3. Cursor

| Animation | Plain meaning | Candidate tools |
|---|---|---|
| Custom cursor | Dot + ring that follows with lag | GSAP |
| Cursor states | Cursor grows or shows a label over items | GSAP |
| Magnetic button | Button pulls toward the cursor | GSAP |
| Spotlight glow | Soft light follows the cursor on a surface | CSS + JS |
| 3D tilt | Cards tilt toward the cursor | React Bits, GSAP |
| Image trail | Images appear behind the moving cursor | GSAP |
| Cursor trail / fluid | Ink or smoke follows the mouse | React Bits (cursor effects) |
| Cursor as breeze | Grass/particles bend away from the cursor | WebGL / canvas |

## 4. Micro-interactions

Button fill sweep, arrow swap, sibling-dim link hover, image zoom on hover, card lift, click ripple, input focus glow with floating label, toggle/switch, success checkmark draw, skeleton shimmer, "Copied" feedback, animated tab title/favicon.
Candidate tools: CSS, GSAP, Framer Motion, React Bits (Micro category).

## 5. Page-level

| Animation | Plain meaning | Candidate tools |
|---|---|---|
| Preloader | Intro while assets load | GSAP |
| Page transition | Wipe/crossfade between routes | GSAP, Framer Motion, View Transitions API |
| Shared-element transition | Thumbnail expands into a detail page | GSAP Flip |
| World-switch transition | Big cinematic change between worlds (OPEN design) | GSAP + shader/clip-path |
| Fullscreen menu | Overlay with staggered links | GSAP |
| Hide-on-scroll navbar | Nav hides down, returns up | JS + CSS |
| Theme reveal | Circular wipe between themes | CSS clip-path |

## 5b. Native browser features worth knowing (verify browser support before use)

View Transitions API, CSS scroll-driven animations, `clip-path` / `mask`, `backdrop-filter` (frosted glass), `mix-blend-mode` (inverting cursor), CSS `@property` (animated gradients), SVG filters (wobble/rough paper).

## 6. Visual / WebGL

| Animation | Plain meaning | Candidate tools |
|---|---|---|
| Animated gradient / mesh | Soft drifting color blobs | React Bits backgrounds |
| Grain/noise overlay | Film texture over everything | CSS / SVG |
| Particles / starfield | Stars, dust, embers, fireflies | React Three Fiber, React Bits |
| Shader backgrounds | Waves, fog, clouds, aurora | Vanta (preset), React Bits, custom shaders |
| Image distortion | Images ripple or liquid-warp | WebGL |
| 3D object reacting to cursor/scroll | Model rotates with input | React Three Fiber |
| Camera fly-through | Scroll moves you through a 3D scene | R3F + Lenis |
| Gravitational lensing | Space bends around a black hole | Custom shader |
| Bloom / glow | Bright things glow | postprocessing |
| SVG line draw | A path draws itself | GSAP DrawSVG |
| SVG morph | One shape turns into another | GSAP MorphSVG |
| Motion along a path | Element travels a curve | GSAP MotionPath |
| Clip-path reveal | Image opens from a shape | GSAP / CSS |
| Depth-of-field blur | Distant layers blur slightly | WebGL / CSS |

## 7. Theme-specific effects (candidates per sub-world)

| Theme | Candidate effects |
|---|---|
| Liminal | Fluorescent flicker, VHS/CRT look, light rays through fog, grain, drifting camera, drifting dust |
| Cyberpunk | Glitch text/images, chromatic aberration, neon flicker, scanlines, ASCII/dither images |
| RDR2 | Drifting dust motes, heat haze, film burn/light leaks, background gameplay video |
| Elden Ring | Rising embers, fog, ornate serif type, slow reveal like cathedral light |
| Space | Starfield, black hole shader, nebula layers, bloom, scroll camera |
| Nature/Contact | Swaying grass, fireflies that brighten near cursor, golden-hour gradient |
| Tame Impala | Melting/kaleidoscopic gradients |
| The Weeknd | Dark red neon glow, cinematic grade |
| Lana Del Rey | Warm film grain, Polaroid frames, light leaks |
| Movies | Letterbox bars, projector flicker, poster carousel |
| Blog | Typewriter/ink-draw text, paper grain, page-turn transition |

## 8. Small touches (suggest, do not assume)

Live local-time display, tab title change when the visitor switches tabs, command palette (Ctrl+K), hidden easter eggs / mini-game on a 404 page, blur-up image loading, time-of-day lighting shifts, subtle UI sounds with a mute toggle, "now playing / now gaming" widget, gyroscope tilt on mobile.

## 9. Selection protocol

1. Check this catalog and `04-design-and-sound-direction.md` for the page's vibe.
2. Shortlist candidate effects that fit the vibe and the performance budget.
3. Present them as options (file 02 format) with plain-language descriptions and honest cost notes.
4. After the owner chooses, record the choice in the decision log.
5. If the owner suggests an effect not in this catalog, add it here.
