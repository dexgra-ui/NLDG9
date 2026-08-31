import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: contains disallowed ${JSON.stringify(value)}`)};
const loadSeries=(...files)=>{
  const context={window:{}};vm.createContext(context);
  for(const file of files)vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_BOOK_STUDY;
};

const required=[
  'es/rut-estudio.html','ruth-study-data-es.js','book-study-series-es.js','es/biblical-study-map-links.js',
  'ruth-study.html','ruth-study-data.js','ruth-study-guide.js','book-study-series.js','nldg-i18n.js','es/estudios-biblicos.html'
];
for(const file of required)if(!exists(file))errors.push(`Required Ruth bilingual resource is missing: ${file}`);

const en=loadSeries('ruth-study-data.js','ruth-study-guide.js');
const es=loadSeries('ruth-study-data-es.js');
if(!en||!es)errors.push('Unable to load English and Spanish Ruth study data.');
if(en?.lessons?.length!==5)errors.push(`Expected 5 English Ruth lessons, found ${en?.lessons?.length??0}.`);
if(es?.lessons?.length!==5)errors.push(`Expected 5 Spanish Ruth lessons, found ${es?.lessons?.length??0}.`);
if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Spanish Ruth study must declare Nueva Traducción Viviente (NTV) as its Scripture standard.');
if(es?.seriesGuideBlocks?.length!==en?.seriesGuideBlocks?.length)errors.push(`Spanish Ruth guide block count ${es?.seriesGuideBlocks?.length??0} does not match English ${en?.seriesGuideBlocks?.length??0}.`);

const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
for(let i=0;i<Math.min(en?.lessons?.length||0,es?.lessons?.length||0);i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Ruth lesson ${i+1}`;
  if(a.number!==b.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of fields)if(!String(b[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const arrayField of ['supporting','teaching','questions']){
    if(!Array.isArray(b[arrayField]))errors.push(`${label}: Spanish ${arrayField} is not an array.`);
    else if(b[arrayField].length!==a[arrayField].length)errors.push(`${label}: Spanish ${arrayField} count ${b[arrayField].length} does not match English ${a[arrayField].length}.`);
  }
  for(const movement of b.teaching||[])if(!movement.heading?.trim()||!movement.body?.trim())errors.push(`${label}: incomplete Spanish teaching movement.`);
}

const spanishData=read('ruth-study-data-es.js');
for(const version of ['RVR60','NVI','NBLA'])reject('Spanish Ruth data',spanishData,version);
for(const englishLeak of ['Discussion Questions','Personal examination','Weekly practice','Closing prayer','Leader guidance'])reject('Spanish Ruth data',spanishData,englishLeak);

const page=read('es/rut-estudio.html');
expect('Spanish Ruth page',page,'<html lang="es"');
expect('Spanish Ruth page',page,'https://nolabelsdesignedbygod.org/es/rut-estudio.html');
expect('Spanish Ruth page',page,'hreflang="en" href="https://nolabelsdesignedbygod.org/ruth-study.html"');
expect('Spanish Ruth page',page,'../ruth-study-data-es.js?v=1.0.0');
expect('Spanish Ruth page',page,'../book-study-series.js?v=0.1.0');
expect('Spanish Ruth page',page,'../book-study-series-es.js?v=1.0.0');
expect('Spanish Ruth page',page,'../nldg-i18n.js?v=1.11.0');

const englishPage=read('ruth-study.html');
expect('English Ruth page',englishPage,'nldg-i18n.js?v=1.11.0');
const i18n=read('nldg-i18n.js');
expect('Ruth route pair',i18n,"'ruth-study.html':'es/rut-estudio.html'");
const hub=read('es/estudios-biblicos.html');
expect('Spanish study hub',hub,'Estudios por libro');
expect('Spanish study hub',hub,'href="rut-estudio.html"');
expect('Spanish study hub',hub,'5 lecciones completas');
expect('Spanish study hub',hub,'nldg-i18n.js?v=1.11.0');

const adapter=read('book-study-series-es.js');
for(const marker of ['Estudio bíblico libro por libro','Lección $1 de $2','El progreso se guarda en este dispositivo','Referencia bíblica: NTV'])expect('Spanish book-series adapter',adapter,marker);
const mapBridge=read('es/biblical-study-map-links.js');
expect('Spanish Ruth geography bridge',mapBridge,'Ubica Rut en el mundo bíblico');
expect('Spanish Ruth geography bridge',mapBridge,'../biblical-map-tribes.html');
expect('Spanish Ruth geography bridge',mapBridge,'inglés');

if(errors.length){
  console.error('Spanish Book Series Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Book Series Audit PASSED');
console.log('OK: Ruth has 5 complete English lessons and 5 structurally matched Spanish lessons.');
console.log('OK: Spanish Ruth preserves guide, teaching, discussion, application, safeguard, and prayer structure.');
console.log('OK: Ruth uses the shared book-series mechanics with a reusable Spanish UI adapter.');
console.log('OK: NTV is declared without mixing Spanish Bible-version labels.');
console.log('OK: the English/Spanish Ruth route pair and Spanish library entry are protected.');
