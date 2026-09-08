import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import JSZip from "npm:jszip@3.10.1";

const U=Deno.env.get("SUPABASE_URL")??"";
const K=Deno.env.get("SUPABASE_ANON_KEY")??"";
const O=Deno.env.get("OPENAI_API_KEY")??"";
const GH=Deno.env.get("GITHUB_TOKEN")??Deno.env.get("GITHUB_PAT")??Deno.env.get("GITHUB_REPO_TOKEN")??"";
const REPO=Deno.env.get("AI_EDITORIAL_GITHUB_REPO")??"Syasu-pixel/my-site";
const REVIEW_MODEL=Deno.env.get("OPENAI_REVIEW_MODEL")??"gpt-5.6-luna";
const H={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info, x-supabase-api-version","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
const J=(b:unknown,s=200)=>new Response(JSON.stringify(b),{status:s,headers:H});

function outputText(b:any){if(typeof b?.output_text==="string")return b.output_text;for(const i of Array.isArray(b?.output)?b.output:[])if(i?.type==="message")for(const p of Array.isArray(i?.content)?i.content:[])if(p?.type==="output_text"&&typeof p.text==="string")return p.text;return ""}
async function rpc(raw:string,name:string,args:any){const r=await fetch(`${U}/rest/v1/rpc/${name}`,{method:"POST",headers:{Authorization:raw,apikey:K,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(args)});const t=await r.text();if(!r.ok)throw new Error(`${name} ${r.status}: ${t.slice(0,700)}`);return t?JSON.parse(t):{}}
async function gh(path:string,init:RequestInit={}){if(!GH)throw new Error("GITHUB_REPO_TOKEN missing");const r=await fetch(`https://api.github.com/repos/${REPO}${path}`,{...init,redirect:"follow",headers:{Authorization:`Bearer ${GH}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(init.headers||{})}});if(!r.ok){const t=await r.text();throw new Error(`GitHub ${r.status} ${path}: ${t.slice(0,700)}`)}const ct=r.headers.get("content-type")||"";if(ct.includes("application/json")){const t=await r.text();return t?JSON.parse(t):{}}return new Uint8Array(await r.arrayBuffer())}
async function checkpoint(raw:string,id:string,st:any){return rpc(raw,"ai_editorial_builder_checkpoint",{p_command_id:id,p_stage:"preview_wait",p_state:st})}
async function event(raw:string,id:string,summary:string,state="BUILDING",severity="info",discussion:any={}){return rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"status",summary,evidence:[],severity,state,created_at:new Date().toISOString(),discussion:{command_id:id,...discussion},availability:{primary_provider:"gpt-preview-audit",status:state==="NEEDS_HUMAN"?"waiting-human":"online"}}]})}
function bytesToB64(bytes:Uint8Array){let bin="";for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin)}
async function repoImage(path:string){try{const x=await gh(`/contents/${path}?ref=main`);if(x?.content)return String(x.content).replace(/\n/g,"")}catch{}return ""}
async function oa(payload:any){if(!O)throw new Error("OPENAI_API_KEY missing");const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${O}`,"Content-Type":"application/json"},body:JSON.stringify(payload)});const t=await r.text();if(!r.ok)throw new Error(`OpenAI ${r.status}: ${t.slice(0,900)}`);return JSON.parse(t)}

async function auditPreview(desktop:string,mobile:string,html:string){
  const character=await repoImage("assets/images/character-templates/senpai-kouhai-character-template.png");
  const gold=await repoImage("assets/images/star-delta-start-basic/star-delta-start-overview.webp");
  const schema={type:"object",additionalProperties:false,required:["pass","score","strengths","blocking_issues","revision_instructions"],properties:{pass:{type:"boolean"},score:{type:"integer",minimum:0,maximum:100},strengths:{type:"array",items:{type:"string"},maxItems:8},blocking_issues:{type:"array",items:{type:"string"},maxItems:15},revision_instructions:{type:"array",items:{type:"string"},maxItems:15}}};
  const compact=html.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").slice(0,60000);
  const relative=[...new Set((compact.match(/先月|先週|昨日|今日|約\d+日前|\d+週間前/g)||[]))];
  const content:any[]=[{type:"input_text",text:`denkicontrol.comの記事Previewを管理者へ上げる前に監査する。desktopとmobileは同一ページの全ページキャプチャ。HTMLも補助証拠として使う。\n\n必須確認:\n- 本文が黒文字の塊になっておらず、要点・注意・結論を色、太字、カード、箇条書き等で読み飛ばせるか\n- 画像はスター・デルタ採用画像レベルの教育的説明力があるか\n- キャラクター使用時は正本テンプレートと同一人物に見えるか。別人なら致命的不合格\n- 機器配置・向き・矢印・ワーク進行が現実的か。対向型多光軸エリアセンサなら左右縦置きで間をワークが通るのが基本\n- 右サイドバーに別記事由来の内容が混入していないか\n- PC/スマホで表・画像・会話UI・寄付導線・フッターが崩れていないか\n- 公式参照資料の日付に「先月」等の相対表現を使っていないか。相対表現検出=${JSON.stringify(relative)}\n- 安全ライトカーテンと汎用エリアセンサを混同していないか\n\n95点未満または致命的不整合が1つでもあればpass=false。管理者が大量のスクショを撮らなくても修正できる具体的なrevision_instructionsを書く。\n\nrendered HTML抜粋:\n${compact}`},{type:"input_image",image_url:`data:image/png;base64,${desktop}`},{type:"input_image",image_url:`data:image/png;base64,${mobile}`}];
  if(character)content.push({type:"input_image",image_url:`data:image/png;base64,${character}`});
  if(gold)content.push({type:"input_image",image_url:`data:image/webp;base64,${gold}`});
  const b=await oa({model:REVIEW_MODEL,store:false,reasoning:{effort:"medium"},input:[{role:"user",content}],text:{format:{type:"json_schema",name:"preview_visual_audit",strict:true,schema}}});
  return JSON.parse(outputText(b));
}

async function finalize(raw:string,id:string,st:any,audit:any){
  const pass=Boolean(audit?.pass)&&Number(audit?.score)>=95;
  const issues=Array.isArray(audit?.blocking_issues)?audit.blocking_issues:[];
  const summary=pass?`GPT Preview監査を通過しました（${audit.score}点）。管理者の最終確認へ進みます。`:`GPT Preview監査で修正候補を検出しました（${audit.score}点）。スクリーンショットを手作業で集めなくても、監査結果を基に修正判断できます。`;
  await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"needs_human",p_last_error:null,p_mark_started:false});
  await rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"preview-ready",summary,evidence:[{kind:"github-pr",ref:st.pr_url},{kind:"netlify-preview",ref:st.preview_url}],severity:pass?"info":"medium",state:"NEEDS_HUMAN",created_at:new Date().toISOString(),discussion:{command_id:id,stage:"gpt-preview-audit",pr_number:st.pr_number,pr_url:st.pr_url,preview_url:st.preview_url,article_path:st.article_path,article_title:st.bp?.title,gpt_visual_audit_pass:pass,gpt_visual_audit_score:audit.score,gpt_visual_audit_strengths:audit.strengths||[],gpt_visual_audit_issues:issues,gpt_revision_instructions:audit.revision_instructions||[],admin_gate:pass?"final-review":"revision-recommended",preview_verified_by:"github-netlify-status+playwright+gpt-vision"},availability:{primary_provider:"gpt-preview-audit",status:"waiting-human"}}]});
  await rpc(raw,"ai_editorial_builder_checkpoint",{p_command_id:id,p_stage:"done",p_state:{...st,preview_verified:true,preview_verified_at:new Date().toISOString(),gpt_visual_audit:audit,gpt_visual_audit_pass:pass}});
}

Deno.serve(async req=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers:H});
  if(req.method!=="POST")return J({error:"method not allowed"},405);
  const raw=req.headers.get("authorization")??"";
  if(!raw.toLowerCase().startsWith("bearer "))return J({error:"authentication required"},401);
  let input:any={};try{input=await req.json()}catch{return J({error:"invalid json"},400)}
  const id=String(input.command_id??"");const st=input.state&&typeof input.state==="object"?input.state:{};
  if(!/^[0-9a-f-]{36}$/i.test(id))return J({error:"valid command_id required"},400);
  try{
    const pr=Number(st.pr_number||0);if(!pr||!st.preview_url)return J({ok:false,error:"preview metadata missing"},409);
    const p=await gh(`/pulls/${pr}`);const sha=String(p?.head?.sha||"");if(!sha)return J({ok:false,error:"PR head SHA missing"},409);
    const statuses=await gh(`/commits/${sha}/status`);const list=Array.isArray(statuses?.statuses)?statuses.statuses:[];const netlify=list.find((x:any)=>String(x?.context||"").includes("netlify/")&&String(x?.context||"").includes("deploy-preview"));
    const checks=Number(st.preview_probe_checks||0)+1;let next={...st,preview_probe_checks:checks,preview_last_status:netlify?.state??statuses?.state??"unknown",preview_last_checked_at:new Date().toISOString(),preview_head_sha:sha};
    if(netlify?.state!=="success"){await checkpoint(raw,id,next);return J({ok:true,status:"waiting-netlify",netlify_status:netlify?.state??statuses?.state??"unknown",checks})}

    const artifactName=`ai-editorial-preview-pr-${pr}`;
    const arts=await gh(`/actions/artifacts?name=${encodeURIComponent(artifactName)}&per_page=20`);const arr=Array.isArray(arts?.artifacts)?arts.artifacts.filter((a:any)=>!a.expired):[];const art=arr.sort((a:any,b:any)=>Date.parse(b.created_at)-Date.parse(a.created_at))[0];
    if(!art){
      next={...next,preview_capture_checks:Number(next.preview_capture_checks||0)+1,preview_capture_mode:"pull-request-auto",preview_capture_artifact_name:artifactName};
      await checkpoint(raw,id,next);
      if(Number(next.preview_capture_checks||0)===1)await event(raw,id,"PR更新に連動したPC/スマホPreview自動取得を待っています。追加のGitHub Actions権限は不要です。","BUILDING","info",{stage:"preview-capture-wait",pr_number:pr});
      return J({ok:true,status:"waiting-capture",artifact_name:artifactName})
    }
    if(next.preview_audit_artifact_id===art.id&&next.gpt_visual_audit)return J({ok:true,status:"already-audited",audit:next.gpt_visual_audit});

    const zipBytes=await gh(`/actions/artifacts/${art.id}/zip`) as Uint8Array;const zip=await JSZip.loadAsync(zipBytes);
    const root=`preview-capture/pr-${pr}/`;const pick=(name:string)=>zip.file(root+name)||zip.file(name)||Object.values(zip.files).find((f:any)=>String(f.name).endsWith("/"+name));
    const d=pick("desktop.png"),m=pick("mobile.png"),h=pick("rendered.html");if(!d||!m||!h)throw new Error("preview artifact files missing");
    const desktop=bytesToB64(await d.async("uint8array"));const mobile=bytesToB64(await m.async("uint8array"));const html=await h.async("string");
    await event(raw,id,"PC/スマホのPreview画面を自動取得しました。GPTが本文密度・図解・キャラクター・機器配置・レスポンシブ表示を監査しています。","BUILDING","info",{stage:"gpt-preview-audit-start",artifact_id:art.id,pr_number:pr});
    const audit=await auditPreview(desktop,mobile,html);next={...next,preview_audit_artifact_id:art.id,preview_audit_run_at:new Date().toISOString(),gpt_visual_audit:audit,preview_capture_mode:"pull-request-auto"};await finalize(raw,id,next,audit);
    return J({ok:true,status:"needs_human",audit});
  }catch(e){const msg=e instanceof Error?e.message:String(e);try{await checkpoint(raw,id,{...st,preview_visual_last_error:msg,preview_visual_last_error_at:new Date().toISOString()})}catch{}return J({ok:false,error:msg},500)}
});
