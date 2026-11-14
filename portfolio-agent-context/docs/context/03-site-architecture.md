# 03 — Site Architecture

> Tags: DECIDED / PROPOSED / OPEN (see file 02). The structure below is a **current snapshot**. Worlds, sub-worlds and pages are expected to change. Build the system so that adding or removing one is cheap (see `07-extension-playbooks.md`).

## 1. The three levels

```
SITE
└── WORLD            (big mood: Space/professional vs Liminal/personal)
    └── SUB-WORLD    (themed area: a game, a music artist, a section)
        └── PAGE     (a screen inside it, e.g. a project detail)
```

## 2. Current map

```
LANDING (Space)  [DECIDED]  — preload screen, then space hero, access to professional content
│
├── WORLD 1: professional (name "On Duty" is PROPOSED; owner has not named it)
│   ├── Projects            [DECIDED]  premium-AI-site look; layout PROPOSED
│   │   └── Project detail  [PROPOSED] one page per project
│   ├── About               [PROPOSED]
│   ├── Resume              [PROPOSED]
│   ├── Blog                [DECIDED exists; which world: OPEN]
│   └── Contact             [DECIDED exists; placement OPEN]
│
└── WORLD 2: "Beyond Code / Off Duty"  [DECIDED name, reached via toggle]
    ├── Liminal landing     [DECIDED]  unsettling written lines, personal creativity
    ├── Games               [DECIDED]
    │   ├── RDR2            [DECIDED]  Arthur Morgan crying GIF slot + background gameplay scenes
    │   ├── Cyberpunk-style [PROPOSED] cyberpunk vibe considered by owner for some games
    │   └── Elden Ring      [PROPOSED] owner said it would not fit cyberpunk; own sub-world suggested
    ├── Music (Spotify)     [DECIDED]
    │   ├── Tame Impala     [DECIDED favorite]   sub-world per artist is PROPOSED
    │   ├── The Weeknd      [DECIDED favorite]   "
    │   └── Lana Del Rey    [DECIDED favorite]   "   (more artists may be added)
    └── Movies              [DECIDED exists]  look PROPOSED (cinema); structure OPEN
```

The full list of the owner's favorite games and movies is **OPEN**. Do not assume any titles beyond those named above.

## 3. The world toggle (DECIDED concept)

- A slider/toggle at the top, styled like a dark/light-mode switch, labeled for **Beyond Code / Off Duty**.
- It must be **always visible and clearly labeled**, because otherwise visitors will never find the personal world (PROPOSED guidance).
- Switching worlds changes: theme (colors/fonts/cursor/particles), navigation items, background scene, and sound.
- The transition effect between worlds is **OPEN**. PROPOSED idea: the black hole pulls the screen in, then the visitor arrives in a hazy fluorescent-lit room; the reverse is the lights going out and stars returning. Present alternatives as options before building.
- Remember the last world the visitor was in (PROPOSED).

## 4. Preload and entry screen (DECIDED)

- Load all the animations/assets needed at the start, then show a **"click anywhere to continue"** prompt. The click also satisfies browser rules for starting audio.
- On touch devices this is "tap anywhere".
- No "sound on/off" popup.
- PROPOSED guidance (flag to the owner if it becomes an issue):
  - Keep the wait short (a few seconds). Load essentials first (first scene, first audio). Load the other world quietly in the background after the click.
  - Show real progress, not a blank screen.
  - The professional content must reach the visitor quickly; do not hide it behind a long intro.
  - Keep a small mute control available somewhere (PROPOSED; ask the owner).

## 5. Theming system (PROPOSED architecture, ask before implementing)

Themes are layered. Each layer inherits from the one above and only overrides what is different.

| Layer | Controls | Example |
|---|---|---|
| Site | Base typography scale, spacing, smooth scroll, easing defaults, reduced-motion handling | Same for everything |
| World | Palette, mood, background scene, nav items, default sound | Space vs Liminal |
| Sub-world | Palette tweaks, particles, cursor style, hover effects, transition style, sound | RDR2 vs Cyberpunk |

Implementation direction (PROPOSED):
- Each world and sub-world is described by a small **config object** (name, route, colors, fonts, cursor, background scene id, audio track id, signature effects). A registry reads the configs to build routes, navigation and theme variables.
- Theme values are exposed as **CSS variables**, swapped by world/sub-world.
- Heavy scenes (WebGL) are **lazy-loaded per sub-world** and disposed when the visitor leaves.
- Content (project list, game list, artist list) lives in **data files**, not hard-coded inside components, so the owner can edit content without touching animation code.

Illustrative shape only (not final; confirm with the owner before using):

```ts
type SubWorldConfig = {
  id: string;                 // "rdr2"
  worldId: string;            // "off-duty"
  route: string;              // "/off-duty/games/rdr2"
  title: string;
  palette: Record<string, string>;
  cursor?: "default" | "ring" | "glow" | string;
  scene?: string;             // id of a lazy-loaded background scene
  audioTrackId?: string;      // file supplied by the owner's friend
  signatureEffects: string[]; // ids from the animation catalog the owner approved
};
```

## 6. Transitions come in three sizes (PROPOSED)

| Level | When | Feel |
|---|---|---|
| World switch | Toggle between worlds | Big, cinematic, rare |
| Sub-world switch | Moving between games / artists / sections | Medium: colors, particles and cursor morph |
| Page inside a sub-world | Opening a detail page | Light: fade or slide |

Reason: if every click is a spectacle, the site becomes tiring and slow.

## 7. Navigation and orientation (PROPOSED)

- Nav items change with the world.
- A small "you are here" label (for example `Off Duty / Games / RDR2`) that is clickable to go up a level, so visitors do not get lost in nested worlds.
- Readable URLs, for example `/off-duty/games/rdr2`, so any sub-world can be shared. Exact URL scheme: OPEN until the owner confirms world names.
- Footer link to Contact in both worlds (PROPOSED).

## 8. Audio architecture (DECIDED direction, details PROPOSED)

- Music is composed by the owner's friend. Each world/sub-world can have its own track.
- One audio manager that lives **outside** page components so music is not cut when the route changes. It crossfades between tracks.
- No autoplay before the entry click. Volume low by default.
- Use placeholder silence or clearly labeled test tones until real files arrive. Ask the owner what formats the friend will deliver.

## 9. Pages that need back-end work (all approaches OPEN)

| Feature | Needs | Notes |
|---|---|---|
| Contact form (takes visitor emails/messages) | A way to send mail without exposing keys | Options: a form service, a serverless function, or a small API (the owner knows FastAPI). Add spam protection (honeypot, rate limit). Never put secrets in frontend code. |
| Spotify profile / now playing | Spotify's API with a login token kept server-side, and/or the official embed player | Read Spotify's current developer terms first. Visualizers are decorative, because Spotify does not give raw audio to websites. |
| Movie posters/metadata | A movies API or manually supplied images | Check the API's current terms and attribution rules. |

Present each as an options decision (file 02 format) before building.
