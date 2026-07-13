const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function itemMatches(item, category, query) {
  const categoryMatch = category === 'all'
    || item.category === category
    || item.processes?.includes(category);
  if (!categoryMatch) return false;

  const needle = query.trim().toLocaleLowerCase('de');
  if (!needle) return true;
  const haystack = [
    item.symptom,
    ...(item.causes || []),
    ...(item.actions || [])
  ].join(' ').toLocaleLowerCase('de');
  return haystack.includes(needle);
}

function renderItem(item, defaultSourceLabel = '') {
  const causes = (item.causes || []).map(value => `<li>${escapeHtml(value)}</li>`).join('');
  const actions = (item.actions || []).map(value => `<li>${escapeHtml(value)}</li>`).join('');
  const processLabels = (item.processes || []).map(process => {
    const labels = {
      mma: 'MMA',
      migmag: 'MIG/MAG',
      mag: 'MAG',
      mig: 'MIG',
      fcaw_s: 'FLUX',
      wig: 'WIG DC',
      plasma: 'Plasma'
    };
    return `<span>${escapeHtml(labels[process] || process)}</span>`;
  }).join('');

  const sourceLabel = item.sourceLabel || defaultSourceLabel || 'Quelle nicht angegeben';
  const sourcePages = item.sourcePages && item.sourcePages !== '–' ? `, Seite ${escapeHtml(item.sourcePages)}` : '';
  const sourceClass = item.sourceType === 'general-practice' ? ' general-practice' : '';

  return `
    <article class="diagnostic-item ${escapeHtml(item.priority || 'info')}">
      <header class="diagnostic-item-header">
        <div>
          <div class="diagnostic-tags">${processLabels}</div>
          <h3>${escapeHtml(item.symptom)}</h3>
        </div>
        <span class="diagnostic-priority">${item.priority === 'danger' ? 'Sicherheitsrelevant' : item.priority === 'warning' ? 'Prüfen' : 'Hinweis'}</span>
      </header>
      <div class="diagnostic-columns">
        <section>
          <h4>Wahrscheinliche Ursachen</h4>
          <ul>${causes}</ul>
        </section>
        <section>
          <h4>Prüfschritte und Maßnahmen</h4>
          <ol>${actions}</ol>
        </section>
      </div>
      <footer class="diagnostic-item-source${sourceClass}">Quelle: ${escapeHtml(sourceLabel)}${sourcePages}</footer>
    </article>`;
}

export function initDiagnostics(data) {
  const category = document.getElementById('diagnosticCategory');
  const search = document.getElementById('diagnosticSearch');
  const list = document.getElementById('diagnosticList');
  const count = document.getElementById('diagnosticCount');
  const source = document.getElementById('diagnosticSource');
  if (!category || !search || !list || !data) return;

  category.innerHTML = (data.categories || [])
    .map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`)
    .join('');

  if (source) {
    source.innerHTML = `<strong>${escapeHtml(data.meta?.device || '')}</strong><br>${escapeHtml(data.meta?.sourceLabel || '')}<br><span>${escapeHtml(data.meta?.note || '')}</span>`;
  }

  const render = () => {
    const matches = (data.items || []).filter(item => itemMatches(item, category.value, search.value));
    list.innerHTML = matches.length
      ? matches.map(item => renderItem(item, data.meta?.sourceLabel)).join('')
      : '<div class="notice warn">Keine passende Fehlerbeschreibung gefunden. Suchbegriff ändern oder „Alle Verfahren“ auswählen.</div>';
    if (count) count.textContent = `${matches.length} Eintrag${matches.length === 1 ? '' : 'e'}`;
  };

  category.addEventListener('change', render);
  search.addEventListener('input', render);
  document.querySelectorAll('[data-diagnostic-process]').forEach(button => {
    button.addEventListener('click', () => {
      category.value = button.dataset.diagnosticProcess || 'all';
      render();
    });
  });
  render();
}
