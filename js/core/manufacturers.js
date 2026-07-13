function within(value, min, max) {
  if (value === null || value === undefined) return true;
  if (min === null || min === undefined || max === null || max === undefined) return true;
  return Number(value) >= Number(min) && Number(value) <= Number(max);
}

function wireMatches(inputWire, referenceWire) {
  if (referenceWire === null || referenceWire === undefined) return true;
  return Math.abs(Number(inputWire || 0) - Number(referenceWire)) < 0.05;
}

function electrodeMatches(inputElectrode, referenceElectrode) {
  if (referenceElectrode === null || referenceElectrode === undefined) return true;
  return Math.abs(Number(inputElectrode || 0) - Number(referenceElectrode)) < 0.05;
}

export function findManufacturerReferences(input, data, manufacturerId = 'all') {
  const db = data?.manufacturerDatabase;
  if (!db?.parameterSets) return [];

  return db.parameterSets.filter(entry => (
    (manufacturerId === 'all' || !manufacturerId || entry.manufacturerId === manufacturerId) &&
    entry.process === input.process &&
    entry.material === input.material &&
    within(input.thickness, entry.thicknessMinMm, entry.thicknessMaxMm) &&
    wireMatches(input.wire, entry.wireMm) &&
    electrodeMatches(input.electrode, entry.electrodeDiameterMm)
  ));
}

export function listManufacturersWithData(data) {
  const db = data?.manufacturerDatabase;
  if (!db?.parameterSets?.length) return [];
  const counts = db.parameterSets.reduce((map, entry) => {
    map.set(entry.manufacturerId, (map.get(entry.manufacturerId) || 0) + 1);
    return map;
  }, new Map());

  return (db.manufacturers || [])
    .filter(item => counts.has(item.id))
    .map(item => ({
      id: item.id,
      label: `${item.name} (${counts.get(item.id)})`
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));
}

export function getManufacturerName(data, manufacturerId) {
  const db = data?.manufacturerDatabase;
  return db?.manufacturers?.find(item => item.id === manufacturerId)?.name || manufacturerId;
}

export function getSourceLabel(data, sourceId) {
  const source = data?.sourceDatabase?.sources?.find(item => item.id === sourceId)
    || data?.sources?.find?.(item => item.id === sourceId);
  return source?.label || source?.title || source?.name || sourceId;
}

function rangeMid(min, max) {
  if (min === null || min === undefined || max === null || max === undefined) return null;
  return (Number(min) + Number(max)) / 2;
}

function valueStatus(value, min, max) {
  if (value === null || value === undefined || min === null || min === undefined || max === null || max === undefined) {
    return { state: 'missing', text: 'nicht vergleichbar', deviationPercent: null };
  }
  const numeric = Number(value);
  const low = Number(min);
  const high = Number(max);
  const middle = rangeMid(low, high);
  const deviationPercent = middle ? ((numeric - middle) / middle) * 100 : null;

  if (numeric < low) return { state: 'below', text: 'unter Herstellerbereich', deviationPercent };
  if (numeric > high) return { state: 'above', text: 'über Herstellerbereich', deviationPercent };
  return { state: 'match', text: 'im Herstellerbereich', deviationPercent };
}

function formatRange(min, max, unit, digits = 0) {
  if (min === null || min === undefined || max === null || max === undefined) return '–';
  return `${Number(min).toFixed(digits)}–${Number(max).toFixed(digits)} ${unit}`;
}

function formatValue(value, unit, digits = 0) {
  if (value === null || value === undefined) return '–';
  return `${Number(value).toFixed(digits)} ${unit}`;
}

function normalizedDistance(value, min, max) {
  if (value === null || value === undefined || min === null || min === undefined || max === null || max === undefined) return 1;
  const low = Number(min);
  const high = Number(max);
  const span = Math.max(high - low, 0.1);
  const middle = (low + high) / 2;
  return Math.abs(Number(value) - middle) / span;
}

function referenceSpecificity(reference, context = {}) {
  let score = 0;
  score += normalizedDistance(context.thickness, reference.thicknessMinMm, reference.thicknessMaxMm) * 5;
  score += normalizedDistance(context.amps, reference.currentMinA, reference.currentMaxA) * 2;

  if (reference.wireMm !== null && reference.wireMm !== undefined) {
    score += Math.abs(Number(context.wire || 0) - Number(reference.wireMm)) < 0.05 ? -2 : 5;
  }
  if (reference.electrodeDiameterMm !== null && reference.electrodeDiameterMm !== undefined) {
    score += Math.abs(Number(context.electrode || 0) - Number(reference.electrodeDiameterMm)) < 0.05 ? -3 : 6;
  }

  const thicknessSpan = reference.thicknessMinMm !== null && reference.thicknessMaxMm !== null
    ? Math.max(Number(reference.thicknessMaxMm) - Number(reference.thicknessMinMm), 0)
    : 99;
  score += thicknessSpan * 0.1;
  if (reference.confidence === 'manufacturer-manual') score -= 1;
  return score;
}

function buildMatchQuality(reference, context = {}) {
  const thicknessDistance = normalizedDistance(context.thickness, reference.thicknessMinMm, reference.thicknessMaxMm);
  const currentDistance = normalizedDistance(context.amps, reference.currentMinA, reference.currentMaxA);
  const exactElectrode = reference.electrodeDiameterMm === null || reference.electrodeDiameterMm === undefined
    || Math.abs(Number(context.electrode || 0) - Number(reference.electrodeDiameterMm)) < 0.05;
  const exactWire = reference.wireMm === null || reference.wireMm === undefined
    || Math.abs(Number(context.wire || 0) - Number(reference.wireMm)) < 0.05;
  const state = thicknessDistance <= 0.5 && currentDistance <= 0.5 && exactElectrode && exactWire
    ? 'exact'
    : thicknessDistance <= 1 && exactElectrode && exactWire
      ? 'close'
      : 'orientation';
  const label = state === 'exact' ? 'Sehr genaue Zuordnung' : state === 'close' ? 'Passende Zuordnung' : 'Orientierungswert';
  return { state, label };
}

export function selectPrimaryReference(references, result, context = {}) {
  if (!references.length) return null;
  const scoringContext = { ...context, amps: result?.amps };
  return [...references].sort((a, b) => referenceSpecificity(a, scoringContext) - referenceSpecificity(b, scoringContext))[0];
}

export function buildManufacturerComparison(result, references, data) {
  const primary = selectPrimaryReference(references, result, result);
  if (!primary) {
    return {
      available: false,
      headline: 'Kein Herstellervergleich verfügbar',
      note: 'Für diese Kombination liegt noch kein passender Herstellerdatensatz vor.',
      matches: 0
    };
  }

  const amp = valueStatus(result.amps, primary.currentMinA, primary.currentMaxA);
  const volt = valueStatus(result.volt, primary.voltageMinV, primary.voltageMaxV);
  const feed = valueStatus(result.wfs, primary.wireFeedMinMMin, primary.wireFeedMaxMMin);
  const manufacturer = getManufacturerName(data, primary.manufacturerId);
  const sourceLabels = (primary.sourceIds || []).map(id => getSourceLabel(data, id)).filter(Boolean);
  const device = primary.deviceFamily || primary.deviceProfileId || 'Herstellerdaten';
  const matchQuality = buildMatchQuality(primary, result);
  const thicknessRange = formatRange(primary.thicknessMinMm, primary.thicknessMaxMm, 'mm', 1);

  return {
    available: true,
    matches: references.length,
    primaryId: primary.id,
    manufacturer,
    device,
    confidence: primary.confidence || 'orientation',
    comment: primary.comment || '',
    sourceLabels,
    matchQuality,
    referenceThickness: thicknessRange,
    amp: {
      ...amp,
      calculated: formatValue(result.amps, 'A', 0),
      range: formatRange(primary.currentMinA, primary.currentMaxA, 'A', 0)
    },
    volt: {
      ...volt,
      calculated: formatValue(result.volt, 'V', 1),
      range: formatRange(primary.voltageMinV, primary.voltageMaxV, 'V', 1)
    },
    feed: {
      ...feed,
      calculated: formatValue(result.wfs, 'm/min', 1),
      range: formatRange(primary.wireFeedMinMMin, primary.wireFeedMaxMMin, 'm/min', 1)
    },
    gasFlow: primary.gasFlowLMin ? formatRange(primary.gasFlowLMin[0], primary.gasFlowLMin[1], 'l/min', 0) : null,
    airPressure: primary.airPressureBar ? formatRange(primary.airPressureBar[0], primary.airPressureBar[1], 'bar', 1) : null,
    gas: primary.gas || null,
    dutyCycle: primary.dutyCycle || null
  };
}

export function getActiveDeviceProfile(data) {
  const db = data?.manufacturerDatabase;
  if (!db?.deviceProfiles?.length) return null;
  const activeId = db.activeDeviceProfileId;
  return db.deviceProfiles.find(profile => profile.id === activeId) || db.deviceProfiles[0] || null;
}

export function getDeviceCurrentLimits(processId, data) {
  const profile = getActiveDeviceProfile(data);
  if (!profile?.outputCurrent) return null;
  if (Array.isArray(profile.processes) && !profile.processes.includes(processId)) return null;

  const key = processId === 'plasma' ? 'cutA'
    : processId === 'mma' ? 'mmaA'
      : processId === 'wig_dc' || processId === 'wig_ac' ? 'wigA'
        : processId === 'mag' || processId === 'mig' || processId === 'fcaw_s' ? 'migA'
          : null;

  const range = key ? profile.outputCurrent[key] : null;
  if (!Array.isArray(range) || range.length < 2) return null;

  return {
    profileId: profile.id,
    manufacturerId: profile.manufacturerId,
    deviceName: profile.name,
    minA: Number(range[0]),
    maxA: Number(range[1])
  };
}
