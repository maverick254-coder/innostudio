# Core Fidelity Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Mighty project continuity, project visuals, staged showcase, and exact-frame exit behavior.

**Architecture:** Use real DOM transition layers for route continuity, a coherent Mighty interface artwork system, and beat-based showcase data mapped to GSAP movement. Keep direct project entry as a normal page path with no invented Works state.

**Tech Stack:** React, React Router, GSAP ScrollTrigger, Lenis, Vitest, CSS.

**Spec:** `docs/superpowers/specs/2026-09-29-core-fidelity-rebuild-design.md`

## Global Constraints

- Preserve the current background system and ignore the Codex pet/mascot.
- Do not broadly redesign `/works` or other Works cards.
- Works during entry/exit must come from the actual Works DOM state, not reconstructed JSX or fake card markup.
- Project exit must freeze the exact current project frame with no project scroll mutation.
- Route updates must not remove transition layers early.
- Direct `/work/mighty-demo` entry has a clean fallback with no fake previous Works layer.
- Desktop is the primary fidelity target; mobile may remain simpler.

## Review Focus

- Entry from scrolled Works: clicked Mighty card and surrounding Works layout remain visually identical during the first layer transition.
- Exit from 25%, 50%, 70%, and 95% showcase progress: current project frame translates out directly with no rewind.
- Direct project load: close navigates to `/works` cleanly without a fake previous state.
- Reduced motion/mobile: content remains accessible without desktop choreography.
- Route state race: URL changes do not remove preserved layers before transition completion.

---

### Task 1: Real Transition Layer Store

**Files:**
- Modify: `src/utils/projectTransition.js`
- Test: `src/__tests__/ProjectRouting.test.jsx`

**Interfaces:**
- Produces: preserved Works DOM snapshot captured during `startProjectEntryTransition`.
- Produces: exact project DOM clone captured during `startProjectExitTransition`.

- [ ] Add tests asserting exit does not call scroll restoration before navigation and direct load uses fallback.
- [ ] Replace fake Works return generation with preserved Works DOM layer from actual `/works`.
- [ ] Preserve route transition layers until GSAP completion.
- [ ] Freeze project frame from current DOM and current Lenis/scroller offset without mutating scroll.
- [ ] Verify entry/exit with browser capture.

### Task 2: Mighty Identity And Cover

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/pages/Works.jsx`
- Modify: `src/components/ProjectArtwork.jsx`
- Modify: `src/styles/style.css`
- Test: `src/__tests__/projects.test.js`

**Interfaces:**
- Consumes: project id/slug remain `mighty-demo`.
- Produces: visible title `Mighty`; cover kind/style for Mighty-specific card rendering.

- [ ] Add data tests for visible Mighty title, cover identity, and screen count.
- [ ] Render Mighty cover from the same artwork system rather than the generic image.
- [ ] Keep other Works cards unchanged.
- [ ] Rebuild project hero to use visible title `Mighty` and left-biased editorial composition.
- [ ] Compact info section styling.

### Task 3: Rich Fictional Screens

**Files:**
- Modify: `src/components/ProjectArtwork.jsx`
- Modify: `src/styles/style.css`
- Test: `src/__tests__/projects.test.js`

**Interfaces:**
- Produces: 10-12 named screen artwork types for Mighty.

- [ ] Replace poster-like screens with interface-like website/product screens.
- [ ] Share logo, navigation, typography, copy, and visual motifs.
- [ ] Include homepage, listing, detail, service/about, mobile home, mobile menu, dark menu, culture/studio, contact/team, collage, desktop, closing composition.
- [ ] Verify no lorem ipsum and no generic placeholders.

### Task 4: Beat-Based Showcase

**Files:**
- Modify: `src/data/projects.js`
- Modify: `src/pages/Project.jsx`
- Modify: `src/styles/style.css`
- Test: `src/__tests__/projects.test.js`

**Interfaces:**
- Produces: `project.showcaseBeats`, where each beat has `primary`, optional `previous`, optional `next`, and layout fields.

- [ ] Add data tests for 8-10 beats and 3 peaks.
- [ ] Render beats as staged compositions, driven by one horizontal GSAP transform on desktop.
- [ ] Allow cropping/offscreen satellites.
- [ ] Keep mobile/reduced-motion fallback stacked and simpler.
- [ ] Tune scroll distance so content does not drag.

### Task 5: Required QA Recording

**Files:**
- Create/update: `.codex-reference/core-fidelity-*`

**Interfaces:**
- Consumes: running dev server.
- Produces: visual capture evidence for required flow.

- [ ] Record 1440x900 full flow from `/works` through entry, hero, info, showcase, and close at about 70%.
- [ ] Record closes from about 25%, 50%, and 95%.
- [ ] Verify returned Works is exact actual page state and no fake-to-real swap is visible.
- [ ] Run targeted tests, build, and lint status check.
