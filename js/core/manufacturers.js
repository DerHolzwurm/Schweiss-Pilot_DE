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
