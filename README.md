# Budget Tracker

A single-user monthly budget tracker: record dated, categorized spend entries, set an overall budget per month, and view a dashboard with total spend and a category breakdown — all updated in place, with no page reloads.

Plain HTML/CSS/JavaScript, no backend, no build step, no dependencies. Data is stored in the browser's `localStorage`.

See [specs/001-budget-tracker/](specs/001-budget-tracker/) for the full spec, plan, data model, storage schema, and quickstart validation guide.

## Run

Open `index.html` directly in a browser (double-click it, or `start index.html` from a terminal). No install, no server needed.

> If your browser blocks `localStorage` for `file://` pages, serve the folder instead with any static file server, e.g. `npx serve .` or `python -m http.server`, and open the printed URL.

## Test

```bash
node --test
```

Runs the unit tests under `tests/unit/` (validation and dashboard aggregation logic) using Node's built-in test runner — no install required.
