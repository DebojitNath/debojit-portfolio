# 08 — Decision Log

Newest entries go at the **top** of the "Log" section. Newest entry wins if two entries conflict.

**How to use:** whenever the owner picks an option, changes direction, or reverses an earlier choice, add a line here in the same session. Use the real date (YYYY-MM-DD). Only record what the owner actually said or picked. Do not record your own suggestions as decisions.

Entry format:

```
YYYY-MM-DD | Area | Decision | Changed from (if any) | Notes
```

## Log

2026-11-23 | Hero Copy | Hero copy = set B with flip-word animation | Set A / initial | Active set B with animated flip words (CS student, hackathon winner, open-source contributor, chess player, competitive gamer), pause/a11y controls, and inactive sets A and C stored in src/content/heroCopy.ts.
2026-11-14 | Mountain Viewport Height Alignment | Anchored alien mountains to absolute bottom of hero viewport (h: 420px) with towering needle peaks reaching into the bottom third of the initial landing screen directly below hero content. Lowest base remains pure black #000000 flowing into outer space on scroll down. | DECIDED | Owner requested mountain peaks be clearly visible on initial landing view.
2026-11-14 | Gap & Pink Sun Disappearance Fix | Eliminated mountain side gaps by decoupling mountains from max-w-7xl and spanning full 100vw edge-to-edge. Fixed pink sun/nebula light source so it completely vanishes (opacity: 0, visible: false) immediately upon scrolling past mountains, transitioning smoothly into pure pitch-black space (#000000) with only stars. | DECIDED | Owner identified gap bug and requested complete disappearance of pink light source below mountains.
2026-11-14 | Hero & Mountain Underground Void Fix | Replaced cartoon astronaut with clean, sleek, minimal zero-G astronaut. Restored the single previous celestial sphere (removed excess green sphere) and kept it in Hero so it scrolls away naturally. Fixed mountains so lowest part flows directly into pure pitch-black space (#000000) with zero purple transition, seamlessly making the planet underground open directly into outer space void. | DECIDED | Owner requested clean, simple astronaut, previous sphere restored, and mountain base matching black space void without purple transition.
2026-11-14 | Hero & Scroll Void Journey | Cel-shaded inverted zero-G astronaut recreated matching reference artwork (bold orange suit, turquoise gauntlets/pads, floating synthesizer, retro mic, shattered cyan crystals). Celestial spheres moved into Hero sky (naturally scrolling up and disappearing once mountains pass). Alien mountains made taller (520px) with jagged needle spires, mid crag, glowing valley lake, and subterranean strata extending below. Scroll narrative fully implemented: top magnetic purple twilight darkens past the mountains into pure pitch-black void (#000000) with only stars, ending at the bottom black hole, reversing smoothly on scroll up. | DECIDED | Owner vision and exact reference artwork matching.
2026-11-14 | Hero Celestial Atmosphere | Left celestial sphere restored at exact coordinates (top-12 left-[16%]), upgraded to a luminous second moon / companion sun with vibrant magnetic violet/cyan corona, multi-layered orbital flux rings, and mouse parallax. | DECIDED | Owner requested left sphere be more visible like a second moon or sun to the magnetic planet.
2026-11-14 | 3D Visual Narrative | Three.js interactive scroll-driven cosmic journey DECIDED: Hero starts on alien planet with twin suns & purple magnetic sky; scrolling down darkens the void past the mountains, turning stars, ending at a spinning Gargantua black hole with accretion disk at the bottom. | DECIDED | Owner vision for interactive background.
2026-11-14 | Smooth Scroll | Lenis (1.3.27) installed and integrated globally across the site with native wheel smoothing. | DECIDED | Owner requested smooth scroll in every part of the site.
2026-11-14 | World Toggle | World toggle names DECIDED as `Focus` (professional world) and `Drift` (creative liminal world). | Option B | Replaces "On Duty / Off Duty" and "Space".
2026-11-14 | World Toggle | "Duty" rejected as too official; options requested for pair name. "Space" must not be the toggle label (Space is the visual theme, not the mode name). | PROPOSED | Owner feedback on toggle identity.
2026-11-14 | Visual Direction | Space world needs rich painterly depth (glowing celestial bodies, sunset/nebula gradient depth, vibrant oranges/teals/magentas mixed with deep space) based on reference image. Off-duty world is light-in-nature liminal/backrooms with shadowed contrast. | PROPOSED | Owner provided reference image for interactive hero style.
2026-11-14 | Domain | Set apex `debojit.tech` as production (no www), `www.debojit.tech` redirects to apex | OPEN | Standard clean modern developer URL structure.
2026-11-14 | Hosting | Vercel chosen and connected to GitHub repo `DebojitNath/debojit-portfolio` | OPEN | CI/CD live on `https://debojit.tech`.
2026-11-14 | Database / Contact | Supabase chosen for storing visitor contact info (avoids email inbox flooding) | OPEN | Owner confirmed preference for Supabase over direct email.
2026-11-14 | Domain | Domain confirmed as `debojit.tech` | OPEN | Owner confirmed domain is ready to be put to use.

*(No coding-phase decisions yet. Add new entries above this line.)*

## Planning-phase decisions (before coding; exact dates not tracked)

These are what the owner said during planning. They are DECIDED unless a newer entry above reverses them.

| Area | Decision | Notes |
|---|---|---|
| Inspiration | Wants hero animations and micro-interactions in the style of landonorris.com | Aim: best-in-class UI/UX |
| Site shape | Multi-page site | |
| Depth | Wants some 3D/WebGL depth | |
| Themes | Every section/page gets a different theme | |
| Workflow | Build one page at a time | |
| Structure | Two worlds: space-themed landing with professional access, and an Off Duty world | |
| World switch | A dark/light-style slider/toggle on top that switches to "Beyond Code / Off Duty" | Visual transition design: OPEN |
| Off Duty entry | Leads to a liminal landing page: personal creativity, unsettling written lines such as "are we even in reality" | Exact lines: owner's voice, offer options |
| Sub-worlds | Each world also has sub-worlds; set will change | |
| Landing theme | Space with black holes, stars and "other stuff" | Space and liminal are two different kinds of liminal; keep them distinct |
| Projects look | Premium, like premium AI-company sites | Owner referenced "Hermes" (exact reference unclear; ask if needed) |
| Games | Games area exists; RDR2 section wants an Arthur Morgan crying GIF and game scenes running in the background | Cyberpunk vibe considered for some games; RDR2 / Elden Ring would not fit it |
| Movies | Movies page exists | Structure OPEN |
| Music page | Connected to Spotify to show his profile | Favorite artists: Tame Impala, The Weeknd, Lana Del Rey; more may be added |
| Contact | Takes messages/emails from visitors | Location in site OPEN |
| Blog | Blog exists | World OPEN |
| Sound | Music will be composed by a friend who has a band | Agent never sources music |
| Entry screen | No sound on/off popup. Preload all animations, then "click anywhere to continue" | |
| Domain | Owner has a `.tech` domain ready | Domain name: ask |
| Stack shortlist | Lenis, GSAP, Vanta, React Bits shortlisted by owner | See file 06 |
| Flexibility | Everything is open to change | Agent must keep docs updated, never rigid |

## Suggested in planning but NOT decided (PROPOSED)

Black-hole portal transition between worlds; the name "On Duty"; About, Resume, project detail pages; 404 easter egg; "now" widget; guestbook; command palette; corner mute icon; per-artist and per-game sub-world vibes listed in file 04; Vite + Tailwind + React Three Fiber + Framer Motion; theme config registry (file 03); three-size transition rule.
