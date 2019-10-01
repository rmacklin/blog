import {CacheFirst} from 'workbox-strategies/CacheFirst';
import {StaleWhileRevalidate} from 'workbox-strategies/StaleWhileRevalidate';
import {applyCallbacks} from './applyCallbacks';
import {EventProxy} from './EventProxy';


function overrideHandler(superClass) {
  const superHandle = superClass.prototype.handle;

  superClass.prototype.handle = async function(options) {
    // Create a proxy for the event, so we can observe when it's done waiting.
    options.event = EventProxy.getOrCreate(options.event, options.request.url);

    await applyCallbacks('handlerWillStart', this._plugins, options);

    // console.log('Running handler for:', options.request.url);
    options.response = await superHandle.call(this, options);

    await applyCallbacks('handlerWillRespond', this._plugins, options,
        (returnValue) => options.response = returnValue);

    // Defer these callbacks as to not block the response.
    Promise.resolve().then(async () => {
      await applyCallbacks('handlerDidRespond', this._plugins, options);
      await options.event.done();
      await applyCallbacks('handlerDidComplete', this._plugins, options);
    });

    return options.response;
  };
}

// Override the `handle`` method of all used strategies to use
overrideHandler(CacheFirst);
overrideHandler(StaleWhileRevalidate);

export {
  CacheFirst,
  StaleWhileRevalidate,
};
