(function (global) {
  const { storage } = global.Budget;
  const { monthOf } = global.Budget.validation;

  function round2(value) {
    return Math.round(value * 100) / 100;
  }

  function getDashboard(month) {
    const data = storage.load();
    const budget = data.budgets[month] || 0;

    const entriesForMonth = data.entries.filter((entry) => monthOf(entry.date) === month);

    const totalsByCategory = new Map();
    let totalSpend = 0;

    entriesForMonth.forEach((entry) => {
      totalSpend += entry.amount;
      totalsByCategory.set(
        entry.category,
        (totalsByCategory.get(entry.category) || 0) + entry.amount
      );
    });

    const categoryBreakdown = Array.from(totalsByCategory.entries()).map(([category, total]) => ({
      category,
      total: round2(total),
    }));

    return {
      month,
      budget,
      totalSpend: round2(totalSpend),
      categoryBreakdown,
      overBudget: totalSpend > budget,
    };
  }

  global.Budget = global.Budget || {};
  global.Budget.dashboardService = { getDashboard };
})(typeof window !== 'undefined' ? window : globalThis);
