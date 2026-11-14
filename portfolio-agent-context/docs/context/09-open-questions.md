# 09 — Open Questions and Placeholders

Two jobs: (1) list what is not decided yet, so you ask instead of guessing; (2) track placeholder content that is waiting for the owner.

When a question is answered, move it into `08-decision-log.md` and delete it here. When you ask a question, use the options format in file 02 where possible.

## 1. Open decisions

### Structure
- [ ] **Contact placement.** Suggested: keep it in the professional world and add a footer link in both worlds. Alternative: one contact per world, or a single shared page. Which?
- [ ] **Blog placement.** Professional world, personal world, or its own sub-world?
- [ ] **Name of the professional world.** "On Duty" was floated; the owner has not named it.
- [ ] **Movies structure.** One page, or sub-worlds (for example by genre or mood)? Need favorite movie titles first.
- [ ] **Do professional-world pages get sub-worlds too?** (Projects by category, for example.) Owner said worlds have sub-worlds but has not listed the professional ones.
- [ ] **Which extra pages to build?** About, Resume, project detail pages, 404 page, "now" widget, guestbook. Each is PROPOSED only.
- [ ] **URL scheme** once world names are final.

### Experience
- [ ] **World-switch transition.** Black-hole portal was one idea. Ask for alternatives before building.
- [ ] **Preload design.** How long is acceptable, what does the progress indicator look like, and what loads before vs after the click?
- [ ] **Mute control.** A small always-available mute icon was suggested. Confirm placement and behavior.
- [ ] **Mobile strategy for WebGL.** Lighter version, static fallback, or both?
- [ ] **Liminal text lines.** The owner's own lines, or pick from options.

### Technical
- [x] ~~**Hosting and deployment**; final `.tech` domain name.~~ Domain confirmed: `debojit.tech`. Hosting/deployment options presented.
- [x] ~~**Contact form approach** (form service, serverless function, or small API).~~ DECIDED: Supabase PostgreSQL database to store visitor messages.
- [ ] **Spotify approach** (official embed, Web API, or both) after reading current Spotify developer terms.
- [ ] **Movie data approach** (an API, or manually supplied posters and metadata) after reading current terms.
- [ ] **Stack confirmation:** Vite, Tailwind, React Three Fiber, Framer Motion (all PROPOSED).
- [ ] **Audio file format and loop requirements** to give the owner's friend.

### Creative
- [ ] **Sub-world vibes** in file 04 are all PROPOSED. Confirm each one before building it.
- [ ] **Which page gets built first.** Suggested order if the owner agrees: theme system + landing, then Projects and Contact, then the rest. Ask.

## 2. Placeholders waiting for the owner

Never fill these in yourself. Keep placeholders visible and labeled in the UI until the real content arrives.

| Placeholder | Needed for | Status |
|---|---|---|
| Owner's short bio / tagline | Landing, About | Waiting |
| Project list (title, description, tech, role, links, images, results) | Projects, project details | Waiting |
| Resume file (PDF) | Resume | Waiting |
| Social/profile links, contact email target | Footer, Contact | Waiting |
| Education / experience / achievements details | About, Resume | Waiting |
| Favorite games list and the owner's notes/ratings | Games | Waiting (only RDR2 and Elden Ring have been mentioned so far) |
| Game media: background gameplay clips, Arthur Morgan crying clip | RDR2 sub-world | Waiting; owner-supplied; copyright reminder given? (note date here) |
| Favorite movies list and notes | Movies | Waiting |
| Spotify account/profile connection details | Music | Waiting (never store secrets in the repo) |
| Music tracks from the owner's friend | All worlds | Waiting |
| Unsettling text lines | Liminal landing | Waiting / options pending |
| Domain name | Deployment | DECIDED: debojit.tech |
| Fonts the owner already likes (if any) | Design | Ask |

## 3. Questions to ask when starting any new page

1. What is this page for, and who is it for?
2. What content do you already have for it?
3. Which vibe/sub-world does it belong to, and is the proposed vibe still right?
4. Which 3–5 signature effects do you want (options)?
5. Is there a reference site or image whose feeling you want?
6. Any sound for this page?
7. Anything you do NOT want?
