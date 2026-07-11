import { calculateWelding, findFeedback } from '../core/calculations.js';
import { renderResult } from '../ui/results.js';
import { initFeedbackSlider } from '../ui/slider.js';
import { storage } from '../core/storage.js';
import { listManufacturersWithData } from '../core/manufacturers.js';

let state = { data: null, corrections: null, lastInput: null, feedbackTrim: 0 };

function fillSelect(id, items, selected) {
  const el = document.getElementById(id);
  el.innerHTML = items.map(item => {
    const value = item.id ?? item;
    const label = item.label ?? `${item} mm`;
    return `<option value="${value}">${label}</option>`;
  }).join('');
  if (selected !== undefined) el.value = selected;
}

function setHidden(id, hidden) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', hidden);
}

function readInput() {
  return {
    process: document.getElementById('process').value,
    material: document.getElementById('material').value,
    thickness: Number(document.getElementById('thickness').value || 0),
    wire: Number(document.getElementById('wire').value || 0.9),
    electrode: Number(document.getElementById('electrode').value || 2.5),
    joint: document.getElementById('joint').value,
    position: document.getElementById('position').value,
    shape: document.getElementById('shape').value,
    trim: Number(document.getElementById('trim').value || 0),
    manufacturerComparison: document.getElementById('manufacturerCompareToggle')?.checked !== false,
    manufacturerId: document.getElementById('manufacturerSelect')?.value || 'all'
  };
}

function updateManufacturerControls() {
  const toggle = document.getElementById('manufacturerCompareToggle');
  const select = document.getElementById('manufacturerSelect');
  const controls = toggle?.closest('.manufacturer-controls');
  const enabled = toggle?.checked !== false;

  if (select) select.disabled = !enabled;
  controls?.classList.toggle('is-disabled', !enabled);
  storage.set('schweisspilot.manufacturerComparison', enabled);
  if (select) storage.set('schweisspilot.manufacturerId', select.value || 'all');
}

function renderCalculation() {
  const input = readInput();
  state.lastInput = input;
  const reference = calculateWelding(input, state.data, 0);
  const result = calculateWelding(input, state.data, state.feedbackTrim);
  renderResult(result, reference);
}

function updateProcessVisibility() {
  const process = document.getElementById('process').value;
  const processData = state.data.processes.find(item => item.id === process);
  const isWire = processData.type === 'wire';
  const isCut = processData.type === 'cut';
  const isMma = process === 'mma';

  setHidden('wireBox', !isWire);
  setHidden('electrodeBox', !isMma);
  setHidden('thicknessBox', isMma);
  setHidden('jointBox', isCut);
  setHidden('positionBox', isCut);
  setHidden('shapeBox', isCut);
  setHidden('trimBox', isCut);

  if (isCut) {
    document.getElementById('joint').value = 'stumpf';
    document.getElementById('position').value = 'pa';
    document.getElementById('shape').value = 'blech';
    document.getElementById('trim').value = 0;
    state.feedbackTrim = 0;
  }

  if (process === 'mig' || process === 'wig_ac') document.getElementById('material').value = 'alu';
  if ((process === 'mag' || process === 'wig_dc' || process === 'fcaw_s' || process === 'plasma') && document.getElementById('material').value === 'alu') document.getElementById('material').value = 'stahl';
}

export function initWelding(data, corrections) {
  state = { data, corrections, lastInput: null, feedbackTrim: 0 };
  fillSelect('process', data.processes, 'fcaw_s');
  fillSelect('material', data.materials, 'stahl');
  fillSelect('wire', data.wires, 0.9);
  fillSelect('electrode', data.electrodes.map(item => ({ id: item.diameterMm, label: item.label })), 2.5);
  fillSelect('joint', data.joints, 'kehl');
  fillSelect('position', data.positions, 'pa');
  fillSelect('shape', data.shapes, 'vierkant');

  const manufacturers = [
    { id: 'all', label: 'Alle verfügbaren Hersteller' },
    ...listManufacturersWithData(data)
  ];
  fillSelect('manufacturerSelect', manufacturers, storage.get('schweisspilot.manufacturerId', 'all'));
  if (!manufacturers.some(item => String(item.id) === document.getElementById('manufacturerSelect').value)) {
    document.getElementById('manufacturerSelect').value = 'all';
  }
  document.getElementById('manufacturerCompareToggle').checked = storage.get('schweisspilot.manufacturerComparison', true);
  updateManufacturerControls();
  updateProcessVisibility();

  document.getElementById('calculateBtn').addEventListener('click', renderCalculation);
  document.getElementById('resetBtn').addEventListener('click', () => window.location.reload());
  ['process','material','thickness','wire','electrode','joint','position','shape','trim'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      updateProcessVisibility();
      if (!document.getElementById('resultCard').classList.contains('hidden')) renderCalculation();
    });
  });

  document.getElementById('manufacturerCompareToggle').addEventListener('change', () => {
    updateManufacturerControls();
    if (!document.getElementById('resultCard').classList.contains('hidden')) renderCalculation();
  });
  document.getElementById('manufacturerSelect').addEventListener('change', () => {
    updateManufacturerControls();
    if (!document.getElementById('resultCard').classList.contains('hidden')) renderCalculation();
  });

  initFeedbackSlider((value) => {
    const process = document.getElementById('process').value;
    const processData = state.data.processes.find(item => item.id === process);
    if (processData.type === 'cut') return { trim: 0, label: 'Plasma', text: 'Beim Plasmaschneiden wird die Naht-Rückmeldung ausgeblendet.' };
    const item = findFeedback(state.corrections, value);
    state.feedbackTrim = item.trim;
    if (!document.getElementById('resultCard').classList.contains('hidden')) renderCalculation();
    return item;
  });
}
