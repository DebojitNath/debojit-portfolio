# 06 — Tech Stack

> Nothing here is installed until the owner approves. Versions drift: check the **current stable version** at install time and pin it.
> "Verified" below means: read from the project's own GitHub README on 2026-10-30. Anything else is general knowledge or a suggestion and must be checked against current docs before use.

## 1. Stack status

| Tool | Role | Status |
|---|---|---|
| React + TypeScript | UI | DECIDED direction (owner's existing skill set) |
| Vite | Dev/build tool | PROPOSED (suggested over Next.js because a portfolio rarely needs server rendering; confirm) |
| Tailwind CSS | Styling | PROPOSED |
| Lenis | Smooth scroll | Owner shortlisted it |
| GSAP (+ ScrollTrigger, SplitText, Flip, etc.) | Core animation | Owner shortlisted it |
| React Bits | Ready-made animated React components | Owner shortlisted it |
| Vanta | Preset animated 3D backgrounds | Owner shortlisted it; limited use, see below |
| React Three Fiber (+ helpers) | 3D/WebGL scenes in React | PROPOSED (not README-verified here) |
| Framer Motion | UI micro-interactions and mount/unmount animation | PROPOSED (not README-verified here) |
| Hosting, domain setup | Deployment | OPEN (owner has a `.tech` domain) |
| Contact, Spotify, movie-data back-end approach | Server-side bits | OPEN |

## 2. Lenis (verified)

- Lightweight, dependency-free smooth-scroll library that runs on the **browser's native scroll**, so `position: sticky`, anchor links and accessibility keep working.
- Install: `npm i lenis`; `import Lenis from 'lenis'`. React adapter: `lenis/react`. Snap plugin: `lenis/snap`. Recommended CSS: `import 'lenis/dist/lenis.css'`.
- Basic setup: `new Lenis({ autoRaf: true })`.
- **Honors `prefers-reduced-motion` by default** (`respectReducedMotion` defaults to true). Do not turn this off.
- Useful options listed in README: `lerp`, `duration`, `easing`, `anchors`, `allowNestedScroll`, `autoToggle`, `syncTouch`, `infinite`, `orientation`. Properties include `velocity`, `progress`, `direction`.
- Nested scroll areas (modals, panels) need `data-lenis-prevent` or `allowNestedScroll: true`.
- Known limitations per README: no native CSS scroll-snap (use `lenis/snap`), capped to 60fps on Safari, smooth scroll does not work over iframes, `position: fixed` may lag on some older Safari/Mac setups.
- **GSAP ScrollTrigger sync** (from the README; re-check against current docs):

```js
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

- Do not run a second smooth-scroll system (for example GSAP ScrollSmoother) at the same time as Lenis. (General knowledge, not from the README: two systems compete for scroll control.) Pick one and tell the owner.

## 3. GSAP (verified)

- Framework-agnostic animation library; animates CSS, SVG, canvas, WebGL objects and plain JS objects.
- Per its README it is **free including all plugins** (SplitText, MorphSVG, and the others formerly paid), even for commercial use. Check the current license page before relying on this for anything unusual.
- Install: `npm install gsap`. Register plugins: `gsap.registerPlugin(ScrollTrigger, ...)`. Imports look like `import { gsap } from "gsap"` and `import ScrollTrigger from "gsap/ScrollTrigger"`.
- React: the `@gsap/react` package exposes a `useGSAP()` hook that replaces `useEffect`/`useLayoutEffect` and automates cleanup. Use it for React components.
- `gsap.matchMedia()` helps build responsive and accessibility-friendly animations (for example, different animations for reduced motion or mobile).
- Plugins named in the README: ScrollTrigger, ScrollSmoother, SplitText, MorphSVG, MotionPath, Flip, Observer, Draggable.

## 4. React Bits (verified)

- Library of animated, interactive React/Next.js components (README: 215+; categories: Text Animations 33, Animations 38, Components 48, Micro 34, Backgrounds 63).
- Each component comes in four flavors: JS or TS, styled with CSS or Tailwind.
- Install with the shadcn CLI, for example: `npx shadcn@latest add @react-bits/SplitText-TS-TW` (JS/TS then CSS/TW suffix). Or jsrepo. Or copy the code by hand from the component's page.
- Live demos with controls: reactbits.dev (category pages such as `/c/text-animations`, `/c/animations`, `/c/micro`, `/c/backgrounds`).
- License: **MIT + Commons Clause**; README says free for personal and commercial use. A paid "Pro" tier exists; do not add it without asking.
- Many people use the same components. Restyle them (colors, timing, layout) so the site does not look generic. Present customization options.
- Not verified here: which components depend on GSAP, three.js, or other libraries. Check each component's code and dependencies before adding it, and tell the owner about any new dependency it pulls in.

## 5. Vanta (verified)

- Adds animated 3D backgrounds to an HTML element. Rendered with three.js (WebGL) or p5.js.
- README states about 120kb minified and gzipped, mostly three.js.
- Needs `window.THREE` (script tag) or you pass `THREE` in the options when using npm `three`. Effects have options (colors, speeds) and support mouse/touch controls (`mouseControls`, `touchControls`, `gyroControls`).
- Clean up with `effect.destroy()` (important in React).
- README credits effects such as waves, fog, clouds, birds, trunk and topology; the demo gallery at vantajs.com shows the full set. Verify the effect list there before promising one.
- Caveats to tell the owner: effects are presets (other sites use them too), and it carries its own three.js, so combining it with React Three Fiber can load three.js twice. Suggested use: quick prototypes or a simple background, not the signature scenes (black hole, grass-in-wind need custom work).

## 6. Not verified here (PROPOSED, check docs first)

- **React Three Fiber** and helpers (Drei, postprocessing) for 3D scenes, bloom and particles.
- **Framer Motion** for React UI micro-interactions and page mount/unmount transitions.
- **OGL** as a lighter WebGL alternative, **Rive/Lottie** for designer-made animated assets, **Theatre.js** for timeline choreography, **Spline** for visually designed 3D.
- Browser features: View Transitions API, CSS scroll-driven animations, `@property`. Check support tables before relying on them.

## 7. Rules for adding anything new

1. Ask the owner first (options format, file 02). Include bundle-size and performance impact.
2. Prefer one tool per job. Avoid two libraries doing the same thing.
3. Check the current version and docs. Pin the version.
4. Record the addition in the decision log and update this file.
5. Remove unused dependencies promptly.

## 8. Secrets and back-end safety

- API keys, tokens and client secrets must never appear in frontend code or in the repo. Use environment variables on a server or serverless function.
- The contact form needs spam protection and should never expose the destination mailbox or credentials.
- Spotify: read the current developer documentation and terms before choosing between the official embed, the Web API, or both. Tokens stay server-side.
