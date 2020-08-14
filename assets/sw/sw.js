/* global __PRECACHE_MANIFEST__ */

import {PrecacheController} from 'workbox-precaching/PrecacheController.mjs';
import {PrecacheRoute} from 'workbox-precaching/PrecacheRoute.mjs';
// import {PrecacheShellRoute} from 'workbox-precaching/PrecacheShellRoute.mjs';
import {PrecacheStrategy} from 'workbox-precaching/PrecacheStrategy.mjs';

import {registerRoute} from 'workbox-routing/registerRoute.mjs';
// import {CacheFirst} from 'workbox-strategies/CacheFirst.mjs';
// import {cacheNames} from './caches.js';

const v = '2';
console.log(v);

// const strategy = new PrecacheStrategy({cacheName: cacheNames.SHELL});

const strategy = new PrecacheStrategy({cacheName: 'my-precache'});
// const strategy = new CacheFirst({cacheName: 'my-runtime-cache'});

const pc = new PrecacheController({strategy});
pc.precache(__PRECACHE_MANIFEST__);

// registerRoute(new PrecacheNavigateFallbackRoute(pc, {url: '/shell-start.html'}));
registerRoute(new PrecacheRoute(pc));

self.skipWaiting();
addEventListener('activate', () => clients.claim());
