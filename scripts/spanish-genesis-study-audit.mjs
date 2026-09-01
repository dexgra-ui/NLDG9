import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=path=>fs.readFileSync(path,'utf8');
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const fail=message=>errors.push(message);
const book=spanishOldTestamentByKey.get('genesis');

for(const file of ['genesis-study-data.js','genesis-study-guide.js','genesis-study-data-es.js','genesis-study.html','es/genesis-estudio.html','es/estudios-biblicos.html','nldg-i18n.js']){
  if(!fs.existsSync(file))fail(`Missing ${file}.`);
}

if(book?.status!=='published')fail('Genesis must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load('genesis-study-data.js','genesis-study-guide.js');
  const es=load('genesis-study-data-es.js');
  if(es.slug!=='genesis-estudio')fail('Spanish Genesis slug must be genesis-estudio.');
  if(es.book!=='Génesis')fail('Spanish book name must be Génesis.');
  if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Genesis must declare the NTV editorial standard.');
  if(en.lessons.length!==8||es.lessons.length!==8)fail('Genesis must contain eight lessons in both languages.');
  const required=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<Math.min(en.lessons.length,es.lessons.length);i++){
    const source=en.lessons[i],translation=es.lessons[i],label=`Lesson ${i+1}`;
    if(source.number!==translation.number)fail(`${label}: lesson number mismatch.`);
    for(const field of required)if(!String(translation[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions']){
      if(!Array.isArray(translation[field]))fail(`${label}: ${field} must be an array.`);
      else if(translation[field].length!==(source[field]?.length||0))fail(`${label}: ${field} count must match English.`);
    }
  }

  const text=read('genesis-study-data-es.js').toLowerCase();
  const safeguards=[
    ['image-bearing dignity','imagen de dios'],
    ['Cain racism safeguard','señal es protección, no una marca racial'],
    ['Ham/Canaan slavery safeguard','maldición recae sobre canaán, no sobre una raza'],
    ['Hagar dignity safeguard','hagar es vista por dios'],
    ['Sodom sexual-violence safeguard','violación colectiva'],
    ['Sodom anti-LGBTQ safeguard','personas lgbtq'],
    ['Isaac child-safety safeguard','dios no autoriza abuso infantil'],
    ['Jacob disability dignity safeguard','discapacidad no es vergüenza'],
    ['Joseph trafficking safeguard','trata de personas'],
    ['Joseph coercion safeguard','coerción sexual'],
    ['reconciliation boundaries safeguard','reconciliación no puede forzarse'],
    ['providence safeguard','providencia nunca excusa métodos dañinos']
  ];
  for(const [label,needle] of safeguards)if(!text.includes(needle))fail(`Missing ${label}.`);

  const enPage=read('genesis-study.html');
  const esPage=read('es/genesis-estudio.html');
  const i18n=read('nldg-i18n.js');
  const hub=read('es/estudios-biblicos.html');
  for(const marker of [
    'hreflang="es" href="https://nolabelsdesignedbygod.org/es/genesis-estudio.html"',
    'nldg-i18n.js'
  ])if(!enPage.includes(marker))fail(`English Genesis page missing ${marker}.`);
  for(const marker of [
    '<html lang="es"',
    'https://nolabelsdesignedbygod.org/es/genesis-estudio.html',
    'hreflang="en" href="https://nolabelsdesignedbygod.org/genesis-study.html"',
    '../genesis-study-data-es.js',
    '../book-study-series-es.js',
    '../nldg-i18n.js'
  ])if(!esPage.includes(marker))fail(`Spanish Genesis page missing ${marker}.`);
  if(!i18n.includes("'genesis-study.html':'es/genesis-estudio.html'"))fail('Genesis bilingual route is missing.');
  if(!hub.includes('href="genesis-estudio.html"'))fail('Spanish Genesis library card is missing.');
  if(!hub.includes('veintinueve series completas y revisadas'))fail('Spanish library count must be updated to twenty-nine series.');
}

if(errors.length){
  console.error('Spanish Genesis study audit failed:');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log('Spanish Genesis study audit passed.');