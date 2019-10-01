export const loggerPlugin = (name) => {
  return {
    async handlerWillStart({
      request, // : Request;
      event, // : ?FetchEvent;
    }) {
      console.log(name, 'handlerWillStart', {
        request, // : Request;
        event, // : ?FetchEvent;
      });
    },

    async cacheDidUpdate({
      cacheName, // : string;
      oldResponse, // : ?Response;
      newResponse, // : Response;
      request, // : Request;
      event, // : ?FetchEvent;
    }) {
      console.log(name, 'cacheDidUpdate', {
        cacheName, // : string;
        oldResponse, // : ?Response;
        newResponse, // : Response;
        request, // : Request;
        event, // : ?FetchEvent;
      });
    },
    async cacheKeyWillBeUsed({
      request, // : Request;
      mode, // : string;
    }) {
      console.log(name, 'cacheKeyWillBeUsed', {
        request, // : Request;
        mode, // : string;
      });
      return request;
    },
    async cacheWillUpdate({
      response, // : Response;
      request, // : ?Request;
      event, // : ?ExtendableEvent;
    }) {
      console.log(name, 'cacheWillUpdate', {
        response, // : Response;
        request, // : ?Request;
        event, // : ?ExtendableEvent;
      });
      return response;
    },
    async cachedResponseWillBeUsed({
      cacheName, // : string;
      request, // : Request;
      matchOptions, // : ?CacheQueryOptions;
      cachedResponse, // : ?Response;
      event, // : ?ExtendableEvent;
    }) {
      console.log(name, 'cachedResponseWillBeUsed', {
        cacheName, // : string;
        request, // : Request;
        matchOptions, // : ?CacheQueryOptions;
        cachedResponse, // : ?Response;
        event, // : ?ExtendableEvent;
      });
      return cachedResponse;
    },
    async fetchDidFail({
      originalRequest, // : Request;
      error, // : Error;
      request, // : Request;
      event, // : ?ExtendableEvent;
    }) {
      console.log(name, 'fetchDidFail', {
        originalRequest, // : Request;
        error, // : Error;
        request, // : Request;
        event, // : ?ExtendableEvent;
      });
    },
    async fetchDidSucceed({
      request, // : Request;
      response, // : Response;
    }) {
      console.log(name, 'fetchDidSucceed', {
        request, // : Request;
        response, // : Response;
      });
      return response;
    },
    async requestWillFetch({
      request, // : Request;
    }) {
      console.log(name, 'requestWillFetch', {
        request, // : Request;
      });
      return request;
    },

    handlerWillRespond({
      request, // : Request;
      response, // : Response;
      event, // : ?FetchEvent;
    }) {
      console.log(name, 'handlerWillRespond', {
        request, // : Request;
        response, // : Response;
        event, // : ?FetchEvent;
      });
      return response;
    },

    handlerDidRespond({
      request, // : Request;
      response, // : Response;
      event, // : ?FetchEvent;
    }) {
      console.log(name, 'handlerDidRdspond', {
        request, // : Request;
        response, // : Response;
        event, // : ?FetchEvent;
      });
    },

    async handlerDidComplete({
      request, // : Request;
      response, // : Response;
      event, // : ?FetchEvent;
    }) {
      console.log(name, 'handlerDidComplete', {
        request, // : Request;
        response, // : Response;
        event, // : ?FetchEvent;
      });
    },
  };
};
