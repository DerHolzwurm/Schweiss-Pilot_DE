const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function formatRange(min, max, unit) {
  if (min == null && max == null) return '–';
  if (min === max || max == null) return `${String(min).replace('.', ',')} ${unit}`;
  return `${String(min).replace('.', ',')}–${String(max).replace('.', ',')} ${unit}`;
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

function renderDefinitionList(target, entries) {
  target.innerHTML = entries.map(entry => `<div><dt>${escapeHtml(entry.label)}</dt><dd>${escapeHtml(entry.value)}</dd></div>`).join('');
}

function renderRanges(rows) {
  const body = document.getElementById('parameterRanges');
  const empty = document.getElementById('parameterNoRanges');
  const count = document.getElementById('parameterRangeCount');
  count.textContent = `${rows.length} ${rows.length === 1 ? 'Bereich' : 'Bereiche'}`;
  body.innerHTML = rows.map(row => {
    const gasFlow = Array.isArray(row.gasFlowLMin) ? formatRange(row.gasFlowLMin[0], row.gasFlowLMin[1], 'l/min') : '–';
    return `<tr>
      <td>${escapeHtml(row.material || '–')}</td>
      <td>${escapeHtml(formatRange(row.thicknessMinMm, row.thicknessMaxMm, 'mm'))}</td>
      <td>${escapeHtml(row.wireDiameterLabel || (row.wireMm ? `${row.wireMm} mm` : '–'))}</td>
      <td>${escapeHtml(formatRange(row.currentMinA, row.currentMaxA, 'A'))}</td>
      <td>${escapeHtml(row.gas || '–')}</td>
      <td>${escapeHtml(gasFlow)}</td>
    </tr>`;
  }).join('');
  body.closest('.parameter-table-wrap').classList.toggle('hidden', rows.length === 0);
  empty.classList.toggle('hidden', rows.length !== 0);
}

export function initMachineParameters(database, manufacturerDatabase) {
  const deviceSelect = document.getElementById('parameterDevice');
  const processSelect = document.getElementById('parameterProcess');
  if (!deviceSelect || !processSelect || !database?.devices?.length) return;

  deviceSelect.innerHTML = database.devices.map(device => `<option value="${escapeHtml(device.id)}">${escapeHtml(device.manufacturer)} ${escapeHtml(device.model)}</option>`).join('');

  function selectedDevice() {
    return database.devices.find(device => device.id === deviceSelect.value) || database.devices[0];
  }

  function populateProcesses() {
    const device = selectedDevice();
    const previous = processSelect.value;
    processSelect.innerHTML = device.processes.map(process => `<option value="${escapeHtml(process.id)}">${escapeHtml(process.label)}</option>`).join('');
    if (device.processes.some(process => process.id === previous)) processSelect.value = previous;
    render();
  }

  function render() {
    const device = selectedDevice();
    const process = device.processes.find(item => item.id === processSelect.value) || device.processes[0];
    if (!process) return;
    processSelect.value = process.id;

    document.getElementById('parameterManufacturer').textContent = `${device.manufacturer} · ${device.model}`;
    document.getElementById('parameterProcessTitle').textContent = process.label;
    const connectionImage = document.getElementById('parameterConnectionImage');
    connectionImage.src = process.image;
    connectionImage.alt = `Anschlussbelegung ${process.label} am ${device.manufacturer} ${device.model}`;
    renderDefinitionList(document.getElementById('parameterConnections'), process.connection || []);
    renderDefinitionList(document.getElementById('parameterSettings'), process.settings || []);
    document.getElementById('parameterSteps').innerHTML = (process.steps || []).map(step => `<li>${escapeHtml(step)}</li>`).join('');
    renderRanges(rangesFor(manufacturerDatabase, device.id, process.id));

    const warningImage = document.getElementById('parameterWarningImage');
    warningImage.src = device.warningImage;
    warningImage.classList.toggle('hidden', !device.warningImage);
    document.getElementById('parameterWarningText').textContent = device.warningText || '';
    document.getElementById('parameterSource').textContent = `Quelle: ${device.source}. Anschlussarbeiten nur bei ausgeschaltetem und vom Stromnetz getrenntem Gerät durchführen.`;
  }

  deviceSelect.addEventListener('change', populateProcesses);
  processSelect.addEventListener('change', render);
  populateProcesses();
}
