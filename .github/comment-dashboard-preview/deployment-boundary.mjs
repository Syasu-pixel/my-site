// Plug in only after deployment/authorization review. This module does not start or expose anything.
import {makeClient,mountDashboard} from './dashboard-client.mjs';
export function mountWithDashboardAuth({root,supabase,articleTitle,doc=document,fetcher=fetch}){
 // getSession is used only to transport a short-lived token, never as proof of administrator access.
 const panel=mountDashboard({root,doc,articleTitle,client:makeClient({fetcher,getToken:async()=>{
  const {data,error}=await supabase.auth.getSession();
  return error?null:data?.session?.access_token??null;
 }})});
 let activeUser;
 const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
  const nextUser=event==='SIGNED_OUT'?null:session?.user?.id??null;
  // Clear the DOM synchronously; an earlier request may still be in flight.
  // Same-user token refresh does not discard a moderator's open draft.
  if(event==='SIGNED_OUT'||(activeUser!==undefined&&activeUser!==nextUser))panel.clear();
  activeUser=nextUser;
 });
 return {...panel,dispose:()=>{subscription.unsubscribe();panel.clear();}};
}
export function makeVerifiedIdentity({supabase}){
 return {authenticate:async token=>{
  const {data,error}=await supabase.auth.getUser(token);
  const user=data?.user;
  return !error&&user&&typeof user.id==='string'&&user.is_anonymous===false?{id:user.id,anonymous:false}:null;
 }};
}

// A restricted server client with read access to the existing operator registry is required.
// Do not pass this client or its credential to the browser. A failed registry lookup fails closed.
export function makeEditorialModeratorRegistry({registryClient}){
 return {has:async id=>{
  if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id))return false;
  const {data,error}=await registryClient.from('ai_editorial_admins').select('user_id').eq('user_id',id).maybeSingle();
  if(error)throw new Error('registry-unavailable');
  return data?.user_id===id;
 }};
}
