import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {root} from './build-site-shells.mjs';
const out=resolve(process.argv[2]||'../integration-build'),site=out+'-publication-fixture',ledger=JSON.parse(await readFile(resolve(out,'coverage-ledger.json'),'utf8'));
for(const path of [...ledger.pages.map(p=>p.path),'assets/js/article-feedback.js']){await mkdir(dirname(resolve(site,path)),{recursive:true});await copyFile(resolve(root,path),resolve(site,path));}
const run=(build,destination)=>spawnSync(process.execPath,['scripts/prepare-integrated-publication.mjs',build,destination],{cwd:root,encoding:'utf8'});
const good=run(out,site);if(good.status!==0)throw Error(good.stderr);
const config=JSON.parse(await readFile(resolve(root,'.github/article-components/integration.json'),'utf8'));
for(const path of [...config.targets,'services/gxworks2-online-support.html'])if(!(await readFile(resolve(site,path))).equals(await readFile(resolve(out,'candidate',path))))throw Error('Published HTML differs from reviewed candidate');
const bad=resolve(out,'publication-rejection-fixture'),first=config.targets[0];await mkdir(dirname(resolve(bad,'candidate',first)),{recursive:true});
await copyFile(resolve(out,'review',first),resolve(bad,'candidate',first));
const rejected=run(bad,site);if(rejected.status===0||!rejected.stderr.includes('Review isolation leaked'))throw Error('Isolated review HTML was not explicitly rejected');
const sourceRejected=run(out,root);if(sourceRejected.status===0)throw Error('Source tree accepted as publish destination');
for(const path of config.targets)if(!(await readFile(resolve(site,path))).equals(await readFile(resolve(out,'candidate',path))))throw Error('Rejected input modified the published candidate');
await writeFile(resolve(out,'publication-boundary-checks.json'),JSON.stringify({status:'passed',exactCandidateArticles:config.targets.length,serviceByteIdentical:true,reviewInjectionRejected:true,sourceOverwriteRejected:true,rejectionLeftOutputUnchanged:true},null,2));
console.log(JSON.stringify({publicationBoundary:'passed',articles:config.targets.length,reviewInjectionRejected:true,sourceOverwriteRejected:true}));
