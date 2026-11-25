// Plug in only after deployment/authorization review. This module does not start or expose anything.
import {makeClient,mountDashboard} from './dashboard-client.mjs';
export function mountWithDashboardAuth({root,supabase}){
 // getSession is used only to transport a short-lived token, never as proof of administrator access.
 const panel=mountDashboard({root,client:makeClient({getToken:async()=>{
  const {data,error}=await supabase.auth.getSession();
  return error?null:data?.session?.access_token??null;
 }})});
 const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')panel.clear();});
 return {...panel,dispose:()=>{subscription.unsubscribe();panel.clear();}};
}
export function makeVerifiedIdentity({supabase}){
 return {authenticate:async token=>{
  const {data,error}=await supabase.auth.getUser(token);
  const user=data?.user;
  return !error&&user&&typeof user.id==='string'&&user.is_anonymous===false?{id:user.id,anonymous:false}:null;
 }};
}
