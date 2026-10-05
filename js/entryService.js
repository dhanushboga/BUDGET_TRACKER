(function (global) {
  const { storage } = global.Budget;
  const { validateEntryInput, monthOf } = global.Budget.validation;

  function generateId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return `e${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function listEntriesForMonth(month) {
    const data = storage.load();
    return data.entries.filter((entry) => monthOf(entry.date) === month);
  }

  function createEntry({ date, category, description, amount }) {
    const error = validateEntryInput({ date, category, amount });
    if (error) return { error };

    const data = storage.load();
    const entry = {
      id: generateId(),
      date,
      category: category.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      amount,
    };
    data.entries.push(entry);
    storage.save(data);
    return { entry };
  }

  function updateEntry(id, { date, category, description, amount }) {
    const error = validateEntryInput({ date, category, amount });
    if (error) return { error };

    const data = storage.load();
    const index = data.entries.findIndex((entry) => entry.id === id);
    if (index === -1) return { notFound: true };

    const updated = {
      id,
      date,
      category: category.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      amount,
    };
    data.entries[index] = updated;
    storage.save(data);
    return { entry: updated };
  }

  function deleteEntry(id) {
    const data = storage.load();
    const index = data.entries.findIndex((entry) => entry.id === id);
    if (index === -1) return { notFound: true };

    data.entries.splice(index, 1);
    storage.save(data);
    return { success: true };
  }

  global.Budget = global.Budget || {};
  global.Budget.entryService = { listEntriesForMonth, createEntry, updateEntry, deleteEntry };
})(typeof window !== 'undefined' ? window : globalThis);
