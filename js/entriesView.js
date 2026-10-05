(function (global) {
  const { entryService } = global.Budget;

  function $(selector) {
    return document.querySelector(selector);
  }

  function currentMonth() {
    return $('#month-select').value;
  }

  function formatAmount(amount) {
    return Number(amount).toFixed(2);
  }

  const form = $('#entry-form');
  const idField = $('#entry-id');
  const dateField = $('#entry-date');
  const categoryField = $('#entry-category');
  const descriptionField = $('#entry-description');
  const amountField = $('#entry-amount');
  const submitBtn = $('#entry-submit');
  const cancelBtn = $('#entry-cancel-edit');
  const formTitle = $('#entry-form-title');
  const formError = $('#entry-form-error');
  const list = $('#entry-list');
  const empty = $('#entry-empty');

  function resetForm() {
    form.reset();
    idField.value = '';
    formTitle.textContent = 'Add Spend Entry';
    submitBtn.textContent = 'Add Entry';
    cancelBtn.hidden = true;
    formError.textContent = '';
    form.querySelectorAll('input').forEach((input) => input.classList.remove('invalid'));
  }

  function renderEntries(entries) {
    list.innerHTML = '';
    empty.hidden = entries.length !== 0;

    entries.forEach((entry) => {
      const row = document.createElement('tr');
      row.dataset.id = entry.id;

      const dateCell = document.createElement('td');
      dateCell.textContent = entry.date;
      const categoryCell = document.createElement('td');
      categoryCell.textContent = entry.category;
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = entry.description || '';
      const amountCell = document.createElement('td');
      amountCell.textContent = formatAmount(entry.amount);

      const actionsCell = document.createElement('td');
      actionsCell.className = 'actions';
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => startEdit(entry));
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => removeEntry(entry.id));
      actionsCell.append(editBtn, deleteBtn);

      row.append(dateCell, categoryCell, descriptionCell, amountCell, actionsCell);
      list.appendChild(row);
    });
  }

  function loadEntries() {
    const month = currentMonth();
    if (!month) return;
    renderEntries(entryService.listEntriesForMonth(month));
  }

  function startEdit(entry) {
    idField.value = entry.id;
    dateField.value = entry.date;
    categoryField.value = entry.category;
    descriptionField.value = entry.description || '';
    amountField.value = entry.amount;
    formTitle.textContent = 'Edit Spend Entry';
    submitBtn.textContent = 'Save Changes';
    cancelBtn.hidden = false;
    formError.textContent = '';
  }

  function removeEntry(id) {
    entryService.deleteEntry(id);
    loadEntries();
    if (global.Budget.dashboardView) global.Budget.dashboardView.refresh();
  }

  function buildPayload() {
    return {
      date: dateField.value,
      category: categoryField.value,
      description: descriptionField.value,
      amount: parseFloat(amountField.value),
    };
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formError.textContent = '';
    form.querySelectorAll('input').forEach((input) => input.classList.remove('invalid'));

    const id = idField.value;
    const payload = buildPayload();
    const result = id
      ? entryService.updateEntry(id, payload)
      : entryService.createEntry(payload);

    if (result.error) {
      formError.textContent = result.error;
      return;
    }

    resetForm();
    loadEntries();
    if (global.Budget.dashboardView) global.Budget.dashboardView.refresh();
  });

  cancelBtn.addEventListener('click', resetForm);
  $('#month-select').addEventListener('change', loadEntries);

  global.Budget = global.Budget || {};
  global.Budget.entriesView = { loadEntries };
})(typeof window !== 'undefined' ? window : globalThis);
