# Feature Specification: Monthly Budget Tracker

**Feature Branch**: `001-budget-tracker`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "I want to create a budget tracker app. it should have the following functionalities. 1. Monthly budget tracker. 2. I should enter my budget for any date, category & description 3. on dashboard I should see monthly budget, and category wise spend for the month. 4. add basic functionality."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record a spend entry (Priority: P1)

As a user managing my personal finances, I want to record what I spent — on a given date, under a category, with a short description — so that my spending is captured as it happens.

**Why this priority**: This is the foundational data-entry action. Without recorded entries, there is nothing to budget against or show on the dashboard. It is the minimum slice that delivers standalone value (a spending log).

**Independent Test**: Can be fully tested by adding a new entry with a date, category, description, and amount, then confirming it appears in the entry list with the correct details.

**Acceptance Scenarios**:

1. **Given** the user is on the "add entry" screen, **When** they submit a date, category, description, and amount, **Then** the entry is saved and appears in the list of entries for that month.
2. **Given** an existing entry, **When** the user edits its date, category, description, or amount, **Then** the updated values are saved and reflected everywhere the entry is shown.
3. **Given** an existing entry, **When** the user deletes it, **Then** it no longer appears in the entry list or in any totals.
4. **Given** the user is entering a new entry, **When** they leave the amount blank, use a negative amount, or leave the date/category empty, **Then** the system rejects the entry and explains what needs to be fixed.

---

### User Story 2 - Set a monthly budget (Priority: P2)

As a user, I want to set my overall budget for a given month so that I have a target to track my spending against.

**Why this priority**: The budget figure is what turns a plain expense log into a "budget tracker." It depends on the concept of a month but not on every entry existing yet, so it can be built and tested independently of User Story 1.

**Independent Test**: Can be fully tested by setting a budget amount for a specific month and confirming it is saved and retrievable for that month.

**Acceptance Scenarios**:

1. **Given** no budget has been set for the current month, **When** the user enters a budget amount for that month, **Then** the amount is saved as that month's budget.
2. **Given** a budget already exists for a month, **When** the user changes the amount, **Then** the updated amount replaces the previous one for that month.
3. **Given** the user has not set a budget for a month, **When** they view that month, **Then** the system shows the budget as not-yet-set (e.g., zero or a clear "no budget set" indicator) rather than an error.

---

### User Story 3 - View monthly dashboard (Priority: P3)

As a user, I want a dashboard that shows my monthly budget alongside how much I've spent in total and per category, so I can see at a glance whether I'm on track.

**Why this priority**: This is the payoff view that ties Stories 1 and 2 together. It provides the most visible day-to-day value but requires both entries and a budget concept to already exist to be meaningful.

**Independent Test**: Can be fully tested by seeding a month with a budget and several categorized entries, then confirming the dashboard shows the correct monthly budget, total spend, and a per-category breakdown that sums to the total.

**Acceptance Scenarios**:

1. **Given** a budget and several entries exist for the current month, **When** the user opens the dashboard, **Then** it shows the monthly budget, the total amount spent, and spend broken down by category.
2. **Given** total spend exceeds the monthly budget, **When** the user views the dashboard, **Then** the over-budget state is clearly indicated.
3. **Given** the user switches the dashboard to a different month, **When** that month has its own budget and entries, **Then** the dashboard updates to show that month's figures instead.
4. **Given** a month has no entries yet, **When** the user views its dashboard, **Then** category spend shows as empty/zero rather than an error.

---

### Edge Cases

- What happens when an entry's date falls in a different month than the one currently being viewed? (Entries are attributed to the calendar month of their own date, not the month the user happened to be viewing when creating them.)
- How does the system handle a category that has no name or an entry with a duplicate description? (Description is free text and not required to be unique; category is required.)
- What happens when the user deletes the last entry in a category for the month? (That category simply drops out of, or shows zero in, the category breakdown.)
- How does the dashboard behave for a month that has a budget but zero entries, or entries but no budget set?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the user to create a spend entry consisting of a date, category, description, and amount.
- **FR-002**: System MUST allow the user to edit and delete any existing spend entry.
- **FR-003**: System MUST allow the user to view a list of all spend entries for a given month.
- **FR-004**: System MUST allow the user to set or update a single overall budget amount for any given month.
- **FR-005**: System MUST reject entries or budgets with a missing date, missing category, or a negative/non-numeric amount, and inform the user what is invalid.
- **FR-006**: System MUST attribute each spend entry to the calendar month of its own date for all totals and dashboard views.
- **FR-007**: Dashboard MUST display the selected month's overall budget amount.
- **FR-008**: Dashboard MUST display the selected month's total amount spent across all entries.
- **FR-009**: Dashboard MUST display spend broken down by category for the selected month.
- **FR-010**: Dashboard MUST visually indicate when total spend for the month exceeds the monthly budget.
- **FR-011**: System MUST allow the user to select which month is shown on the dashboard, defaulting to the current calendar month.
- **FR-012**: System MUST support free-text categories (the user may type any category name; there is no fixed predefined list).

### Key Entities

- **Spend Entry**: A single recorded expense — attributes: date, category (text), description (text), amount. Belongs to the calendar month derived from its date.
- **Monthly Budget**: The overall spending target the user sets for one calendar month — attributes: month, budget amount. At most one budget amount per month.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can record a new spend entry in under 30 seconds.
- **SC-002**: A user can set or update a month's budget in under 15 seconds.
- **SC-003**: The dashboard reflects a newly added, edited, or deleted entry's effect on total and category spend immediately (no manual refresh/recalculation step required by the user).
- **SC-004**: 100% of category totals shown on the dashboard sum exactly to the displayed monthly total spend.
- **SC-005**: A user can determine, within 5 seconds of opening the dashboard, whether they are over or under budget for the month.

## Assumptions

- Single-user application: no login, accounts, or multi-user data separation are in scope for this feature.
- The monthly budget is a single overall amount per month (not broken down per category); category-level budgets are out of scope for this feature.
- Spend entries represent expenses only; income tracking is out of scope for this feature.
- A single default currency is used throughout; multi-currency support is out of scope.
- Categories are free text entered by the user rather than a fixed, predefined list.
- "Basic functionality" (per point 4 of the input) is interpreted as standard create/edit/delete/view (CRUD) operations on entries and budgets, covered by FR-001–FR-004.
