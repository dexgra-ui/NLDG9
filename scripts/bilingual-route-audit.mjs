import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT=process.cwd();
const errors=[];
const warnings=[];
const notes=[];
const exists=async file=>{try{await fs.access(file);return true;}catch{return false;}};

const routerPath=path.join(ROOT,'nldg-i18n.js');
if(!await exists(routerPath)){
  console.error('FAILED\nMissing bilingual locale router');
  process.exit(1);
}

const router=await fs.readFile(routerPath,'utf8');
const block=router.match(/const pairs=\{([\s\S]*?)\n\};/);
if(!block){
  console.error('FAILED\nCould not find the bilingual route registry');
  process.exit(1);
}

const pairs=[];
for(const match of block[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g))pairs.push({en:match[1],es:match[2]});
if(!pairs.length)errors.push('No English/Spanish route pairs were found.');

const seenEnglish=new Set();
const seenSpanish=new Set();
for(const pair of pairs){
  if(seenEnglish.has(pair.en))errors.push(`Duplicate English route in registry: ${pair.en}`);
  if(seenSpanish.has(pair.es))errors.push(`Duplicate Spanish route in registry: ${pair.es}`);
  seenEnglish.add(pair.en);seenSpanish.add(pair.es);
  if(pair.en.startsWith('es/'))errors.push(`English route is incorrectly under /es/: ${pair.en}`);
  if(!pair.es.startsWith('es/'))errors.push(`Spanish route is not under /es/: ${pair.es}`);
  const enPath=path.join(ROOT,pair.en);
  const esPath=path.join(ROOT,pair.es);
  if(!await exists(enPath))errors.push(`Missing English route: ${pair.en}`);
  if(!await exists(esPath))errors.push(`Missing Spanish route: ${pair.es}`);
  if(await exists(esPath)&&path.extname(esPath).toLowerCase()==='.html'){
    const html=await fs.readFile(esPath,'utf8');
    if(!/<html\b[^>]*\blang=["']es["']/i.test(html))errors.push(`Spanish page is missing lang="es": ${pair.es}`);
    if(!/hreflang=["']en["']/i.test(html)||!/hreflang=["']es["']/i.test(html))warnings.push(`Static hreflang links are not both present in ${pair.es}; runtime alternates may still be added by nldg-i18n.js.`);
  }
}

const fallback='es/proximamente.html';
if(!await exists(path.join(ROOT,fallback)))errors.push(`Missing Spanish fallback route: ${fallback}`);
else notes.push(`Verified fallback route ${fallback}.`);
notes.push(`Verified ${pairs.length} registered English/Spanish route pair${pairs.length===1?'':'s'}.`);

const report=[
  errors.length?'FAILED':'PASSED',
  ...errors.map(item=>`ERROR: ${item}`),
  ...warnings.map(item=>`WARNING: ${item}`),
  ...notes.map(item=>`OK: ${item}`)
].join('\n');
console.log(report);
if(errors.length)process.exitCode=1;
