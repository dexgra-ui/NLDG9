import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const failures=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};
const exists=file=>fs.existsSync(path.join(root,file));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

const retired=[
  '.github/workflows/fix-accessibility-findings-v2.yml',
  '.github/workflows/fix-accessibility-prayer-study.yml',
  '.github/workflows/normalize-public-labels.yml'
];
for(const file of retired)assert(!exists(file),`${file}: completed one-time repair workflow must stay retired`);

const permanentAudits=[
  '.github/workflows/accessibility-audit.yml',
  '.github/workflows/repository-completion-audit.yml',
  '.github/workflows/seo-social-audit.yml',
  '.github/workflows/site-quality.yml'
];
for(const file of permanentAudits){
  assert(exists(file),`${file}: permanent audit workflow is missing`);
  if(!exists(file))continue;
  const yaml=read(file);
  assert(!/contents:\s*write/i.test(yaml),`${file}: permanent audit workflows must not request contents: write`);
}

if(exists('.github/workflows/site-quality.yml')){
  const siteQuality=read('.github/workflows/site-quality.yml');
  const hygieneScript='workflow-hygiene-audit'+'.mjs';
  assert(!siteQuality.includes('repair-audit-failures.yml'),'site-quality.yml: stale ignore for removed repair-audit-failures.yml must not return');
  assert(siteQuality.includes(hygieneScript),'site-quality.yml: workflow hygiene audit step is missing');
}

if(failures.length){
  console.error(`Workflow hygiene audit FAILED with ${failures.length} problem(s):`);
  failures.forEach(item=>console.error(`- ${item}`));
  process.exit(1);
}
console.log('Workflow hygiene audit PASSED: one-time repair workflows are retired and permanent audits remain read-only.');