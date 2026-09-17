/* =========================================================
   ABHIJITH MR — Progressive Web App (PWA) Service Worker
   Version: 1.0.0
   Enables offline capabilities, instant repeat loads,
   and stale-while-revalidate caching.
========================================================= */

const CACHE_NAME = 'abhijith-portfolio-v1.1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './site.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './Images/Header-Image-transparent.webp',
  './Images/Header-Image.webp',
  './Images/Header-Image-og.jpg',
  './Images/About-Us.webp',
  './Images/footer.webp',
  './Images/project-omeagle.webp',
  './Images/project-krynntools.webp',
  './Images/project-hotelsnearme.webp',
  './Images/project-hawksbill.webp',
  './Images/project-theqoder.webp',
  './Images/project-securescan.webp',
  './Images/project-creativestudio.webp'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clear older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for static assets/images, Stale-While-Revalidate for HTML/scripts
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass Vercel system / analytics / Speed Insights telemetry
  if (url.pathname.startsWith('/_vercel')) {
    return;
  }

  // Skip cross-origin requests except fonts or CDNs
  if (url.origin !== self.location.origin && !url.origin.includes('fonts.googleapis.com') && !url.origin.includes('fonts.gstatic.com') && !url.origin.includes('cdnjs.cloudflare.com') && !url.origin.includes('unpkg.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
          }
        }).catch(() => {/* Offline */});

        return cachedResponse;
      }

      // If not cached, fetch from network and cache response
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for HTML documents if offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
