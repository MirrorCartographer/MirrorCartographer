import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDeploymentEvidenceManifest, REQUIRED_EVIDENCE_FILES } from './build-deployment-evidence-manifest.mjs';
import { verifyDeploymentEvidenceManifest } from './verify-deployment-evidence-manifest.mjs';
import { materializeMissingDeploymentEvidence } from './materialize-missing-deployment-evidence.mjs';
import { materializeHostnameAuthorityConsistency } from './materialize-hostname-authority-consistency.mjs';
import { verifyHostnameAuthorityConsistencyFile } from './verify-hostname-authority-consistency.mjs';
import { buildWorkflowInvocationReceipt, contextFromEnvironment, policyFromEnvironment } from './build-workflow-invocation-receipt.mjs';

export function finalizeDeploymentEvidence({directory='.',output='cloudflare-deployment-evidence-manifest.json',sourceCommit,runId,generatedAt=new Date().toISOString(),files=REQUIRED_EVIDENCE_FILES}={}){
  const outputPath=path.join(directory,output);if(fs.existsSync(outputPath))throw new Error(`manifest-output-exists:${output}`);
  const closure=materializeMissingDeploymentEvidence({directory,sourceCommit,runId,generatedAt});
  const hostnameConsistency=materializeHostnameAuthorityConsistency({directory,expectedCommit:sourceCommit});
  const hostnameConsistencyVerification=verifyHostnameAuthorityConsistencyFile({directory,expectedCommit:sourceCommit});
  if(!hostnameConsistencyVerification.verified){const error=new Error(`hostname-authority-consistency-verification-failed:${hostnameConsistencyVerification.errors.join(',')}`);error.verification=hostnameConsistencyVerification;throw error;}
  const manifest=buildDeploymentEvidenceManifest({directory,files,sourceCommit,runId,generatedAt});
  fs.writeFileSync(outputPath,`${JSON.stringify(manifest,null,2)}\n`,{flag:'wx'});
  const verification=verifyDeploymentEvidenceManifest({manifest:JSON.parse(fs.readFileSync(outputPath,'utf8')),directory,expectedSourceCommit:sourceCommit,expectedRunId:runId,requiredFiles:files});
  if(!verification.ok){fs.rmSync(outputPath,{force:true});const error=new Error(`deployment-evidence-manifest-verification-failed:${verification.errors.join(',')}`);error.verification=verification;throw error;}
  return{manifest_path:outputPath,manifest,verification,closure,hostname_consistency:{accepted:hostnameConsistency.evidence.accepted,errors:hostnameConsistency.evidence.errors,output_path:hostnameConsistency.output_path,verification:hostnameConsistencyVerification}};
}

function materializeWorkflowInvocationReceipt({directory='.',generatedAt,env=process.env}={}){
  const workflowEnvironment={...env,CLOUDFLARE_DEPLOYMENT_ENVIRONMENT:'cloudflare-research'};
  const receipt=buildWorkflowInvocationReceipt({context:contextFromEnvironment(workflowEnvironment),policy:policyFromEnvironment(workflowEnvironment),generatedAt});
  const receiptPath=path.join(directory,'cloudflare-workflow-invocation-receipt.json');
  fs.writeFileSync(receiptPath,`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx'});
  if(!receipt.accepted)throw new Error(`workflow-invocation-receipt-rejected:${receipt.reason}`);
  return receipt;
}

function main(){
  const[directory='.',output='cloudflare-deployment-evidence-manifest.json']=process.argv.slice(2);
  const generatedAt=process.env.RUN_STARTED_AT||new Date().toISOString();
  const receipt=materializeWorkflowInvocationReceipt({directory,generatedAt});
  const result=finalizeDeploymentEvidence({directory,output,sourceCommit:process.env.GITHUB_SHA,runId:process.env.GITHUB_RUN_ID,generatedAt});
  process.stdout.write(`${JSON.stringify({ok:true,manifest_path:result.manifest_path,workflow_invocation_receipt:{accepted:receipt.accepted,replay_key_sha256:receipt.replay_key_sha256},closure:result.closure,hostname_consistency:result.hostname_consistency,...result.verification})}\n`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))main();
