export async function checkHeroCta(page, link, expectedDestination) {
  const expectedUrl = await link.evaluate(anchor => anchor.href);
  await link.click();
  try {
    await page.waitForURL(url => url.href === expectedUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 5000,
    });
  } catch (error) {
    throw new Error(`CTA navigation incomplete: expected ${expectedUrl}, observed ${page.url()}`, {cause: error});
  }

  const state = await page.evaluate(() => ({
    hash: location.hash,
    destination: (location.pathname + location.hash).replace(/^\/(before|after)\//, '/'),
    targetExists: location.hash
      ? !!document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : !!document.querySelector('h1'),
  }));
  if (!state.targetExists || state.destination !== expectedDestination) {
    throw new Error(`CTA target differs: expected ${expectedDestination}, observed ${state.destination}, target exists: ${state.targetExists}`);
  }
  return state;
}
