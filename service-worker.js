// Service Worker mínimo para PWA instalable (sin cache offline)
self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Borrar todos los caches viejos
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// No interceptar requests - dejar que el navegador maneje todo normalmente
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
