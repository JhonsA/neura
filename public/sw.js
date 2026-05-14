const CACHE_NAME = 'neura-shell-v1'

const SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Cache shell assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  )
  self.skipWaiting()
})

// Remove old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Network-first for navigation, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    // Cache-first for navigation: always serve the cached app shell.
    // For a SPA the HTML never changes between visits (assets are hashed),
    // so going to the network first only adds latency and breaks offline.
    event.respondWith(
      caches.match('/').then((cached) => cached ?? fetch(request))
    )
  } else {
    // Cache-first for static assets (JS, CSS, fonts, images)
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((response) => {
            // Cache successful GET responses for static assets
            if (
              response.ok &&
              request.method === 'GET' &&
              (url.pathname.match(/\.(js|css|woff2?|png|svg|ico)$/) !== null)
            ) {
              const clone = response.clone()
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            }
            return response
          })
      )
    )
  }
})
