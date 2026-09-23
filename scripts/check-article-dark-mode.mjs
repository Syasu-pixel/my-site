import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const build=resolve(process.argv[2]||'../integration-build');
const shardCount=Number(process.env.REVIEW_SHARD_COUNT||1);
const shardIndex=Number(process.env.REVIEW_SHARD_INDEX||0);
if(!Number.isInteger(shardCount)||shardCount<1||!Number.isInteger(shardIndex)||shardIndex<0||shardIndex>=shardCount)throw Error('Invalid shard');

const config=JSON.parse(await readFile('.github/article-components/integration.json','utf8'));
const targets=(config.targets||config.representatives).filter((p,i)=>i%shardCount===shardIndex);
const evidence=resolve(build,'evidence-shard-'+shardIndex);
await mkdir(evidence,{recursive:true});

const origin='http://127.0.0.1:'+(process.env.REVIEW_PORT||8768);
const browser=await chromium.launch({headless:true});
const results=[],failures=[];
const widths=[390,1440];

async function makeContext(width){
  const context=await browser.newContext({
    viewport:{width,height:width<700?844:1000},
    locale:'ja-JP',
    timezoneId:'Asia/Tokyo',
    reducedMotion:'reduce',
    colorScheme:'dark',
    serviceWorkers:'block'
  });
  await context.route('**/*',route=>{
    const url=route.request().url();
    return url.startsWith(origin+'/')||url.startsWith('data:')?route.continue():route.abort();
  });
  return context;
}

try{
  for(const path of targets)for(const width of widths){
    const context=await makeContext(width),page=await context.newPage();
    try{
      await page.goto(origin+'/'+path,{waitUntil:'networkidle'});
      await page.evaluate(async()=>{
        await document.fonts.ready;
        for(const image of document.images)image.loading='eager';
        await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
      });
      await page.waitForFunction(()=>document.documentElement.dataset.dcTheme==='dark');

      const audit=await page.evaluate(()=>{
        const parse=value=>{
          const match=value.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)/i);
          return match?{r:+match[1],g:+match[2],b:+match[3],a:match[4]===undefined?1:+match[4]}:null;
        };
        const channel=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
        const luminance=rgb=>.2126*channel(rgb.r)+.7152*channel(rgb.g)+.0722*channel(rgb.b);
        const contrast=(a,b)=>{const hi=Math.max(a,b),lo=Math.min(a,b);return(hi+.05)/(lo+.05)};
        const visible=element=>{
          const style=getComputedStyle(element),box=element.getBoundingClientRect();
          return box.width>0&&box.height>0&&style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)>0.02;
        };
        const signature=element=>{
          const id=element.id?'#'+element.id:'';
          const classes=[...element.classList].slice(0,3).map(name=>'.'+name).join('');
          return element.tagName.toLowerCase()+id+classes;
        };
        const mediaContainer=element=>element.matches('img,picture,svg,video,canvas')||element.closest('.article-hero,.hero-visual');
        const surfaces=[];
        for(const element of document.querySelectorAll('body *')){
          if(!visible(element)||mediaContainer(element))continue;
          const style=getComputedStyle(element),box=element.getBoundingClientRect();
          if(box.width*box.height<900)continue;
          const bg=parse(style.backgroundColor);
          const brightColor=bg&&bg.a>=.82&&luminance(bg)>.78;
          const brightGradient=style.backgroundImage!=='none'&&/(?:rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255|#fff(?:fff)?\b)/i.test(style.backgroundImage);
          if(brightColor||brightGradient)surfaces.push({
            selector:signature(element),
            background:style.backgroundColor,
            backgroundImage:style.backgroundImage==='none'?'none':style.backgroundImage.slice(0,180),
            area:Math.round(box.width*box.height)
          });
        }

        const textFindings=[];
        const textSelector='p,li,span,a,strong,small,h1,h2,h3,h4,h5,h6,td,th,label,figcaption,button';
        for(const element of document.querySelectorAll(textSelector)){
          if(!visible(element))continue;
          const directText=[...element.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
          if(!directText)continue;
          const style=getComputedStyle(element),fg=parse(style.color);
          if(!fg||fg.a<.6)continue;
          let node=element,bg=null,uncertain=false;
          while(node&&node!==document.documentElement){
            const current=getComputedStyle(node);
            if(current.backgroundImage!=='none')uncertain=true;
            const parsed=parse(current.backgroundColor);
            if(parsed&&parsed.a>=.82){bg=parsed;break}
            node=node.parentElement;
          }
          if(!bg||uncertain)continue;
          const ratio=contrast(luminance(fg),luminance(bg));
          if(ratio<2.8)textFindings.push({
            selector:signature(element),
            color:style.color,
            background:`rgb(${bg.r}, ${bg.g}, ${bg.b})`,
            contrast:Number(ratio.toFixed(2)),
            text:element.textContent.trim().replace(/\s+/g,' ').slice(0,80)
          });
        }

        const body=parse(getComputedStyle(document.body).backgroundColor);
        return {
          bodyLuminance:body?Number(luminance(body).toFixed(3)):null,
          brightSurfaces:[...new Map(surfaces.map(item=>[item.selector+'|'+item.background+'|'+item.backgroundImage,item])).values()].slice(0,40),
          lowContrastText:[...new Map(textFindings.map(item=>[item.selector+'|'+item.color+'|'+item.background,item])).values()].slice(0,40)
        };
      });

      const problems=[];
      if(audit.bodyLuminance===null||audit.bodyLuminance>.22)problems.push('Dark body background missing');
      if(audit.brightSurfaces.length)problems.push('Bright surfaces: '+audit.brightSurfaces.map(x=>x.selector).join(', '));
      if(audit.lowContrastText.length)problems.push('Low contrast text: '+audit.lowContrastText.map(x=>x.selector+'('+x.contrast+')').join(', '));

      if(problems.length){
        const key=path.replaceAll('/','__').replace('.html','')+'--'+width+'--dark-failure.png';
        await page.screenshot({path:resolve(evidence,key),fullPage:true,animations:'disabled'});
        failures.push({path,width,problems,...audit,screenshot:key});
        console.log('DARK FAIL',path,width,problems.join(' | '));
      }else{
        results.push({path,width,status:'passed',bodyLuminance:audit.bodyLuminance});
        console.log('DARK PASS',path,width);
      }
    }catch(error){
      failures.push({path,width,problems:[error.message]});
      console.log('DARK ERROR',path,width,error.message);
    }finally{
      await context.close();
    }
  }
}finally{
  await browser.close();
}

const report={shardIndex,shardCount,targets,widths,results,failures,productionPublished:false};
await writeFile(resolve(build,'article-dark-checks-shard-'+shardIndex+'.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({shardIndex,cases:results.length+failures.length,passed:results.length,failures:failures.length}));
if(failures.length)process.exitCode=1;
