(function (global) {
  const STORAGE_KEY = 'budgetTracker.v1';
  const EMPTY_STATE = { entries: [], budgets: {} };

  function load() {
    const raw = global.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = { entries: [], budgets: {} };
      save(initial);
      return initial;
    }
    return JSON.parse(raw);
  }

  function save(data) {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  global.Budget = global.Budget || {};
  global.Budget.storage = { load, save, STORAGE_KEY, EMPTY_STATE };
})(typeof window !== 'undefined' ? window : globalThis);
