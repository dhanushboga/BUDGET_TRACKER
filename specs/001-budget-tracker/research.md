# Phase 0 Research: Monthly Budget Tracker

All technical unknowns below were resolved from the user's revised direction ("HTML, CSS, JS... standard patterns for clean coding" — no backend, no jQuery/AJAX) plus lessons from the earlier implementation attempt. No [NEEDS CLARIFICATION] markers remain in the Technical Context.

## 1. No backend — pure static app with `localStorage`

- **Decision**: Drop the Node/Express server entirely. The app is a static `index.html` + CSS + JS bundle with no build step, persisting data via the browser's `localStorage`.
- **Rationale**: The user's latest request names only HTML/CSS/JS, dropping the earlier AJAX/jQuery/backend framing. A single-user app has no need for a server at all if data only needs to persist in the user's own browser. This also sidesteps a real problem hit in the previous implementation attempt: `npm install` failed in this environment (`UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, consistent with a corporate TLS-inspecting proxy), which blocked installing Express/jQuery/Jest. A zero-dependency static app has nothing to install to run.
- **Alternatives considered**:
  - *Keep Express + JSON file, serve statically* — rejected: no longer matches the user's stated scope, and reintroduces the exact dependency-install problem already encountered.
  - *IndexedDB* — rejected: more API surface than needed for a small, flat JSON shape; `localStorage`'s synchronous get/set is simpler to reason about at this scale.

## 2. Persistence shape

- **Decision**: A single `localStorage` key (`budgetTracker.v1`) holding one JSON blob: `{ "entries": [...], "budgets": {...} }` — the same shape as the previous file-based design, just relocated.
- **Rationale**: Keeps `data-model.md`'s entities unchanged; a single key means a read-modify-write cycle only ever touches one blob, avoiding partial-write inconsistency between separate keys.
- **Alternatives considered**: *One `localStorage` key per entity type* — rejected: adds bookkeeping for no benefit at hundreds-to-thousands of records.

## 3. Client-side module organization

- **Decision**: Plain `<script>` tags (no bundler, no ES module `import`/`export`) loaded in dependency order: `storage.js` → `entryService.js`/`budgetService.js`/`dashboardService.js` → `entriesView.js`/`dashboardView.js` → `app.js`. Each file attaches its exports to a shared namespace object (e.g., `window.Budget.entryService`).
- **Rationale**: Matches "standard patterns for clean coding" (clear separation of concerns) while staying zero-build. Native ES modules were considered but rejected because `type="module"` scripts fail under `file://` due to CORS restrictions on module fetches — plain scripts let the app be opened directly as a local file, not just through a static server.
- **Alternatives considered**: *ES modules + a local dev server requirement* — rejected: adds a "you must serve this, can't just open the file" constraint not justified by this app's scope.

## 4. Reload-free UI updates

- **Decision**: Every create/edit/delete/save action calls a service function synchronously, then re-renders only the affected DOM section (entry list, dashboard) — the same "no full reload" outcome as before, just without any network round trip since there's no server to call.
- **Rationale**: Satisfies FR/SC requirements about immediate updates using the simplest mechanism available once persistence is local.
- **Alternatives considered**: None needed — this follows directly from removing the backend.

## 5. Testing approach

- **Decision**: Node's built-in test runner (`node --test`) with `node:assert/strict`, targeting `entryService.js`, `budgetService.js`, and `dashboardService.js` directly (they're plain functions operating on a JSON object, no DOM dependency). No test framework dependency.
- **Rationale**: These three modules hold 100% of the logic worth automated-testing (FR-005 validation, SC-004 aggregation invariant). Using Node's built-in runner needs zero `npm install`, avoiding the exact registry-connectivity problem hit earlier in this environment, and fits the "no build step" philosophy of the rest of the app.
- **Alternatives considered**: *Jest* — rejected: requires `npm install`, which failed in this environment; unjustified weight for a dependency-free app.
