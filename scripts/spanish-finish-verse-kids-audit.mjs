import { promises as fs } from 'node:fs';
import vm from 'node:vm';
import process from 'node:process';

const errors=[];
const notes=[];
const label='Finish the Verse Kids';

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
    'es/juegos-contenido-completa-versiculo-ninos.js'
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
  for(const audience of ['family','preschool','kids']){
    if(!spanish.reviewedAudiences?.includes(audience))errors.push(`[${label}] ${audience} must remain registered as a reviewed NTV audience.`);
  }
  if(spanish.reviewedQuestionCount!==60)errors.push(`[${label}] Expected 60 reviewed audience entries after Family + Preschool + Kids; found ${spanish.reviewedQuestionCount||0}.`);
  if(!String(spanish.copyrightNotice||'').includes('NTV')||!String(spanish.copyrightNotice||'').includes('2010')||!String(spanish.copyrightNotice||'').includes('Tyndale'))errors.push(`[${label}] Missing required NTV/Tyndale copyright credit metadata.`);

  const sourceQuestions=extra?.kids;
  const audience=spanish.audiences?.kids;
  if(!Array.isArray(sourceQuestions))errors.push(`[${label}] Missing canonical Kids audience bank.`);
  if(!audience)errors.push(`[${label}] Missing reviewed Kids audience extension.`);
  if(Array.isArray(sourceQuestions)&&sourceQuestions.length!==20)errors.push(`[${label}] Expected 20 canonical Kids questions; found ${sourceQuestions.length}.`);
  if(audience&&audience.sourceQuestionCount!==20)errors.push(`[${label}] Kids module must declare 20 source questions; found ${audience.sourceQuestionCount||0}.`);

  if(Array.isArray(sourceQuestions)&&audience){
    const displayEntries=audience.entries||{};
    if(Object.keys(displayEntries).length!==sourceQuestions.length)errors.push(`[${label}] Expected exactly ${sourceQuestions.length} reviewed Kids NTV entries; found ${Object.keys(displayEntries).length}.`);
    const references=new Set();
    for(const item of sourceQuestions){
      if(!Array.isArray(item)||item.length!==4){errors.push(`[${label}] Malformed canonical Kids question.`);continue;}
      const [reference,prompt,answer,choices]=item;
      references.add(reference);
      const entry=displayEntries[reference];
      if(!entry){errors.push(`[${label}] Missing reviewed NTV Kids entry: ${reference}`);continue;}
      if(entry.verified!==true)errors.push(`[${label}] Kids entry is not marked verified: ${reference}`);
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
    if(references.size!==sourceQuestions.length)errors.push(`[${label}] Kids bank contains duplicate Scripture references.`);
  }

  const kids=spanish.audiences?.kids?.entries||{};
  const protectedWording={
    'Isaiah 40:31':'En cambio, los que confían en el Señor encontrarán nuevas ____.',
    'Colossians 3:2':'Piensen en las cosas del ____, no en las de la tierra.',
    'Romans 12:12':'Tengan paciencia en las dificultades y sigan ____.',
    'Ephesians 2:10':'Pues somos la ____ de Dios. Él nos creó de nuevo en Cristo Jesús.',
    'Colossians 3:23':'Trabajen ____ en todo lo que hagan, como si fuera para el Señor y no para la gente.',
    'Mark 12:30':'Ama al Señor tu Dios con todo tu ____, con toda tu alma, con toda tu mente y con todas tus fuerzas.',
    'Psalm 91:2':'Solo él es mi refugio, mi ____; él es mi Dios y en él confío.'
  };
  for(const [reference,prompt] of Object.entries(protectedWording)){
    if(kids[reference]?.prompt!==prompt)errors.push(`[${label}] ${reference} must preserve the reviewed NTV-specific wording.`);
  }
}

if(!errors.length){
  notes.push(`${label}: verified 20 Kids questions against the reviewed NTV display extension.`);
  notes.push(`${label}: Family and Preschool remain intact, Kids is registered, and the combined reviewed count is 60.`);
  notes.push(`${label}: source-answer mapping, choices, localized references, NTV metadata, and translation-specific wording are protected.`);
}

console.log([errors.length?'FAILED':'PASSED',...errors.map(item=>`ERROR: ${item}`),...notes.map(item=>`OK: ${item}`)].join('\n'));
if(errors.length)process.exitCode=1;