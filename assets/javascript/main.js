import * as alerts from './alerts';
import * as breakpoints from './breakpoints';
import * as contentLoader from './content-loader';
import * as drawer from './drawer';
import * as messages from './messages';
import * as sw from './sw-init';


/**
 * The main script entry point for the site. Initalizes all the sub modules
 * analytics tracking, and the service worker.
 */
const main = async () => {
  contentLoader.init();
  drawer.init();
  breakpoints.init();
  messages.init();
  alerts.init();

  if ('serviceWorker' in navigator) {
    try {
      await sw.init();
    } catch (err) {
      const analytics = await import('./analytics');
      analytics.trackError(err);
    }
  }

  const analytics = await import('./analytics');
  analytics.init();
};

// Initialize all code in a separate task.
setTimeout(main, 0);
