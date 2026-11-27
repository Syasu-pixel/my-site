// Candidate for the same-origin server route; never expose signing keys to the browser.
const name='__Host-dc_comment', ttl=180*24*3600;
const ascii=new TextEncoder();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const b64=u=>btoa(String.fromCharCode(...new Uint8Array(u))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const bytes=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='),c=>c.charCodeAt(0));
export async function makeArticleSessions({keyBytes,previousKeyBytes=[],clock=()=>Math.floor(Date.now()/1000)}={}){
 const all=[keyBytes,...previousKeyBytes];
 if(all.length>3||!all.every(k=>k instanceof Uint8Array&&k.byteLength===32))throw new TypeError('server-only 32-byte signing keys required');
 const keys=await Promise.all(all.map(raw=>crypto.subtle.importKey('raw',raw,{name:'HMAC',hash:'SHA-256'},false,['sign','verify'])));
 const currentTime=()=>{
  const now=clock();if(!Number.isSafeInteger(now)||now<0)throw new Error('session clock unavailable');return now;
 };
 const read=async request=>{
  const cookies=(request.headers.get('cookie')??'').split(';').map(x=>x.trim()).filter(x=>x.startsWith(name+'='));
  if(cookies.length!==1)return null;
  const parts=cookies[0].slice(name.length+1).split('.');
  if(parts.length!==4||parts[0]!=='1'||!uuid.test(parts[1])||!/^[1-9][0-9]{0,13}$/.test(parts[2])||!/^[A-Za-z0-9_-]{43}$/.test(parts[3]))return null;
  const expires=Number(parts[2]),now=currentTime();
  if(expires<=now||expires>now+ttl)return null;
  const sig=bytes(parts[3]);if(b64(sig)!==parts[3])return null;
  const message=ascii.encode(parts.slice(0,3).join('.'));
  for(let i=0;i<keys.length;i++)if(await crypto.subtle.verify('HMAC',keys[i],sig,message))return {id:parts[1],useCurrent:i===0};
  return null;
 };
 const signedCookie=async id=>{
  const body='1.'+id+'.'+(currentTime()+ttl),sig=b64(await crypto.subtle.sign('HMAC',keys[0],ascii.encode(body)));
  return name+'='+body+'.'+sig+'; Path=/; Max-Age='+ttl+'; Secure; HttpOnly; SameSite=Strict';
 };
 return {
  read:async request=>(await read(request))?.id??null,
  ensure:async request=>{
   const old=await read(request);
   if(old?.useCurrent)return {actor:old.id,cookie:null};
   const actor=old?.id??crypto.randomUUID();
   return {actor,cookie:await signedCookie(actor)};
  }
 };
}

