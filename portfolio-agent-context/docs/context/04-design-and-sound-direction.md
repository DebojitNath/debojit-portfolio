# 04 — Design and Sound Direction

> Tags: DECIDED / PROPOSED / OPEN. Vibes below are **directions to discuss**, not finished designs. Each page gets its own plan and approval before building (file 02, section 6).

## 1. Vibe map

| Area | Vibe | Status | Visual ideas (menu, not a to-do list) |
|---|---|---|---|
| Landing (Space) | Cosmic awe: vast, silent, humbling | DECIDED (space theme) | Starfield, black hole with accretion disk, nebula haze, scroll-driven camera movement, slow heavy easing |
| Projects | Premium, composed, dark; like premium AI-company sites | DECIDED direction | Asymmetric/bento grid, restrained palette (1–2 accents), glass-like cards, cursor spotlight, subtle tilt, slow image zoom |
| Project detail | Clean, focused, minimal motion | PROPOSED | Let the case study breathe |
| About | Warm and personal | PROPOSED | Film-photo feel, grain |
| Resume | Clean and scannable | PROPOSED | Almost no motion |
| Blog | Editorial, "paper and ink" | PROPOSED | Serif body text, typographic micro-interactions, minimal WebGL |
| Contact | Calm, warm resolution; nature (trees, grassland) was floated | PROPOSED | Golden-hour field, fireflies, grass reacting to cursor, simple form |
| Liminal landing (Off Duty) | Uncanny nostalgia: empty rooms, backrooms, open grasslands | DECIDED | Washed-out yellow-green, haze/fog, grain, slow flicker, near-still drift, unsettling text |
| Games: RDR2 | Dust and gold, cinematic | PROPOSED | Sepia/amber, film grain, slow painterly fades, background gameplay video loops |
| Games: cyberpunk-style | Neon, glitch | PROPOSED | Magenta/cyan, scanlines, glitch on hover, glow trails |
| Games: Elden Ring | Gothic/ashen | PROPOSED | Desaturated gray with one accent, fog, rising embers, carved-stone serif |
| Music: Tame Impala | Psychedelic | PROPOSED | Melting/swirling gradients, purple-orange haze |
| Music: The Weeknd | Dark red neon, night-city | PROPOSED | Overlaps the cyberpunk style; reuse components |
| Music: Lana Del Rey | Vintage Americana | PROPOSED | Warm washed film, grain, Polaroid frames |
| Movies | Cinema theatre | PROPOSED | Letterbox bars, projector flicker, poster carousel |

### Space vs Liminal: two different kinds of liminal (DECIDED concept)

| | Landing (Space) | Liminal landing |
|---|---|---|
| Kind of emptiness | Cosmic: the void between stars | Human: empty rooms, fields, hallways |
| Feeling | Awe, smallness | Uneasy nostalgia |
| Color | Deep black/blue with one warm glow | Washed yellow-green, beige, haze |
| Motion | Slow, huge fly-through | Almost still drift |
| Sound | Deep drone, near silence | Fluorescent hum, ambient |

## 2. Design process for every page (follow strictly)

Before writing page code, produce a **design plan** and show it to the owner:

- **Color:** 4–6 named hex values.
- **Type:** the typefaces and their roles. One or two families; if two, clearly different. Set a deliberate type scale. Line length under ~80 characters for body text.
- **Layout:** one-sentence concept plus a small ASCII wireframe. State alignment.
- **Principles:** what makes this page unique.
- **Signature effects:** 3–5 candidates as options (file 02 format), picked from `05-animation-catalog.md`.

Then check the plan against the brief: if any part is just what you would produce for any portfolio, revise it and say what you changed. Only then build.

### Avoid generic "generated" defaults
Where the owner has pinned a direction, follow it. Where an axis is free, do not fall back on these overused looks:
- Warm cream background + high-contrast serif + terracotta accent
- Near-black background + one acid-green or vermilion accent
- Newspaper layout with hairlines and zero border radius
- Identical rounded cards with the same soft shadow and gradient washes
- Template chrome: tracked-out ALL-CAPS label above every heading, numbered 01/02/03 markers on content that is not a sequence, dot-separated meta strings, a `→` on every link

Also avoid: accenting a single word in every headline, and fade-up on every section with hover effects on every card. Those are the most common tells.

### Restraint
- **Spend boldness in one place per page.** One memorable element, quiet everything around it.
- Ambient motion only where it serves the page's mood. Motion that answers a visitor's action (open, confirm, expand) is always welcome.
- Before finishing a page, remove one decoration.

## 3. Copy rules

- Never invent facts about the owner (file 02).
- Words are design content: short, plain, specific. Sentence case. Buttons say what happens ("Send message", not "Submit").
- Errors say what went wrong and how to fix it.
- For the liminal world's unsettling text: the concept is DECIDED ("are we even in reality" style). Specific lines are the owner's voice, so offer **options** and let him write or choose. Starter ideas that were floated (PROPOSED, not final): "You've been here before." / "The lights are on. Who turned them on?" / "Nobody is here. Nobody was ever here." / a visitor counter that always reads 1.

## 4. Sound plan

- **DECIDED:** music will be composed by a friend who has a band. The agent does not source, generate, or download music.
- **DECIDED:** no sound on/off popup. Instead: preload everything, then "click anywhere to continue". That click unlocks audio.
- **PROPOSED sound map** (confirm with the owner and his friend):

| Place | Sound idea |
|---|---|
| Space landing | Deep drone, distant radio static, near-silence |
| Liminal landing | Fluorescent hum, empty-room ambience, soft dreamy ambient |
| Games sub-worlds | Genre-fitting (synth pulse / acoustic guitar and wind / low choir-like drone) |
| Contact | Wind, crickets, birds |

- **PROPOSED handling:** seamless loops of about 1–3 minutes, small compressed files (MP3 or AAC; ask what the friend delivers), crossfade between tracks, low default volume, a small always-reachable mute control (ask the owner).
- Spotify page: the Spotify player/embed handles artist music. Do not try to host or rip commercial songs.
- Until real files arrive, wire everything with placeholder tracks and make swapping a file a one-line change.

## 5. Media rules (RDR2 section and others)

- Background scenes: use short, muted, looping **video** (WebM/MP4), not heavy GIFs. Load a still poster image first; fall back to the still on mobile or slow connections.
- A color grade and grain overlay can unify clips of different origin.
- The owner wants an Arthur Morgan crying GIF in the RDR2 section. Build the slot (for example a reaction element or easter egg; present placement options). The media file comes from the owner. Remind him once that footage from the game belongs to its publisher and recording his own gameplay is the safer route.
