# Core Fidelity Rebuild Design

## Goal

Rebuild the Mighty project experience so `/works -> /work/mighty-demo -> /works` feels like entering and leaving the selected project's world, using stable visual canvases and the real Works state rather than fake transition approximations.

## Scope

This pass covers only the project identity, Mighty Works cover, entry transition, hero, info, showcase assets, showcase composition, exit transition, and Works restoration. It does not change the background system, Codex pet/mascot, unrelated global navigation, unrelated lint, or other Works cards.

## Transition Architecture

Entry and exit use complete visual layers:

- Works layer: cloned from the actual Works DOM at the clicked scroll position.
- Project layer: cloned from the actual current Project DOM/frame on exit, and an authored project canvas on entry only when the project route has not mounted yet.

The preserved Works layer is a DOM snapshot of the real Works page, not duplicated React markup or a screenshot. It is kept only for continuity between Works and the corresponding Project route and removed after return settles. Direct `/work/mighty-demo` loads do not invent a previous Works state.

Route state and visual state are decoupled. Route navigation can happen while transition layers remain mounted; layers are removed only after the visual transition completes. Exit freezes the current project frame before navigating and must not scroll, rewind ScrollTrigger, or animate through Info/Hero.

## Mighty Identity

The visible case-study title is `Mighty`. The route/data id may remain `mighty-demo`. The Mighty Works cover and all case-study screens share a yellow, pink, black, and off-white system, common navigation language, a repeated `MIGHTY` motif, concise editorial copy, and interface-like details.

## Project Composition

The hero is a quiet editorial title suspended in a large canvas, left-biased and not centered. The info section is compact: small metadata on the left and a controlled editorial paragraph on the right.

The artwork is rebuilt from poster-like cards into believable fictional screens from a Mighty website/product ecosystem. The media set contains approximately 10-12 screens including homepage, projects listing, project detail, services/about, mobile homepage, mobile menu, dark menu, culture/studio, contact/team, collage, another desktop screen, and a closing composition.

## Showcase Model

The showcase remains GSAP/Lenis-driven on desktop, but the data model describes authored visual beats rather than only widths and gaps. Each beat defines a primary screen and optional previous/next satellites with size, x/y placement, scale, crop, and depth. A single horizontal transform may still drive the internal strip, but the viewer should perceive staged compositions with one dominant image and surrounding satellites, not a flexbox conveyor.

Mobile and reduced motion use a simpler stacked fallback.

## QA

Record the complete 1440x900 flow:

1. `/works`, showing Mighty cover.
2. Click Mighty.
3. Entry transition.
4. Hero.
5. Info.
6. Full showcase.
7. Close from about 70% gallery progress.
8. Verify no rewind and immediate horizontal exit.
9. Verify returned Works is the real Works state.
10. Repeat close from about 25%, 50%, and 95% showcase progress.

Acceptance depends on visual judgment: entry should feel like entering the selected project world; exit should feel like leaving exactly the current project frame and returning to Works.
