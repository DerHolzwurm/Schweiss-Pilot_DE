function within(value, min, max) {
  if (value === null || value === undefined) return true;
  if (min === null || min === undefined || max === null || max === undefined) return true;
  return Number(value) >= Number(min) && Number(value) <= Number(max);
}

function wireMatches(inputWire, referenceWire) {
  if (referenceWire === null || referenceWire === undefined) return true;
  return Math.abs(Number(inputWire || 0) - Number(referenceWire)) < 0.05;
}

export function findManufacturerReferences(input, data) {
  const db = data?.manufacturerDatabase;
  if (!db?.parameterSets) return [];

  return db.parameterSets.filter(entry => (
    entry.process === input.process &&
    entry.material === input.material &&
    within(input.thickness, entry.thicknessMinMm, entry.thicknessMaxMm) &&
    wireMatches(input.wire, entry.wireMm)
  ));
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

function bestReference(references, result) {
  if (!references.length) return null;
  return [...references].sort((a, b) => {
    const aMid = rangeMid(a.currentMinA, a.currentMaxA);
    const bMid = rangeMid(b.currentMinA, b.currentMaxA);
    if (aMid === null && bMid === null) return 0;
    if (aMid === null) return 1;
    if (bMid === null) return -1;
    return Math.abs(Number(result.amps) - aMid) - Math.abs(Number(result.amps) - bMid);
  })[0];
}

export function buildManufacturerComparison(result, references, data) {
  const primary = bestReference(references, result);
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

  return {
    available: true,
    matches: references.length,
    primaryId: primary.id,
    manufacturer,
    device,
    confidence: primary.confidence || 'orientation',
    comment: primary.comment || '',
    sourceLabels,
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
