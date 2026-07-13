import { datasets } from './config.js';
import { loadDatasetRegistry, loadJson } from './data-registry.js';

export { loadJson } from './data-registry.js';

export async function loadAppData() {
  const data = await loadDatasetRegistry(datasets);

  return Object.freeze({
    version: data.version,
    welding: Object.freeze({
      ...data.processes,
      manufacturerDatabase: data.manufacturers,
      sourceDatabase: data.sources
    }),
    corrections: data.corrections,
    lexicon: data.lexicon,
    help: data.help,
    troubleshooting: data.troubleshooting,
    machineParameters: data.machineParameters,
    devices: data.devices
  });
}
