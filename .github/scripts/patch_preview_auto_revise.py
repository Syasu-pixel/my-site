from pathlib import Path

p = Path('supabase/functions/ai-editorial-preview-visual-audit/index.ts')
s = p.read_text()

anchor = 'async function previewReachable(url:string){try{const r=await fetch(url,{method:"GET",redirect:"follow",headers:{"User-Agent":"denkicontrol-ai-editorial-preview-audit","Cache-Control":"no-cache"}});return r.ok}catch{return false}}\n'
helper = '''
function textToB64(text:string){const bytes=new TextEncoder().encode(text);let bin="";for(let i=0;i<bytes.length;i+=0x8000)bin+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(bin)}
function b64ToText(s:string){const bin=atob(String(s||"").replace(/\\n/g,""));const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
async function repoText(path:string,ref:string){const x=await gh(`/contents/${path}?ref=${encodeURIComponent(ref)}`);if(!x?.content||!x?.sha)throw new Error(`repo source missing: ${path}`);return {text:b64ToText(String(x.content)),sha:String(x.sha)}}
async function revisePreview(raw:string,id:string,st:any,audit:any){
  const round=Number(st.preview_auto_revision_round||0)+1;
  const maxRounds=5;
  if(round>maxRounds)return {status:"exhausted",round};
  const branch=String(st.branch||"");const path=String(st.article_path||"");
  if(!branch||!path)throw new Error("preview auto revision metadata missing");
  const src=await repoText(path,branch);
  const issues=Array.isArray(audit?.blocking_issues)?audit.blocking_issues:[];
  const instructions=Array.isArray(audit?.revision_instructions)?audit.revision_instructions:[];
  const today=new Date().toISOString().slice(0,10);
  const prompt=`denkicontrol.com の記事HTMLを、Preview監査の指摘だけに基づいて修正してください。完全なHTML全文だけを返してください。Markdownコードフェンスは禁止です。\n\n絶対条件:\n- 既存の上部構造、3カラム/サイドバー、先輩後輩会話、寄付導線、関連記事、ヘッダー、フッター、レスポンシブ構造を維持する。\n- 技術的事実、メーカー仕様、端子番号、定格、適合情報を新しく推測・創作しない。\n- 外部URLを新規追加しない。\n- 監査で問題になった箇所だけを直し、記事の検索意図と主題を変えない。\n- article-figure の重要画像は全ページPreview監査で確実に描画されるよう loading=\"eager\" を使ってよい。既存の画像パスは勝手に変更しない。\n- スマホで表が横にはみ出す場合はカード化またはoverflow-x:auto等で、ページ全体を横にはみ出させない。\n- 会話の生成残骸・誤文は自然な日本語へ修正する。\n- 公式資料の公開日/改訂日を確認できない場合は日付を創作せず『発行日・改訂日を確認できず（${today}参照）』のように資料日付と参照日を分離する。\n- サイドバーに別記事由来の内容があればこの記事専用の一般的な確認ポイントへ置換するが、新しい製品固有仕様は追加しない。\n- heroの文字と背景図が重なり読みにくい場合はCSSだけでコントラストを改善する。\n\n監査スコア: ${audit?.score??0}\nBlocking issues:\n${issues.map((x:string,i:number)=>`${i+1}. ${x}`).join("\\n")}\n\nRevision instructions:\n${instructions.map((x:string,i:number)=>`${i+1}. ${x}`).join("\\n")}\n\n現在のHTML:\n${src.text}`;
  const b=await oa({model:REVIEW_MODEL,store:false,reasoning:{effort:"medium"},input:[{role:"user",content:[{type:"input_text",text:prompt}]}]});
  let revised=outputText(b).trim().replace(/^```html\\s*/i,"").replace(/```$/i,"").trim();
  if(!/^<!doctype html>/i.test(revised)||!/<html[\\s>]/i.test(revised)||!/<\\/html>\\s*$/i.test(revised))throw new Error("preview auto revision returned invalid full HTML");
  await gh(`/contents/${path}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`AI編集部: Preview監査の自動修正 ${round}/${maxRounds}`,content:textToB64(revised),sha:src.sha,branch})});
  const next={...st,preview_verified:false,preview_audit_artifact_id:null,preview_head_sha:null,gpt_visual_audit:audit,gpt_visual_audit_pass:false,gpt_visual_audit_score:audit?.score??0,gpt_visual_audit_issues:issues,gpt_revision_instructions:instructions,preview_auto_revision_round:round,preview_auto_revision_last_at:new Date().toISOString(),autonomous_remediation_exhausted:false};
  await checkpoint(raw,id,"preview_wait",next);
  await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"building",p_last_error:null,p_mark_started:false});
  await event(raw,id,`GPT Preview監査は${audit?.score??0}点。管理者には止めず、指摘を記事HTMLへ自動反映しました。同じPRでCloudflare Previewを再構築して再監査します（自動修正 ${round}/${maxRounds}）。`,"BUILDING","medium",{stage:"gpt-preview-audit-auto-revise",score:audit?.score??0,round,max_rounds:maxRounds,same_queue:true,human_gate_policy:"final-preview-only",requires_human_decision:false});
  return {status:"preview-revising",round};
}
'''
if helper.strip() not in s:
    if anchor not in s:
        raise SystemExit('anchor not found')
    s = s.replace(anchor, anchor + helper, 1)

old = '''async function finalize(raw:string,id:string,st:any,audit:any){
  const pass=Boolean(audit?.pass)&&Number(audit?.score)>=95;
  const issues=Array.isArray(audit?.blocking_issues)?audit.blocking_issues:[];
  if(!pass){
    const msg=`GPT Preview監査が${audit?.score??0}点で基準未達です。管理者確認には回さず、自動工程の失敗として停止します。`;
    await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"failed",p_last_error:msg,p_mark_started:false});
    await rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"error",summary:msg,evidence:[{kind:"github-pr",ref:st.pr_url},{kind:"preview",ref:st.preview_url}],severity:"high",state:"ERROR",created_at:new Date().toISOString(),discussion:{command_id:id,stage:"gpt-preview-audit-auto-stop",pr_number:st.pr_number,preview_url:st.preview_url,gpt_visual_audit_pass:false,gpt_visual_audit_score:audit?.score??0,gpt_visual_audit_issues:issues,gpt_revision_instructions:audit?.revision_instructions||[],human_gate_policy:"final-preview-only",requires_human_decision:false},availability:{primary_provider:"gpt-preview-audit",status:"error"}}]});
    await checkpoint(raw,id,"done",{...st,preview_verified:false,gpt_visual_audit:audit,gpt_visual_audit_pass:false,autonomous_remediation_exhausted:true});
    return;
  }
  const summary=`GPT Preview監査を通過しました（${audit.score}点）。これが唯一の管理者確認です。`;
  await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"needs_human",p_last_error:null,p_mark_started:false});
  await rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"preview-ready",summary,evidence:[{kind:"github-pr",ref:st.pr_url},{kind:"preview",ref:st.preview_url}],severity:"info",state:"NEEDS_HUMAN",created_at:new Date().toISOString(),discussion:{command_id:id,stage:"gpt-preview-audit",pr_number:st.pr_number,pr_url:st.pr_url,preview_url:st.preview_url,article_path:st.article_path,article_title:st.bp?.title,gpt_visual_audit_pass:true,gpt_visual_audit_score:audit.score,gpt_visual_audit_strengths:audit.strengths||[],gpt_visual_audit_issues:[],gpt_revision_instructions:[],ogp_dedicated_review:st.ogp_dedicated_review||null,admin_gate:"final-review",human_gate_policy:"final-preview-only",preview_verified_by:st.preview_verified_by||"github-actions-playwright+gpt-vision"},availability:{primary_provider:"gpt-preview-audit",status:"waiting-human"}}]});
  await checkpoint(raw,id,"done",{...st,preview_verified:true,preview_verified_at:new Date().toISOString(),gpt_visual_audit:audit,gpt_visual_audit_pass:true});
}
'''
new = '''async function finalize(raw:string,id:string,st:any,audit:any){
  const pass=Boolean(audit?.pass)&&Number(audit?.score)>=95;
  const issues=Array.isArray(audit?.blocking_issues)?audit.blocking_issues:[];
  if(!pass){
    const revised=await revisePreview(raw,id,st,audit);
    if(revised.status!=="exhausted")return revised;
    const msg=`GPT Preview監査が${audit?.score??0}点で基準未達のまま、自動修正5回を使い切りました。管理者確認には回さず、自動工程の失敗として停止します。`;
    await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"failed",p_last_error:msg,p_mark_started:false});
    await rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"error",summary:msg,evidence:[{kind:"github-pr",ref:st.pr_url},{kind:"preview",ref:st.preview_url}],severity:"high",state:"ERROR",created_at:new Date().toISOString(),discussion:{command_id:id,stage:"gpt-preview-audit-auto-revise-exhausted",pr_number:st.pr_number,preview_url:st.preview_url,gpt_visual_audit_pass:false,gpt_visual_audit_score:audit?.score??0,gpt_visual_audit_issues:issues,gpt_revision_instructions:audit?.revision_instructions||[],preview_auto_revision_round:Number(st.preview_auto_revision_round||0),human_gate_policy:"final-preview-only",requires_human_decision:false},availability:{primary_provider:"gpt-preview-audit",status:"error"}}]});
    await checkpoint(raw,id,"done",{...st,preview_verified:false,gpt_visual_audit:audit,gpt_visual_audit_pass:false,autonomous_remediation_exhausted:true});
    return {status:"failed",round:Number(st.preview_auto_revision_round||0)};
  }
  const summary=`GPT Preview監査を通過しました（${audit.score}点）。これが唯一の管理者確認です。`;
  await rpc(raw,"ai_editorial_command_patch",{p_command_id:id,p_status:"needs_human",p_last_error:null,p_mark_started:false});
  await rpc(raw,"ai_editorial_command_add_events",{p_command_id:id,p_events:[{event_id:crypto.randomUUID(),job_id:`command-${id}`,role:"reviewer",provider:"gpt-preview-audit",event_type:"preview-ready",summary,evidence:[{kind:"github-pr",ref:st.pr_url},{kind:"preview",ref:st.preview_url}],severity:"info",state:"NEEDS_HUMAN",created_at:new Date().toISOString(),discussion:{command_id:id,stage:"gpt-preview-audit",pr_number:st.pr_number,pr_url:st.pr_url,preview_url:st.preview_url,article_path:st.article_path,article_title:st.bp?.title,gpt_visual_audit_pass:true,gpt_visual_audit_score:audit.score,gpt_visual_audit_strengths:audit.strengths||[],gpt_visual_audit_issues:[],gpt_revision_instructions:[],ogp_dedicated_review:st.ogp_dedicated_review||null,admin_gate:"final-review",human_gate_policy:"final-preview-only",preview_verified_by:st.preview_verified_by||"github-actions-playwright+gpt-vision"},availability:{primary_provider:"gpt-preview-audit",status:"waiting-human"}}]});
  await checkpoint(raw,id,"done",{...st,preview_verified:true,preview_verified_at:new Date().toISOString(),gpt_visual_audit:audit,gpt_visual_audit_pass:true,autonomous_remediation_exhausted:false});
  return {status:"needs_human"};
}
'''
if old not in s:
    raise SystemExit('finalize block not found')
s = s.replace(old, new, 1)

old2 = 'const audit=await auditPreview(desktop,mobile,html);next={...next,preview_audit_artifact_id:art.id,preview_audit_run_at:new Date().toISOString(),gpt_visual_audit:audit,preview_capture_mode:"pull-request-auto"};await finalize(raw,id,next,audit);return J({ok:true,status:"needs_human",audit})'
new2 = 'const audit=await auditPreview(desktop,mobile,html);next={...next,preview_audit_artifact_id:art.id,preview_audit_run_at:new Date().toISOString(),gpt_visual_audit:audit,preview_capture_mode:"pull-request-auto"};const finalResult=await finalize(raw,id,next,audit);return J({ok:true,...finalResult,audit})'
if old2 not in s:
    raise SystemExit('handler finalize call not found')
s = s.replace(old2, new2, 1)

p.write_text(s)
