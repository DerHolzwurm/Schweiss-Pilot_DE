import { renderOutputVisuals } from './visuals.js';
const show = value => value ?? '–';
const fmt = (value, unit, digits = 0) => value === null || value === undefined ? '–' : `${Number(value).toFixed(digits)} ${unit}`;
const num = (value, digits = 0) => value === null || value === undefined ? '–' : Number(value).toFixed(digits);

export function renderResult(result, reference = result) {
  document.getElementById('resultCard').classList.remove('hidden');
  document.getElementById('amp').textContent = num(result.amps, 0);
  document.getElementById('volt').textContent = result.volt === null ? '–' : num(result.volt, 1);
  document.getElementById('feed').textContent = result.wfs === null ? '–' : num(result.wfs, 1);
  document.getElementById('refAmp').textContent = fmt(reference.amps, 'A', 0);
  document.getElementById('refVolt').textContent = reference.volt === null ? '–' : fmt(reference.volt, 'V', 1);
  document.getElementById('refFeed').textContent = reference.wfs === null ? '–' : fmt(reference.wfs, 'm/min', 1);
  document.getElementById('polarity').textContent = show(result.polarity);
  document.getElementById('gas').textContent = show(result.gas);
  document.getElementById('practice').textContent = show(result.practice);
  document.getElementById('faseAlert').textContent = result.fase.text;
  document.getElementById('faseAlert').className = `notice ${result.fase.level || 'info'}`;
  renderOutputVisuals({
    position: result.positionId,
    positionLabel: result.positionLabel,
    joint: result.jointId,
    jointLabel: result.jointLabel,
    shape: result.shapeId,
    shapeLabel: result.shapeLabel,
    fase: result.fase
  });
  document.getElementById('why').textContent = result.why;
}
