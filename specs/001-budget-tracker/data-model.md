# Phase 1 Data Model: Monthly Budget Tracker

Derived from the Key Entities and Functional Requirements in [spec.md](./spec.md). Unchanged from the previous plan except for where the data lives (see Persistence Shape).

## Entity: Spend Entry

Represents a single recorded expense.

| Field | Type | Required | Validation Rules |
|-------|------|----------|-------------------|
| `id` | string (generated client-side, e.g., `crypto.randomUUID()`) | yes (assigned on create) | Immutable once assigned |
| `date` | string, ISO date `YYYY-MM-DD` | yes | Must be a valid calendar date (FR-005). Determines the entry's month (FR-006). |
| `category` | string (free text) | yes | Non-empty after trimming whitespace (FR-005, FR-012) |
| `description` | string (free text) | no | May be empty; not required to be unique |
| `amount` | number | yes | Must be numeric and > 0; negative or non-numeric values are rejected (FR-005) |

**Derived grouping**: An entry's month is `YYYY-MM` taken from its `date` field — never from the month the user happened to be viewing when the entry was created (Edge Cases).

## Entity: Monthly Budget

Represents the single overall spending target for one calendar month.

| Field | Type | Required | Validation Rules |
|-------|------|----------|-------------------|
| `month` | string, `YYYY-MM` | yes | Acts as the unique key — at most one budget per month (Key Entities) |
| `amount` | number | yes | Must be numeric and > 0; negative or non-numeric values are rejected (FR-005) |

A month with no budget record is treated as "no budget set" (zero / clear indicator), not an error (User Story 2, Acceptance Scenario 3).

## Derived: Dashboard Summary (computed, not stored)

Computed on demand from Spend Entries + Monthly Budget for a given month; not persisted as its own record.

| Field | Type | Derivation |
|-------|------|------------|
| `month` | string, `YYYY-MM` | The month being viewed (defaults to current month — FR-011) |
| `budget` | number | The Monthly Budget amount for `month`, or 0 if unset |
| `totalSpend` | number | Sum of `amount` across all Spend Entries whose `date` falls in `month` |
| `categoryBreakdown` | array of `{ category, total }` | Spend Entries for `month` grouped by `category`, each summed; must sum exactly to `totalSpend` (SC-004) |
| `overBudget` | boolean | `totalSpend > budget` (FR-010) |

## Relationships

- A Spend Entry belongs to exactly one month (derived from `date`); a month can have any number of Spend Entries (zero or more).
- A month has at most one Monthly Budget record.
- The Dashboard Summary is a read-time join/aggregation of the two entities above for a single month — it has no independent lifecycle (no create/update/delete of its own).

## Persistence Shape (`localStorage`)

Reflecting the "no backend, single `localStorage` blob" decision in [research.md](./research.md):

- **Key**: `budgetTracker.v1`
- **Value** (JSON-stringified):

```json
{
  "entries": [
    { "id": "…", "date": "2026-09-15", "category": "Groceries", "description": "Weekly shop", "amount": 54.30 }
  ],
  "budgets": {
    "2026-09": 1500
  }
}
```

If the key is absent (first run), `storage.js` initializes it to `{ "entries": [], "budgets": {} }` before any read.
