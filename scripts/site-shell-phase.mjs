// Capture-only pixel phase stabilization. Production DOM and CSS are never changed.
// The original screenshots and read-only diagnostics remain separate evidence.
export async function shellContract(page, selector) {
  return page.locator(selector).evaluate(root => {
    const r = root.getBoundingClientRect();
    const rect = e => { const b=e.getBoundingClientRect(); return {x:b.x-r.x,y:b.y-r.y,width:b.width,height:b.height}; };
    const style = (e,pseudo) => { const s=getComputedStyle(e,pseudo); return Object.fromEntries([...s].map(k=>[k,s.getPropertyValue(k).replaceAll(location.origin,'http://visual-origin.invalid')])); };
    const siblingGap=direction=>{let e=root[direction];while(e){const b=e.getBoundingClientRect();if(b.width&&b.height)return direction==='previousElementSibling'?r.top-b.bottom:b.top-r.bottom;e=e[direction];}return null;};
    const ancestors=[];for(let e=root.parentElement;e;e=e.parentElement){const styles=style(e);for(const k of ['height','block-size','transform-origin','perspective-origin'])delete styles[k];ancestors.push({tag:e.tagName,styles});}
    return {html:root.outerHTML, x:r.x,width:r.width,height:r.height,previousGap:siblingGap('previousElementSibling'),nextGap:siblingGap('nextElementSibling'),ancestors,
      nodes:[root,...root.querySelectorAll('*')].map(e=>({tag:e.tagName,rect:rect(e),style:style(e),before:style(e,'::before'),after:style(e,'::after'),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight}))};
  });
}

// Eligibility is deliberately fail-closed. External paint must not disappear
// from the capture when its origin shifts. Pointer events do not determine
// painted visibility; computed geometry and paint bounds are checked below.
export async function assertIndependentFooter(page, selector='footer.site-footer') {
  const evidence=await page.locator(selector).evaluate(root => {
    const issues=[],boundedPseudos=[],flowShadows=[];
    const label=e=>`${e.tagName.toLowerCase()}${e.id?'#'+e.id:''}${[...e.classList].map(c=>'.'+c).join('')}`;
    const original=root.getBoundingClientRect();
    // Check the union of the original and exact subpixel-shifted paint region.
    const documentY=original.y+scrollY, dy=Math.ceil(documentY)-documentY;
    const area={left:original.left, right:original.right, top:original.top+Math.min(0,dy), bottom:original.bottom+Math.max(0,dy)};
    const intersects=r=>r.left<area.right && r.right>area.left && r.top<area.bottom && r.bottom>area.top;
    const hasTransform=s=>s.transform!=='none' || (s.translate && s.translate!=='none') || (s.rotate && s.rotate!=='none') || (s.scale && s.scale!=='none');
    const normalFlow=e=>{
      for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(!['static','relative','sticky'].includes(s.position)||hasTransform(s)||s.perspective!=='none')return false;}
      return true;
    };
    const visible=(e,s=getComputedStyle(e))=>{
      if(s.display==='none'||s.visibility!=='visible'||Number(s.opacity)===0)return false;
      for(let p=e.parentElement;p;p=p.parentElement)if(Number(getComputedStyle(p).opacity)===0 || getComputedStyle(p).display==='none')return false;
      return true;
    };
    for(let e=root.parentElement;e;e=e.parentElement){
      const s=getComputedStyle(e);
      if(hasTransform(s)||s.filter!=='none'||s.perspective!=='none'||s.clipPath!=='none'||s.maskImage!=='none'||(s.backdropFilter&&s.backdropFilter!=='none')||(e!==document.body&&e!==document.documentElement&&[s.overflowX,s.overflowY].some(x=>['hidden','clip','auto','scroll'].includes(x))))issues.push({kind:'ancestor-paint-or-clip',element:label(e)});
    }
    if(root.querySelector('canvas,video,iframe,object,embed,svg'))issues.push({kind:'unsupported-dynamic-footer-paint',element:label(root)});
    if(hasTransform(getComputedStyle(root)))issues.push({kind:'existing-footer-transform',element:label(root)});
    for(const e of [root,...root.querySelectorAll('*')]) {
      const s=getComputedStyle(e);
      for(const pseudo of ['::before','::after']) {
        const ps=getComputedStyle(e,pseudo);
        if(!['none','normal'].includes(ps.content) && ['fixed','absolute'].includes(ps.position) && ps.display!=='none') issues.push({kind:'positioned-footer-pseudo',element:label(e),pseudo});
      }
      // Out-of-flow and independently stacked descendants are not proven to
      // preserve their paint relationship under a layout-origin adjustment.
      if(e!==root && (['fixed','absolute'].includes(s.position)||s.zIndex!=='auto'))issues.push({kind:'positioned-footer-descendant',element:label(e)});
    }
    // A generated pseudo element has no reliable element rectangle API. It is
    // eligible only when an unchanged clipping ancestor proves that it cannot
    // paint in the footer's capture region; guessing offsets is not sufficient.
    const clippedAway=(e,pseudoStyle)=>{
      if(pseudoStyle.position==='fixed')return false;
      let containingBlock=pseudoStyle.position!=='absolute';
      for(let p=e;p;p=p.parentElement){
        const s=getComputedStyle(p);
        if(s.position!=='static'||hasTransform(s))containingBlock=true;
        if(containingBlock && ['hidden','clip','scroll','auto'].includes(s.overflowX) && ['hidden','clip','scroll','auto'].includes(s.overflowY) && !(parseFloat(s.overflowClipMargin)||0) && !intersects(p.getBoundingClientRect()))return true;
      }
      return false;
    };
    // Empty, absolutely positioned decoration only. Unlike a z-index claim,
    // these bounds prove that even the union of both capture regions is untouched.
    // Unsupported geometry/paint is unknown, never assumed to be zero.
    const boundedPseudoAway=(e,ps,pseudo)=>{
      if(!(e instanceof HTMLElement)||!['""',"''"].includes(ps.content)||ps.position!=='absolute'||ps.display!=='block')return false;
      const px=v=>/^[-+]?(?:\d*\.)?\d+px$/.test(v)?Number.parseFloat(v):null;
      const es=getComputedStyle(e);
      if(es.position==='static'||es.display==='inline'||e.getClientRects().length!==1||es.writingMode!=='horizontal-tb'||es.direction!=='ltr')return false;
      if(['scroll','auto'].includes(es.overflowX)||['scroll','auto'].includes(es.overflowY)||e.scrollLeft||e.scrollTop)return false;
      for(let p=e;p;p=p.parentElement){
        const st=getComputedStyle(p);
        if(hasTransform(st)||st.perspective!=='none'||(st.zoom&&Number(st.zoom)!==1)||st.offsetPath!=='none'||st.filter!=='none')return false;
      }
      if((ps.webkitBoxReflect&&ps.webkitBoxReflect!=='none')||ps.boxShadow!=='none'||ps.textShadow!=='none'||ps.filter!=='none'||(ps.backdropFilter&&ps.backdropFilter!=='none')||ps.borderImageSource!=='none'||ps.offsetPath!=='none')return false;
      if((ps.translate&&ps.translate!=='none')||(ps.rotate&&ps.rotate!=='none')||(ps.scale&&ps.scale!=='none')||ps.perspective!=='none')return false;
      if(ps.outlineStyle!=='none'&&px(ps.outlineWidth)!==0)return false;
      if(px(ps.webkitTextStrokeWidth)!==0)return false;
      const names=['width','height','paddingLeft','paddingRight','paddingTop','paddingBottom','borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth','marginLeft','marginRight','marginTop','marginBottom'];
      const v=Object.fromEntries(names.map(k=>[k,px(ps[k])]));
      if(Object.values(v).some(x=>x===null))return false;
      if(!['content-box','border-box'].includes(ps.boxSizing))return false;
      let width=v.width,height=v.height;
      if(ps.boxSizing==='content-box'){
        width+=v.paddingLeft+v.paddingRight+v.borderLeftWidth+v.borderRightWidth;
        height+=v.paddingTop+v.paddingBottom+v.borderTopWidth+v.borderBottomWidth;
      }
      // Border-box minimums can enlarge an explicitly undersized CSS box.
      width=Math.max(width,v.paddingLeft+v.paddingRight+v.borderLeftWidth+v.borderRightWidth);
      height=Math.max(height,v.paddingTop+v.paddingBottom+v.borderTopWidth+v.borderBottomWidth);
      if(width<0||height<0)return false;
      const borders=['borderLeftWidth','borderRightWidth','borderTopWidth','borderBottomWidth'].map(k=>px(es[k]));
      if(borders.some(x=>x===null))return false;
      const r=e.getBoundingClientRect();
      const cb={x:r.left+borders[0],y:r.top+borders[2],width:r.width-borders[0]-borders[1],height:r.height-borders[2]-borders[3]};
      const offset=(start,end,size,total,marginStart,marginEnd)=>{
        const a=px(start),b=px(end);
        if(a===null&&start!=='auto'||b===null&&end!=='auto')return null;
        if(a!==null&&b!==null&&Math.abs(a+marginStart+size+marginEnd+b-total)>1/64)return null;
        if(a!==null)return a+marginStart;
        if(b!==null)return total-b-marginEnd-size;
        return null; // static-position dependence is not an explicit bound
      };
      const x=offset(ps.left,ps.right,width,cb.width,v.marginLeft,v.marginRight);
      const y=offset(ps.top,ps.bottom,height,cb.height,v.marginTop,v.marginBottom);
      if(x===null||y===null)return false;
      const origin=ps.transformOrigin.split(/\s+/).map(px);
      if(origin.length<2||origin.length>3||origin.some(n=>n===null)||(origin.length===3&&origin[2]!==0))return false;
      if(!['border-box','view-box'].includes(ps.transformBox))return false;
      let matrix;
      try{matrix=new DOMMatrixReadOnly(ps.transform==='none'?undefined:ps.transform);}catch{return false;}
      if(!matrix.is2D)return false;
      const corners=[[0,0],[width,0],[width,height],[0,height]].map(([xx,yy])=>{
        const p=matrix.transformPoint({x:xx-origin[0],y:yy-origin[1]});
        return {x:cb.x+x+origin[0]+p.x,y:cb.y+y+origin[1]+p.y};
      });
      if(corners.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)))return false;
      // Raster AA may extend beyond the geometric edge. Keep a full CSS pixel
      // safety margin (DPR=1 in this verifier), not a permissive edge tolerance.
      const bound={left:Math.min(...corners.map(p=>p.x))-1,right:Math.max(...corners.map(p=>p.x))+1,top:Math.min(...corners.map(p=>p.y))-1,bottom:Math.max(...corners.map(p=>p.y))+1};
      if(intersects(bound))return false;
      boundedPseudos.push({element:label(e),pseudo,bound});
      return true;
    };
    // Conservative finite expansion for CSS shadows. Unknown paint syntax is
    // not treated as zero; it makes the capture ineligible.
    const shadowOutset=value=>{
      if(!value||value==='none')return 0;
      const cleaned=value.replace(/(?:rgba?|hsla?|color)\([^)]*\)/g,'');
      let maximum=0;
      for(const shadow of cleaned.split(',')){
        const terms=shadow.trim().split(/\s+/).filter(Boolean);
        if(terms.includes('inset'))continue;
        const nums=terms.map(t=>/^[-+]?(?:\d*\.)?\d+px$/.test(t)?Number.parseFloat(t):NaN);
        if(nums.length<2||nums.some(n=>!Number.isFinite(n)))return null;
        maximum=Math.max(maximum,Math.abs(nums[0])+Math.abs(nums[1])+3*Math.max(0,nums[2]||0)+Math.abs(nums[3]||0));
      }
      return maximum;
    };
    let externalElements=0;
    for(const e of document.querySelectorAll('*')) {
      if(root.contains(e))continue;
      const s=getComputedStyle(e);
      // A hidden host may have a visibility:visible pseudo or descendant.
      if(s.display==='none'||Number(s.opacity)===0)continue;
      const ancestor=e.contains(root);
      for(const pseudo of ['::before','::after']){
        const ps=getComputedStyle(e,pseudo);
        if(!['none','normal'].includes(ps.content)&&ps.display!=='none'&&ps.visibility==='visible'&&Number(ps.opacity)!==0&&!clippedAway(e,ps)&&!boundedPseudoAway(e,ps,pseudo)) {
          issues.push({kind:'unbounded-external-pseudo',element:label(e),pseudo});
        }
      }
      if(!visible(e,s))continue;
      if(s.webkitBoxReflect&&s.webkitBoxReflect!=='none')issues.push({kind:'external-reflection',element:label(e)});
      const letter=getComputedStyle(e,'::first-letter'),marker=getComputedStyle(e,'::marker');
      if(['fontSize','fontFamily','fontWeight','fontStyle','textShadow'].some(k=>letter[k]!==s[k])||!['normal','none'].includes(marker.content))issues.push({kind:'unsupported-external-text-pseudo',element:label(e)});
      for(const node of e.childNodes){
        if(node.nodeType!==Node.TEXT_NODE||!node.textContent.trim())continue;
        const range=document.createRange();range.selectNodeContents(node);
        const inkMargin=2*(parseFloat(s.fontSize)||16);
        for(const r of range.getClientRects())if(intersects({left:r.left-inkMargin,right:r.right+inkMargin,top:r.top-inkMargin,bottom:r.bottom+inkMargin}))issues.push({kind:'external-text-paint-near-footer',element:label(e)});
      }
      if(ancestor)continue;
      externalElements++;
      const box=shadowOutset(s.boxShadow),text=shadowOutset(s.textShadow);
      if(box===null||text===null||s.filter!=='none'||(s.backdropFilter&&s.backdropFilter!=='none')||(e instanceof SVGElement && s.stroke!=='none' && Number(s.strokeOpacity)!==0)) {
        issues.push({kind:'unbounded-external-paint',element:label(e)});continue;
      }
      const outline=s.outlineStyle==='none'?0:Math.max(0,parseFloat(s.outlineWidth)||0)+Math.max(0,parseFloat(s.outlineOffset)||0);
      const outset=Math.max(box,text,outline,parseFloat(s.webkitTextStrokeWidth)||0);
      for(const r of e.getClientRects()) {
        if(intersects({left:r.left-outset,right:r.right+outset,top:r.top-outset,bottom:r.bottom+outset})) {
          // A flow/sticky card's static box shadow is NOT masked or ignored.
          // Its owner and every flow/sticky ancestor must translate by the exact
          // permitted dy, with unchanged styles/sizes, in verifyScene below.
          // Only shadow overlap is eligible; its real border box must be outside.
          const shadowOnly=!intersects(r)&&box>0&&text===0&&outline===0&&!(parseFloat(s.webkitTextStrokeWidth)||0)&&e instanceof HTMLElement&&normalFlow(e);
          if(shadowOnly)flowShadows.push({element:label(e),boxShadow:s.boxShadow,borderRadius:s.borderRadius,width:r.width,relativeLeft:r.left-original.left,bottomGap:original.top-r.bottom,rect:{x:r.x,y:r.y,width:r.width,height:r.height}});
          else issues.push({kind:'external-paint-overlap',element:label(e)});
          break;
        }
      }
    }
    return {eligible:issues.length===0,externalElements,boundedPseudos,flowShadows,issues};
  });
  if(!evidence.eligible)throw Error(`Footer phase capture ineligible: ${JSON.stringify(evidence.issues)}`);
  return evidence;
}

async function snapshotScene(page) {
  return page.evaluateHandle(()=>[...document.querySelectorAll('*')].map(element=>{
    const s=getComputedStyle(element),r=element.getBoundingClientRect();
    let normalFlow=true;for(let p=element;p;p=p.parentElement){const st=getComputedStyle(p);if(!['static','relative','sticky'].includes(st.position)||st.transform!=='none'||st.perspective!=='none'||(st.translate&&st.translate!=='none')||(st.rotate&&st.rotate!=='none')||(st.scale&&st.scale!=='none'))normalFlow=false;}
    return {element,normalFlow,text:element.textContent,style:Object.fromEntries([...s].map(k=>[k,s.getPropertyValue(k)])),rect:{x:r.x+scrollX,y:r.y+scrollY,vx:r.x,vy:r.y,width:r.width,height:r.height},hasBox:element.getClientRects().length>0};
  }));
}
async function verifyScene(page,scene,dy) {
  return page.evaluate(({scene,dy})=>{
    const near=(a,b)=>Math.abs(a-b)<1e-6,issues=[];
    if(document.querySelectorAll('*').length!==scene.length)return ['DOM inventory changed'];
    for(const old of scene){
      const e=old.element;if(!e.isConnected){issues.push('Element removed');continue;}
      if(e.textContent!==old.text)issues.push(e.tagName+' text changed');
      const s=getComputedStyle(e),now=Object.fromEntries([...s].map(k=>[k,s.getPropertyValue(k)])),prior={...old.style};
      const ancestor=e===document.body||e===document.documentElement;
      if(ancestor)for(const k of ['height','block-size','transform-origin','perspective-origin']){delete now[k];delete prior[k];}
      if(e===document.body)for(const k of ['padding-top','padding-block-start']){delete now[k];delete prior[k];}
      if(JSON.stringify(now)!==JSON.stringify(prior))issues.push(e.tagName+' computed styles changed');
      if(!old.hasBox)continue;
      const r=e.getBoundingClientRect(),a=old.rect;
      if(!near(r.width,a.width)||!(near(r.height,a.height)||(ancestor&&near(r.height,a.height+dy))))issues.push(e.tagName+' size changed');
      if(!near(r.x+scrollX,a.x))issues.push(e.tagName+' horizontal position changed');
      const moved=near(r.y+scrollY,a.y+dy),stationary=near(r.y+scrollY,a.y)||near(r.y,a.vy);
      if(old.normalFlow&&!ancestor&&!moved)issues.push(e.tagName+' normal flow did not move by exact dy');
      if(!moved&&!stationary)issues.push(e.tagName+' did not translate rigidly');
    }
    return issues.slice(0,20);
  },{scene,dy});
}

export async function capturePhaseStableFooter(page, options={}) {
  const selector='footer.site-footer';
  const locator=page.locator(selector);
  if(await locator.count()!==1) throw Error('Expected exactly one footer');
  const eligibility=await assertIndependentFooter(page,selector);
  const original=await shellContract(page,selector);
  const scene=await snapshotScene(page);
  // Adjust layout BEFORE rasterization, not a compositor transform of an
  // already rasterized footer. The original page source is restored afterward.
  // No diagnostic crop values or post-processing of images is used.
  const saved=await locator.evaluate(e=>{
    const body=document.body, bs=getComputedStyle(body);
    if(bs.display!=='block'||bs.writingMode!=='horizontal-tb'||bs.transform!=='none'||bs.position!=='static')throw Error('Footer phase capture ineligible: unsupported body layout');
    const style=body.getAttribute('style');
    const r=e.getBoundingClientRect(), y=r.y+scrollY,dy=Math.ceil(y)-y;
    const padding=Number.parseFloat(bs.paddingTop);
    if(!Number.isFinite(padding))throw Error('Footer phase capture ineligible: invalid body padding');
    body.style.setProperty('padding-top',`${padding+dy}px`,'important');
    return {style,dy,y};
  });
  let bytes,failure;
  try {
    const sceneIssues=await verifyScene(page,scene,saved.dy);
    if(sceneIssues.length)throw Error('Page paint changed: '+sceneIssues.join('; '));
    eligibility.after=await assertIndependentFooter(page,selector);
    eligibility.flowShadowProof='all-normal-flow-elements-exact-dy-and-styles-sizes-unchanged';
    const shifted=await shellContract(page,selector);
    if(shifted.html!==original.html)throw Error('Footer DOM changed during capture');
    if(shifted.width!==original.width||shifted.height!==original.height||JSON.stringify(shifted.nodes.map(n=>n.rect))!==JSON.stringify(original.nodes.map(n=>n.rect)))throw Error('Phase stabilization changed footer layout');
    for(let i=0;i<original.nodes.length;i++)for(const kind of ['style','before','after']){
      const a={...original.nodes[i][kind]},b={...shifted.nodes[i][kind]};
      if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Phase stabilization changed footer computed styles');
    }
    if(shifted.previousGap!==original.previousGap||shifted.nextGap!==original.nextGap)throw Error('Footer outside spacing changed');
    for(let i=0;i<original.ancestors.length;i++){
      const a={...original.ancestors[i].styles},b={...shifted.ancestors[i].styles};
      if(original.ancestors[i].tag==='BODY')for(const k of ['padding-top','padding-block-start']){delete a[k];delete b[k];}
      if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Ancestor paint changed');
    }
    const documentY=await locator.evaluate(e=>e.getBoundingClientRect().y+scrollY);
    if(Math.abs(documentY-saved.y-saved.dy)>1e-6)throw Error('Footer moved by more than the phase adjustment');
    if(Math.abs(documentY-Math.round(documentY))>1e-6)throw Error('Footer phase did not stabilize to integer origin');
    bytes=await locator.screenshot({...options,animations:'disabled'});
  } catch(error) {
    failure=error;
  } finally {
    await page.evaluate(s=>{if(s===null)document.body.removeAttribute('style');else document.body.setAttribute('style',s);},saved.style);
  }
  const restoredSceneIssues=await verifyScene(page,scene,0);
  await scene.dispose();
  if(restoredSceneIssues.length)throw Error('Scene restoration failed: '+restoredSceneIssues.join('; '));
  const restored=await shellContract(page,selector);
  if(JSON.stringify(original)!==JSON.stringify(restored)) throw Error('Footer capture changed original contract');
  if(failure)throw Error('Footer phase capture ineligible: '+failure.message);
  return {bytes,contract:{...original,flowShadows:eligibility.flowShadows.map(({rect,...paint})=>paint)},translationY:saved.dy,eligibility};
}
