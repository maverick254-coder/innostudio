# SDD ledger — plan: docs/superpowers/plans/2026-09-29-core-fidelity-rebuild.md
Pre-flight: Task 1 transition store produces preserved Works/project layers consumed by Task 5 visual QA.
Pre-flight: Task 2 Mighty data/artwork produces screen ids consumed by Task 3 and Task 4.
Pre-flight: Task 4 beat model consumes Task 3 screen ids and produces desktop staged showcase for Task 5.
Ruling: skip task commits in this dirty shared workspace — avoids accidentally committing unrelated pre-existing changes — cost if wrong: less granular git history for this rebuild.
Task 1: complete without commit (tests: npx vitest run src\\__tests__\\projectTransition.test.js -> 2/2 pass).
Task 2: complete without commit (tests: npx vitest run src\\__tests__\\projects.test.js src\\__tests__\\ProjectRouting.test.jsx -> data/routing pass).
Task 3: complete without commit (implementation: ProjectArtwork rebuilt as coherent Mighty interface screens; covered by project data and route render tests).
Task 4: complete without commit (tests: showcaseBeats data contract and route render pass; renderer now consumes beat panels).
Task 5: complete without commit (QA: recorded `/works -> /work/mighty-demo -> close from 73% gallery progress` at 1440x900 in `.codex-reference/core-fidelity-rebuild/desktop-1440x900/close-from-70-gallery-exit.mp4`).
Verification: targeted project tests pass and `npm run build` passes. `npm run lint` still fails on pre-existing repo-wide issues in `script.js`, `NavigationDirectionContext.jsx`, and `About.jsx`, plus two hook dependency warnings.
