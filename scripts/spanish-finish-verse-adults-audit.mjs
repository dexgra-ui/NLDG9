import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];
const label='Finish the Verse Adults';

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
    'es/juegos-contenido-completa-versiculo-adolescentes.js',
    'es/juegos-contenido-completa-versiculo-adultos.js'
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
  for(const audience of ['family','preschool','kids','teens','adults']){
    if(!spanish.reviewedAudiences?.includes(audience))errors.push(`[${label}] ${audience} must remain registered as a reviewed NTV audience.`);
  }
  if(spanish.reviewedQuestionCount!==100)errors.push(`[${label}] Expected 100 reviewed audience entries after all five audiences; found ${spanish.reviewedQuestionCount||0}.`);
  if(!String(spanish.copyrightNotice||'').includes('NTV')||!String(spanish.copyrightNotice||'').includes('2010')||!String(spanish.copyrightNotice||'').includes('Tyndale'))errors.push(`[${label}] Missing required NTV/Tyndale copyright credit metadata.`);

  const sourceQuestions=extra?.adults;
  const audience=spanish.audiences?.adults;
  if(!Array.isArray(sourceQuestions))errors.push(`[${label}] Missing canonical Adults audience bank.`);
  if(!audience)errors.push(`[${label}] Missing reviewed Adults audience extension.`);
  if(Array.isArray(sourceQuestions)&&sourceQuestions.length!==20)errors.push(`[${label}] Expected 20 canonical Adults questions; found ${sourceQuestions.length}.`);
  if(audience&&audience.sourceQuestionCount!==20)errors.push(`[${label}] Adults module must declare 20 source questions; found ${audience.sourceQuestionCount||0}.`);

  if(Array.isArray(sourceQuestions)&&audience){
    const displayEntries=audience.entries||{};
    if(Object.keys(displayEntries).length!==sourceQuestions.length)errors.push(`[${label}] Expected exactly ${sourceQuestions.length} reviewed Adults NTV entries; found ${Object.keys(displayEntries).length}.`);
    const references=new Set();
    for(const item of sourceQuestions){
      if(!Array.isArray(item)||item.length!==4){errors.push(`[${label}] Malformed canonical Adults question.`);continue;}
      const [reference,prompt,answer,choices]=item;
      references.add(reference);
      const entry=displayEntries[reference];
      if(!entry){errors.push(`[${label}] Missing reviewed NTV Adults entry: ${reference}`);continue;}
      if(entry.verified!==true)errors.push(`[${label}] Adults entry is not marked verified: ${reference}`);
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
    if(references.size!==sourceQuestions.length)errors.push(`[${label}] Adults bank contains duplicate Scripture references.`);
  }

  const adults=spanish.audiences?.adults?.entries||{};
  const protectedWording={
    '2 Timothy 3:16':'Toda la Escritura es inspirada por ____ y es útil para enseñarnos lo que es verdad.',
    'James 2:17':'A menos que produzca buenas acciones, la fe está ____ y es inútil.',
    'Romans 5:3':'También nos alegramos al enfrentar pruebas y dificultades porque sabemos que nos ayudan a desarrollar ____.',
    'Hebrews 4:12':'Pues la palabra de Dios es viva y ____.',
    'Romans 14:19':'Por lo tanto, procuremos que haya ____ en la iglesia y tratemos de edificarnos unos a otros.',
    '2 Corinthians 12:9':'Cada vez él me dijo: «Mi gracia es todo lo que ____; mi poder actúa mejor en la debilidad».',
    'Hebrews 10:24':'Pensemos en maneras de motivarnos unos a otros a realizar actos de amor y buenas ____.',
    'James 3:17':'Sin embargo, la sabiduría que proviene del cielo es, ante todo, ____ y también ama la paz.'
  };
  for(const [reference,prompt] of Object.entries(protectedWording)){
    if(adults[reference]?.prompt!==prompt)errors.push(`[${label}] ${reference} must preserve the reviewed NTV-specific wording.`);
  }
}

if(!errors.length){
  notes.push(`${label}: verified 20 Adults questions against the reviewed NTV display extension.`);
  notes.push(`${label}: all five audiences are registered and the combined reviewed count is 100.`);
  notes.push(`${label}: source-answer mapping, choices, localized references, NTV metadata, and translation-specific wording are protected.`);
  notes.push(`${label}: Finish the Verse Spanish audience coverage is complete.`);
}

console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;