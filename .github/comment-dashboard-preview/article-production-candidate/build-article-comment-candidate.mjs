// REVIEW ONLY. No upload or mutations to the canonical integrated Pages copy.
import { readFile, writeFile, mkdir, realpath, readdir } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { ARTICLE_PATH, SITE_ORIGIN } from './article-production-mount.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const prefix = '/assets/js/article-comments/';
const marker = 'data-article-comments-slot';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const list = (values, label) => {
 if (!Array.isArray(values) || values.some(v => typeof v !== 'string' || !v.startsWith('/') || v.startsWith('//')
     || v.includes('..') || /[%?#\\\s]/.test(v)) || new Set(values).size !== values.length)
   throw Error('Invalid or duplicate ' + label);
 return values;
};
export function computeScope({ manifest, sitemap, unpublished }) {
 const registered = new Set(list(manifest, 'manifest paths'));
 const offline = new Set(list(unpublished, 'unpublished paths'));
 const listed = list(sitemap, 'sitemap paths').filter(path => ARTICLE_PATH.test(path));
 for (const path of listed) {
  if (!registered.has(path) || offline.has(path)) throw Error('Publication registries disagree for ' + path);
 }
 return listed.sort();
}
export function overlayArticle(html, injection) {
 if (html.includes(marker) || html.includes(prefix)) throw Error('Comments markup already present');
 const footers = [...html.matchAll(/<footer\b[^>]*\bclass=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>/gi)];
 if (footers.length !== 1) throw Error('Expected exactly one shared footer');
 const index = footers[0].index;
 return html.slice(0,index) + injection + html.slice(index);
}
const json = async p => JSON.parse(await readFile(p,'utf8'));
export async function assemble({ site, manifestPath, configPath, out }) {
 site = await realpath(site);
 out = resolve(out);
 if (out === site || out.startsWith(site + sep) || site.startsWith(out + sep)) throw Error('Use independent output directory');
 const config = await json(configPath);
 if (!config || typeof config !== 'object' || typeof config.enabled !== 'boolean' ||
     Object.keys(config).sort().join(',') !== 'enabled,paths') throw Error('Explicit typed rollout config required');
 const paths = list(config.paths, 'pilot paths');
 if (!config.enabled && paths.length) throw Error('Disabled candidate must not stage article or assets');
 if (config.enabled && !paths.length) throw Error('Enabled candidate requires nonempty explicit path allowlist');

 const manifest = (await json(manifestPath)).pages;
 const unpublished = (await json(resolve(site,'assets/data/site-health-unpublished.json'))).unpublished;
 if (!Array.isArray(manifest) || !Array.isArray(unpublished) || manifest.some(p => typeof p?.output !== 'string')
     || unpublished.some(p => typeof p?.path !== 'string')) throw Error('Missing publication registries');
 const sitemap = (await readFile(resolve(site,'sitemap.xml'),'utf8'));
 const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(([,loc]) => {
  const url = new URL(loc);
  if (url.origin !== SITE_ORIGIN || url.username || url.password || url.search || url.hash || url.href !== loc)
   throw Error('Noncanonical sitemap location: ' + loc);
  return url.pathname;
 });
 const scope = computeScope({ manifest: manifest.map(p=>'/'+p.output), unpublished: unpublished.map(p=>'/'+p.path), sitemap: locs });
 if (!scope.length || paths.some(path => !scope.includes(path))) throw Error('Out of Japanese published article scope');

 const pending = [];
 if (paths.length) {
  const markup = (await readFile(resolve(here,'article-template.html'),'utf8')).trim();
  if (!markup.startsWith('<section data-comments ') || !markup.endsWith('</section>')) throw Error('Invalid article template');
  const injection = '<link rel="stylesheet" href="'+prefix+'article-comments.css">\n'
   + '<div hidden '+marker+'><template data-article-comments-template>'+markup+'</template></div>\n'
   + '<script type="module" src="'+prefix+'entry.mjs"></script>\n';
  for (const path of paths.sort()) {
   const origin = resolve(site,'.'+path);
   if (await realpath(origin) !== origin) throw Error('Symlink or noncanonical article: '+path);
   const current = await readFile(origin,'utf8');
   const canonical = [...current.matchAll(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"]+)["'][^>]*>/gi)];
   if (canonical.length !== 1 || canonical[0][1] !== SITE_ORIGIN + path
       || !/<html\b[^>]*\blang=["']ja["']/i.test(current)
       || /<meta\b[^>]*noindex|data-review-only|data-preview-isolation/i.test(current))
     throw Error('Not a published canonical Japanese HTML article: '+path);
   const candidate=overlayArticle(current,injection);
   if(candidate.replace(injection,'')!==current) throw Error('Source preservation check: '+path);
   pending.push({path, candidate, originalSha:sha(current), candidateSha:sha(candidate)});
  }
 }
 await mkdir(out);
 for (const item of pending) {
  const dest = resolve(out,'.'+item.path);
  await mkdir(dirname(dest),{recursive:true});await writeFile(dest,item.candidate,{flag:'wx'});
 }
 if (pending.length) {
  const dir=resolve(out,'.'+prefix);
  await mkdir(dir,{recursive:true});
  for (const path of ['article-client.mjs','article-production-mount.mjs','article-comments.css'])
   await writeFile(resolve(dir,path),await readFile(resolve(here,path)),{flag:'wx'});
  await writeFile(resolve(dir,'entry.mjs'), 'import {attachProductionArticleComments} from "./article-production-mount.mjs";\n'
   + 'void attachProductionArticleComments({enabled:true,allowedPaths:new Set('+JSON.stringify(paths)+')});\n',{flag:'wx'});
 }
 const report = { reviewOnly:true, activationConfigEnabled:config.enabled, stagedArticles:pending.length,
  eligibleCount:scope.length, sourceMutated:false,
  pages:pending.map(({candidate,...row})=>row) };
 await writeFile(resolve(out,'review-report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 return report;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const [site, manifestPath, configPath, out] = process.argv.slice(2);
 if (!site || !manifestPath || !configPath || !out) throw Error('Provide final Pages copy, shell manifest, rollout config, new review folder');
 console.log(await assemble({site,manifestPath,configPath,out}));
}
