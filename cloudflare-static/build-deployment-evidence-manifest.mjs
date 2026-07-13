import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const REQUIRED_EVIDENCE_FILES = Object.freeze([
  'cloudflare-workflow-invocation-receipt.json',
  'cloudflare-deployment-readiness.json',
  'cloudflare-access-probe.json',
  'cloudflare-pages-hostname-authority.json',
  'cloudflare-deployment-blocker.json',
  'cloudflare-deployment-decision.json',
  'cloudflare-deployment-metadata.json',
  'cloudflare-deployment-proof.json',
  'cloudflare-deployment-proof.freshness.json',
  'cloudflare-deployment-proof.intoto.json',
  'cloudflare-deployment-proof.signature-verification.json',
  'cloudflare-evidence-verification-input.json',
  'cloudflare-deployment-acceptance.json'
]);
function sha256(buffer){return crypto.createHash('sha256').update(buffer).digest('hex');}
function assertSafeRelativeFile(value){if(typeof value!=='string'||value.length===0)throw new Error('invalid-evidence-path');if(path.isAbsolute(value)||value.includes('..')||value.includes('\\'))throw new Error(`unsafe-evidence-path:${value}`);if(path.basename(value)!==value)throw new Error(`nested-evidence-path:${value}`);}
export function buildDeploymentEvidenceManifest({directory='.',files=REQUIRED_EVIDENCE_FILES,sourceCommit,runId,generatedAt=new Date().toISOString()}={}){
  if(!/^[0-9a-f]{40}$/i.test(sourceCommit??''))throw new Error('invalid-source-commit');
  if(typeof runId!=='string'||!/^[1-9][0-9]*$/.test(runId))throw new Error('invalid-run-id');
  if(!Array.isArray(files)||files.length===0)throw new Error('missing-evidence-files');
  const unique=new Set(files);if(unique.size!==files.length)throw new Error('duplicate-evidence-path');
  const entries=[...files].sort().map((relativePath)=>{assertSafeRelativeFile(relativePath);const absolutePath=path.join(directory,relativePath);if(!fs.existsSync(absolutePath))throw new Error(`missing-evidence-file:${relativePath}`);const bytes=fs.readFileSync(absolutePath);if(bytes.length===0)throw new Error(`empty-evidence-file:${relativePath}`);return{path:relativePath,sha256:sha256(bytes),size_bytes:bytes.length};});
  const manifest={schema_version:'1.1.0',artifact_type:'cloudflare-deployment-evidence-manifest',source_commit:sourceCommit.toLowerCase(),workflow_run_id:runId,generated_at:generatedAt,evidence_files:entries};
  return{...manifest,manifest_sha256:sha256(Buffer.from(JSON.stringify(manifest)))};
}
function main(){const[directory='.',output='cloudflare-deployment-evidence-manifest.json']=process.argv.slice(2);const manifest=buildDeploymentEvidenceManifest({directory,sourceCommit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,generatedAt:process.env.RUN_STARTED_AT||new Date().toISOString()});fs.writeFileSync(output,`${JSON.stringify(manifest,null,2)}\n`,{flag:'wx'});}
if(process.argv[1]===fileURLToPath(import.meta.url))main();
