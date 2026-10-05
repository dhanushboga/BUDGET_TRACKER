function createLocalStorageStub() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

function loadFreshBudget() {
  global.localStorage = createLocalStorageStub();
  global.window = global;
  global.crypto = global.crypto || require('crypto').webcrypto;
  delete global.Budget;

  for (const path of [
    '../../js/storage.js',
    '../../js/validation.js',
    '../../js/entryService.js',
    '../../js/budgetService.js',
    '../../js/dashboardService.js',
  ]) {
    delete require.cache[require.resolve(path)];
    require(path);
  }

  return global.Budget;
}

module.exports = { loadFreshBudget };
