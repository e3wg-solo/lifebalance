// LifeBalance Service Worker
// Only caches same-origin static assets. Never caches Supabase API responses
// (auth tokens, user data) to prevent cross-user data leaks on shared devices.
const CACHE_NAME = "lifebalance-v2";
const OFFLINE_URLS = [
  "/",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests — never cache Supabase API responses
  if (url.origin !== self.location.origin) return;

  // Never cache auth-related or API routes
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/_next/data/")
  ) return;

  // Only cache static assets
  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json" ||
    /\.(?:js|css|png|jpg|jpeg|svg|webp|woff2?)$/i.test(url.pathname);

  if (!isStatic) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// Allow the app to purge the cache on sign-out via postMessage
self.addEventListener("message", (event) => {
  if (event.data === "CLEAR_CACHE") {
    caches.delete(CACHE_NAME);
  }
});
