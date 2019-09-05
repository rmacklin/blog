import * as breakpoints from './breakpoints';
import * as contentLoader from './content-loader';
import * as drawer from './drawer';

/**
 * The main script entry point for the site.
 */
export const main = async () => {
  contentLoader.init();
  drawer.init();
  breakpoints.init();
};
