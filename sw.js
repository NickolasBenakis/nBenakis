'use strict';
const staticCacheName = 'pages-cache-v1';
const filesToCache = [
    '/',
    'index.html',
    'styles/index.scss',
    'styles/toggle.scss',
];

self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
        self.skipWaiting(),
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches
            .match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request).then(response => {
                    if (response.status === 404) {
                        return caches.match('index.html');
                    }
                    return caches.open(staticCacheName).then(cache => {
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                });
            })
            .catch(error => {
                console.log('Error, ', error);
                return caches.match('index.html');
            })
    );
});
