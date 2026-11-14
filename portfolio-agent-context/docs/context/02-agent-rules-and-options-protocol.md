# 02 — Agent Rules and Options Protocol

This is the most important file. If any other file or your own judgment conflicts with it, follow this one and tell the owner about the conflict.

## 1. Source-of-truth order

When information conflicts, higher beats lower:

1. The owner's **latest message** in the conversation
2. `08-decision-log.md` (newest entry wins)
3. The other files in `docs/context/`
4. Your own ideas (lowest; these are always suggestions, never facts)

The docs are **living**. They describe the current plan, not a contract. The owner may add an artist, add or rename a sub-world, drop a page, or change a vibe at any time.

## 2. Status tags

- **DECIDED**: the owner said it. Follow it until he changes it.
- **PROPOSED**: suggested during planning. Treat as a default *option*, not an instruction. Confirm before building.
- **OPEN**: not decided. You must ask.

Never silently promote PROPOSED or OPEN items to DECIDED. Only the owner can do that, and when he does, you record it in the decision log.

## 3. Never invent (anti-hallucination rules)

### Content about the owner or his work
- Do not write or guess: bio text, project descriptions, tech stacks used in a project, metrics or results, dates, testimonials, achievements, awards, job titles, college details, social handles, email addresses, links.
- If you need such content for a page, use a **visible placeholder** such as `{{TODO: project title}}` or obviously fake lorem text labeled "PLACEHOLDER", then add it to the placeholder table in `09-open-questions.md` and ask the owner.
- Writing *copy* (headlines, microcopy, unsettling lines) is allowed only as **options for the owner to choose from**, never as silently final text.

### Technical facts
- Do not guess library APIs, option names, file paths, or versions. Check the installed package (types, README in `node_modules`) or the official docs first.
- If you cannot verify something, say so explicitly: "I have not verified this."
- Do not claim something works unless you ran it. Report errors honestly, including ones you caused.
- Version numbers in these docs may be stale. Check the current stable version at install time.
- For external services (Spotify, movie-poster APIs, email services, hosting), read their **current** official docs and terms before designing around them. Their rules change.

### Assets and copyright
- Do not download or embed copyrighted material from the internet as if it were free to use: game footage, film clips, posters, album art, songs, GIFs of copyrighted scenes.
- Use clearly labeled placeholders (solid-color boxes, `placeholder-arthur.webm`, etc.). The owner supplies the real assets, for example his own screen recordings, music from his friend, licensed or free-licensed files.
- Official embeds/APIs (for example a Spotify embed) are allowed **after** the owner approves that approach.
- If the owner asks for something with a copyright concern (for example, the Arthur Morgan crying GIF), implement the *mechanism* (a looping muted video slot) and tell him plainly that the file must come from him and that using game footage is his call.

### Scope
- Do not add pages, features, worlds, sub-worlds, libraries or animations that are not in the docs without asking. Good ideas are welcome, but as **options**, not as surprise work.

## 4. Options protocol (the owner must always have a say)

### When to present options
At every real decision point, including:
- Choosing a signature animation for a page or sub-world
- Choosing layout, typography direction, palette, cursor style
- Adding a dependency or choosing between libraries
- Architecture choices (routing, state, theming approach, audio handling)
- Writing copy (headlines, unsettling lines, microcopy)
- Performance trade-offs (for example, a lighter mobile version)
- Anything the docs mark PROPOSED or OPEN

### When NOT to ask
Pure implementation details with no visible effect (file names, internal helper structure, formatting). Pick a sensible default and mention it in your summary. Do not drown the owner in questions: batch small decisions together, and ask at most one major decision per message when the options are complex.

### Format

```
DECISION: <short title>
Context: <one or two plain sentences on why this decision matters>

Option A — <name>
  Looks/feels like: ...
  Effort: low | medium | high      Performance: light | medium | heavy
  Trade-off: ...

Option B — <name>
  ...

Option C — <name> (optional)
  ...

My recommendation: <A/B/C> because <one plain reason>.
Option D: Your own idea / mix of the above.

Which one? (I will wait for your pick before building.)
```

Rules for options:
- 2–4 real options plus the "your own idea" choice. No fake filler options.
- Always include a recommendation with a reason, but never act on it before the owner picks.
- Describe what the option looks and feels like in plain words, because the owner may not know the technical names. Link a demo page when you know a real one (never invent a URL).
- Be honest about cost: bundle size, GPU load, mobile impact, accessibility, effort.
- After the owner picks, restate the choice in one line and add it to the decision log.

### Proactive suggestions
The owner wants you to **suggest things during coding**, not just wait. Good moments to suggest:
- You notice a page would benefit from a different or additional effect
- Something is heavy for mobile and a lighter variant exists
- A reusable pattern could save time across sub-worlds
- A detail would make the UI feel more polished (hover state, loading state, transition)
Phrase these as options in the format above. Keep suggestions few and relevant: roughly 1–3 per work session, not a flood.

## 5. Handling changes

When the owner says things like "change this part", "add another artist", "make this world different":

1. Confirm the scope in one or two lines (what changes, what stays).
2. List which files and docs are affected.
3. Make the change.
4. Update `08-decision-log.md` and any context file that is now outdated (architecture, design, open questions).
5. Never silently diverge from the docs. If the code and the docs disagree, tell the owner and fix whichever is wrong with his approval.

## 6. Working rhythm for each page or sub-world

1. **Plan (no code).** Present a compact design plan: 4–6 named hex colors, type choices and roles, a layout idea (one-sentence description plus a simple ASCII wireframe), and 3–5 candidate signature effects as options. See `04-design-and-sound-direction.md`.
2. **Owner approves or changes the plan.**
3. **Build** the page using the theme system (see `03-site-architecture.md`).
4. **Review** against the quality floor (section 7), take screenshots if your environment allows, and critique your own work honestly.
5. **Polish options.** Offer a few options for the next improvements. Do not decide alone.
6. **Update docs** (decision log, open questions, placeholders).

## 7. Quality floor (applies to everything)

- `prefers-reduced-motion` is respected: calmer or no motion for those users. (Lenis honors it by default per its README; check any other library you add.)
- Mobile works. Heavy WebGL gets a lighter fallback or a static image on weak devices.
- Target 60fps. Lazy-load heavy scenes and assets. Dispose of WebGL resources when leaving a page.
- Keyboard focus is visible; contrast is accessible; images have alt text; the world toggle and any audio controls are reachable by keyboard.
- No scattered motion for its own sake. Prefer one memorable orchestrated moment per page, with quieter surroundings, over effects on every element. Motion that responds to the visitor's action is always welcome.
- Audio never auto-plays before a click (browsers block it anyway). See file 04.

## 8. Communication style

- Plain, short language. Explain what you did and why in a few sentences.
- Define a technical term the first time you use it.
- Flag anything unverified, risky, or heavy.
- When a task is large, say what you will do first and check in before doing the rest.
- Be honest if something the owner asked for is a bad idea (for example, performance or accessibility problems). Say it kindly, explain why, and offer alternatives.
