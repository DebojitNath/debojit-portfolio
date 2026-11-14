# 01 — Project Overview

> Status legend used across all docs: **DECIDED** = owner said it. **PROPOSED** = suggested during planning, not confirmed. **OPEN** = undecided, must ask.
> Everything is changeable. See `02-agent-rules-and-options-protocol.md`.

## What this is

A personal portfolio website with a strong cinematic/animated identity. It has two audiences:

- **Professional visitors** (recruiters, engineers, hiring managers): need to quickly see who the owner is, his projects, resume and how to contact him.
- **Personal/creative visitors** (friends, curious people): get to see the owner's personality through games, movies, music and an unsettling "liminal" world.

## Owner

- Name: Debojit **(DECIDED)**
- Computer science student, aiming for software developer / AI engineer roles **(DECIDED)**
- Frontend skill: basic (React + TypeScript). He plans to lean on the agent for frontend work, so explain things simply.
- Everything else about the owner (bio, college details, experience, achievements, links) is **not in these docs**. Ask for it. Never invent it.

## Goals

- **DECIDED:** The portfolio should be exceptional UI/UX: smooth, intentional, memorable, with hero animations and micro-interactions, in the spirit of landonorris.com.
- **DECIDED:** Multi-page site with some 3D/WebGL depth, not just 2D scroll effects.
- **DECIDED:** Different sections/pages have different themes/vibes. The owner is building **one page at a time**.
- **DECIDED:** The domain is `debojit.tech`.

## Big idea in one paragraph (DECIDED unless tagged)

The site has **two worlds**. The landing page is the **space-themed** world and gives access to the professional content (projects, etc.). At the top there is a slider/toggle, like a dark/light-mode switch, but it switches to **"Beyond Code / Off Duty"**. Flipping it takes the visitor to a **liminal landing page**: the owner's personal, creative, slightly unsettling side, with text like "are we even in reality". Each world also contains **sub-worlds** (for example, separate themed areas for different games or music artists). The set of sub-worlds is expected to grow, for example another music artist or a blog area.

## Things the owner has explicitly said he wants

| Item | Status | Notes |
|---|---|---|
| Space-themed landing page with access to professional stuff | DECIDED | Black holes, stars, "other space stuff" |
| Slider/toggle to switch to Beyond Code / Off Duty | DECIDED | Visual style like a dark/light toggle |
| Liminal landing page in the Off Duty world | DECIDED | Personal creativity, unsettling written lines |
| Worlds contain sub-worlds | DECIDED | List will change over time |
| Games page(s), including RDR2 with an Arthur Morgan crying GIF and game scenes running in the background | DECIDED | Cyberpunk vibe considered for some games; RDR2 and Elden Ring would need different vibes |
| Movies page | DECIDED (exists) | Look/structure OPEN |
| Music page connected to Spotify, showing his profile; favorite artists Tame Impala, The Weeknd, Lana Del Rey | DECIDED | More artists may be added later |
| Projects page (premium look, like premium AI-company sites) | DECIDED | Detailed layout PROPOSED |
| Contact page that takes messages/emails from visitors | DECIDED | Where it lives in the site: OPEN |
| Blog | DECIDED (exists) | Which world it belongs to: OPEN |
| Music/sound: a friend (who has a band) will compose it | DECIDED | Do not source or generate music yourself without asking |
| No "sound on/off" popup at the start | DECIDED | Replaced by a preload + "click anywhere to continue" screen |
| Preload all animations at the start, then prompt "click anywhere to continue" | DECIDED | Keep load time reasonable, see file 03 |

## Things that were suggested but are NOT confirmed

About page, Resume page, project detail pages, a 404 page, a "now" widget, guestbook, command palette, the black-hole portal transition between worlds, the specific names "On Duty" for the professional world, a corner mute icon. See `08-decision-log.md` and `09-open-questions.md`. Ask before building any of them.

## Current phase

Planning. No code is written yet unless the decision log says otherwise. The next likely step: set up the project scaffold and the theme system (see `03-site-architecture.md`), then build the first page once the owner picks which one.

## Content the owner must supply (do not invent)

Project list and descriptions, bio/about text, resume file, social links, contact email target, list of favorite games, list of favorite movies, music files from his friend, game/screen-recording clips (see asset rules in file 02), domain name. Track what is still missing in `09-open-questions.md`.
