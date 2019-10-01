import {Deferred} from 'workbox-core/_private/Deferred.mjs';


const eventProxyMap = new Map();


export class EventProxy {
  static getOrCreate(event, url) {
    let eventProxy = event instanceof EventProxy ?
        event : eventProxyMap.get(event);

    if (!eventProxy) {
      eventProxy = new EventProxy(event, url);
      eventProxyMap.set(event, eventProxy);
    }

    eventProxy._spyCount++;
    return eventProxy;
  }

  constructor(event) {
    this._originalEvent = event;
    this._spyCount = 0;
    this._extendLifetimePromises = [];
    this._waitingDeferred = new Deferred();

    // Since we're proxying `waitUntil()`, we have to manually let the
    // original event know when we're done.
    event.waitUntil(this._waitingDeferred.promise);

    return new Proxy(event, {
      get: (obj, prop) => {
        if (prop in this) {
          return this[prop];
        }
        return obj[prop];
      },
    });
  }

  get originalEvent() {
    return this._originalEvent;
  }

  waitUntil(promise) {
    this._extendLifetimePromises.push(promise);
  }

  respondWith(promise) {
    this._extendLifetimePromises.push(promise);
    this._originalEvent.respondWith(promise);
  }

  async done() {
    let promise;

    while (promise = this._extendLifetimePromises.shift()) {
      // Ignore errors by default;
      await promise.catch((e) => e);
    }

    this._release();
  }

  _release(event) {
    this._spyCount--;
    if (this._spyCount === 0) {
      eventProxyMap.delete(this._originalEvent);

      // Once the last proxy is done with this event, it can stop waiting.
      this._waitingDeferred.resolve();
    }
  }
}
