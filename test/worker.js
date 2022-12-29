import {strict as assert} from 'assert';
import fetch from 'node-fetch';

const urlWithLCPImage =
  '/articles/my-challenge-to-the-web-performance-community/';

const urlWithoutLCPImage = '/articles/cascading-cache-invalidation/';

describe('worker', function () {
  describe('priority hints', function () {
    beforeEach(async () => {
      // Delete the cache by passing an empty selector.
      // TODO: figure out a better way to do this. There doesn't seem to
      // currently be a way to clear KV store data locally via wrangler.
      for (const url of [urlWithLCPImage, urlWithLCPImage]) {
        await fetch(`http://127.0.0.1:3000/hint`, {
          method: 'POST',
          body: JSON.stringify({
            path: url,
            selector: '',
          }),
        });
      }
    });

    it('should apply priority hints to prior LCP images', async () => {
      await browser.url(urlWithLCPImage);

      const fp1 = await browser.execute(() => {
        return document.querySelector('img').getAttribute('fetchpriority');
      });

      // Wait until the hint has been sent.
      await browser.executeAsync((done) => {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name.endsWith('/hint')) {
              done();
            }
          }
        }).observe({type: 'resource', buffered: true});
      });

      await browser.url('/__reset__');

      // Wait until the SW has unregistered.
      await browser.waitUntil(async () => {
        return await browser.execute(() => {
          return window.__ready__ === true;
        });
      });

      await browser.url(urlWithLCPImage);

      const fp2 = await browser.execute(() => {
        return document.querySelector('img').getAttribute('fetchpriority');
      });

      assert.strictEqual(fp1, null);
      assert.strictEqual(fp2, 'high');
    });

    it('should not apply priority hints to prior non-LCP images', async () => {
      await browser.url(urlWithoutLCPImage);

      const fp1 = await browser.execute(() => {
        return document.querySelector('img').getAttribute('fetchpriority');
      });

      // No hint should be sent for this page, but we need to wait a bit
      // to ensure that it doesn't happen.
      await browser.pause(2000);

      await browser.url('/__reset__');

      // Wait until the SW has unregistered.
      await browser.waitUntil(async () => {
        return await browser.execute(() => {
          return window.__ready__ === true;
        });
      });

      await browser.url(urlWithoutLCPImage);

      const fp2 = await browser.execute(() => {
        return document.querySelector('img').getAttribute('fetchpriority');
      });

      assert.strictEqual(fp1, null);
      assert.strictEqual(fp2, null);
    });
  });
});
