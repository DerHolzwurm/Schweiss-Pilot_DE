const CACHE_NAME = 'schweisspilot-v1.0.2-c12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  './css/main.css',
  './css/layout.css',
  './css/components.css',
  './css/responsive.css',
  './js/main.js',
  './js/core/app.js',
  './js/core/device-manager.js',
  './js/core/calculations.js',
  './js/core/manufacturers.js',
  './js/core/config.js',
  './js/core/storage.js',
  './js/core/version.js',
  './js/ui/navigation.js',
  './js/ui/theme.js',
  './js/ui/results.js',
  './js/ui/visuals.js',
  './js/ui/slider.js',
  './js/ui/dialogs.js',
  './js/ui/tooltips.js',
  './js/features/welding.js',
  './js/features/feedback.js',
  './js/features/diagnostics.js',
  './js/features/machine-parameters.js',
  './data/defaults.json',
  './data/processes.json',
  './data/corrections.json',
  './data/lexicon.json',
  './data/illustrations.json',
  './data/help.json',
  './data/reference-formulas.json',
  './data/manufacturers.json',
  './data/sources.json',
  './data/troubleshooting.json',
  './data/machine-parameters.json',
  './data/devices.json',
  './assets/images/parameters/ctm250-cut.png',
  './assets/images/parameters/ctm250-flux.png',
  './assets/images/parameters/ctm250-mig-mag.png',
  './assets/images/parameters/ctm250-mma.png',
  './assets/images/parameters/ctm250-wig.png',
  './assets/images/parameters/ctm250-warning.png',
  './assets/icons/icon-192.png',
  './assets/images/positions/pa.svg',
  './assets/images/positions/pc.svg',
  './assets/images/positions/pf.svg',
  './assets/images/positions/pg.svg',
  './assets/images/positions/pe.svg',
  './assets/images/joints/stumpf.svg',
  './assets/images/joints/kehl.svg',
  './assets/images/joints/ueberlapp.svg',
  './assets/images/materials/blech.svg',
  './assets/images/materials/vierkant.svg',
  './assets/images/materials/massiv.svg',
  './assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
