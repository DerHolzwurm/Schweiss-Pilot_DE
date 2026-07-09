import { renderOutputVisuals } from './visuals.js';
const show = value => value ?? '–';
const fmt = (value, unit, digits = 0) => value === null || value === undefined ? '–' : `${Number(value).toFixed(digits)} ${unit}`;

export function renderResult(result) {
  document.getElementById('resultCard').classList.remove('hidden');
  document.getElementById('heroMain').textContent = result.heroMain;
  document.getElementById('heroSub').textContent = result.heroSub;
  document.getElementById('amp').textContent = fmt(result.amps, 'A', 0);
  document.getElementById('volt').textContent = result.volt === null ? 'geregelt / geräteabhängig' : fmt(result.volt, 'V', 1);
  document.getElementById('feed').textContent = result.wfs === null ? '–' : fmt(result.wfs, 'm/min', 1);
  document.getElementById('polarity').textContent = show(result.polarity);
  document.getElementById('gas').textContent = show(result.gas);
  document.getElementById('practice').textContent = show(result.practice);
  document.getElementById('faseAlert').textContent = result.fase.text;
  document.getElementById('faseAlert').className = `notice ${result.fase.level || 'info'}`;
  renderOutputVisuals({ position: result.positionId, positionLabel: result.positionLabel, fase: result.fase });
  document.getElementById('why').textContent = result.why;
}
