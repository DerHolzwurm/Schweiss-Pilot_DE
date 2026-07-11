import { paths } from './config.js';

export async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Konnte ${path} nicht laden`);
  return response.json();
}

export async function loadAppData() {
  const [version, welding, corrections, lexicon, help, manufacturers, sources, troubleshooting, machineParameters] = await Promise.all([
    loadJson(paths.version),
    loadJson(paths.processes),
    loadJson(paths.corrections),
    loadJson(paths.lexicon),
    loadJson(paths.help),
    loadJson(paths.manufacturers),
    loadJson(paths.sources),
    loadJson(paths.troubleshooting),
    loadJson(paths.machineParameters)
  ]);
  return {
    version,
    welding: { ...welding, manufacturerDatabase: manufacturers, sourceDatabase: sources },
    corrections,
    lexicon,
    help,
    troubleshooting,
    machineParameters
  };
}
