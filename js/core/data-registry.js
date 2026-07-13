function assertObject(value, datasetName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Datensatz ${datasetName} hat kein gültiges Objektformat`);
  }
}

function validateDataset(name, value, definition) {
  if (definition.type === 'array') {
    if (!Array.isArray(value)) throw new Error(`Datensatz ${name} muss eine Liste sein`);
    return value;
  }

  assertObject(value, name);
  const missing = (definition.required || []).filter(key => !(key in value));
  if (missing.length) {
    throw new Error(`Datensatz ${name} enthält nicht: ${missing.join(', ')}`);
  }
  return value;
}

export async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Konnte ${path} nicht laden (${response.status})`);
  try {
    return await response.json();
  } catch {
    throw new Error(`Ungültiges JSON in ${path}`);
  }
}

export async function loadDatasetRegistry(definitions) {
  const entries = await Promise.all(
    Object.entries(definitions).map(async ([name, definition]) => {
      const value = await loadJson(definition.path);
      return [name, validateDataset(name, value, definition)];
    })
  );

  return Object.freeze(Object.fromEntries(entries));
}
