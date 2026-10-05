(function (global) {
  const { budgetService, dashboardService } = global.Budget;

  function $(selector) {
    return document.querySelector(selector);
  }

  function currentMonth() {
    return $('#month-select').value;
  }

  function formatAmount(amount) {
    return Number(amount).toFixed(2);
  }

  const monthSelect = $('#month-select');
  const budgetForm = $('#budget-form');
  const budgetAmount = $('#budget-amount');
  const budgetFormError = $('#budget-form-error');

  const dashboardBudget = $('#dashboard-budget');
  const dashboardTotal = $('#dashboard-total');
  const dashboardFlag = $('#dashboard-flag');
  const categoryBreakdown = $('#category-breakdown');
  const dashboardEmpty = $('#dashboard-empty');

  function loadBudget() {
    const month = currentMonth();
    if (!month) return;
    const data = budgetService.getBudget(month);
    budgetAmount.value = data.amount > 0 ? data.amount : '';
  }

  function loadDashboard() {
    const month = currentMonth();
    if (!month) return;
    const data = dashboardService.getDashboard(month);

    dashboardBudget.textContent = formatAmount(data.budget);
    dashboardTotal.textContent = formatAmount(data.totalSpend);
    dashboardFlag.hidden = !data.overBudget;

    categoryBreakdown.innerHTML = '';
    dashboardEmpty.hidden = data.categoryBreakdown.length !== 0;

    data.categoryBreakdown.forEach((row) => {
      const item = document.createElement('li');
      const categorySpan = document.createElement('span');
      categorySpan.textContent = row.category;
      const totalSpan = document.createElement('span');
      totalSpan.textContent = formatAmount(row.total);
      item.append(categorySpan, totalSpan);
      categoryBreakdown.appendChild(item);
    });
  }

  function refresh() {
    loadBudget();
    loadDashboard();
  }

  budgetForm.addEventListener('submit', function (event) {
    event.preventDefault();
    budgetFormError.textContent = '';
    const month = currentMonth();
    const amount = parseFloat(budgetAmount.value);

    const result = budgetService.setBudget(month, { amount });
    if (result.error) {
      budgetFormError.textContent = result.error;
      return;
    }
    refresh();
  });

  monthSelect.addEventListener('change', refresh);

  global.Budget = global.Budget || {};
  global.Budget.dashboardView = { refresh };
})(typeof window !== 'undefined' ? window : globalThis);
