// Local flower index filtering. No query leaves the browser and the original 15 links stay intact.
(() => {
  'use strict';
  const grid = document.querySelector('.study-grid');
  const search = document.getElementById('study-search');
  const family = document.getElementById('study-family');
  const reset = document.getElementById('study-filter-reset');
  const status = document.getElementById('study-filter-status');
  const empty = document.getElementById('study-filter-empty');
  if (!grid || !search || !family || !reset || !status || !empty) return;

  const items = [...grid.querySelectorAll(':scope > li')];
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim().replace(/\s+/g, ' ');

  function applyFilters() {
    const query = normalize(search.value);
    const selectedFamily = family.value;
    let visible = 0;
    items.forEach((item) => {
      const common = normalize(item.dataset.commonName);
      const scientific = normalize(item.dataset.latinName);
      const matchesName = !query || common.includes(query) || scientific.includes(query);
      const matchesFamily = !selectedFamily || item.dataset.family === selectedFamily;
      const show = matchesName && matchesFamily;
      item.hidden = !show;
      if (show) visible += 1;
    });
    const active = Boolean(query || selectedFamily);
    reset.disabled = !active;
    status.hidden = !active;
    status.textContent = active ? `${visible} of ${items.length} studies shown.` : '';
    empty.hidden = visible !== 0;
  }

  search.addEventListener('input', applyFilters);
  family.addEventListener('change', applyFilters);
  reset.addEventListener('click', () => {
    search.value = '';
    family.value = '';
    applyFilters();
    search.focus();
  });
  applyFilters();
})();
