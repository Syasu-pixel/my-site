import {releasePaths} from './comment-release.mjs';
import pg from 'pg';
import {makeProductionWorker} from './production-worker.mjs';
async function connect(connectionString){
 const db=new pg.Client({connectionString,connectionTimeoutMillis:4000,query_timeout:4000});
 try{await db.connect();}
 catch(e){await db.end().catch(()=>{});throw e;}
 return {query:(sql,args)=>db.query(sql,args),close:()=>db.end()};
}
export default {fetch:makeProductionWorker({connect,releasePaths})};

