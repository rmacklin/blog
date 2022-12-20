class PriorityHintsTransform {
  constructor() {
    this._applied = false;
  }
  element(element) {
    if (!this._applied) {
      element.setAttribute('fetchpriority', 'high');
      this._applied = true;
    }
  }
}

/**
 * @param {string} experiment
 * @param {HTMLRewriter} rewriter
 * @returns {HTMLRewriter}
 */
export function addPriorityHints(rewriter, selector) {
  rewriter.on(selector, new PriorityHintsTransform());
}

export function getPriorityHintKey(request, path) {
  const device =
    request.headers.get('sec-ch-ua-mobile') === '?1' ? 'mobile' : 'desktop';

  return `${device}:${encodeURIComponent(path)}`;
}

async function storePriorityHints(request, store) {
  const [hintPath, newHintValue] = (await request.text()).split('\n');
  const key = getPriorityHintKey(request, hintPath);

  const oldHintValue = await store.get(key);

  if (newHintValue !== oldHintValue) {
    console.log('put', key, newHintValue);
    await store.put(key, newHintValue);
  }
}

export async function logPriorityHint(request, store) {
  await storePriorityHints(request, store);
  return new Response();
}
