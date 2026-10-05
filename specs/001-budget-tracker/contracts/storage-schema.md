# Storage & Module Contract: Monthly Budget Tracker

There is no network API in this design (see [research.md](../research.md), decision 1). The equivalent "contract" is (a) the `localStorage` schema and (b) the function signatures each service module exposes to the view layer. Both are documented here so `entriesView.js`/`dashboardView.js` and any future module can be written against a stable interface.

## `localStorage` Schema

- **Key**: `budgetTracker.v1`
- **Shape**: see [data-model.md](../data-model.md)'s Persistence Shape section.
- **Versioning**: the `.v1` suffix is deliberate — if the shape ever changes incompatibly, bump to `.v2` and migrate/ignore the old key rather than mutating the v1 shape in place.

## `storage.js`

- `load(): { entries: Entry[], budgets: Record<string, number> }` — reads and parses the blob, initializing it to `{ entries: [], budgets: {} }` on first run.
- `save(data): void` — stringifies and writes the full blob back to `localStorage`.

## `entryService.js`

- `listEntriesForMonth(month: string): Entry[]` — all entries whose `date` falls in `month` (`YYYY-MM`).
- `createEntry(input: { date, category, description, amount }): { entry } | { error }` — validates per FR-005, assigns an `id`, persists, returns the created entry or a validation error message.
- `updateEntry(id: string, input): { entry } | { error } | { notFound: true }` — validates and replaces an existing entry.
- `deleteEntry(id: string): { success: true } | { notFound: true }`.

## `budgetService.js`

- `getBudget(month: string): { month, amount }` — `amount` is `0` when unset.
- `setBudget(month: string, input: { amount }): { month, amount } | { error }`.

## `dashboardService.js`

- `getDashboard(month: string): { month, budget, totalSpend, categoryBreakdown: { category, total }[], overBudget }` — pure aggregation over `entryService`/`budgetService` data; `sum(categoryBreakdown[].total) === totalSpend` always holds (SC-004); a month with no entries returns `categoryBreakdown: []` and `totalSpend: 0` (Edge Cases).

## View modules (consumers, not further contracted)

`entriesView.js` and `dashboardView.js` call the above functions and render/re-render only the DOM section they own — they expose no reusable functions of their own beyond DOM event wiring, so they aren't part of this contract.
