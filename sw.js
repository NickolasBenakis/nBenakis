(() => {
    const cacheName = 'news-v1';
    const staticAssets = [
        './',
        './index.js',
        './index.scss',
        './fallback.json',
        './images/fallback_image.jpg',
    ];

    globalThis.addEventListener('install', async function() {
        const cache = await caches.open(cacheName);
        cache.addAll(staticAssets);
    });

    globalThis.addEventListener('activate', event => {
        event.waitUntil(globalThis.clients.claim());
    });

    globalThis.addEventListener('fetch', event => {
        const request = event.request;
        const url = new URL(request.url);
        if (url.origin === location.origin) {
            event.respondWith(cacheFirst(request));
        } else {
            event.respondWith(networkFirst(request));
        }
    });

    async function cacheFirst(request) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || fetch(request);
    }

    async function networkFirst(request) {
        const dynamicCache = await caches.open('news-dynamic');
        try {
            const networkResponse = await fetch(request);
            dynamicCache.put(request, networkResponse.clone());
            return networkResponse;
        } catch (err) {
            const cachedResponse = await dynamicCache.match(request);
            return cachedResponse || (await caches.match('./fallback.json'));
        }
    }
})();
