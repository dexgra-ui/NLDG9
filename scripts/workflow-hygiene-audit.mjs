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
  '.github/workflows/site-quality.yml',
  '.github/workflows/spanish-bible-book-audit.yml'
];
for(const file of permanentAudits){
  assert(exists(file),`${file}: permanent audit workflow is missing`);
  if(!exists(file))continue;
  const yaml=read(file);
  assert(!/contents:\s*write/i.test(yaml),`${file}: permanent audit workflows must not request contents: write`);
}

const spanishAggregate='scripts/spanish-bible-book-audit.mjs';
assert(exists(spanishAggregate),`${spanishAggregate}: consolidated Spanish Bible book runner is missing`);
if(exists(spanishAggregate)){
  const aggregate=read(spanishAggregate);
  const legacyScripts=[...aggregate.matchAll(/'scripts\/(spanish-[^']+-audit\.mjs)'/g)].map(match=>match[1]);
  assert(legacyScripts.length>=50,`${spanishAggregate}: expected the completed book collection to retain at least 50 legacy safeguard audits`);
  for(const script of legacyScripts){
    const workflow=`.github/workflows/${script.replace(/\.mjs$/,'.yml')}`;
    assert(!exists(workflow),`${workflow}: legacy per-book workflow must stay retired; its script now runs through Spanish Bible Book Audit`);
  }
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
console.log('Workflow hygiene audit PASSED: one-time repair workflows stay retired, Spanish book safeguards run through one workflow, and permanent audits remain read-only.');
