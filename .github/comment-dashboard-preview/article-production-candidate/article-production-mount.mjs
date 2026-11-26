import { COMMENT_API_ORIGIN, makeArticleClient, mountArticleComments } from './article-client.mjs';

export const SITE_ORIGIN = 'https://denkicontrol.com';
export const ARTICLE_PATH = /^\/articles\/[a-z0-9-]+\.html$/;
const readinessKeys = ['ready'];
const selectors = {
 slot: '[data-article-comments-slot]',
 template: 'template[data-article-comments-template]',
 mounted: '[data-comments]',
};
const inFlight = new WeakSet();

export async function attachProductionArticleComments({
 enabled = false, location = globalThis.location, doc = globalThis.document, allowedPaths,
 fetcher = globalThis.fetch, makeClient = makeArticleClient, mount = mountArticleComments,
 timeoutMs = 6000
} = {}) {
 const path = location?.pathname;
 if (enabled !== true || location?.origin !== SITE_ORIGIN || typeof path !== 'string'
     || !ARTICLE_PATH.test(path) || !(allowedPaths instanceof Set) || !allowedPaths.has(path)
     || !Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 10000) return null;
 const canonical = doc?.querySelectorAll('link[rel=canonical]');
 if (canonical?.length !== 1 || canonical[0].getAttribute('href') !== SITE_ORIGIN + path) return null;
 if (doc.documentElement?.lang.toLowerCase() !== 'ja') return null;
 const slots = doc.querySelectorAll(selectors.slot);
 if (slots.length !== 1) return null;
 const slot = slots[0];
 const templates = slot.querySelectorAll(selectors.template);
 if (templates.length !== 1 || !slot.hidden || !slot.isConnected || slot.querySelector(selectors.mounted)
     || inFlight.has(slot) || templates[0].content.childElementCount !== 1) return null;
 const root = templates[0].content.firstElementChild.cloneNode(true);
 if (!root.matches(selectors.mounted)) return null;

 const endpoint = COMMENT_API_ORIGIN + '/api/article-comments/readiness?article=' + encodeURIComponent(path);
 const current = () => slot.isConnected && slot.hidden && !slot.querySelector(selectors.mounted)
   && location.origin === SITE_ORIGIN && location.pathname === path;
 const controller = new AbortController();
 let bootstrap = true;
 let timer;
 inFlight.add(slot);
 try {
  const work = async () => {
   const response = await fetcher(endpoint, {
    method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error',
    referrerPolicy: 'no-referrer', signal: controller.signal
   });
   if (response.status !== 200 || response.redirected || response.url !== endpoint ||
       !/^application\/json(?:\s*;|$)/i.test(response.headers.get('content-type') || '')) return null;
   const readiness = await response.json();
   if (readiness === null || typeof readiness !== 'object'
       || Object.keys(readiness).join(',') !== readinessKeys.join(',') || readiness.ready !== true
       || controller.signal.aborted || !current()) return null;

   const client = makeClient({
    path, apiOrigin: COMMENT_API_ORIGIN,
    fetcher: (url, options) => fetcher(url, {
     ...options, referrerPolicy: 'no-referrer', ...(bootstrap ? { signal: controller.signal } : {})
    })
   });
   let first = await client.publicRows();
   if (!Array.isArray(first) || controller.signal.aborted || !current()) return null;
   const reused = { ...client, publicRows: () => {
    if (first === null) return client.publicRows();
    const rows = first; first = null; return Promise.resolve(rows);
   }};
   const ui = mount({ root, client: reused, doc });
   await ui.refresh();
   if (controller.signal.aborted || !current()) return null;
   slot.append(root);
   slot.hidden = false;
   return ui;
  };
  const stop = new Promise(resolve => {
   timer = setTimeout(() => { controller.abort(); resolve(null); }, timeoutMs);
  });
  return await Promise.race([work(), stop]);
 } catch {
  return null;
 } finally {
  clearTimeout(timer);
  bootstrap = false;
  controller.abort();
  inFlight.delete(slot);
 }
}
