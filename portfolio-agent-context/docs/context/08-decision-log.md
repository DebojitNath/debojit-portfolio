# 08 — Decision Log

Newest entries go at the **top** of the "Log" section. Newest entry wins if two entries conflict.

**How to use:** whenever the owner picks an option, changes direction, or reverses an earlier choice, add a line here in the same session. Use the real date (YYYY-MM-DD). Only record what the owner actually said or picked. Do not record your own suggestions as decisions.

Entry format:

```
YYYY-MM-DD | Area | Decision | Changed from (if any) | Notes
```

## Log

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
