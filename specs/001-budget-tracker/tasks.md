---

description: "Task list template for feature implementation"
---

# Tasks: Monthly Budget Tracker

**Input**: Design documents from `/specs/001-budget-tracker/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/storage-schema.md](./contracts/storage-schema.md), [quickstart.md](./quickstart.md)

**Revision note**: This replaces the previous tasks.md, which built an Express + jQuery version of this feature. Per the updated plan.md, this app is now a dependency-free static site (vanilla JS + `localStorage`, no backend). Phase 1 includes removing the obsolete server/jQuery code.

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

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately (includes removing the old implementation)
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational only
- **User Story 2 (Phase 4)**: Depends on Foundational only; independent of US1
- **User Story 3 (Phase 5)**: Depends on Foundational; reads entries (US1) and budget (US2) data to compute the dashboard, so is most naturally built after US1 and US2 even though its own service/view code is separate
- **Polish (Phase 6)**: Depends on the user stories it tests (US1, US2, US3) being complete

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
