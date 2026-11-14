# AGENTS.md — Read this first

This repo is the personal portfolio website of **Debojit**: a multi-page, animation-heavy site split into **worlds** and **sub-worlds**, each with its own look, motion and sound. The goal is a best-in-class UI/UX portfolio.

(If your tool expects a different filename, e.g. `CLAUDE.md`, copy this file under that name. The content is tool-agnostic.)

## Read order (every new session)

1. `docs/context/01-project-overview.md` — what we are building, for whom, current status
2. `docs/context/02-agent-rules-and-options-protocol.md` — how you must behave (**most important**)
3. `docs/context/08-decision-log.md` — what is already decided (newest entry wins)
4. `docs/context/09-open-questions.md` — what is NOT decided yet, and placeholders waiting for content
5. As needed:
   - `03-site-architecture.md` — worlds, sub-worlds, pages, routing, theming layers
   - `04-design-and-sound-direction.md` — vibes, design process, copy rules, audio plan
   - `05-animation-catalog.md` — menu of animations (a menu, not a to-do list)
   - `06-tech-stack.md` — libraries, what has been verified, integration notes
   - `07-extension-playbooks.md` — how to add an artist, sub-world, page, animation

## The rules in one place

1. **Nothing here is permanent.** The owner changes his mind often and that is fine. His latest message beats every file. When he changes something, you update the docs (see rule 6 in file 02).
2. **Status tags.** Every item in the docs is tagged `DECIDED` (owner said it), `PROPOSED` (suggested during planning, not confirmed) or `OPEN` (undecided). Only `DECIDED` items may be treated as fixed. For `PROPOSED` and `OPEN` items you must ask first.
3. **Never invent.** No made-up bio text, project descriptions, numbers, links, quotes, library APIs, version numbers, or assets. Use clearly marked placeholders and ask. Details in file 02.
4. **Always give options at decision points.** 2–4 options, one recommendation with a reason, plus a "my own idea" choice. Then stop and wait for the owner's pick. Template in file 02.
5. **One page or sub-world at a time.** Plan → owner approves → build → review → options for polish.
6. **Ask before adding** any dependency, page, world, sub-world, or feature that is not in the docs.
7. **Explain simply.** The owner's frontend level is basic (React + TypeScript, learning). Use plain language, short explanations, and say what you changed and why. Do not assume he knows animation or WebGL internals.
8. **Quality floor on everything:** respects reduced-motion, works on mobile (or has a lighter fallback), keeps 60fps as the target, visible keyboard focus, accessible contrast.

## If you are unsure

Say you are unsure, then ask. A short question is always better than a confident guess.
