import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];
const label='Finish the Verse Preschool';

const hasLocalizedReference=(reference,referenceBooks)=>{
  const books=Object.keys(referenceBooks||{}).sort((a,b)=>b.length-a.length);
  return books.some(book=>reference===book||reference.startsWith(`${book} `));
};

let extra,spanish;
try{
  const source=await fs.readFile('finish-the-verse.html','utf8');
  const match=source.match(/const EXTRA=(\{[\s\S]*?\});\s*const BANK=/);
  if(!match)throw new Error('Could not read the Finish the Verse audience banks.');
  extra=vm.runInNewContext(`(${match[1]})`,Object.create(null));

  const sandbox={window:{}};
  const baseSource=await fs.readFile('es/juegos-contenido-completa-versiculo.js','utf8');
  const preschoolSource=await fs.readFile('es/juegos-contenido-completa-versiculo-preescolar.js','utf8');
  vm.runInNewContext(baseSource,sandbox);
  vm.runInNewContext(preschoolSource,sandbox);
  spanish=sandbox.window.NLDG_ES_FINISH_VERSE;
  if(!spanish)throw new Error('Spanish Finish the Verse modules did not expose NLDG_ES_FINISH_VERSE.');
}catch(error){
  errors.push(error.message);
}

if(spanish){
  if(spanish.translation!=='NTV')errors.push(`[${label}] Spanish translation standard must remain NTV.`);
  if(!spanish.reviewedAudiences?.includes('family'))errors.push(`[${label}] Family must remain a reviewed NTV audience.`);
  if(!spanish.reviewedAudiences?.includes('preschool'))errors.push(`[${label}] Preschool must be registered as a reviewed NTV audience.`);
  if(spanish.reviewedQuestionCount!==40)errors.push(`[${label}] Expected 40 reviewed audience entries after Family + Preschool; found ${spanish.reviewedQuestionCount||0}.`);
  if(!String(spanish.copyrightNotice||'').includes('NTV')||!String(spanish.copyrightNotice||'').includes('2010')||!String(spanish.copyrightNotice||'').includes('Tyndale'))errors.push(`[${label}] Missing required NTV/Tyndale copyright credit metadata.`);

  const sourceQuestions=extra?.preschool;
  const audience=spanish.audiences?.preschool;
  if(!Array.isArray(sourceQuestions))errors.push(`[${label}] Missing canonical Preschool audience bank.`);
  if(!audience)errors.push(`[${label}] Missing reviewed Preschool audience extension.`);
  if(Array.isArray(sourceQuestions)&&sourceQuestions.length!==20)errors.push(`[${label}] Expected 20 canonical Preschool questions; found ${sourceQuestions.length}.`);
  if(audience&&audience.sourceQuestionCount!==20)errors.push(`[${label}] Preschool module must declare 20 source questions; found ${audience.sourceQuestionCount||0}.`);

  if(Array.isArray(sourceQuestions)&&audience){
    const displayEntries=audience.entries||{};
    if(Object.keys(displayEntries).length!==sourceQuestions.length)errors.push(`[${label}] Expected exactly ${sourceQuestions.length} reviewed Preschool NTV entries; found ${Object.keys(displayEntries).length}.`);
    const references=new Set();
    for(const item of sourceQuestions){
      if(!Array.isArray(item)||item.length!==4){errors.push(`[${label}] Malformed canonical Preschool question.`);continue;}
      const [reference,prompt,answer,choices]=item;
      references.add(reference);
      const entry=displayEntries[reference];
      if(!entry){errors.push(`[${label}] Missing reviewed NTV Preschool entry: ${reference}`);continue;}
      if(entry.verified!==true)errors.push(`[${label}] Preschool entry is not marked verified: ${reference}`);
      if(entry.sourceAnswer!==answer)errors.push(`[${label}] Source-answer mismatch for ${reference}: expected "${answer}", found "${entry.sourceAnswer}".`);
      if(!Array.isArray(choices)||!choices.includes(answer))errors.push(`[${label}] Canonical correct answer is not present in choices: ${reference}`);
      if((String(prompt).match(/____/g)||[]).length!==1)errors.push(`[${label}] Canonical question must contain exactly one blank: ${reference}`);
      if((String(entry.prompt||'').match(/____/g)||[]).length!==1)errors.push(`[${label}] Spanish NTV question must contain exactly one blank: ${reference}`);
      for(const choice of choices||[]){if(!entry.choiceMap?.[choice])errors.push(`[${label}] Missing Spanish display choice "${choice}" for ${reference}`);}
      if(entry.choiceMap?.[answer]!==entry.answer)errors.push(`[${label}] Spanish correct-answer display does not match choice map for ${reference}`);
      const translated=(choices||[]).map(choice=>entry.choiceMap?.[choice]);
      if(translated.every(Boolean)&&new Set(translated).size!==translated.length)errors.push(`[${label}] Spanish answer choices collapse into duplicates for ${reference}`);
      if(!hasLocalizedReference(reference,spanish.referenceBooks||{}))errors.push(`[${label}] Missing Spanish Bible-book label for reference ${reference}`);
    }
    if(references.size!==sourceQuestions.length)errors.push(`[${label}] Preschool bank contains duplicate Scripture references.`);
  }

  const luke=spanish.audiences?.preschool?.entries?.['Luke 1:37'];
  if(luke?.prompt!=='Pues la palabra de ____ nunca dejará de cumplirse.')errors.push(`[${label}] Luke 1:37 must preserve the reviewed NTV wording rather than substitute another translation/manuscript rendering.`);
}

if(!errors.length){
  notes.push(`${label}: verified 20 Preschool questions against the reviewed NTV display extension.`);
  notes.push(`${label}: Family remains intact, Preschool is registered, and the combined reviewed count is 40.`);
  notes.push(`${label}: source-answer mapping, choices, references, NTV metadata, and Luke 1:37 wording are protected.`);
}

console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;