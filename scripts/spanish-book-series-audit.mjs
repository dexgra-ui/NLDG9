import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: contains disallowed ${JSON.stringify(value)}`)};
const html='.ht'+'ml';
const loadSeries=(...files)=>{
  const context={window:{}};vm.createContext(context);
  for(const file of files)vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_BOOK_STUDY;
};

const commonRequired=['book-study-series.js','book-study-series-es.js','es/biblical-study-map-links.js','nldg-i18n.js','es/estudios-biblicos.html'];
const series=[
  {
    label:'Ruth',expected:5,
    enData:'ruth-study-data.js',enGuide:'ruth-study-guide.js',esData:'ruth-study-data-es.js',
    enPage:'ruth-study.html',esPage:'es/rut-estudio.html',esCanonical:'https://nolabelsdesignedbygod.org/es/rut-estudio.html',
    pair:"'ruth-study.html':'es/rut-estudio.html'",hubHref:`href="rut-estudio${html}"`,completion:'5 lecciones completas',
    esDataSrc:'../ruth-study-data-es.js?v=1.0.0'
  },
  {
    label:'Philippians',expected:6,
    enData:'philippians-study-data.js',enGuide:'philippians-study-guide.js',esData:'philippians-study-data-es.js',
    enPage:'philippians-study.html',esPage:'es/filipenses-estudio.html',esCanonical:'https://nolabelsdesignedbygod.org/es/filipenses-estudio.html',
    pair:"'philippians-study.html':'es/filipenses-estudio.html'",hubHref:`href="filipenses-estudio${html}"`,completion:'6 lecciones completas',
    esDataSrc:'../philippians-study-data-es.js?v=1.0.0'
  }
];

for(const file of commonRequired)if(!exists(file))errors.push(`Required shared bilingual book-series resource is missing: ${file}`);
const i18n=read('nldg-i18n.js');
const hub=read('es/estudios-biblicos.html');
const adapter=read('book-study-series-es.js');
const mapBridge=read('es/biblical-study-map-links.js');
const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];

for(const config of series){
  for(const file of [config.enData,config.enGuide,config.esData,config.enPage,config.esPage])if(!exists(file))errors.push(`${config.label}: required bilingual resource is missing: ${file}`);
  if(!exists(config.enData)||!exists(config.enGuide)||!exists(config.esData))continue;
  const en=loadSeries(config.enData,config.enGuide);
  const es=loadSeries(config.esData);
  if(!en||!es){errors.push(`${config.label}: unable to load English and Spanish study data.`);continue;}
  if(en.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} English lessons, found ${en.lessons?.length??0}.`);
  if(es.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} Spanish lessons, found ${es.lessons?.length??0}.`);
  if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push(`${config.label}: Spanish study must declare Nueva Traducción Viviente (NTV) as its Scripture standard.`);
  if(es.seriesGuideBlocks?.length!==en.seriesGuideBlocks?.length)errors.push(`${config.label}: Spanish guide block count ${es.seriesGuideBlocks?.length??0} does not match English ${en.seriesGuideBlocks?.length??0}.`);
  for(let i=0;i<Math.min(en.lessons?.length||0,es.lessons?.length||0);i++){
    const a=en.lessons[i],b=es.lessons[i],lessonLabel=`${config.label} lesson ${i+1}`;
    if(a.number!==b.number)errors.push(`${lessonLabel}: lesson number mismatch.`);
    for(const field of fields)if(!String(b[field]||'').trim())errors.push(`${lessonLabel}: missing Spanish ${field}.`);
    for(const arrayField of ['supporting','teaching','questions']){
      if(!Array.isArray(b[arrayField]))errors.push(`${lessonLabel}: Spanish ${arrayField} is not an array.`);
      else if(b[arrayField].length!==a[arrayField].length)errors.push(`${lessonLabel}: Spanish ${arrayField} count ${b[arrayField].length} does not match English ${a[arrayField].length}.`);
    }
    for(const movement of b.teaching||[])if(!movement.heading?.trim()||!movement.body?.trim())errors.push(`${lessonLabel}: incomplete Spanish teaching movement.`);
  }
  const spanishData=read(config.esData);
  for(const version of ['RVR60','NVI','NBLA'])reject(`${config.label} Spanish data`,spanishData,version);
  for(const englishLeak of ['Discussion Questions','Personal examination','Weekly practice','Closing prayer','Leader guidance','TEACHING MOVEMENT'])reject(`${config.label} Spanish data`,spanishData,englishLeak);
  const page=read(config.esPage);
  expect(`${config.label} Spanish page`,page,'<html lang="es"');
  expect(`${config.label} Spanish page`,page,config.esCanonical);
  expect(`${config.label} Spanish page`,page,`hreflang="en" href="https://nolabelsdesignedbygod.org/${config.enPage}"`);
  expect(`${config.label} Spanish page`,page,config.esDataSrc);
  expect(`${config.label} Spanish page`,page,'../book-study-series.js?v=0.1.0');
  expect(`${config.label} Spanish page`,page,'../book-study-series-es.js?v=1.1.0');
  expect(`${config.label} Spanish page`,page,'../nldg-i18n.js?v=1.12.0');
  const englishPage=read(config.enPage);
  expect(`${config.label} English page`,englishPage,'nldg-i18n.js?v=1.12.0');
  expect(`${config.label} route pair`,i18n,config.pair);
  expect('Spanish study hub',hub,config.hubHref);
  expect('Spanish study hub',hub,config.completion);
}

expect('Spanish study hub',hub,'Estudios por libro');
expect('Spanish study hub',hub,'dos series completas y revisadas');
expect('Spanish study hub',hub,'nldg-i18n.js?v=1.12.0');
for(const marker of ['Estudio bíblico libro por libro','Lección $1 de $2','El progreso se guarda en este dispositivo','Referencia bíblica: NTV','location.pathname.split'])expect('Spanish book-series adapter',adapter,marker);
reject('Spanish book-series adapter',adapter,'rut-estudio.');
reject('Spanish book-series adapter',adapter,'filipenses-estudio.');
expect('Spanish Ruth geography bridge',mapBridge,"rut:{");
expect('Spanish Ruth geography bridge',mapBridge,'Ubica Rut en el mundo bíblico');
expect('Spanish Ruth geography bridge',mapBridge,'../biblical-map-tribes.html');
expect('Spanish Philippians geography bridge',mapBridge,"filipenses:{");
expect('Spanish Philippians geography bridge',mapBridge,'Ubica Filipenses en el mundo misionero de Pablo');
expect('Spanish Philippians geography bridge',mapBridge,'../biblical-map-paul.html');
expect('Spanish geography bridge',mapBridge,'inglés');

if(exists('philippians-study-data-es.js')){
  const ph=loadSeries('philippians-study-data-es.js');
  const lesson2=ph.lessons?.[1],lesson3=ph.lessons?.[2],lesson5=ph.lessons?.[4],lesson6=ph.lessons?.[5];
  if(!lesson2?.teaching?.[5]?.heading?.includes('ABUSO'))errors.push('Philippians lesson 2 must preserve the safeguard that suffering never justifies abuse.');
  if(!lesson3?.caution?.toLowerCase().includes('abuso'))errors.push('Philippians lesson 3 must preserve the humility/abuse safeguard.');
  if(!lesson5?.caution?.includes('atención médica')||!lesson5?.caution?.includes('consejería'))errors.push('Philippians lesson 5 must preserve medical and counseling language around anxiety.');
  if(!lesson6?.teaching?.[2]?.heading?.includes('FILIPENSES 4:13')||!lesson6?.teaching?.[2]?.body?.includes('no promete victoria en cada ambición personal'))errors.push('Philippians lesson 6 must preserve the contextual reading of Philippians 4:13.');
  if(!lesson6?.teaching?.[4]?.body?.includes('colaboradores generosos'))errors.push('Philippians lesson 6 must preserve the partnership context of Philippians 4:19.');
  if(!lesson6?.caution?.includes('explotación')||!lesson6?.caution?.includes('salarios retenidos'))errors.push('Philippians lesson 6 must preserve the contentment safeguard against exploitation.');
}

if(errors.length){
  console.error('Spanish Book Series Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Book Series Audit PASSED');
console.log('OK: Ruth has 5 complete English/Spanish lessons with matched structure.');
console.log('OK: Philippians has 6 complete English/Spanish lessons with matched structure.');
console.log('OK: both series preserve source-guide, teaching, discussion, application, safeguard, and prayer structure.');
console.log('OK: the shared Spanish book-series adapter is route-agnostic and reusable.');
console.log('OK: NTV is declared without mixing Spanish Bible-version labels.');
console.log('OK: Philippians contextual safeguards for suffering, humility, anxiety, 4:13, and 4:19 are protected.');
console.log('OK: both English/Spanish route pairs, library entries, and geography bridges are protected.');
