import { renderOutputVisuals } from './visuals.js';
const show = value => value ?? '–';
const fmt = (value, unit, digits = 0) => value === null || value === undefined ? '–' : `${Number(value).toFixed(digits)} ${unit}`;
const num = (value, digits = 0) => value === null || value === undefined ? '–' : Number(value).toFixed(digits);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

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

function renderDeviceLimit(deviceLimit) {
  const panel = document.getElementById('deviceLimitPanel');
  if (!panel) return;

  const visible = Boolean(deviceLimit?.limited);
  panel.classList.toggle('hidden', !visible);
  if (!visible) return;

  panel.className = `device-limit ${deviceLimit.state === 'above' ? 'danger' : 'warn'}`;
  setText('deviceLimitTitle', deviceLimit.state === 'above' ? 'Geräteleistung nicht ausreichend' : 'Mindeststrom des Geräts erreicht');
  setText('deviceLimitDevice', deviceLimit.deviceName || 'Aktives Gerät');
  setText('deviceLimitBadge', deviceLimit.state === 'above' ? 'ÜBER LIMIT' : 'UNTER LIMIT');
  setText('deviceLimitRequested', fmt(deviceLimit.requestedA, 'A', 0));
  setText('deviceLimitOutput', fmt(deviceLimit.outputA, 'A', 0));
  setText('deviceLimitRange', `${Number(deviceLimit.minA).toFixed(0)}–${Number(deviceLimit.maxA).toFixed(0)} A`);
  setText('deviceLimitText', deviceLimit.action);
}

function renderManufacturerComparison(comparison, isCut, enabled = true) {
  const panel = document.getElementById('manufacturerComparePanel');
  if (!panel) return;

  panel.classList.toggle('hidden', !enabled);
  if (!enabled) return;

  if (!comparison?.available) {
    panel.classList.add('compare-missing');
    setText('manufacturerCompareMeta', comparison?.note || 'Kein passender Datensatz gefunden.');
    setText('manufacturerCompareBadge', 'Keine Daten');
    setText('manufacturerCompareNotes', 'Im aktuellen Datenstand liegt für diese Kombination kein passender Herstellerwert vor.');
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

function renderPlausibility(plausibility) {
  const panel = document.getElementById('plausibilityPanel');
  const list = document.getElementById('plausibilityList');
  if (!panel || !list || !plausibility) return;

  const stateLabel = plausibility.state === 'fail'
    ? 'Prüfung fehlgeschlagen'
    : plausibility.state === 'warn'
      ? 'Mit Hinweisen'
      : 'Strukturell plausibel';
  panel.className = `plausibility-panel ${plausibility.state}`;
  setText('plausibilityBadge', stateLabel);
  setText(
    'plausibilitySummary',
    plausibility.failed
      ? `${plausibility.failed} fehlerhafte Prüfstufe${plausibility.failed === 1 ? '' : 'n'} erkannt.`
      : plausibility.warnings
        ? `${plausibility.warnings} Hinweis${plausibility.warnings === 1 ? '' : 'e'}; Probenaht und Herstellerangaben bleiben erforderlich.`
        : 'Alle verfügbaren Rechenschritte liefern verwertbare Werte innerhalb der aktiven Grenzen.'
  );

  list.innerHTML = plausibility.checks.map(item => `
    <div class="plausibility-item ${item.state}">
      <span class="plausibility-state" aria-hidden="true"></span>
      <div><strong>${item.label}</strong><p>${item.text}</p></div>
    </div>`).join('');
}


function renderCalculationTrace(trace) {
  const panel = document.getElementById('calculationTracePanel');
  const list = document.getElementById('calculationTraceList');
  if (!panel || !list) return;

  const steps = trace?.steps || [];
  panel.classList.toggle('hidden', !steps.length);
  if (!steps.length) {
    list.innerHTML = '';
    return;
  }

  list.innerHTML = steps.map((item, index) => `
    <div class="calculation-trace-item ${escapeHtml(item.state || 'info')}">
      <span class="calculation-trace-number">${index + 1}</span>
      <div>
        <div class="calculation-trace-heading"><strong>${escapeHtml(item.label)}</strong><span>${escapeHtml(item.value)}</span></div>
        <p>${escapeHtml(item.detail)}</p>
      </div>
    </div>`).join('');
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
  setHidden('electrodeResultBox', result.processId !== 'mma');
  setText('electrodeResult', result.processId === 'mma' ? `${Number(result.electrodeDiameter).toFixed(1).replace('.', ',')} mm · ${result.electrodeRange || 'Bereich prüfen'}` : '–');
  setHidden('recommendedThicknessBox', result.processId !== 'mma');
  setText('recommendedThickness', result.processId === 'mma' ? result.recommendedMaterialThickness || 'Bereich prüfen' : '–');
  document.getElementById('practice').textContent = show(result.practice);
  setText('travelSpeed', result.travelSpeed === null || result.travelSpeed === undefined ? '–' : fmt(result.travelSpeed, 'mm/min', 0));
  setText('heatInput', result.heatInput === null || result.heatInput === undefined ? '–' : fmt(result.heatInput, 'kJ/mm', 2));
  setHidden('travelSpeedBox', isCut);
  setHidden('heatInputBox', isCut);
  document.getElementById('faseAlert').textContent = isCut ? 'Plasmaschnitt: Probeschnitt durchführen, Luftdruck prüfen und Schnittkante beurteilen.' : result.fase.text;
  document.getElementById('faseAlert').className = `notice ${result.fase.level || 'info'}`;

  renderDeviceLimit(result.deviceLimit);
  renderManufacturerComparison(result.manufacturerComparison, isCut, result.manufacturerComparisonEnabled);
  renderPlausibility(result.plausibility);
  renderCalculationTrace(result.calculationTrace);

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
