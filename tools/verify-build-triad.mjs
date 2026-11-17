import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
export function checkDecision(d,root='.'){
 const faults=[];
 if(d?.schema!=='mc.decision-triad.v1'||typeof d?.decision_id!=='string')faults.push('invalid schema or decision ID');
 const e=d?.exact_copy;
 if(e?.speaker!=='user'||e?.source_kind!=='private_conversation'||!/^[a-f0-9]{64}$/.test(e.excerpt_sha256||'')||e.literal_source_public!==false)faults.push('source attribution/private content gate failed');
 if(d?.interpretation?.status!=='hypothesis'||!d?.interpretation?.alternative||d?.interpretation?.owner_review!=='pending')faults.push('interpretation not marked as disputable');
 const idea=d?.idea;
 if(!Array.isArray(idea?.source_paths)||!idea.source_paths.length||!idea.test_path)faults.push('missing implementation paths');
 else for(const p of [...idea.source_paths,idea.test_path])if(!/^(site|tests)\/[a-z0-9_./-]+$/.test(p)||!existsSync(join(root,p)))faults.push('missing or invalid path: '+p);
 if(idea?.human_impact_status!=='not-tested'||idea?.owner_device_sound_status!=='not-tested')faults.push('unverified human/device experience claimed as verified');
 return faults;
}
export function run(root='.'){
 const dir=join(root,'docs/decision-records');
 const paths=readdirSync(dir).filter(p=>p.endsWith('.json'));
 if(!paths.length)throw Error('No build-decision records');
 for(const p of paths){const d=JSON.parse(readFileSync(join(dir,p),'utf8')),faults=checkDecision(d,root);if(faults.length)throw Error(p+': '+faults.join('; '));}
 return {records:paths.length,triadsValidated:true,semanticMeaningMachineVerified:false};
}
if(process.argv[1]&&process.argv[1].endsWith('verify-build-triad.mjs'))console.log(JSON.stringify(run(process.cwd())));