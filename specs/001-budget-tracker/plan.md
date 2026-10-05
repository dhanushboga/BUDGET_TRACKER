# Implementation Plan: Monthly Budget Tracker

**Branch**: `001-budget-tracker` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-budget-tracker/spec.md`

**Revision note**: This plan replaces an earlier version that used a Node/Express backend + jQuery/AJAX. The user has since asked for a plain HTML/CSS/JS app with no backend; this version reflects that direction. `/speckit-tasks` and `/speckit-implement` will need to be re-run against this plan — the existing `server/` and jQuery-based `public/` code will be replaced.

## Summary

A single-user monthly budget tracker built as a purely static HTML/CSS/JavaScript app: users record dated, categorized spend entries (date, category, description, amount), set an overall budget per month, and view a dashboard showing that month's budget, total spend, and category breakdown. There is no backend and no build step — all data is persisted directly in the browser via `localStorage`, and the UI updates in place (no page reload) purely through synchronous DOM manipulation, since there's no network round trip involved at all.

## Technical Context

**Language/Version**: JavaScript (ES2021+), HTML5, CSS3 — no transpilation or bundling

**Primary Dependencies**: None. Plain `<script>` tags, no framework, no jQuery, no server framework

**Storage**: Browser `localStorage`, a single JSON blob under one key (`budgetTracker.v1`) holding `{ entries: [...], budgets: {...} }`

**Testing**: Node's built-in test runner (`node --test`) with `node:assert/strict` for the storage-independent validation/aggregation logic; manual browser walkthrough (`quickstart.md`) for the UI

**Target Platform**: Modern desktop web browsers; the app can be opened directly as a local file or served by any static file server — no server-side runtime required

**Project Type**: Single static web app (frontend-only; no backend project)

**Performance Goals**: All interactions (add/edit/delete entry, set budget, switch dashboard month) reflect in the UI instantly (no network latency, since everything is local), consistent with SC-001/SC-002/SC-003

**Constraints**: No full-page reloads for any create/edit/delete/view action; single user, no authentication; single default currency; single overall budget per month (no per-category budgets, per spec Assumptions); data lives only in the browser that entered it — no cross-device sync

**Scale/Scope**: One user, realistically hundreds to a few thousand entries — comfortably within `localStorage`'s per-origin size limits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` contains only unfilled template placeholders — no project-specific principles have been ratified for this repository. Proceeding under general engineering defaults implied by the user's own request ("standard patterns for clean coding"):

- Separation of concerns: persistence (`storage.js`), business/validation logic (`entryService.js`, `budgetService.js`, `dashboardService.js`), and DOM rendering (`entriesView.js`, `dashboardView.js`) live in distinct modules.
- Validation lives at the system boundary (before anything is written to storage), matching FR-005.
- No unnecessary dependencies or build tooling, matching the "basic functionality" scope and the plain HTML/CSS/JS request.

**Result**: PASS (no constitution constraints to violate; self-imposed simplicity constraints documented above).

## Project Structure

### Documentation (this feature)

```text
specs/001-budget-tracker/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── storage-schema.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                   # Single-page shell (entry form, entry list, budget control, dashboard)
css/
└── styles.css

js/
├── storage.js                # Read/write the single localStorage blob; schema init/versioning
├── entryService.js            # Entry validation + CRUD over storage.js (FR-001, FR-002, FR-005, FR-006)
├── budgetService.js            # Budget validation + get/set over storage.js (FR-004, FR-005)
├── dashboardService.js          # Aggregation: totalSpend, categoryBreakdown, overBudget (FR-007-010)
├── entriesView.js               # Renders entry form/list; wires DOM events to entryService
├── dashboardView.js              # Renders budget control + dashboard; wires DOM events to budgetService/dashboardService
└── app.js                        # Bootstraps the page: sets default month, initial render

tests/
└── unit/
    ├── entryService.test.js
    ├── budgetService.test.js
    └── dashboardService.test.js
```

**Structure Decision**: A flat, dependency-free static site at the repository root — no `server/`, no `public/`, no `node_modules` required to run the app. Internal layering mirrors the previous plan's separation of concerns (storage → services → views) but everything runs client-side. Tests target the three service modules directly since they contain the only logic worth unit-testing (validation, aggregation); the view/DOM-wiring modules are covered by the manual `quickstart.md` walkthrough instead.

## Complexity Tracking

*No constitution violations identified — this section is not applicable.*
