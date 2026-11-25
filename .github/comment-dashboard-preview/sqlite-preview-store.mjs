// Synthetic, local SQLite verification adapter. Not intended for deployment.
import {DatabaseSync} from 'node:sqlite';
import {randomUUID,createHash} from 'node:crypto';
const fail=status=>{throw Object.assign(new Error('preview store rejected operation'),{status});};
const slug=/^\/articles\/[a-z0-9-]+\.html$/;
const key=/^[\w-]{1,80}$/;
function fields(d){
 if(typeof d.body!=='string'||typeof d.nickname!=='string')fail(400);
 const body=d.body.trim(),nickname=d.nickname.trim()||'匿名';
 if(!body||[...body].length>500||[...nickname].length>24)fail(400);
 return {body,nickname,consent:d.consent===true};
}
export function openPreviewStore({file,eligible,operatorIds}){
 const db=new DatabaseSync(file);
 const allow=new Set(eligible),operators=new Set(operatorIds);
 db.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=4000;
  CREATE TABLE IF NOT EXISTS comment (
    id TEXT PRIMARY KEY, path TEXT NOT NULL, author TEXT NOT NULL, parent TEXT,
    request_key TEXT NOT NULL, fingerprint TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1, pending TEXT, published TEXT,
    hidden INTEGER NOT NULL DEFAULT 0 CHECK(hidden IN (0,1)),
    UNIQUE (id,path), UNIQUE(path,author,request_key),
    FOREIGN KEY(parent,path) REFERENCES comment(id,path)
  ) STRICT;
  CREATE INDEX IF NOT EXISTS comments_by_path ON comment(path);
  CREATE INDEX IF NOT EXISTS comments_pending ON comment(path) WHERE pending IS NOT NULL AND hidden=0;`);
 const one=(sql,...args)=>db.prepare(sql).get(...args);
 const all=(sql,...args)=>db.prepare(sql).all(...args);
 const run=(sql,...args)=>db.prepare(sql).run(...args);
 const tx=fn=>{db.exec('BEGIN IMMEDIATE');try{const r=fn();db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}};
 const pathGuard=path=>{if(typeof path!=='string'||!slug.test(path)||!allow.has(path))fail(404);};
 const actorGuard=id=>{if(typeof id!=='string'||!key.test(id))fail(403);};
 const adminGuard=id=>{if(!operators.has(id))fail(403);};
 const row=(path,id)=>{pathGuard(path);const r=one('SELECT * FROM comment WHERE path=? AND id=?',path,id);if(!r||r.hidden)fail(404);return r;};
 const visible=r=>!!r.published&&!r.hidden&&(!r.parent||!!one('SELECT 1 FROM comment WHERE id=? AND path=? AND hidden=0 AND published IS NOT NULL',r.parent,r.path));
 const change=(r,sql,...args)=>{if(run(sql,...args,r.id,r.version).changes!==1)fail(409);};
 const output=(r,state)=>{const draft=JSON.parse(r[state]);return {id:r.id,path:r.path,parent:r.parent,state,body:draft.body,nickname:draft.nickname,editor:draft.editor,rev:r.version,hasPendingEdit:state==='published'&&Boolean(r.pending),mayFeature:state==='published'&&draft.consent&&!r.pending};};
 return {
  close:()=>db.close(),
  isEligible:path=>allow.has(path),
  post:(path,actor,d)=>tx(()=>{
   pathGuard(path);actorGuard(actor);
   if(typeof d.requestId!=='string'||!key.test(d.requestId)||d.parent!=null&&(typeof d.parent!=='string'||!key.test(d.parent)))fail(400);
   const draft={...fields(d),editor:'投稿者'},parent=d.parent??null;
   const fingerprint=createHash('sha256').update(JSON.stringify([parent,draft])).digest('hex');
   const known=one('SELECT id,fingerprint FROM comment WHERE path=? AND author=? AND request_key=?',path,actor,d.requestId);
   if(known){if(known.fingerprint!==fingerprint)fail(409);return known.id;}
   if(parent){const source=row(path,parent);if(source.parent||!visible(source))fail(409);}
   const id=randomUUID();
   run('INSERT INTO comment(id,path,author,parent,request_key,fingerprint,pending) VALUES(?,?,?,?,?,?,?)',id,path,actor,parent,d.requestId,fingerprint,JSON.stringify(draft));
   return id;
  }),
  editOwn:(path,id,actor,d)=>tx(()=>{
   actorGuard(actor);const r=row(path,id);if(r.author!==actor)fail(403);
   change(r,'UPDATE comment SET pending=?,version=version+1 WHERE id=? AND version=?',JSON.stringify({...fields(d),editor:'投稿者'}));
  }),
  publicFor:path=>{
   pathGuard(path);
   const rows=all('SELECT c.* FROM comment c LEFT JOIN comment p ON p.id=c.parent AND p.path=c.path WHERE c.path=? AND c.hidden=0 AND c.published IS NOT NULL AND (c.parent IS NULL OR (p.hidden=0 AND p.published IS NOT NULL)) ORDER BY c.rowid',path);
   return rows.map(r=>{const {state,rev,mayFeature,hasPendingEdit,...safe}=output(r,'published');return safe;});
  },
  ownFor:(path,actor)=>{
   pathGuard(path);actorGuard(actor);
   return all('SELECT * FROM comment WHERE path=? AND author=? AND hidden=0 ORDER BY rowid',path,actor).flatMap(r=>r.pending?[output(r,'pending')]:visible(r)?[output(r,'published')]:[]);
  },
  list:({adminId,state,limit,after=null})=>{
   adminGuard(adminId);if(!['pending','published'].includes(state)||!Number.isInteger(limit)||limit<1||limit>51)fail(400);
   const anchor=after===null?null:one('SELECT rowid,path FROM comment WHERE id=?',after);
   if(after!==null&&(!anchor||!allow.has(anchor.path)))fail(400);
   return all(`SELECT * FROM comment WHERE hidden=0 AND ${state} IS NOT NULL AND (? IS NULL OR rowid < ?) ORDER BY rowid DESC`,anchor?.rowid??null,anchor?.rowid??null)
    .filter(r=>allow.has(r.path)&&(state==='pending'||visible(r))).slice(0,limit).map(r=>({...output(r,state),parentUnavailable:state==='pending'&&Boolean(r.parent)&&!one('SELECT 1 FROM comment WHERE id=? AND path=? AND parent IS NULL AND hidden=0 AND published IS NOT NULL',r.parent,r.path)}));
  },
  apply:d=>tx(()=>{
   adminGuard(d.adminId);const r=row(d.path,d.id);
   if(r.version!==d.rev)fail(409);
   if(d.action==='approve'||d.action==='decline'){
    if(r.version!==d.rev||!r.pending)fail(409);
    if(d.action==='approve'&&r.parent&&!visible(row(d.path,r.parent)))fail(409);
    if(d.action==='approve')change(r,'UPDATE comment SET published=pending,pending=NULL,version=version+1 WHERE id=? AND version=?');
    else change(r,'UPDATE comment SET pending=NULL,version=version+1 WHERE id=? AND version=?');
   }else if(d.action==='edit'){
    change(r,'UPDATE comment SET pending=?,version=version+1 WHERE id=? AND version=?',JSON.stringify({...fields(d),editor:'運営',consent:false}));
   }else if(d.action==='hide'){
    change(r,'UPDATE comment SET hidden=1,version=version+1 WHERE id=? AND version=?');
   }else fail(400);
  })
 };
}
