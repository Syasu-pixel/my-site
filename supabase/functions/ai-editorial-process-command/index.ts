import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL=Deno.env.get("SUPABASE_URL")??"";
const ANON_KEY=Deno.env.get("SUPABASE_ANON_KEY")??"";
const OPENAI_API_KEY=Deno.env.get("OPENAI_API_KEY")??"";
const EDITOR_MODEL=Deno.env.get("OPENAI_EDITOR_MODEL")??"gpt-5.6-luna";
const RESEARCH_MODEL=Deno.env.get("OPENAI_RESEARCH_MODEL")??"gpt-5.6-luna";

const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info, x-supabase-api-version","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});

function outputText(body:any){
  if(typeof body?.output_text==="string")return body.output_text;
  for(const item of Array.isArray(body?.output)?body.output:[]){
    if(item?.type!=="message")continue;
    for(const part of Array.isArray(item?.content)?item.content:[]){
      if(part?.type==="output_text"&&typeof part.text==="string")return part.text;
    }
  }
  return "";
}

function webUrls(body:any){
  const out=new Set<string>();
  for(const item of Array.isArray(body?.output)?body.output:[]){
    if(item?.type!=="web_search_call")continue;
    for(const source of Array.isArray(item?.action?.sources)?item.action.sources:[]){
      if(typeof source?.url==="string"&&source.url.startsWith("https://"))out.add(source.url);
    }
    if(typeof item?.action?.url==="string"&&item.action.url.startsWith("https://"))out.add(item.action.url);
  }
  return out;
}

async function rpc(token:string,name:string,args:Record<string,unknown>){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`,{method:"POST",headers:{Authorization:`Bearer ${token}`,apikey:ANON_KEY,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(args)});
  const raw=await r.text();
  let body:any={}; try{body=raw?JSON.parse(raw):{}}catch{body={raw}};
  if(!r.ok)throw new Error(`${name} failed ${r.status}: ${raw.slice(0,500)}`);
  return body;
}

async function openai(payload:Record<string,unknown>){
  if(!OPENAI_API_KEY)throw new Error("OPENAI_API_KEY is not configured");
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const raw=await r.text();
  let body:any={}; try{body=raw?JSON.parse(raw):{}}catch{body={raw}};
  if(!r.ok)throw new Error(`OpenAI response ${r.status}: ${raw.slice(0,800)}`);
  return body;
}

async function patch(token:string,id:string,status:string,lastError:string|null=null,markStarted=false){
  return await rpc(token,"ai_editorial_command_patch",{p_command_id:id,p_status:status,p_last_error:lastError,p_mark_started:markStarted});
}
async function addEvents(token:string,id:string,events:any[]){
  return await rpc(token,"ai_editorial_command_add_events",{p_command_id:id,p_events:events});
}

async function plan(token:string,cmd:any){
  await patch(token,cmd.id,"planning",null,true);
  const prompt=[
    "あなたはdenkicontrol.comのAI編集部の編集長です。管理者指示を実行可能な案件へ分解してください。",
    "既存記事との重複回避、初心者への分かりやすさ、安全性、メーカー一次情報の優先を守ってください。",
    "メーカー仕様、型式、パラメータ、規格、安全、最新情報が関係する案件は needs_research=true にしてください。",
    "research_briefには調査すべき公式資料・確認項目・最新版確認条件を書いてください。",
    "requested_countが指定されている場合、jobs件数を必ず一致させてください。",
    `管理者指示: ${cmd.instruction}`,
    `requested_count: ${cmd.requested_count??"未指定"}`,
    `options: ${JSON.stringify(cmd.options??{})}`
  ].join("\n");
  const body=await openai({model:EDITOR_MODEL,store:false,reasoning:{effort:"low"},input:prompt,text:{format:{type:"json_schema",name:"editorial_plan",strict:true,schema:{type:"object",additionalProperties:false,required:["summary","needs_research","research_brief","jobs"],properties:{summary:{type:"string"},needs_research:{type:"boolean"},research_brief:{type:"string"},jobs:{type:"array",minItems:1,maxItems:50,items:{type:"object",additionalProperties:false,required:["title","goal","content_type","priority","needs_research","research_brief"],properties:{title:{type:"string"},goal:{type:"string"},content_type:{type:"string",enum:["new_article","article_update","site_improvement","research","other"]},priority:{type:"string",enum:["high","medium","low"]},needs_research:{type:"boolean"},research_brief:{type:"string"}}}}}}}}});
  const text=outputText(body); if(!text)throw new Error("GPT editor returned no structured output");
  const result=JSON.parse(text);
  if(!Array.isArray(result.jobs)||!result.jobs.length)throw new Error("GPT editor returned no jobs");
  if(cmd.requested_count&&result.jobs.length!==Number(cmd.requested_count))throw new Error(`GPT editor returned ${result.jobs.length} jobs; expected ${cmd.requested_count}`);
  const parent=`command-${cmd.id}`; const now=new Date().toISOString();
  const anyResearch=Boolean(result.needs_research||result.jobs.some((j:any)=>j.needs_research));
  const events:any[]=[{event_id:crypto.randomUUID(),job_id:parent,role:"editor",provider:"openai-editor",event_type:"proposal",summary:String(result.summary).slice(0,2000),evidence:[{kind:"command",ref:cmd.id}],severity:"info",state:"PLANNING",created_at:now,discussion:{command_id:cmd.id,stage:"editor-plan",model:EDITOR_MODEL,job_count:result.jobs.length,needs_research:anyResearch,research_brief:String(result.research_brief||"").slice(0,3000)},availability:{primary_provider:"openai-editor",status:"online",model:EDITOR_MODEL}}];
  result.jobs.forEach((j:any,i:number)=>events.push({event_id:crypto.randomUUID(),job_id:`${parent}-${String(i+1).padStart(2,"0")}`,role:"editor",provider:"openai-editor",event_type:"proposal",summary:`${String(j.title).slice(0,300)}\n${String(j.goal).slice(0,1500)}`.slice(0,2000),evidence:[{kind:"parent-command",ref:cmd.id}],severity:j.priority==="high"?"medium":"info",state:"PLANNING",created_at:now,discussion:{command_id:cmd.id,parent_job_id:parent,child_index:i+1,content_type:j.content_type,priority:j.priority,needs_research:Boolean(j.needs_research),research_brief:String(j.research_brief||"").slice(0,3000),model:EDITOR_MODEL,stage:"editor-child-job"},availability:{primary_provider:"openai-editor",status:"online",model:EDITOR_MODEL}}));
  await addEvents(token,cmd.id,events);
  await patch(token,cmd.id,anyResearch?"needs_research":"running",null,false);
  return {result,parent,anyResearch};
}

async function research(token:string,cmd:any,planned:any){
  const targets=planned.result.jobs.map((j:any,i:number)=>({...j,child_index:i+1})).filter((j:any)=>j.needs_research);
  if(!targets.length)return {researched:false,reason:"not-needed"};
  const prompt=[
    "あなたはdenkicontrol.comの技術資料調査担当です。必ずWeb検索を使って各案件を調査してください。",
    "メーカー公式サイト、公式マニュアル、公式FAQ、公式技術資料を最優先してください。販売店やまとめサイトは一次根拠にしません。",
    "最新版・改訂版を優先し、対象機種、資料名、資料番号、公開日または改訂情報を確認してください。確認できない情報は推測しないでください。",
    "具体的な端子番号・パラメータ番号・初期値・安全機能は対象機種が確認できた場合だけ記載してください。",
    JSON.stringify(targets.map((j:any)=>({child_index:j.child_index,title:j.title,goal:j.goal,research_brief:j.research_brief})))
  ].join("\n");
  const body=await openai({model:RESEARCH_MODEL,store:false,reasoning:{effort:"low"},tools:[{type:"web_search",search_context_size:"medium"}],tool_choice:"required",include:["web_search_call.action.sources"],input:prompt,text:{format:{type:"json_schema",name:"technical_research",strict:true,schema:{type:"object",additionalProperties:false,required:["results"],properties:{results:{type:"array",items:{type:"object",additionalProperties:false,required:["child_index","summary","key_points","sources","confidence"],properties:{child_index:{type:"integer"},summary:{type:"string"},key_points:{type:"array",items:{type:"string"}},sources:{type:"array",items:{type:"object",additionalProperties:false,required:["title","url","published_or_revised","notes"],properties:{title:{type:"string"},url:{type:"string"},published_or_revised:{type:"string"},notes:{type:"string"}}}},confidence:{type:"number",minimum:0,maximum:1}}}}}}}}});
  const text=outputText(body); if(!text)throw new Error("Web research returned no structured output");
  const parsed=JSON.parse(text); const observed=webUrls(body); const now=new Date().toISOString(); const events:any[]=[];
  for(const r of Array.isArray(parsed.results)?parsed.results:[]){
    const idx=Number(r.child_index); if(!targets.some((x:any)=>x.child_index===idx))continue;
    const sources=(Array.isArray(r.sources)?r.sources:[]).filter((s:any)=>typeof s?.url==="string"&&observed.has(s.url)).slice(0,12);
    const key=(Array.isArray(r.key_points)?r.key_points:[]).map((x:any)=>String(x)).slice(0,12);
    events.push({event_id:crypto.randomUUID(),job_id:`${planned.parent}-${String(idx).padStart(2,"0")}`,role:"editor",provider:"openai-web-research",event_type:"research",summary:[String(r.summary||""),...key.map((x:string)=>`・${x}`)].join("\n").slice(0,2000),evidence:sources.map((s:any)=>({kind:"official-web-source",ref:String(s.url).slice(0,1500),title:String(s.title||"").slice(0,300)})),severity:sources.length?"info":"medium",state:"PLANNING",created_at:now,discussion:{command_id:cmd.id,parent_job_id:planned.parent,child_index:idx,stage:"official-web-research",model:RESEARCH_MODEL,confidence:Number(r.confidence||0),source_count:sources.length,sources},availability:{primary_provider:"openai-web-research",status:"online",model:RESEARCH_MODEL,web_search:true}});
  }
  if(!events.length)throw new Error("Web research returned no matching child results");
  await addEvents(token,cmd.id,events);
  await patch(token,cmd.id,"running",null,false);
  await addEvents(token,cmd.id,[{event_id:crypto.randomUUID(),job_id:planned.parent,role:"system",provider:"orchestrator",event_type:"status",summary:`公式Web調査が完了しました。${events.length}件の案件へ調査結果を追加しました。`,evidence:[],severity:"info",state:"PLANNING",created_at:new Date().toISOString(),discussion:{command_id:cmd.id,stage:"research-complete",researched_jobs:events.length},availability:{primary_provider:"openai-web-research",status:"online",model:RESEARCH_MODEL}}]);
  return {researched:true,job_count:events.length};
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(req.method!=="POST")return json({error:"method not allowed"},405);
  const raw=req.headers.get("authorization")??""; const token=raw.toLowerCase().startsWith("bearer ")?raw.slice(7).trim():"";
  if(!token)return json({error:"authentication required"},401);
  let input:any={}; try{input=await req.json()}catch{return json({error:"invalid json"},400)}
  const commandId=String(input.command_id??""); if(!/^[0-9a-f-]{36}$/i.test(commandId))return json({error:"valid command_id required"},400);
  let cmd:any;
  try{cmd=await rpc(token,"ai_editorial_command_get",{p_command_id:commandId})}catch(e){return json({error:e instanceof Error?e.message:String(e)},403)}
  if(!["queued","failed"].includes(String(cmd.status)))return json({ok:true,skipped:true,status:cmd.status},200);
  try{
    const planned=await plan(token,cmd);
    let researched:any={researched:false,reason:"not-needed"};
    if(planned.anyResearch)researched=await research(token,cmd,planned);
    return json({ok:true,command_id:cmd.id,planning:{job_count:planned.result.jobs.length,model:EDITOR_MODEL},research:researched},200);
  }catch(e){
    const message=e instanceof Error?e.message:String(e);
    try{await patch(token,cmd.id,"failed",message,false);await addEvents(token,cmd.id,[{event_id:crypto.randomUUID(),job_id:`command-${cmd.id}`,role:"system",provider:"orchestrator",event_type:"error",summary:`自動処理に失敗しました: ${message}`.slice(0,2000),evidence:[{kind:"command",ref:cmd.id}],severity:"high",state:"FAILED",created_at:new Date().toISOString(),discussion:{command_id:cmd.id,stage:"processor",model:EDITOR_MODEL},availability:{primary_provider:"openai-editor",status:"error",model:EDITOR_MODEL}}])}catch{}
    return json({ok:false,error:message},500);
  }
});
