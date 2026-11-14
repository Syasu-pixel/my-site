// Same fail-closed semantic routing as integrated review; never weaken pixel checks.
import {articleImpact} from './report-article-impact.mjs';
import {writeFileSync} from 'node:fs';
const [base,head,output='.visual-targets.json']=process.argv.slice(2);
if(!base||!head)throw Error('Usage: select-shell-visual-targets.mjs BASE HEAD OUTPUT');
const impact=articleImpact(base,head);
const focused=impact.scope==='selected';
const result={mode:focused?'changed-articles':'all',targets:focused?impact.affectedTargets:null,changed:impact.changedFiles,reason:impact.reason};
writeFileSync(output,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
