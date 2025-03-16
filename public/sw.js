const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/main.js',
    '/style.css',
    '/blog.js',
    '/light-theme.css'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_ASSETS))
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name.startsWith('portfolio-') && name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});