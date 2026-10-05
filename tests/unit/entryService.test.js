const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadFreshBudget } = require('./testHelpers');

test('entryService validation (FR-005)', async (t) => {
  await t.test('rejects a negative amount', () => {
    const { entryService } = loadFreshBudget();
    const result = entryService.createEntry({
      date: '2026-09-15',
      category: 'Groceries',
      description: 'Weekly shop',
      amount: -10,
    });
    assert.ok(result.error);
  });

  await t.test('rejects a missing category', () => {
    const { entryService } = loadFreshBudget();
    const result = entryService.createEntry({
      date: '2026-09-15',
      category: '',
      description: '',
      amount: 10,
    });
    assert.ok(result.error);
  });

  await t.test('rejects an invalid date', () => {
    const { entryService } = loadFreshBudget();
    const result = entryService.createEntry({
      date: 'not-a-date',
      category: 'Groceries',
      description: '',
      amount: 10,
    });
    assert.ok(result.error);
  });

  await t.test('accepts a valid entry and derives its month from the date (FR-006)', () => {
    const { entryService } = loadFreshBudget();
    const result = entryService.createEntry({
      date: '2026-09-15',
      category: 'Groceries',
      description: 'Weekly shop',
      amount: 54.3,
    });
    assert.equal(result.error, undefined);
    assert.ok(result.entry.id);

    const entries = entryService.listEntriesForMonth('2026-09');
    assert.equal(entries.length, 1);
    assert.equal(entries[0].amount, 54.3);
  });
});

test('entryService CRUD', async (t) => {
  await t.test('update replaces an existing entry', () => {
    const { entryService } = loadFreshBudget();
    const created = entryService.createEntry({
      date: '2026-09-01',
      category: 'Transport',
      description: 'Bus pass',
      amount: 20,
    }).entry;

    const updated = entryService.updateEntry(created.id, {
      date: '2026-09-01',
      category: 'Transport',
      description: 'Monthly bus pass',
      amount: 25,
    });

    assert.equal(updated.entry.amount, 25);
    assert.equal(updated.entry.description, 'Monthly bus pass');
  });

  await t.test('delete removes the entry', () => {
    const { entryService } = loadFreshBudget();
    const created = entryService.createEntry({
      date: '2026-09-01',
      category: 'Transport',
      description: '',
      amount: 20,
    }).entry;

    entryService.deleteEntry(created.id);
    assert.equal(entryService.listEntriesForMonth('2026-09').length, 0);
  });

  await t.test('update/delete of an unknown id returns notFound', () => {
    const { entryService } = loadFreshBudget();
    assert.equal(
      entryService.updateEntry('missing', { date: '2026-09-01', category: 'X', amount: 1 }).notFound,
      true
    );
    assert.equal(entryService.deleteEntry('missing').notFound, true);
  });
});
