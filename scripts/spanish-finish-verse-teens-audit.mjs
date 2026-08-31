import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];
const label='Finish the Verse Teens';

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
  for(const file of [
    'es/juegos-contenido-completa-versiculo.js',
    'es/juegos-contenido-completa-versiculo-preescolar.js',
    'es/juegos-contenido-completa-versiculo-ninos.js',
    'es/juegos-contenido-completa-versiculo-adolescentes.js'
  ]){
    vm.runInNewContext(await fs.readFile(file,'utf8'),sandbox);
  }
  spanish=sandbox.window.NLDG_ES_FINISH_VERSE;
  if(!spanish)throw new Error('Spanish Finish the Verse modules did not expose NLDG_ES_FINISH_VERSE.');
}catch(error){
  errors.push(error.message);
}

if(spanish){
  if(spanish.translation!=='NTV')errors.push(`[${label}] Spanish translation standard must remain NTV.`);
  for(const audience of ['family','preschool','kids','teens']){
    if(!spanish.reviewedAudiences?.includes(audience))errors.push(`[${label}] ${audience} must remain registered as a reviewed NTV audience.`);
  }
  if(spanish.reviewedQuestionCount!==80)errors.push(`[${label}] Expected 80 reviewed audience entries after Family + Preschool + Kids + Teens; found ${spanish.reviewedQuestionCount||0}.`);
  if(!String(spanish.copyrightNotice||'').includes('NTV')||!String(spanish.copyrightNotice||'').includes('2010')||!String(spanish.copyrightNotice||'').includes('Tyndale'))errors.push(`[${label}] Missing required NTV/Tyndale copyright credit metadata.`);

  const sourceQuestions=extra?.teens;
  const audience=spanish.audiences?.teens;
  if(!Array.isArray(sourceQuestions))errors.push(`[${label}] Missing canonical Teens audience bank.`);
  if(!audience)errors.push(`[${label}] Missing reviewed Teens audience extension.`);
  if(Array.isArray(sourceQuestions)&&sourceQuestions.length!==20)errors.push(`[${label}] Expected 20 canonical Teens questions; found ${sourceQuestions.length}.`);
  if(audience&&audience.sourceQuestionCount!==20)errors.push(`[${label}] Teens module must declare 20 source questions; found ${audience.sourceQuestionCount||0}.`);

  if(Array.isArray(sourceQuestions)&&audience){
    const displayEntries=audience.entries||{};
    if(Object.keys(displayEntries).length!==sourceQuestions.length)errors.push(`[${label}] Expected exactly ${sourceQuestions.length} reviewed Teens NTV entries; found ${Object.keys(displayEntries).length}.`);
    const references=new Set();
    for(const item of sourceQuestions){
      if(!Array.isArray(item)||item.length!==4){errors.push(`[${label}] Malformed canonical Teens question.`);continue;}
      const [reference,prompt,answer,choices]=item;
      references.add(reference);
      const entry=displayEntries[reference];
      if(!entry){errors.push(`[${label}] Missing reviewed NTV Teens entry: ${reference}`);continue;}
      if(entry.verified!==true)errors.push(`[${label}] Teens entry is not marked verified: ${reference}`);
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
    if(references.size!==sourceQuestions.length)errors.push(`[${label}] Teens bank contains duplicate Scripture references.`);
  }

  const teens=spanish.audiences?.teens?.entries||{};
  const protectedWording={
    'Ephesians 2:8':'Dios los salvó por su gracia cuando ____.',
    'Philippians 1:6':'Dios, quien comenzó la buena obra en ustedes, la continuará hasta que quede completamente ____.',
    'Psalm 139:14':'¡Gracias por hacerme tan maravillosamente ____!',
    'John 10:10':'Mi propósito es darles una ____ plena y abundante.'
  };
  for(const [reference,prompt] of Object.entries(protectedWording)){
    if(teens[reference]?.prompt!==prompt)errors.push(`[${label}] ${reference} must preserve the reviewed NTV-specific wording.`);
  }
}

if(!errors.length){
  notes.push(`${label}: verified 20 Teens questions against the reviewed NTV display extension.`);
  notes.push(`${label}: Family, Preschool, and Kids remain intact, Teens is registered, and the combined reviewed count is 80.`);
  notes.push(`${label}: source-answer mapping, choices, localized references, NTV metadata, and translation-specific wording are protected.`);
}

console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;