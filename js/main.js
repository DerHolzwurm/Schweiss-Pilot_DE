import { loadAppData } from './core/app.js';
import { initVersionDialog, renderVersion } from './core/version.js';
import { initNavigation } from './ui/navigation.js';
import { initTheme } from './ui/theme.js';
import { initWelding } from './features/welding.js';
import { renderLexiconVisuals } from './ui/visuals.js';

function renderLexicon(items) {
  const basics = items.map(item => `<section class="tile"><strong>${item.term}</strong><p>${item.text}</p></section>`).join('');
  document.getElementById('lexiconList').innerHTML = `${renderLexiconVisuals()}<section class="lexicon-visual-block"><h3>Grundlagen</h3><div class="lexicon-basics">${basics}</div></section>`;
}

async function init() {
  const app = await loadAppData();
  renderVersion(app.version);
  initVersionDialog();
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
