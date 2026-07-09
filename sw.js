const CACHE_NAME = 'schweisspilot-v1.0.1-c02';
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
  './js/core/calculations.js',
  './js/core/config.js',
  './js/core/storage.js',
  './js/core/version.js',
  './js/ui/navigation.js',
  './js/ui/theme.js',
  './js/ui/results.js',
  './js/ui/visuals.js',
  './js/ui/slider.js',
  './js/ui/dialogs.js',
  './js/features/welding.js',
  './js/features/feedback.js',
  './data/defaults.json',
  './data/processes.json',
  './data/corrections.json',
  './data/lexicon.json',
  './assets/icons/icon-192.png',
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
