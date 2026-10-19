// Preview-only: return actual 404 for the three paused PLC design articles.
// All other article routes retain their normal static behavior.
const paused = new Set([
  'plc-drilling-line-design-project-01',
  'plc-drilling-line-design-project-02',
  'plc-drilling-line-design-project-03',
]);
export async function onRequest(context) {
  if (paused.has(context.params.slug)) {
    return new Response('Not Found', {
      status: 404,
      headers: {'content-type':'text/plain; charset=utf-8', 'x-robots-tag':'noindex'},
    });
  }
  return context.next();
}
