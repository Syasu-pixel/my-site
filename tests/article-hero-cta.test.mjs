import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from 'node:http';
import test from 'node:test';
import {chromium} from 'playwright';
import {checkHeroCta} from '../scripts/article-hero-cta.mjs';

test('Hero CTA waits for its destination and rejects invalid targets', async () => {
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    if (req.url === '/before/source.html') {
      res.end('<a href="#map">Map</a><a href="slow.html">Next</a><a href="#missing">Missing</a><a href="empty.html">Empty</a><h1 id="map">Map</h1>');
    } else if (req.url === '/before/slow.html') {
      res.write('<!doctype html><body>');
      setTimeout(() => res.end('<h1>Next article</h1>'), 200);
    } else {
      res.writeHead(404).end('<p>Page unavailable</p>');
    }
  }).listen(0, '127.0.0.1');
  let browser;
  try {
    await once(server, 'listening');
    const source = `http://127.0.0.1:${server.address().port}/before/source.html`;
    browser = await chromium.launch({
      executablePath: process.env.TEST_CHROMIUM_EXECUTABLE || undefined,
      args: ['--disable-gpu'],
    });
    const page = await browser.newPage();
    const link = name => page.getByRole('link', {name, exact: true});

    await page.goto(source);
    assert.equal((await checkHeroCta(page, link('Map'), '/source.html#map')).targetExists, true);
    assert.equal((await checkHeroCta(page, link('Next'), '/slow.html')).targetExists, true);

    await page.goto(source);
    await assert.rejects(checkHeroCta(page, link('Missing'), '/source.html#missing'), /target exists: false/);
    await assert.rejects(checkHeroCta(page, link('Next'), '/wrong.html'), /observed \/slow.html/);

    await page.goto(source);
    await assert.rejects(checkHeroCta(page, link('Empty'), '/empty.html'), /target exists: false/);
  } finally {
    try {
      await browser?.close();
    } finally {
      await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    }
  }
});
