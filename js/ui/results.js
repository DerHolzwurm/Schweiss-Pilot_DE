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

function setCompareItem(prefix, item) {
  setText(`${prefix}Calculated`, item?.calculated || '–');
  setText(`${prefix}Range`, item?.range ? `Hersteller: ${item.range}` : 'Hersteller: –');
  setText(`${prefix}Status`, item?.text || 'nicht vergleichbar');
  const statusEl = document.getElementById(`${prefix}Status`);
  if (statusEl) statusEl.className = `compare-state ${item?.state || 'missing'}`;
}

function renderManufacturerComparison(comparison, isCut) {
  const panel = document.getElementById('manufacturerComparePanel');
  if (!panel) return;

  panel.classList.remove('hidden');

  if (!comparison?.available) {
    panel.classList.add('compare-missing');
    setText('manufacturerCompareMeta', comparison?.note || 'Kein passender Datensatz gefunden.');
    setText('manufacturerCompareBadge', 'Keine Daten');
    setText('manufacturerCompareNotes', 'C07/C07.5 enthält die Datenbasis. Weitere Herstellerwerte können später ergänzt werden.');
    setCompareItem('cmpAmp', null);
    setCompareItem('cmpVolt', null);
    setCompareItem('cmpFeed', null);
    setHidden('cmpVoltItem', isCut);
    setHidden('cmpFeedItem', isCut);
    return;
  }

  panel.classList.remove('compare-missing');
  const meta = `${comparison.manufacturer} · ${comparison.device} · ${comparison.matches} passender Datensatz${comparison.matches === 1 ? '' : 'e'}`;
  setText('manufacturerCompareMeta', meta);
  setText('manufacturerCompareBadge', comparison.amp?.text || 'Vergleich');
  setCompareItem('cmpAmp', comparison.amp);
  setCompareItem('cmpVolt', comparison.volt);
  setCompareItem('cmpFeed', comparison.feed);

  setHidden('cmpVoltItem', isCut || comparison.volt?.state === 'missing');
  setHidden('cmpFeedItem', isCut || comparison.feed?.state === 'missing');

  const extras = [];
  if (comparison.gas) extras.push(`Gas: ${comparison.gas}`);
  if (comparison.gasFlow) extras.push(`Gasdurchfluss: ${comparison.gasFlow}`);
  if (comparison.airPressure) extras.push(`Druckluft: ${comparison.airPressure}`);
  if (comparison.dutyCycle?.length) extras.push(`ED: ${comparison.dutyCycle.join(' · ')}`);
  if (comparison.sourceLabels?.length) extras.push(`Quelle: ${comparison.sourceLabels.join(', ')}`);
  if (comparison.comment) extras.push(comparison.comment);

  setText('manufacturerCompareNotes', extras.join(' | ') || 'Herstellerwert als Orientierungs- und Plausibilitätsvergleich.');
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
  setText('travelSpeed', result.travelSpeed === null || result.travelSpeed === undefined ? '–' : fmt(result.travelSpeed, 'mm/min', 0));
  setText('heatInput', result.heatInput === null || result.heatInput === undefined ? '–' : fmt(result.heatInput, 'kJ/mm', 2));
  setHidden('travelSpeedBox', isCut);
  setHidden('heatInputBox', isCut);
  document.getElementById('faseAlert').textContent = isCut ? 'Plasmaschnitt: Probeschnitt durchführen, Luftdruck prüfen und Schnittkante beurteilen.' : result.fase.text;
  document.getElementById('faseAlert').className = `notice ${result.fase.level || 'info'}`;

  renderManufacturerComparison(result.manufacturerComparison, isCut);

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
