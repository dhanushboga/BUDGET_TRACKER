(function (global) {
  function defaultMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  document.getElementById('month-select').value = defaultMonth();
  global.Budget.dashboardView.refresh();
  global.Budget.entriesView.loadEntries();
})(typeof window !== 'undefined' ? window : globalThis);
