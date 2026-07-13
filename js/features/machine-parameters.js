import { storage } from '../core/storage.js';
import { createDeviceCatalog } from '../core/device-manager.js';

const SELECTION_KEY = 'schweisspilot.machineParameters.selection';

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function formatRange(min, max, unit) {
  if (min == null && max == null) return '–';
  if (min === max || max == null) return `${String(min).replace('.', ',')} ${unit}`;
  return `${String(min).replace('.', ',')}–${String(max).replace('.', ',')} ${unit}`;
}


function calculatorProcessId(processId) {
  const supported = new Set(['plasma', 'fcaw_s', 'mag', 'mig', 'mma', 'wig_dc']);
  return supported.has(processId) ? processId : null;
}

function openInCalculator(processId) {
  const targetProcess = calculatorProcessId(processId);
  const calculatorSelect = document.getElementById('process');
  const calculatorTab = document.querySelector('.tab[data-target="calculator"]');
  if (!targetProcess || !calculatorSelect || !calculatorTab) return false;

  const available = Array.from(calculatorSelect.options).some(option => option.value === targetProcess);
  if (!available) return false;

  calculatorSelect.value = targetProcess;
  calculatorSelect.dispatchEvent(new Event('input', { bubbles: true }));
  calculatorTab.click();
  calculatorSelect.focus({ preventScroll: true });
  document.getElementById('processBox')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return true;
}

function processRangeId(processId) {
  if (processId === 'mig') return 'mig';
  return processId;
}

function rangesFor(manufacturerDatabase, deviceId, processId) {
  const target = processRangeId(processId);
  return (manufacturerDatabase.parameterSets || []).filter(item =>
    item.deviceProfileId === deviceId && item.process === target
  ).sort((a, b) => (a.thicknessMinMm || 0) - (b.thicknessMinMm || 0));
}

function deviceProfileFor(manufacturerDatabase, deviceId) {
  return (manufacturerDatabase.deviceProfiles || []).find(profile => profile.id === deviceId) || null;
}

function currentRangeFor(profile, processId) {
  if (!profile?.outputCurrent) return null;
  const key = processId === 'plasma' ? 'cutA'
    : processId === 'mma' ? 'mmaA'
      : processId === 'wig_dc' ? 'wigA'
        : ['mag', 'mig', 'fcaw_s'].includes(processId) ? 'migA'
          : null;
  const range = key ? profile.outputCurrent[key] : null;
  return Array.isArray(range) && range.length >= 2 ? range : null;
}

function inputCurrentFor(profile, processId, type) {
  const source = type === 'effective' ? profile?.effectiveInputCurrentA : profile?.maxInputCurrentA;
  if (!source) return null;
  const key = processId === 'plasma' ? 'cut'
    : processId === 'mma' ? 'mma'
      : processId === 'wig_dc' ? 'wig'
        : ['mag', 'mig', 'fcaw_s'].includes(processId) ? 'mig'
          : null;
  return key ? source[key] : null;
}

function dutyCycleFor(profile, processId) {
  const values = processId === 'plasma' ? profile?.dutyCycle40C?.cut : profile?.dutyCycle40C?.migMmaWig;
  return Array.isArray(values) ? values.join(' · ') : null;
}

function renderDeviceProfile(profile, processId) {
  const limits = document.getElementById('parameterDeviceLimits');
  const technical = document.getElementById('parameterTechnicalData');
  const limitations = document.getElementById('parameterLimitations');
  const limitationsPanel = document.getElementById('parameterLimitationsPanel');
  if (!limits || !technical || !limitations || !limitationsPanel) return;

  if (!profile) {
    renderDefinitionList(limits, [{ label: 'Status', value: 'Kein freigegebenes Geräteprofil vorhanden' }]);
    renderDefinitionList(technical, [{ label: 'Status', value: 'Keine technischen Gerätedaten vorhanden' }]);
    limitations.innerHTML = '';
    limitationsPanel.classList.add('hidden');
    return;
  }

  const currentRange = currentRangeFor(profile, processId);
  const maxInput = inputCurrentFor(profile, processId, 'max');
  const effectiveInput = inputCurrentFor(profile, processId, 'effective');
  const limitEntries = [
    { label: 'Ausgangsstrom', value: currentRange ? formatRange(currentRange[0], currentRange[1], 'A') : '–' },
    { label: 'Einschaltdauer bei 40 °C', value: dutyCycleFor(profile, processId) || '–' }
  ];
  if (processId === 'plasma') {
    const pressure = profile.plasmaAirPressureBar;
    limitEntries.push({ label: 'Arbeitsdruck', value: Array.isArray(pressure) ? formatRange(pressure[0], pressure[1], 'bar') : '–' });
  }
  renderDefinitionList(limits, limitEntries);

  renderDefinitionList(technical, [
    { label: 'Gerätekategorie', value: profile.category || '–' },
    { label: 'Netzversorgung', value: profile.supply || '–' },
    { label: 'Max. Eingangsstrom', value: maxInput == null ? '–' : `${String(maxInput).replace('.', ',')} A` },
    { label: 'Effektiver Eingangsstrom', value: effectiveInput == null ? '–' : `${String(effectiveInput).replace('.', ',')} A` },
    { label: 'Validierungsstatus', value: profile.validationStatus || '–' }
  ]);

  const items = Array.isArray(profile.limitations) ? profile.limitations : [];
  limitations.innerHTML = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  limitationsPanel.classList.toggle('hidden', items.length === 0);
}


function sourceFor(sourceDatabase, sourceId) {
  return (sourceDatabase?.sources || []).find(source => source.id === sourceId) || null;
}

function rowDataStatus(row) {
  const derived = /abgeleitet/i.test(row.comment || '');
  return {
    label: derived ? 'Aus Handbuch abgeleitet' : 'Handbuch-Richtwert',
    className: derived ? 'derived' : 'manual'
  };
}

function renderProvenance(rows, sourceDatabase) {
  const target = document.getElementById('parameterProvenance');
  if (!target) return;
  const sourceIds = [...new Set(rows.flatMap(row => row.sourceIds || []))];
  const sources = sourceIds.map(id => sourceFor(sourceDatabase, id)).filter(Boolean);
  const sourceLabels = sources.length ? sources.map(source => source.label).join(' · ') : 'Keine Quelle hinterlegt';
  const pages = [...new Set(sources.flatMap(source => source.pages || []))];
  const directCount = rows.filter(row => !/abgeleitet/i.test(row.comment || '')).length;
  const derivedCount = rows.length - directCount;
  renderDefinitionList(target, [
    { label: 'Quelle', value: sourceLabels },
    { label: 'Relevante Seiten', value: pages.length ? pages.join(', ') : '–' },
    { label: 'Direkte Handbuchwerte', value: String(directCount) },
    { label: 'Gekennzeichnete Ableitungen', value: String(derivedCount) },
    { label: 'Datenfreigabe', value: rows.length ? 'Herstellerdatenbank freigegeben' : 'Keine Tabellenwerte vorhanden' }
  ]);
}

function renderDefinitionList(target, entries) {
  target.innerHTML = entries.map(entry => `<div><dt>${escapeHtml(entry.label)}</dt><dd>${escapeHtml(entry.value)}</dd></div>`).join('');
}

function renderRanges(rows, sourceDatabase) {
  const body = document.getElementById('parameterRanges');
  const empty = document.getElementById('parameterNoRanges');
  const count = document.getElementById('parameterRangeCount');
  count.textContent = `${rows.length} ${rows.length === 1 ? 'Bereich' : 'Bereiche'}`;
  body.innerHTML = rows.map(row => {
    const gasFlow = Array.isArray(row.gasFlowLMin) ? formatRange(row.gasFlowLMin[0], row.gasFlowLMin[1], 'l/min') : '–';
    const technicalDetails = [
      row.tungstenElectrodeMm ? `Wolfram ${row.tungstenElectrodeMm} mm` : null,
      row.gasNozzleSize ? `Gasdüse ${row.gasNozzleSize}` : null,
      row.fillerRodMm ? `Zusatzstab ${row.fillerRodMm} mm` : null,
      row.electrodeType ? `Elektrode ${row.electrodeType}` : null,
      row.electrodeDiameterMm ? `Ø ${row.electrodeDiameterMm} mm` : null
    ].filter(Boolean).join(' · ') || '–';
    const status = rowDataStatus(row);
    return `<tr>
      <td>${escapeHtml(row.material || '–')}</td>
      <td>${escapeHtml(formatRange(row.thicknessMinMm, row.thicknessMaxMm, 'mm'))}</td>
      <td>${escapeHtml(row.wireDiameterLabel || (row.wireMm ? `${row.wireMm} mm` : '–'))}</td>
      <td>${escapeHtml(formatRange(row.currentMinA, row.currentMaxA, 'A'))}</td>
      <td>${escapeHtml(row.gas || '–')}</td>
      <td>${escapeHtml(gasFlow)}</td>
      <td>${escapeHtml(technicalDetails)}</td>
      <td><span class="parameter-data-status ${escapeHtml(status.className)}" title="${escapeHtml(row.comment || status.label)}">${escapeHtml(status.label)}</span></td>
    </tr>`;
  }).join('');
  body.closest('.parameter-table-wrap').classList.toggle('hidden', rows.length === 0);
  empty.classList.toggle('hidden', rows.length !== 0);
  renderProvenance(rows, sourceDatabase);
}


function renderProcessReference(entries) {
  const target = document.getElementById('parameterProcessReference');
  const panel = document.getElementById('parameterProcessReferencePanel');
  if (!target || !panel) return;
  const items = Array.isArray(entries) ? entries : [];
  renderDefinitionList(target, items);
  panel.classList.toggle('hidden', items.length === 0);
}

export function initMachineParameters(database, manufacturerDatabase, sourceDatabase) {
  const deviceSelect = document.getElementById('parameterDevice');
  const processSelect = document.getElementById('parameterProcess');
  const openCalculatorButton = document.getElementById('parameterOpenCalculator');
  const transferHint = document.getElementById('parameterTransferHint');
  const catalog = createDeviceCatalog(database);
  if (!deviceSelect || !processSelect || !catalog.devices.length) return;

  deviceSelect.innerHTML = catalog.devices.map(device => `<option value="${escapeHtml(device.id)}">${escapeHtml(device.manufacturer)} ${escapeHtml(device.model)}</option>`).join('');

  const savedSelection = storage.get(SELECTION_KEY, {});
  if (catalog.devices.some(device => device.id === savedSelection.deviceId)) {
    deviceSelect.value = savedSelection.deviceId;
  }

  function selectedDevice() {
    return catalog.findDevice(deviceSelect.value);
  }

  function populateProcesses() {
    const device = selectedDevice();
    const previous = processSelect.value || (savedSelection.deviceId === device.id ? savedSelection.processId : '');
    processSelect.innerHTML = orderedProcessOptions(device).map(process => `<option value="${escapeHtml(process.id)}"${process.unavailable ? ' disabled' : ''}>${escapeHtml(process.label)}</option>`).join('');
    if (device.processes.some(process => process.id === previous)) processSelect.value = previous;
    render();
  }

  function saveSelection(deviceId, processId) {
    storage.set(SELECTION_KEY, { deviceId, processId });
  }

  function render() {
    const device = selectedDevice();
    const process = catalog.findProcess(device, processSelect.value);
    if (!process) return;
    processSelect.value = process.id;
    saveSelection(device.id, process.id);

    document.getElementById('parameterManufacturer').textContent = `${device.manufacturer} · ${device.model}`;
    document.getElementById('parameterProcessTitle').textContent = process.label;
    const connectionImage = document.getElementById('parameterConnectionImage');
    connectionImage.src = process.image;
    connectionImage.alt = `Anschlussbelegung ${process.label} am ${device.manufacturer} ${device.model}`;
    renderDefinitionList(document.getElementById('parameterConnections'), process.connection || []);
    renderDefinitionList(document.getElementById('parameterSettings'), process.settings || []);
    document.getElementById('parameterSteps').innerHTML = (process.steps || []).map(step => `<li>${escapeHtml(step)}</li>`).join('');
    renderProcessReference(process.reference || []);
    renderDeviceProfile(deviceProfileFor(manufacturerDatabase, device.id), process.id);
    renderRanges(rangesFor(manufacturerDatabase, device.id, process.id), sourceDatabase);

    const warningImage = document.getElementById('parameterWarningImage');
    warningImage.src = device.warningImage;
    warningImage.classList.toggle('hidden', !device.warningImage);
    document.getElementById('parameterWarningText').textContent = device.warningText || '';
    document.getElementById('parameterSource').textContent = `Quelle: ${device.source}. Anschlussarbeiten nur bei ausgeschaltetem und vom Stromnetz getrenntem Gerät durchführen.`;

    const canTransfer = Boolean(calculatorProcessId(process.id));
    if (openCalculatorButton) {
      openCalculatorButton.disabled = !canTransfer;
      openCalculatorButton.dataset.processId = process.id;
    }
    if (transferHint) {
      transferHint.textContent = canTransfer
        ? `Übernimmt ${process.label} in den Rechner. Material und weitere Eingaben bleiben unverändert.`
        : 'Dieses Verfahren kann derzeit nicht in den Rechner übernommen werden.';
    }
  }

  deviceSelect.addEventListener('change', populateProcesses);
  processSelect.addEventListener('change', render);
  openCalculatorButton?.addEventListener('click', () => {
    const processId = openCalculatorButton.dataset.processId || processSelect.value;
    openInCalculator(processId);
  });
  populateProcesses();
}
