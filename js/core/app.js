import { paths } from './config.js';

export async function loadJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Konnte ${path} nicht laden`);
  return response.json();
}

export async function loadAppData() {
  const [version, welding, corrections, lexicon, help] = await Promise.all([
    loadJson(paths.version),
    loadJson(paths.processes),
    loadJson(paths.corrections),
    loadJson(paths.lexicon),
    loadJson(paths.help)
  ]);
  return { version, welding, corrections, lexicon, help };
}
