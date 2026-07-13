export const datasets = Object.freeze({
  version: { path: './version.json', required: ['name', 'version', 'build', 'branch', 'status'] },
  processes: { path: './data/processes.json', required: [] },
  corrections: { path: './data/corrections.json', required: [] },
  lexicon: { path: './data/lexicon.json', type: 'array' },
  help: { path: './data/help.json', required: [] },
  manufacturers: { path: './data/manufacturers.json', required: [] },
  sources: { path: './data/sources.json', required: [] },
  troubleshooting: { path: './data/troubleshooting.json', required: [] },
  machineParameters: { path: './data/machine-parameters.json', required: ['schemaVersion', 'deviceDatabase'] },
  devices: { path: './data/devices.json', required: ['devices'] }
});

export const paths = Object.freeze(
  Object.fromEntries(Object.entries(datasets).map(([key, definition]) => [key, definition.path]))
);
