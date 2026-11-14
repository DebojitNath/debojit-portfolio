# 07 — Extension Playbooks

The plan will keep changing: another artist, another game, a new sub-world such as a blog area, a renamed world. These checklists make changes cheap and keep the docs honest. Every playbook follows the rules in file 02: no invention, options at decision points, update the docs.

If the theming system from file 03 is not built yet, build that first (with approval) so these playbooks work as written.

## A. Add a music artist

1. Confirm the artist name and spelling with the owner. Add the artist to the music data file. Do not invent bio text, album lists, or links.
2. Ask what the artist's page should feel like. Present 2–3 visual/motion direction options (file 02 format). Existing PROPOSED directions: Tame Impala = psychedelic, The Weeknd = dark red neon, Lana Del Rey = vintage Americana.
3. Check whether the new look can reuse an existing sub-world's components (for example neon styles shared with a cyberpunk sub-world).
4. Create the sub-world config (palette, cursor, scene, signature effects, audio).
5. Spotify content: use the approved approach only (embed and/or API). Do not hard-code playlist or track IDs you were not given.
6. Update the decision log and `03-site-architecture.md`.

## B. Add a game (or other themed item) to the Games area

1. Ask for the game title and what the owner wants to show: favorite moments, rating, personal note, clips. Never write his opinions for him.
2. Ask whether it fits an existing sub-world vibe or needs its own. Present options.
3. Media slots: video loop for background, optional reaction GIF/video, still poster as fallback. The owner supplies files. Use labeled placeholders until then. Remind him about the copyright consideration once (file 04, section 5).
4. Create or extend the sub-world config and content data entry.
5. Update docs.

## C. Add a new sub-world (any kind, for example Blog)

1. Ask which **world** it belongs to (the world list may change).
2. Present a short design plan (file 04 process): palette, type, layout, 3–5 signature effect options.
3. After approval, add the config + route + nav entry + content data + (lazy-loaded) scene.
4. Check transitions into and out of it follow the three-size rule (file 03, section 6).
5. Check audio: ask whether it has its own track or inherits its world's.
6. Test: reduced motion, mobile, performance, keyboard.
7. Update the decision log, file 03, file 04, and remove it from "OPEN" lists if it was there.

## D. Add a new world

This is rare and large. Before anything else:
1. Present options for the world's identity and how visitors reach it (toggle extension, a third state, a separate entry).
2. Present options for the transition into it (file 03, section 3).
3. Confirm the effect on navigation, preload time and audio.
4. Then follow playbook C for its landing and first sub-worlds.

## E. Add a standard page (About, Resume, project detail, etc.)

1. Ask for the content. Never write it. Offer a structure (sections) as options.
2. Follow the design process in file 04.
3. Add to the nav only after confirming placement.
4. Update docs and placeholders.

## F. Add or change an animation

1. Check whether the catalog (file 05) already lists it. If not, add it with a plain-language description.
2. Present options with cost notes (performance, mobile, accessibility).
3. Implement behind a reduced-motion check.
4. Reuse existing helpers instead of duplicating logic.
5. Record the choice in the decision log.

## G. Rename, move, or remove something

1. Confirm the exact scope with the owner.
2. List every route, nav item, config, content entry and doc reference affected.
3. Keep or redirect old URLs if they might have been shared (ask).
4. Update docs. Do not leave stale references.

## H. Content changes (text, projects, lists)

Content lives in data files. Changing content should never require touching animation code. If it does, tell the owner and propose a refactor as an option.

## I. Before you finish any extension

- [ ] Docs updated (decision log; architecture/design/animation/open-questions files as needed)
- [ ] Placeholders recorded in `09-open-questions.md`
- [ ] Nothing invented; anything unverified flagged
- [ ] Reduced motion, mobile, performance, keyboard checked
- [ ] Summary given to the owner in plain language, with 1–3 suggested next options
