import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];
const groups=['preschool','kids','teens','adults','family'];

async function readBank(file,label){
  const source=await fs.readFile(file,'utf8');
  const match=source.match(/const BANK=(\{[\s\S]*?\});\s*const \$=/);
  if(!match)throw new Error(`Could not read the ${label} question bank.`);
  try{return vm.runInNewContext(`(${match[1]})`,Object.create(null));}
  catch(error){throw new Error(`Could not parse the ${label} bank: ${error.message}`);}
}

async function readModule(file,globalName,label){
  const source=await fs.readFile(file,'utf8');
  const sandbox={window:{}};
  try{vm.runInNewContext(source,sandbox);}
  catch(error){throw new Error(`Could not parse the Spanish ${label} content module: ${error.message}`);}
  const module=sandbox.window[globalName];
  if(!module)throw new Error(`Spanish ${label} module did not expose ${globalName}.`);
  return module;
}

async function auditGame({label,sourceFile,moduleFile,globalName,labelField}){
  let bank,spanish;
  try{bank=await readBank(sourceFile,label);spanish=await readModule(moduleFile,globalName,label);}
  catch(error){errors.push(error.message);return;}
  if(!spanish.prompts){errors.push(`Spanish ${label} module did not expose prompts.`);return;}
  const labels=spanish[labelField];
  if(!labels){errors.push(`Spanish ${label} module did not expose ${labelField}.`);return;}
  const entries=[];
  for(const group of groups){
    const questions=bank[group];
    if(!Array.isArray(questions)){errors.push(`[${label}] Missing canonical audience bank: ${group}`);continue;}
    for(const item of questions){
      if(!Array.isArray(item)||item.length!==3){errors.push(`[${label}] Malformed canonical question in ${group}`);continue;}
      const [prompt,answer,choices]=item;
      entries.push({group,prompt,answer,choices});
      if(!spanish.prompts[prompt])errors.push(`[${label}] Missing Spanish prompt [${group}]: ${prompt}`);
      if(!Array.isArray(choices)||!choices.includes(answer))errors.push(`[${label}] Canonical answer is not present in choices [${group}]: ${prompt}`);
      for(const choice of choices||[]){if(!labels[choice])errors.push(`[${label}] Missing Spanish answer label [${group}]: ${choice}`);}
      if(!labels[answer])errors.push(`[${label}] Missing Spanish correct-answer label [${group}]: ${answer}`);
      const translated=(choices||[]).map(choice=>labels[choice]);
      if(new Set(translated).size!==translated.length)errors.push(`[${label}] Spanish answer labels collapse into duplicates [${group}]: ${prompt}`);
    }
  }
  if(entries.length!==100)errors.push(`[${label}] Expected 100 canonical questions; found ${entries.length}.`);
  if(spanish.sourceQuestionCount!==entries.length)errors.push(`[${label}] Spanish module declares ${spanish.sourceQuestionCount} source questions; canonical bank has ${entries.length}.`);
  notes.push(`${label}: verified ${entries.length} canonical questions across ${groups.length} audience banks.`);
  notes.push(`${label}: verified Spanish prompt coverage for ${new Set(entries.map(item=>item.prompt)).size} unique source questions.`);
  notes.push(`${label}: verified Spanish labels for every answer choice used by the canonical bank.`);
}

async function auditMemory(){
  const label='Memory Match';
  let source,spanish;
  try{
    source=await fs.readFile('memory-match.html','utf8');
    spanish=await readModule('es/juegos-contenido-memoria.js','NLDG_ES_MEMORY',label);
  }catch(error){errors.push(error.message);return;}
  const baseMatch=source.match(/const BASE=(\[[\s\S]*?\]);\s*const EXTRA=/);
  const extraMatch=source.match(/const EXTRA=(\{[\s\S]*?\});\s*const BANK=/);
  if(!baseMatch||!extraMatch){errors.push(`[${label}] Could not read canonical BASE/EXTRA pair banks.`);return;}
  let base,extra;
  try{
    base=vm.runInNewContext(`(${baseMatch[1]})`,Object.create(null));
    extra=vm.runInNewContext(`(${extraMatch[1]})`,Object.create(null));
  }catch(error){errors.push(`[${label}] Could not parse canonical pair bank: ${error.message}`);return;}
  const labels=spanish.labels;
  if(!labels){errors.push(`[${label}] Spanish module did not expose labels.`);return;}
  const entries=[];
  for(const group of groups){
    const pairs=[...base,...(extra[group]||[])];
    if(!Array.isArray(extra[group]))errors.push(`[${label}] Missing canonical audience extras: ${group}`);
    for(const pair of pairs){
      if(!Array.isArray(pair)||pair.length!==2){errors.push(`[${label}] Malformed pair in ${group}`);continue;}
      entries.push({group,pair});
      const translated=pair.map(item=>labels[item]);
      pair.forEach(item=>{if(!labels[item])errors.push(`[${label}] Missing Spanish card label [${group}]: ${item}`);});
      if(translated.every(Boolean)&&translated[0]===translated[1])errors.push(`[${label}] Spanish pair collapses into duplicate labels [${group}]: ${pair.join(' ↔ ')}`);
    }
  }
  const uniquePairs=new Set(entries.map(({pair})=>pair.join('|')));
  if(entries.length!==137)errors.push(`[${label}] Expected 137 canonical audience-pair entries; found ${entries.length}.`);
  if(uniquePairs.size!==49)errors.push(`[${label}] Expected 49 unique canonical pair combinations; found ${uniquePairs.size}.`);
  if(spanish.sourcePairCount!==entries.length)errors.push(`[${label}] Spanish module declares ${spanish.sourcePairCount} source pair entries; canonical banks have ${entries.length}.`);
  if(spanish.uniquePairCount!==uniquePairs.size)errors.push(`[${label}] Spanish module declares ${spanish.uniquePairCount} unique pairs; canonical banks have ${uniquePairs.size}.`);
  notes.push(`${label}: verified ${entries.length} canonical audience-pair entries across ${groups.length} audience banks.`);
  notes.push(`${label}: verified ${uniquePairs.size} unique pair combinations and every visible Spanish card label.`);
}

await auditGame({
  label:'Who Am I',
  sourceFile:'who-am-i.html',
  moduleFile:'es/juegos-contenido-quien-soy.js',
  globalName:'NLDG_ES_WHO_AM_I',
  labelField:'names'
});
await auditGame({
  label:'Lightning Round',
  sourceFile:'lightning-round.html',
  moduleFile:'es/juegos-contenido-ronda-relampago.js',
  globalName:'NLDG_ES_LIGHTNING',
  labelField:'labels'
});
await auditMemory();

notes.push('English game banks remain canonical; Spanish content modules are audited display-layer counterparts.');
console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;
