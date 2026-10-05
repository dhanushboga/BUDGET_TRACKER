---

description: "Task list template for feature implementation"
---

# Tasks: Monthly Budget Tracker

**Input**: Design documents from `/specs/001-budget-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/storage-schema.md](./contracts/storage-schema.md), [quickstart.md](./quickstart.md)

**Revision note**: This replaces the previous tasks.md, which built an Express + jQuery version of this feature. Per the updated plan.md, this app is now a dependency-free static site (vanilla JS + `localStorage`, no backend). Phase 1 includes removing the obsolete server/jQuery code. Phase 7 was added afterwards to apply Elsevier branding and a professional color palette to the already-complete UI; it does not change any functional requirement or user story. Phase 8 was added after that to enlarge and crop the Elsevier logo so its artwork is clearly visible.

**Tests**: Not explicitly requested in the spec, so no per-story TDD test tasks are included. A small set of tests using Node's built-in test runner is included in the Polish phase to cover the validation and aggregation logic called out by FR-005 and SC-004, matching the testing approach chosen in research.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Per [plan.md](./plan.md)'s Project Structure: everything lives at the repository root — `index.html`, `css/`, `js/`, `tests/unit/`. No `server/`, no `public/`, no `node_modules`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove the obsolete backend/jQuery implementation and lay out the new static-site structure

- [X] T001 Remove the obsolete implementation: delete the `server/` directory, delete the old jQuery-based `public/` directory, and delete `package.json`/`package-lock.json` and `node_modules/` if present — the app now has zero dependencies and no backend
- [X] T002 Create the new project structure at repo root: `css/`, `js/`, `tests/unit/`
- [X] T003 [P] Create the HTML shell `index.html` with containers for a month selector, dashboard, budget control, entry form, and entry list, plus `<script>` tags in dependency order for `js/storage.js`, `js/validation.js`, `js/entryService.js`, `js/budgetService.js`, `js/dashboardService.js`, `js/entriesView.js`, `js/dashboardView.js`, `js/app.js`
- [X] T004 [P] Create the base stylesheet `css/styles.css` with a minimal layout for the sections in `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Implement `js/storage.js`: `Budget.storage.load()` / `Budget.storage.save(data)` over the single `localStorage` key `budgetTracker.v1`, initializing it to `{ entries: [], budgets: {} }` on first run, per contracts/storage-schema.md
- [X] T006 [P] Implement `js/validation.js`: `isValidDate`, `isNonEmptyCategory`, `isPositiveAmount`, `monthOf`, returning clear error messages per FR-005/FR-006

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Record a spend entry (Priority: P1) 🎯 MVP

**Goal**: Let the user create, edit, delete, and list spend entries (date, category, description, amount), with the entry list updating in place, never a full page reload.

**Independent Test**: Add a new entry, confirm it appears in the list without a page reload; edit it and confirm the list reflects the change; delete it and confirm it's gone; submit invalid data (blank amount, negative amount, missing date/category) and confirm it's rejected with a clear message; reload the page and confirm entries persisted via `localStorage`.

### Implementation for User Story 1

- [X] T007 [US1] Implement `js/entryService.js`: `listEntriesForMonth(month)`, `createEntry(input)`, `updateEntry(id, input)`, `deleteEntry(id)` over `js/storage.js`, using `js/validation.js` to enforce FR-005 and deriving each entry's month from its `date` field (FR-006)
- [X] T008 [P] [US1] Refine the entry form and entry list markup in `index.html` (date, category, description, amount inputs; submit button; list container with per-row edit/delete controls)
- [X] T009 [US1] Implement `js/entriesView.js`: on load, fetch and render the current month's entries; wire create/edit/delete actions to `entryService`, re-rendering only the entry list on success (no reload)
- [X] T010 [US1] In `js/entriesView.js`, display validation errors returned by `entryService` inline on the entry form without clearing user input
- [X] T011 [US1] Style the entry form and entry list (including validation error state) in `css/styles.css`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Set a monthly budget (Priority: P2)

**Goal**: Let the user set or update a single overall budget amount for any given month.

**Independent Test**: Open a month with no budget set and confirm it shows as unset (zero/"no budget set"); enter a budget amount and confirm it saves; change it and confirm the new amount replaces the old one — all without a page reload.

### Implementation for User Story 2

- [X] T012 [US2] Implement `js/budgetService.js`: `getBudget(month)` (returning amount 0 when unset) and `setBudget(month, input)` over `js/storage.js`, using `js/validation.js` to enforce FR-005
- [X] T013 [P] [US2] Add a month selector and budget-amount input/display to `index.html`
- [X] T014 [US2] Implement budget fetch/save logic in `js/dashboardView.js`: on month change, load that month's budget via `budgetService`; on save, update it and re-render the budget display without reload
- [X] T015 [US2] Style the month selector and budget control in `css/styles.css`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - View monthly dashboard (Priority: P3)

**Goal**: Show the selected month's overall budget, total spend, and category-wise spend breakdown on a dashboard, with a clear over-budget indicator and the ability to switch months.

**Independent Test**: Seed a month with a budget and several categorized entries; open the dashboard and confirm it shows the correct budget, total spend, and a category breakdown that sums exactly to the total; push spend over budget and confirm the over-budget state is visually flagged; switch to another month and confirm the dashboard updates; switch to an empty month and confirm it shows zero/empty rather than an error.

### Implementation for User Story 3

- [X] T016 [US3] Implement `js/dashboardService.js`: `getDashboard(month)` computing `totalSpend`, `categoryBreakdown` (grouped sums), and `overBudget` from `entryService`/`budgetService` data, per data-model.md's Dashboard Summary (ensuring category totals sum exactly to `totalSpend`, per SC-004)
- [X] T017 [P] [US3] Build the dashboard markup in `index.html` (budget, total spend, category breakdown list, over-budget indicator, reusing the month selector from US2)
- [X] T018 [US3] Implement dashboard render and month-switch logic in `js/dashboardView.js`: on load and on month change, call `dashboardService.getDashboard` and render budget/total/breakdown/over-budget state without reload
- [X] T019 [US3] Style the dashboard, including a distinct visual state for over-budget, in `css/styles.css`
- [X] T020 [US3] In `js/entriesView.js` and `js/dashboardView.js`, trigger a dashboard re-render immediately after any entry create/edit/delete or budget save for the currently viewed month, so the dashboard never requires a manual refresh (SC-003)
- [X] T021 [US3] Implement `js/app.js`: on page load, set the month selector to the current calendar month (FR-011) and trigger the initial render of both the entry list and the dashboard

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and documentation that spans all user stories

- [X] T022 [P] Add `tests/unit/entryService.test.js` (Node's built-in `node:test` + `node:assert/strict`, with a minimal in-memory `localStorage` stub) covering FR-005 validation rules and CRUD behavior — 7 tests, all passing (`node --test`)
- [X] T023 [P] Add `tests/unit/budgetService.test.js` covering FR-005 validation and the "unset month returns 0" behavior — 4 tests, all passing
- [X] T024 [P] Add `tests/unit/dashboardService.test.js` asserting category totals always sum to `totalSpend` (SC-004) and that an empty month returns zero/empty, not an error — 3 tests, all passing
- [X] T025 **Partial**: no Playwright/`chromium-cli` is available in this environment (and installing one is blocked by the same `npm` certificate issue noted earlier), so the quickstart.md scenarios could not be driven in a live browser. Verified instead by: syntax-checking every JS file (`node -c`), cross-checking every DOM id referenced from `entriesView.js`/`dashboardView.js`/`app.js` against `index.html` (all match), and tracing script load order against each module's dependencies (all satisfied). Recommend the user open `index.html` once to confirm visually.
- [X] T026 [P] Update `README.md` to describe the no-install, no-server workflow (open `index.html` directly, or serve the folder statically; run `node --test` for logic tests)

---

## Phase 7: Branding & Visual Design (Cross-Cutting)

**Purpose**: Apply Elsevier branding and a more attractive, professional color palette across the existing UI. Purely presentational — no functional requirement, user story, or data model changes.

- [X] T027 [P] Reference the Elsevier logo at `assets/elsevier-logo.webp` (already added to the repo) from `index.html`: display it in `.app-header` next to the "Budget Tracker" title
- [X] T028 Add the Elsevier logo as a subtle background watermark on the page in `css/styles.css` (e.g. low-opacity, fixed, non-repeating `background-image` on `body`), tuned so panel/table/form content stays fully readable on top of it
- [X] T029 [P] Define a professional Elsevier-inspired color palette as CSS custom properties at the top of `css/styles.css` (dark neutral `--color-header`, Elsevier orange `--color-accent` ~`#F36D21`, supporting neutrals/background/text colors)
- [X] T030 Apply the new palette in `css/styles.css` by replacing hard-coded colors with the custom properties from T029: `.app-header`, `button`, `.stat-value`, `.budget-flag`, table header (`th`), and focus/hover states
- [X] T031 **Partial**: no browser automation is available in this environment (same constraint as T025), so the restyle was verified by: re-running all 18 `node --test` unit tests (all pass — styling-only change, no logic touched), syntax-checking every JS file (`node -c`), and confirming `assets/elsevier-logo.webp` is referenced correctly from both `index.html` and `css/styles.css`. Recommend the user open `index.html` once to visually confirm legibility of the over-budget flag and validation errors against the new palette/watermark.

**Checkpoint**: UI reflects Elsevier branding and a cohesive professional color scheme, with no regression to existing functionality

---

## Phase 8: Elsevier Logo Sizing & Clarity (Cross-Cutting)

**Purpose**: Make the Elsevier logo large and clear enough to actually see the artwork (tree, "NON SOLUS" banner, figure, and orange "ELSEVIER" wordmark). Purely presentational — no functional requirement, user story, or data model changes.

**Root cause**: `assets/elsevier-logo.webp` is 1280×719 px, but the artwork only fills a central box of roughly x 385–895 px, y 78–642 px (≈510×565 px, aspect ≈0.9:1); the rest is white padding. With the current `.app-logo { height: 2rem }` the visible artwork renders only ~25 px tall, which is why it looks tiny and blurry. The fix is to crop to the artwork box *and* enlarge it, rather than only increasing `height`.

**Independent Test**: Open `index.html` at desktop width (≥1024 px) — the header logo shows the tree and the "ELSEVIER" wordmark legibly (~72 px tall frame, artwork uncut with only a thin white margin), vertically centered with the "Budget Tracker" title and not overlapping the month switcher. At ≤600 px width the logo shrinks proportionally and the header still fits without horizontal scroll.

- [X] T032 In `index.html`, wrap the existing `<img src="assets/elsevier-logo.webp" alt="Elsevier" class="app-logo">` inside `.app-brand` in a new `<span class="app-logo-frame">…</span>` (keep the `<img>`, its `src`, and `alt="Elsevier"` unchanged for accessibility)
- [X] T033 In `css/styles.css`, add a `.app-logo-frame` rule that crops to the artwork box: `display: inline-block; width: 4.125rem; height: 4.5rem; overflow: hidden; flex-shrink: 0; background: #fff; border-radius: 6px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);`
- [X] T034 In `css/styles.css`, replace the existing `.app-logo` rule (currently `height: 2rem; width: auto; border-radius: 4px; background: #fff; padding: 0.15rem 0.35rem;`) with a scaled, offset image inside the frame: `display: block; height: 5.39rem; width: auto; max-width: none; margin-left: -2.74rem; margin-top: -0.45rem;` (scale = 4.5rem / 600 px, so left offset 365 px and top offset 60 px). The first pass used the unpadded 3.5rem box and clipped the bottom of the "ELSEVIER" wordmark and the tree's left edge, so the padded box and the larger 4.5rem frame were adopted
- [X] T035 In `css/styles.css`, keep `.app-header` from cramping the larger logo: set `.app-brand { gap: 1rem; }`, add `flex-wrap: wrap; gap: 0.75rem;` to `.app-header`, and keep `padding: 1rem 1.5rem` (the header grows to fit the 4.5rem frame automatically via `align-items: center`)
- [X] T036 In `css/styles.css`, add an `@media (max-width: 600px)` block that scales the logo down proportionally: `.app-logo-frame { width: 3.1rem; height: 3.375rem; }` and `.app-logo { height: 4.04rem; margin-left: -2.05rem; margin-top: -0.34rem; }` (the same ratios as T033/T034 × 0.75), plus `.app-header h1 { font-size: 1.1rem; }`
- [X] T037 In `css/styles.css`, enlarge the `body::before` watermark so its artwork is also recognizable: change `background-size: 480px auto` to `background-size: min(1200px, 110vw) auto` (the 1280 px source is never upscaled more than slightly, so it stays sharp), and keep `opacity: 0.05` so panel, table, and form content stays fully readable
- [X] T038 Verify: run `node --test` (all 18 unit tests still pass — no logic touched), confirm the `assets/elsevier-logo.webp` paths in `index.html` and `css/styles.css` are unchanged, and open `index.html` in a browser at ~1280 px and ~375 px widths to confirm the Independent Test above (logo artwork fully visible and uncut, wordmark readable, no header overflow). If browser automation is unavailable (as in T025/T031), record it as **Partial** and ask the user to check visually. **Done**: 18/18 tests pass; headless Edge screenshots (1280×800, plus a 2× zoom of the header) confirm the full artwork and wordmark are visible and unclipped and the header does not overflow. The 375 px check was inconclusive because headless Edge enforces a minimum window width wider than 375 px, so the `@media` rule is verified by its values only. A real phone or DevTools device-mode check is still recommended

**Checkpoint**: The Elsevier logo is clearly visible in the header at desktop and mobile widths, the watermark is recognizable but unobtrusive, and existing functionality is unchanged

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately (includes removing the old implementation)
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational only
- **User Story 2 (Phase 4)**: Depends on Foundational only; independent of US1
- **User Story 3 (Phase 5)**: Depends on Foundational; reads entries (US1) and budget (US2) data to compute the dashboard, so is most naturally built after US1 and US2 even though its own service/view code is separate
- **Polish (Phase 6)**: Depends on the user stories it tests (US1, US2, US3) being complete
- **Branding & Visual Design (Phase 7)**: Depends on Phases 1–6 being complete (restyles the finished UI); independent of which user stories ran in what order
- **Logo Sizing & Clarity (Phase 8)**: Depends on Phase 7 (T027 logo markup, T028 watermark). Within the phase: T032 → T033 → T034 → T035 → T036 run sequentially (same files, and T036 mirrors T033/T034's values); T037 touches a separate rule and can run any time after T028; T038 runs last

### Within Each User Story

- Service module before view module (view calls the service)
- Frontend markup ([P] tasks) can proceed in parallel with service work within the same story

### Parallel Opportunities

- T003, T004 (Setup) can run in parallel
- T006 (Foundational) can run in parallel with T005
- T008 (US1 markup) can run in parallel with T007 (US1 service)
- T013 (US2 markup) can run in parallel with T012 (US2 service)
- T017 (US3 markup) can run in parallel with T016 (US3 service)
- T022, T023, T024, T026 (Polish) can all run in parallel

---

## Parallel Example: User Story 1

```bash
# Service and frontend markup for US1 can proceed together:
Task: "Implement js/entryService.js per FR-005/FR-006"
Task: "Refine the entry form and entry list markup in index.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (including removing the old implementation)
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (record spend entries)
4. **STOP and VALIDATE**: Run the User Story 1 section of quickstart.md
5. This alone delivers a working spend log — a usable MVP even before budgets/dashboard exist

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. User Story 1 → validate independently → usable spend log (MVP)
3. User Story 2 → validate independently → budgets can now be set per month
4. User Story 3 → validate independently → full dashboard experience (budget + spend + category breakdown)
5. Polish → automated test coverage, README, final quickstart pass

---

## Notes

- No cross-story file conflicts: `index.html` and `css/styles.css` are touched by each story only to add that story's own section/rules; every JS module is story-specific except `js/dashboardView.js`, which is intentionally shared by US2 (budget fetch/save) and US3 (dashboard render) since both concern the month view.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
- No `npm install` or any install step is required anywhere in this task list — the app has zero dependencies by design (see research.md).
- Phase 7 is purely visual: it touches only `index.html` (logo reference) and `css/styles.css` (palette + watermark); no `js/` file changes.
- Phase 8 is also purely visual and touches only `index.html` (one wrapper `<span>`) and `css/styles.css`; the logo asset itself is not modified or re-encoded.
