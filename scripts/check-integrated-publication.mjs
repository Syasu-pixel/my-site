import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {root} from './build-site-shells.mjs';
const out=resolve(process.argv[2]||'../integration-build'),site=out+'-publication-fixture',ledger=JSON.parse(await readFile(resolve(out,'coverage-ledger.json'),'utf8'));
const generated=spawnSync(process.execPath,['scripts/build-additional-shells.mjs',resolve(out,'additional-shells')],{cwd:root,encoding:'utf8'});if(generated.status!==0)throw Error(generated.stderr);
for(const path of [...ledger.pages.map(p=>p.path),'assets/js/article-feedback.js']){await mkdir(dirname(resolve(site,path)),{recursive:true});await copyFile(resolve(root,path),resolve(site,path));}
const run=(build,destination)=>spawnSync(process.execPath,['scripts/prepare-integrated-publication.mjs',build,destination],{cwd:root,encoding:'utf8'});
const good=run(out,site);if(good.status!==0)throw Error(good.stderr);
const config=JSON.parse(await readFile(resolve(root,'.github/article-components/integration.json'),'utf8'));
const additional=JSON.parse(await readFile(resolve(root,'.github/site-shells/additional/manifest.json'),'utf8')).pages.map(p=>p.path);
for(const path of [...config.targets,...additional])if(!(await readFile(resolve(site,path))).equals(await readFile(resolve(out,additional.includes(path)?'additional-shells/candidate':'candidate',path))))throw Error('Published HTML differs from reviewed candidate');
for(const row of ledger.pages.filter(p=>!config.targets.includes(p.path)&&!additional.includes(p.path)))if(!(await readFile(resolve(site,row.path))).equals(await readFile(resolve(root,row.path))))throw Error('Unrequested page changed');
const bad=resolve(out,'publication-rejection-fixture'),first=config.targets[0];await mkdir(dirname(resolve(bad,'candidate',first)),{recursive:true});
await mkdir(resolve(bad,'additional-shells'),{recursive:true});await copyFile(resolve(out,'additional-shells/preservation.json'),resolve(bad,'additional-shells/preservation.json'));
await copyFile(resolve(out,'review',first),resolve(bad,'candidate',first));
const rejected=run(bad,site);if(rejected.status===0||!rejected.stderr.includes('Review isolation leaked'))throw Error('Isolated review HTML was not explicitly rejected');
const sourceRejected=run(out,root);if(sourceRejected.status===0)throw Error('Source tree accepted as publish destination');
const additionalFirst=additional[0],additionalCandidate=resolve(out,'additional-shells/candidate',additionalFirst),approvedAdditional=await readFile(additionalCandidate);
try{await copyFile(resolve(out,'additional-shells/review',additionalFirst),additionalCandidate);const rejectedAdditional=run(out,site);if(rejectedAdditional.status===0||!rejectedAdditional.stderr.includes('Review isolation leaked'))throw Error('Additional review isolation accepted');}finally{await writeFile(additionalCandidate,approvedAdditional);}
for(const path of config.targets)if(!(await readFile(resolve(site,path))).equals(await readFile(resolve(out,'candidate',path))))throw Error('Rejected input modified the published candidate');
for(const path of additional)if(!(await readFile(resolve(site,path))).equals(await readFile(resolve(out,'additional-shells/candidate',path))))throw Error('Rejected input modified additional pages');
await writeFile(resolve(out,'publication-boundary-checks.json'),JSON.stringify({status:'passed',exactCandidateArticles:config.targets.length,additionalShellPages:additional.length,nonArticleUntouched:17,serviceNonShellBytesPreserved:true,reviewInjectionRejected:true,sourceOverwriteRejected:true,rejectionLeftOutputUnchanged:true},null,2));
console.log(JSON.stringify({publicationBoundary:'passed',articles:config.targets.length,additionalPages:additional.length,untouchedPages:17,reviewInjectionRejected:true,additionalReviewInjectionRejected:true,sourceOverwriteRejected:true}));
