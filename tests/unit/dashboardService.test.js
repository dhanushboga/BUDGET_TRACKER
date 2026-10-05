const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFreshBudget } = require('./testHelpers');

test('dashboardService aggregation (SC-004, FR-007-010)', async (t) => {
  await t.test('category totals always sum exactly to totalSpend', () => {
    const { entryService, budgetService, dashboardService } = loadFreshBudget();
    entryService.createEntry({ date: '2026-09-01', category: 'Groceries', amount: 10.1 });
    entryService.createEntry({ date: '2026-09-05', category: 'Groceries', amount: 20.2 });
    entryService.createEntry({ date: '2026-09-10', category: 'Transport', amount: 5.05 });
    budgetService.setBudget('2026-09', { amount: 100 });

    const dashboard = dashboardService.getDashboard('2026-09');
    const sumOfCategories = dashboard.categoryBreakdown.reduce((acc, c) => acc + c.total, 0);

    assert.equal(Math.round(sumOfCategories * 100) / 100, dashboard.totalSpend);
    assert.equal(dashboard.overBudget, false);
  });

  await t.test('flags overBudget when total spend exceeds the monthly budget (FR-010)', () => {
    const { entryService, budgetService, dashboardService } = loadFreshBudget();
    entryService.createEntry({ date: '2026-10-01', category: 'Rent', amount: 1200 });
    budgetService.setBudget('2026-10', { amount: 1000 });

    const dashboard = dashboardService.getDashboard('2026-10');
    assert.equal(dashboard.overBudget, true);
  });

  await t.test('a month with no entries returns empty breakdown and zero totalSpend, not an error', () => {
    const { dashboardService } = loadFreshBudget();
    const dashboard = dashboardService.getDashboard('2026-11');
    assert.deepEqual(dashboard.categoryBreakdown, []);
    assert.equal(dashboard.totalSpend, 0);
    assert.equal(dashboard.budget, 0);
  });
});
