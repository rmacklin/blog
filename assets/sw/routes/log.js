import {Route} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';
import {BackgroundSyncPlugin} from 'workbox-background-sync';


const logMatcher = ({url}) => {
  return url.hostname === location.hostname && url.pathname === '/log';
};

const logStrategy = new NetworkOnly({
  plugins: [
    new BackgroundSyncPlugin('log', {
      maxRetentionTime: 60 * 24 * 4, // Retry for 4 days.
      async onSync({queue}) {
        let entry;
        while (entry = await queue.shiftRequest()) {
          const {request} = entry;
          try {
            const originalBody = await request.clone().text();
            const body = originalBody.split(/\n/).map((event) => {
              const params = new URLSearchParams(event);
              params.set('ep.sw_replay', true);
              return params.toString();
            }).join('\n');

            await fetch(new Request(request.url, {body, method: 'POST'}));
          } catch (err) {
            await queue.unshiftRequest(entry);
            throw err;
          }
        }
      },
    }),
  ],
});

export const createLogRoute = () => {
  return new Route(logMatcher, logStrategy, 'POST');
};
