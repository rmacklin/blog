import {ExpirationPlugin} from 'workbox-expiration/ExpirationPlugin.js';
import {Route} from 'workbox-routing/Route.js';
import {CacheFirst} from 'workbox-strategies/CacheFirst.js';
import {cacheNames} from '../caches.js';

const staticAssetsMatcher = ({url}) => {
  return url.hostname === location.hostname &&
      url.pathname.startsWith('/static/');
};

const staticAssetsStrategy = new CacheFirst({
  cacheName: cacheNames.STATIC_ASSETS,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 100,
    }),
    // TODO: add plugin to set cache hit status via Server Timing. If not
    // a cache hit set transfer size via Resource Timing.
    // {
    //   handlerWillRespond({response}) {
    //     console.log('content-length', response.headers.get('content-length'));
    //     return response;
    //   },
    //   cacheWillUpdate({response, event}) {
    //     console.log({response});


    //     setTimeout(() => {
    //       const matchingEntry = performance.getEntriesByType('resource').find(e => e.name === response.url);
    //       console.log({ matchingEntry,
    //       resources: performance.getEntriesByType('resource'),});
    //     }, 1000);


    //     return response;
    //   }
    // },
  ],
});

export const createStaticAssetsRoute = () => {
  return new Route(staticAssetsMatcher, staticAssetsStrategy);
};
