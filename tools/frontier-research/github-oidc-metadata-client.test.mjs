import assert from 'node:assert/strict'
import test from 'node:test'
import { generateKeyPairSync, sign } from 'node:crypto'
import { fetchPinnedJson, verifyGitHubOidcJwtWithNetwork, githubOidcMetadataConstants as C } from './github-oidc-metadata-client.mjs'

const discovery = {issuer:'https://token.actions.githubusercontent.com',jwks_uri:C.jwks_url,id_token_signing_alg_values_supported:['RS256']}
function jsonResponse(body,{status=200,url,headers={}}={}) {
  const response = new Response(JSON.stringify(body), {status, headers:{'content-type':'application/json','cache-control':'max-age=300',date:new Date(0).toUTCString(),...headers}})
  Object.defineProperty(response,'url',{value:url})
  return response
}
function signedFixture() {
  const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048})
  const kid='rotation-key'
  const header=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT',kid})).toString('base64url')
  const claims=Buffer.from(JSON.stringify({iss:discovery.issuer,aud:'test'})).toString('base64url')
  const signature=sign('RSA-SHA256',Buffer.from(`${header}.${claims}`,'ascii'),privateKey).toString('base64url')
  return {token:`${header}.${claims}.${signature}`,jwk:{...publicKey.export({format:'jwk'}),kid,kty:'RSA',alg:'RS256',use:'sig'}}
}

test('accepts fresh pinned JSON', async () => {
  const result = await fetchPinnedJson({url:C.discovery_url,fetchImpl:async()=>jsonResponse(discovery,{url:C.discovery_url}),now:()=>0})
  assert.equal(result.accepted,true)
  assert.deepEqual(result.body,discovery)
})

test('rejects redirects without following', async () => {
  let options
  const result = await fetchPinnedJson({url:C.discovery_url,fetchImpl:async(_url,o)=>{options=o; return jsonResponse({}, {status:302,url:C.discovery_url,headers:{location:'https://evil.example/'}})},now:()=>0})
  assert.equal(options.redirect,'manual')
  assert.equal(result.reason,'redirect_rejected')
})

test('rejects stale metadata using Age', async () => {
  const result = await fetchPinnedJson({url:C.discovery_url,fetchImpl:async()=>jsonResponse(discovery,{url:C.discovery_url,headers:{age:'301'}}),now:()=>0})
  assert.equal(result.reason,'metadata_stale')
})

test('rejects oversized metadata', async () => {
  const result = await fetchPinnedJson({url:C.discovery_url,maxBytes:8,fetchImpl:async()=>jsonResponse(discovery,{url:C.discovery_url}),now:()=>0})
  assert.equal(result.reason,'response_too_large')
})

test('performs exactly one JWKS refresh for unknown kid', async () => {
  const fixture=signedFixture()
  let jwksCalls=0
  const fetchImpl=async(url)=>{
    if(url===C.discovery_url) return jsonResponse(discovery,{url})
    jwksCalls++
    return jsonResponse({keys:jwksCalls===1?[]:[fixture.jwk]},{url})
  }
  const result=await verifyGitHubOidcJwtWithNetwork({token:fixture.token,fetchImpl,options:{now:()=>0}})
  assert.equal(result.accepted,true)
  assert.equal(result.refresh_count,1)
  assert.equal(jwksCalls,2)
})

test('does not refresh after an immediately verifiable token', async () => {
  const fixture=signedFixture()
  let jwksCalls=0
  const fetchImpl=async(url)=>{
    if(url===C.discovery_url) return jsonResponse(discovery,{url})
    jwksCalls++
    return jsonResponse({keys:[fixture.jwk]},{url})
  }
  const result=await verifyGitHubOidcJwtWithNetwork({token:fixture.token,fetchImpl,options:{now:()=>0}})
  assert.equal(result.accepted,true)
  assert.equal(result.refresh_count,0)
  assert.equal(jwksCalls,1)
})