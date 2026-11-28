/**
 * ICT Easy Learning - Service Worker
 * Handles app-shell precaching, offline fallback, and smart runtime caching.
 */

const CACHE_VERSION = 'ict-pwa-v1.0.2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/login.html',
    '/offline.html',
    '/manifest.json',
    '/assets/css/style.css',
    '/assets/js/api.js',
    '/assets/js/main.js',
    '/assets/js/pwa.js',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => Promise.allSettled(
                PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => !key.startsWith(CACHE_VERSION))
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Never cache API calls or dynamic uploads
    if (url.origin === self.location.origin &&
        (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/'))) {
        return;
    }

    // HTML / Navigation requests: Network-first, fallback to cache, then offline.html
    const isNavigation = request.mode === 'navigate' ||
        (request.headers.get('accept') || '').includes('text/html');

    if (isNavigation) {
        event.respondWith(handleNavigationRequest(request));
        return;
    }

    // Static assets (CSS, JS, images, fonts): Stale-While-Revalidate
    event.respondWith(handleAssetRequest(request));
});

async function handleNavigationRequest(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (err) {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;

        const offlinePage = await caches.match('/offline.html');
        if (offlinePage) return offlinePage;

        return new Response('অফলাইন', {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

async function handleAssetRequest(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request, { ignoreSearch: false }) ||
        await caches.match(request, { ignoreSearch: true });

    const networkPromise = fetch(request)
        .then((response) => {
            if (response && (response.ok || response.type === 'opaque')) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    if (cached) {
        return cached;
    }

    const networkResponse = await networkPromise;
    if (networkResponse) {
        return networkResponse;
    }

    return new Response('', { status: 504, statusText: 'Offline' });
}
