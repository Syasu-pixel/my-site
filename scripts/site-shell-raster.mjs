// Execute comparable shell captures with one verified browser text-paint mode.
import { chromium } from 'playwright';
import os from 'node:os';
const rasterFlag='--disable-lcd-text';
const captureVersion=6;
const textRasterization='grayscale-lcd-disabled';

export function assertRasterArguments(actual) {
  if(!Array.isArray(actual)||actual.filter(arg=>arg===rasterFlag).length!==1||actual.includes('--enable-lcd-text')) {
    throw Error('Expected one unopposed Chromium LCD text disable flag');
  }
}
export async function launchShellCaptureBrowser() {
  const browser=await chromium.launch({headless:true,args:[rasterFlag]});
  try {
    const session=await browser.newBrowserCDPSession();
    try {assertRasterArguments((await session.send('Browser.getBrowserCommandLine')).arguments);}
    finally {await session.detach();}
    return browser;
  } catch(error) {await browser.close();throw error;}
}
export function shellCaptureEnvironment(browser,viewports) {
  return {browser:browser.version(),platform:os.platform(),arch:os.arch(),node:process.version,
    viewports,pixelThreshold:0.1,includeAntialiasing:false,captureVersion,parallelContexts:4,textRasterization};
}
export function assertCaptureBaselineMode(environment) {
  if(environment?.captureVersion!==captureVersion||environment?.textRasterization!==textRasterization) {
    throw Error('Baseline/candidate environments differ: unsupported shell raster capture provenance');
  }
}
export function assertCompatibleCaptureEnvironment(environment,baseline) {
  assertCaptureBaselineMode(baseline);
  if(JSON.stringify(environment)!==JSON.stringify(baseline))throw Error('Baseline/candidate environments differ');
}
