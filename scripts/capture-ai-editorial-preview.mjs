import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const previewUrl = process.env.PREVIEW_URL;
const commandId = process.env.COMMAND_ID || 'unknown';
if (!previewUrl) throw new Error('PREVIEW_URL is required');

const outDir = path.resolve('preview-audit', commandId);
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const cases = [
    { name: 'desktop', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 },
    { name: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 },
  ];

  const metadata = {
    command_id: commandId,
    preview_url: previewUrl,
    captured_at: new Date().toISOString(),
    captures: [],
  };

  for (const c of cases) {
    const context = await browser.newContext({
      viewport: c.viewport,
      deviceScaleFactor: c.deviceScaleFactor,
      locale: 'ja-JP',
    });
    const page = await context.newPage();
    const response = await page.goto(previewUrl, { waitUntil: 'networkidle', timeout: 90_000 });
    if (!response || !response.ok()) {
      throw new Error(`${c.name}: Preview returned ${response?.status() ?? 'no response'}`);
    }
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    const file = path.join(outDir, `${c.name}-full.png`);
    await page.screenshot({ path: file, fullPage: true });

    const htmlFile = path.join(outDir, `${c.name}.html`);
    await fs.writeFile(htmlFile, await page.content(), 'utf8');

    metadata.captures.push({
      name: c.name,
      viewport: c.viewport,
      screenshot: `${c.name}-full.png`,
      html: `${c.name}.html`,
      title: await page.title(),
    });
    await context.close();
  }

  await fs.writeFile(path.join(outDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');
} finally {
  await browser.close();
}
