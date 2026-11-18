// Diagnostic only. Never use these values to crop images or accept a difference.
// Playwright 1.55.0: packages/playwright-core/src/server/helper.ts,
// Helper.enclosingIntRect; screenshotter.ts adds scroll offset first.
// https://github.com/microsoft/playwright/blob/v1.55.0/packages/playwright-core/src/server/helper.ts
export function playwright155EnclosingRect(rect) {
  const x = Math.floor(rect.x + 1e-3);
  const y = Math.floor(rect.y + 1e-3);
  const x2 = Math.ceil(rect.x + rect.width - 1e-3);
  const y2 = Math.ceil(rect.y + rect.height - 1e-3);
  return { x, y, width: x2 - x, height: y2 - y };
}

export async function collectShellGeometry(page, selector) {
  try {
    const measured = await page.locator(selector).evaluate(element => {
      const rect = node => {
        const r = node.getBoundingClientRect();
        return { x:r.x, y:r.y, width:r.width, height:r.height, top:r.top, right:r.right, bottom:r.bottom, left:r.left };
      };
      const box = node => {
        const s = getComputedStyle(node);
        return {
          tag:node.tagName, className:node.className, rect:rect(node),
          style:Object.fromEntries(['display','boxSizing','fontFamily','fontSize','fontWeight','lineHeight','marginTop','marginBottom','paddingTop','paddingBottom','borderTopWidth','borderBottomWidth','height','transform'].map(key => [key,s[key]]))
        };
      };
      return {
        rect:rect(element), scroll:{x:window.scrollX,y:window.scrollY},
        viewport:{width:window.innerWidth,height:window.innerHeight,devicePixelRatio:window.devicePixelRatio,clientWidth:document.documentElement.clientWidth,clientHeight:document.documentElement.clientHeight},
        visualViewport:window.visualViewport ? {width:window.visualViewport.width,height:window.visualViewport.height,offsetLeft:window.visualViewport.offsetLeft,offsetTop:window.visualViewport.offsetTop,scale:window.visualViewport.scale} : null,
        document:{scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,bodyScrollHeight:document.body.scrollHeight,fontsStatus:document.fonts.status,pendingImages:[...document.images].filter(image => !image.complete).length},
        boxes:[element,...element.querySelectorAll(':scope > *, :scope > .container > p')].map(box)
      };
    });
    const {rect,scroll} = measured;
    if (![rect.x,rect.y,rect.width,rect.height,scroll.x,scroll.y].every(Number.isFinite)) throw Error('Non-finite geometry');
    const documentRect = {x:rect.x+scroll.x,y:rect.y+scroll.y,width:rect.width,height:rect.height};
    return {status:'measured',...measured,documentRect,predictedPlaywright155Clip:playwright155EnclosingRect(documentRect)};
  } catch (error) {
    // A diagnostic failure is recorded, not converted into a pass or a new test failure.
    return {status:'unavailable',error:String(error.message || error)};
  }
}
