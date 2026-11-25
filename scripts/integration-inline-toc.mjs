import assert from 'node:assert/strict';

const article = 'articles/pressure-switch-vs-gauge-basic.html';
export const usesInlineCompactToc = (path, compact) => path === article && compact === true;

export function verifyCompactTocState(s, expected) {
  assert(s.legacyHidden && s.dialogClosed, 'Inline TOC must replace legacy overlay');
  assert(s.staticDetails && s.detailsCount === 1 && s.summaryCount === 1 && s.summaryHeight >= 44, 'Inline TOC must be a single usable control in document flow');
  if (expected !== null) {
    assert(s.horizontalFit, 'Inline TOC details, summary and links must fit horizontally');
    assert.deepEqual(s.links, expected, 'Inline TOC anchors, order and labels must match the article contract');
  }
  return true;
}
export function verifyCompactDestination(s, keyboard) {
  assert(s.focus && s.clearance >= 15 && s.headingInViewport, 'Inline TOC destination must be focused below the header and visible in the viewport');
  assert(s.hashMatches, 'Inline TOC destination must retain the selected URL fragment');
  if (keyboard) assert(s.focusVisible && s.outline !== 'none' && s.outlineWidth >= 2, 'Inline keyboard destination focus must remain visible');
  else assert(!s.focusVisible && s.outline === 'none', 'Inline pointer destination must not draw a persistent focus outline');
  return true;
}

export async function checkInlineCompactToc(page, spec, capture) {
  const details = page.locator('main details.pressure-mobile-toc');
  const summary = details.locator('summary');
  const links = details.locator('nav a');
  const legacy = page.locator('.dc-toc-button');
  const legacyDialog = page.locator('#dc-toc-dialog');
  const inspect = async () => ({
    legacyHidden: await legacy.isHidden(),
    dialogClosed: await legacyDialog.evaluate(e => !e.open),
    staticDetails: await details.evaluate(e => getComputedStyle(e).position === 'static'),
    detailsCount: await details.count(),
    summaryCount: await summary.count(),
    summaryHeight: (await summary.boundingBox())?.height ?? 0,
    horizontalFit: await details.evaluate(e => [e, ...e.querySelectorAll('summary,nav,nav a')].filter(n => n.getBoundingClientRect().width > 0).every(n => {
      const a = n.getBoundingClientRect();
      return a.left >= -1 && a.right <= document.documentElement.clientWidth + 1 && n.scrollWidth <= n.clientWidth + 1;
    })),
    links: await links.evaluateAll(es => es.map(e => [e.getAttribute('href'), e.textContent.trim()])),
  });
  const expected = spec.tocReference.map(r => ['#' + r.id, r.label]);
  assert.equal(expected.length, 8, 'Reviewed article must retain its eight entries');
  const checkClosed = async () => {
    assert(await details.evaluate(e => !e.open), 'Inline TOC closed state');
    assert(await details.locator('nav').isHidden(), 'Inline TOC closed state must hide its navigation');
  };
  const checkOpen = async () => {
    assert(await details.evaluate(e => e.open), 'Inline TOC open state');
    assert(await details.locator('nav').isVisible(), 'Inline TOC open state must show its navigation');
    verifyCompactTocState(await inspect(), expected);
  };
  const inspectDestination = id => page.evaluate(id => {
    const t = document.getElementById(id), h = t?.querySelector('h2');
    const head = document.querySelector('header.site-header');
    const style = h && getComputedStyle(h);
    const r = h?.getBoundingClientRect();
    return {
      focus: document.activeElement === h,
      hashMatches: location.hash === '#' + id,
      headingInViewport: !!r && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight,
      clearance: h && head ? h.getBoundingClientRect().top - head.getBoundingClientRect().bottom : -Infinity,
      focusVisible: h?.matches(':focus-visible'),
      outline: style?.outlineStyle,
      outlineWidth: parseFloat(style?.outlineWidth || '0'),
    };
  }, id);

  verifyCompactTocState(await inspect(), null);
  await checkClosed();
  await summary.click(); await checkOpen();
  if (capture) await capture();
  await summary.click(); await checkClosed();
  await summary.press('Space'); await checkOpen();
  assert(await summary.evaluate(e => document.activeElement === e && e.matches(':focus-visible') && getComputedStyle(e).outlineStyle !== 'none'), 'Inline TOC keyboard summary focus');
  await summary.press('Space'); await checkClosed();

  await summary.click(); await checkOpen();
  const pointerId = spec.tocReference.find(r => r.id === 'flow')?.id;
  assert(pointerId, 'Inline TOC pressure example destination');
  await links.filter({hasText: spec.tocReference.find(r => r.id === pointerId).label}).click();
  verifyCompactDestination(await inspectDestination(pointerId), false);

  // The actual Tab traversal reaches the first link from the summary. Enter navigates
  // to the final link too, retaining the legacy gate's last-destination coverage.
  await summary.press('Tab');
  assert(await links.first().evaluate(e => document.activeElement === e && e.matches(':focus-visible')), 'Inline TOC first link keyboard reachability');
  for (let i = 1; i < expected.length; i++) await page.keyboard.press('Tab');
  const last = spec.tocReference.at(-1).id;
  assert(await links.last().evaluate(e => document.activeElement === e), 'Inline TOC last link keyboard reachability');
  await page.keyboard.press('Enter');
  verifyCompactDestination(await inspectDestination(last), true);
  verifyCompactTocState(await inspect(), expected);
}
