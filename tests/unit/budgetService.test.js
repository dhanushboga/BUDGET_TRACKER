const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFreshBudget } = require('./testHelpers');

test('budgetService', async (t) => {
  await t.test('unset month returns amount 0, not an error', () => {
    const { budgetService } = loadFreshBudget();
    const result = budgetService.getBudget('2026-12');
    assert.deepEqual(result, { month: '2026-12', amount: 0 });
  });

  await t.test('set then get returns the saved amount', () => {
    const { budgetService } = loadFreshBudget();
    budgetService.setBudget('2026-09', { amount: 1500 });
    assert.equal(budgetService.getBudget('2026-09').amount, 1500);
  });

  await t.test('changing the amount replaces the previous value', () => {
    const { budgetService } = loadFreshBudget();
    budgetService.setBudget('2026-09', { amount: 1000 });
    budgetService.setBudget('2026-09', { amount: 1200 });
    assert.equal(budgetService.getBudget('2026-09').amount, 1200);
  });

  await t.test('rejects a negative or non-numeric amount (FR-005)', () => {
    const { budgetService } = loadFreshBudget();
    assert.ok(budgetService.setBudget('2026-09', { amount: -5 }).error);
    assert.ok(budgetService.setBudget('2026-09', { amount: 'abc' }).error);
  });
});
