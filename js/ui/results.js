import { renderOutputVisuals } from './visuals.js';
const show = value => value ?? '–';
const fmt = (value, unit, digits = 0) => value === null || value === undefined ? '–' : `${Number(value).toFixed(digits)} ${unit}`;
const num = (value, digits = 0) => value === null || value === undefined ? '–' : Number(value).toFixed(digits);

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHidden(id, hidden) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', hidden);
}

export function renderResult(result, reference = result) {
  const isCut = result.processType === 'cut';
  document.getElementById('resultCard').classList.remove('hidden');

  setText('ampLabel', isCut ? 'Schneidstrom A' : 'A');
  setText('voltLabel', 'V');
  setText('feedLabel', isCut ? 'Schnittführung' : 'Vorschub m/min');
  setText('refAmpLabel', isCut ? 'Referenz Schneidstrom' : 'Referenz Strom');
  setText('refVoltLabel', 'Referenz Spannung');
  setText('refFeedLabel', isCut ? 'Referenz Schnittführung' : 'Referenz Vorschub');

  setHidden('voltStartBox', isCut);
  setHidden('refVoltBox', isCut);
  setHidden('feedbackPanel', isCut);

  document.getElementById('amp').textContent = num(result.amps, 0);
  document.getElementById('volt').textContent = result.volt === null ? '–' : num(result.volt, 1);
  document.getElementById('feed').textContent = isCut ? 'Probe' : result.wfs === null ? '–' : num(result.wfs, 1);
  document.getElementById('refAmp').textContent = fmt(reference.amps, 'A', 0);
  document.getElementById('refVolt').textContent = reference.volt === null ? '–' : fmt(reference.volt, 'V', 1);
  document.getElementById('refFeed').textContent = isCut ? 'geräteabhängig' : reference.wfs === null ? '–' : fmt(reference.wfs, 'm/min', 1);
  document.getElementById('polarity').textContent = show(result.polarity);
  document.getElementById('gas').textContent = show(result.gas);
  document.getElementById('practice').textContent = show(result.practice);
  document.getElementById('faseAlert').textContent = isCut ? 'Plasmaschnitt: Probeschnitt durchführen, Luftdruck prüfen und Schnittkante beurteilen.' : result.fase.text;
  document.getElementById('faseAlert').className = `notice ${result.fase.level || 'info'}`;

  if (isCut) {
    document.getElementById('outputVisuals').innerHTML = '<section class="visual-guideline"><strong>Plasma-Workflow aktiv</strong><p>Nahtart, Position, Materialform, Draht und Nahtkorrektur sind ausgeblendet. Relevant bleiben Material, Materialstärke und Schneidstrom.</p></section>';
  } else {
    renderOutputVisuals({
      position: result.positionId,
      positionLabel: result.positionLabel,
      joint: result.jointId,
      jointLabel: result.jointLabel,
      shape: result.shapeId,
      shapeLabel: result.shapeLabel,
      fase: result.fase
    });
  }
  document.getElementById('why').textContent = result.why;
}
