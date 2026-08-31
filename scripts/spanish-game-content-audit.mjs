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
  if(!module?.prompts)throw new Error(`Spanish ${label} module did not expose prompts.`);
  return module;
}

async function auditGame({label,sourceFile,moduleFile,globalName,labelField}){
  let bank,spanish;
  try{bank=await readBank(sourceFile,label);spanish=await readModule(moduleFile,globalName,label);}
  catch(error){errors.push(error.message);return;}
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

notes.push('English game banks remain canonical; Spanish content modules are audited display-layer counterparts.');
console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;
