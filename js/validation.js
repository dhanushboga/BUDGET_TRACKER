(function (global) {
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  function isValidDate(value) {
    if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
    const date = new Date(value + 'T00:00:00Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function isNonEmptyCategory(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function isPositiveAmount(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  }

  function monthOf(date) {
    return date.slice(0, 7);
  }

  function validateEntryInput({ date, category, amount }) {
    if (!isValidDate(date)) return 'date must be a valid date in YYYY-MM-DD format';
    if (!isNonEmptyCategory(category)) return 'category is required';
    if (!isPositiveAmount(amount)) return 'amount must be a positive number';
    return null;
  }

  function validateBudgetInput({ amount }) {
    if (!isPositiveAmount(amount)) return 'amount must be a positive number';
    return null;
  }

  global.Budget = global.Budget || {};
  global.Budget.validation = {
    isValidDate,
    isNonEmptyCategory,
    isPositiveAmount,
    monthOf,
    validateEntryInput,
    validateBudgetInput,
  };
})(typeof window !== 'undefined' ? window : globalThis);
