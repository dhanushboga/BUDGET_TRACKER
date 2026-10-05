(function (global) {
  const { storage } = global.Budget;
  const { validateBudgetInput } = global.Budget.validation;

  function getBudget(month) {
    const data = storage.load();
    const amount = data.budgets[month] || 0;
    return { month, amount };
  }

  function setBudget(month, { amount }) {
    const error = validateBudgetInput({ amount });
    if (error) return { error };

    const data = storage.load();
    data.budgets[month] = amount;
    storage.save(data);
    return { month, amount };
  }

  global.Budget = global.Budget || {};
  global.Budget.budgetService = { getBudget, setBudget };
})(typeof window !== 'undefined' ? window : globalThis);
