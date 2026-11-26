import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import {makePreviewAccessVerifier} from './staging-worker.mjs';
test('preview requires a signed, current token for the specified Access app',async()=>{
 const issuer='https://synthetic.cloudflareaccess.com', audience='a'.repeat(64);
 const env={COMMENTS_STAGING_ACCESS_TEAM:'synthetic',COMMENTS_STAGING_ACCESS_AUDIENCE:audience};
 const pair=await generateKeyPair('RS256',{extractable:true});
 const wrong=await generateKeyPair('RS256');
 const keys=[{...await exportJWK(pair.publicKey),kid:'k',use:'sig',alg:'RS256'}];
 let calls=0;
 const verify=makePreviewAccessVerifier({fetcher:async(url,opts)=>{
  calls++;assert.equal(String(url),issuer+'/cdn-cgi/access/certs');assert.equal(opts.redirect,'error');
  return Response.json({keys});
 }});
 const signed=({aud=audience,iss=issuer,exp='5m',key=pair.privateKey}={})=>new SignJWT({})
  .setProtectedHeader({alg:'RS256',kid:'k'}).setIssuer(iss).setSubject('fixture').setAudience(aud).setExpirationTime(exp).sign(key);
 const request=token=>new Request('https://example.invalid/',{headers:{'Cf-Access-Jwt-Assertion':token}});
 assert.equal(await verify(request(''),env),false);
 assert.equal(await verify(request('not-a-token'),{...env,COMMENTS_STAGING_ACCESS_TEAM:'outside.test'}),false);
 assert.equal(calls,0);
 assert.equal(await verify(request(await signed()),env),true);
 for(const options of [{aud:'b'.repeat(64)},{iss:'https://other.cloudflareaccess.com'},{exp:'-1m'},{key:wrong.privateKey}]){
  const token=await signed(options);await assert.rejects(verify(request(token),env));
 }
 assert.equal(calls,1);
});
