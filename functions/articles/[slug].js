// Preview-only: return HTTP 404 for the three paused PLC design articles.
// Match the actual .html request path; preserve all other article routes.
const paused = new Set([
  'plc-drilling-line-design-project-01.html',
  'plc-drilling-line-design-project-02.html',
  'plc-drilling-line-design-project-03.html',
]);

export async function onRequest(context) {
  if (paused.has(context.params.slug)) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-robots-tag': 'noindex',
      },
    });
  }
  return context.next();
}
