const CACHE_NAME = "dev-coffee-v4";

const APP_SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "css/style.css",
  "javascript/app.js",
  "images/01-espresso.jpg",
  "images/02-cappuccino.jpg",
  "images/03-iced-coffee.jpg",
  "images/04-coffee-beans.jpg",
  "images/05-french-press.jpg",
  "images/06-turkish-coffee.jpg",
  "images/07-latte-art.jpg",
  "images/08-americano.jpg",
  "images/09-pour-over.jpg",
  "images/10-mocha.jpg",
  "images/icons/icon-72x72.png",
  "images/icons/icon-96x96.png",
  "images/icons/icon-128x128.png",
  "images/icons/icon-144x144.png",
  "images/icons/icon-152x152.png",
  "images/icons/icon-192x192.png",
  "images/icons/icon-384x384.png",
  "images/icons/icon-512x512.png"
];

/* ===== Estrategias ===== */

// Cache first: responde desde caché; si no existe, va a la red
async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}

// Network first: intenta la red (y actualiza la caché); si falla, usa la caché
async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    return Response.error();
  }
}

/* ===== 1. Instalación: precachear los archivos base ===== */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* ===== 2. Activación: borrar cachés de versiones anteriores ===== */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ===== 3. Fetch: decidir de dónde responder ===== */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Fuentes de Google: stale-while-revalidate
  if (
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((response) => {
              if (response.ok) cache.put(request, response.clone());
              return response;
            })
            .catch(() => cached || Response.error());
          return cached || network;
        })
      )
    );
    return;
  }

  // Ignorar otros dominios
  if (url.origin !== self.location.origin) return;

  // Navegación, CSS y JS: network first
  if (
    request.mode === "navigate" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(networkFirst(request, "index.html"));
    return;
  }

  // Imágenes, iconos y demás archivos propios: cache first
  event.respondWith(cacheFirst(request));
});
