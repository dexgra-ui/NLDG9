import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];

const source=await fs.readFile('who-am-i.html','utf8');
const bankMatch=source.match(/const BANK=(\{[\s\S]*?\});\s*const \$=/);
if(!bankMatch){
  console.error('FAILED\nERROR: Could not read the Who Am I question bank.');
  process.exit(1);
}

let bank;
try{bank=vm.runInNewContext(`(${bankMatch[1]})`,Object.create(null));}
catch(error){
  console.error(`FAILED\nERROR: Could not parse the Who Am I bank: ${error.message}`);
  process.exit(1);
}

const spanishSource=await fs.readFile('es/juegos-contenido-quien-soy.js','utf8');
const sandbox={window:{}};
try{vm.runInNewContext(spanishSource,sandbox);}
catch(error){
  console.error(`FAILED\nERROR: Could not parse the Spanish Who Am I content module: ${error.message}`);
  process.exit(1);
}
const spanish=sandbox.window.NLDG_ES_WHO_AM_I;
if(!spanish?.prompts||!spanish?.names){
  console.error('FAILED\nERROR: Spanish Who Am I module did not expose prompts and names.');
  process.exit(1);
}

const groups=['preschool','kids','teens','adults','family'];
const entries=[];
for(const group of groups){
  const questions=bank[group];
  if(!Array.isArray(questions)){errors.push(`Missing canonical audience bank: ${group}`);continue;}
  for(const item of questions){
    if(!Array.isArray(item)||item.length!==3){errors.push(`Malformed canonical question in ${group}`);continue;}
    const [prompt,answer,choices]=item;
    entries.push({group,prompt,answer,choices});
    if(!spanish.prompts[prompt])errors.push(`Missing Spanish prompt [${group}]: ${prompt}`);
    if(!Array.isArray(choices)||!choices.includes(answer))errors.push(`Canonical answer is not present in choices [${group}]: ${prompt}`);
    for(const choice of choices||[]){if(!spanish.names[choice])errors.push(`Missing Spanish answer label [${group}]: ${choice}`);}
    if(!spanish.names[answer])errors.push(`Missing Spanish correct-answer label [${group}]: ${answer}`);
    const translated=(choices||[]).map(choice=>spanish.names[choice]);
    if(new Set(translated).size!==translated.length)errors.push(`Spanish answer labels collapse into duplicates [${group}]: ${prompt}`);
  }
}

if(entries.length!==100)errors.push(`Expected 100 canonical Who Am I questions; found ${entries.length}.`);
if(spanish.sourceQuestionCount!==entries.length)errors.push(`Spanish module declares ${spanish.sourceQuestionCount} source questions; canonical bank has ${entries.length}.`);

notes.push(`Verified ${entries.length} canonical Who Am I questions across ${groups.length} audience banks.`);
notes.push(`Verified Spanish prompt coverage for ${new Set(entries.map(item=>item.prompt)).size} unique source clues.`);
notes.push(`Verified Spanish labels for every answer choice used by the canonical bank.`);
notes.push('English Who Am I remains the canonical question bank; Spanish content is a display-layer counterpart.');

console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;
