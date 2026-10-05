# Quickstart: Monthly Budget Tracker

Manual validation guide for confirming the feature works end-to-end in a browser. For the module/storage interface, see [contracts/storage-schema.md](./contracts/storage-schema.md); for field definitions, see [data-model.md](./data-model.md).

## Prerequisites

- None. There is no build step and nothing to `npm install` — the app is a static `index.html` + CSS + JS bundle.

## Run the app

Open `index.html` directly in a browser (double-click it, or `start index.html` / `open index.html` from a terminal). No server is required.

> If your browser blocks `localStorage` for `file://` pages (some browsers do), serve the folder instead with any static file server, e.g. `npx serve .` or Python's `python -m http.server`, and open the printed `http://localhost:...` URL.

## Validation scenarios

### 1. Record a spend entry (User Story 1)

1. In the entry form, enter a date, category, description, and amount, then submit.
2. **Expected**: the entry appears in the entry list immediately, with no page reload.
3. Edit the entry's amount and resubmit.
4. **Expected**: the list updates in place to show the new amount.
5. Delete the entry.
6. **Expected**: it disappears from the list and no longer contributes to any totals.
7. Try submitting with a blank amount, a negative amount, or no date/category.
8. **Expected**: the form shows a validation message and no entry is created.
9. Reload the page (or reopen `index.html`).
10. **Expected**: previously entered entries are still there — they're read back from `localStorage`.

### 2. Set a monthly budget (User Story 2)

1. Navigate to a month with no budget set yet.
2. **Expected**: the budget field shows as unset (e.g., 0 / "no budget set").
3. Enter a budget amount and save.
4. **Expected**: the amount is saved and re-displayed without a page reload.
5. Change the amount and save again.
6. **Expected**: the new amount replaces the old one.

### 3. View the dashboard (User Story 3)

1. Seed the current month with a budget and a few entries across at least two categories (via steps 1–2 above).
2. Open the dashboard view.
3. **Expected**: it shows the monthly budget, total spend, and a per-category breakdown whose totals sum exactly to the displayed total spend.
4. Add enough entries to push total spend above the budget.
5. **Expected**: the dashboard visually flags the over-budget state.
6. Switch the dashboard to a different month with its own data.
7. **Expected**: all dashboard figures update to that month's data, with no page reload.
8. Switch to a month with no entries at all.
9. **Expected**: category breakdown shows empty/zero, not an error.

## Automated logic tests

```bash
node --test
```

Runs the validation and aggregation tests for `entryService.js`, `budgetService.js`, and `dashboardService.js` — no install required (Node's built-in test runner).

## Success criteria check

- Adding an entry and setting a budget each complete in a few clicks/seconds (SC-001, SC-002).
- No manual refresh is ever required to see the effect of an add/edit/delete on the dashboard (SC-003).
- Category totals always sum to the displayed monthly total (SC-004).
- Over/under budget status is visually obvious immediately on opening the dashboard (SC-005).
