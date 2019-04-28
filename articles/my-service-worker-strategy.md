There are a lot of articles on the web that will teach you how to implement service worker caching and offline functionality for a progress web app. Specifically, most service worker tutorials assume you're building a single page application (SPA) using the app shell model and probably a web framework. In fact, all the popular web frameworks and CLIs come with some sort of service worker integration that you can turn on and it (most of the time) just works.

But what if you're building a content site? What if your site is Wikipedia, or the New York Times, or even a personal blog?

When I decided to add service worker to this site, I wanted to spend some time and really think about what the optimal service worker implementation would be -- both for performance and user experience.


Here were the requirements I made for my service worker implementation:

- All pages a user has visited in the past should work offline.
- Content for pages never visited should not be cached (nothing should be precached unnecessarily).
- The use of service worker should not negatively affect performance, even when visiting a new page
- Entire pages should not be cached (only the content/markup unique to that page)
- For repeat visits, first paint should never be blocked on the network


