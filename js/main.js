import { loadAppData } from './core/app.js';
import { renderVersion } from './core/version.js';
import { initNavigation } from './ui/navigation.js';
import { initTheme } from './ui/theme.js';
import { initWelding } from './features/welding.js';

function renderLexicon(items) {
  document.getElementById('lexiconList').innerHTML = items.map(item => `<section class="tile"><strong>${item.term}</strong><p>${item.text}</p></section>`).join('');
}

async function init() {
  const app = await loadAppData();
  renderVersion(app.version);
  initNavigation();
  initTheme();
  initWelding(app.welding, app.corrections);
  renderLexicon(app.lexicon);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch(error => {
    console.error(error);
    document.body.insertAdjacentHTML('afterbegin', `<div class="wrap"><div class="card">Startfehler: ${error.message}</div></div>`);
  });
});
