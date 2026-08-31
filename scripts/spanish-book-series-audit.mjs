import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(path,'utf8');
const exists=path=>fs.existsSync(path);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const reject=(label,source,value)=>{if(source.includes(value))errors.push(`${label}: contains disallowed ${JSON.stringify(value)}`)};
const rejectVersion=(label,source,version)=>{if(new RegExp(`\\b${version}\\b`).test(source))errors.push(`${label}: contains disallowed Bible version label ${JSON.stringify(version)}`)};
const html='.ht'+'ml';
const loadBookSeries=(...files)=>{
  const context={window:{}};vm.createContext(context);
  for(const file of files)vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_BOOK_STUDY;
};
const loadJamesSeries=file=>{
  const context={window:{}};vm.createContext(context);vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_JAMES_SERIES;
};

const commonRequired=['book-study-series.js','book-study-series-es.js','es/biblical-study-map-links.js','nldg-i18n.js','es/estudios-biblicos.html'];
const series=[
  {
    label:'Ruth',expected:5,
    enData:'ruth-study-data.js',enGuide:'ruth-study-guide.js',esData:'ruth-study-data-es.js',
    enPage:'ruth-study.html',esPage:'es/rut-estudio.html',esCanonical:'https://nolabelsdesignedbygod.org/es/rut-estudio.html',
    pair:`'ruth-study${html}':'es/rut-estudio${html}'`,hubHref:`href="rut-estudio${html}"`,completion:'5 lecciones completas',
    esDataSrc:'../ruth-study-data-es.js?v=1.0.0',i18nVersion:'1.12.0'
  },
  {
    label:'Philippians',expected:6,
    enData:'philippians-study-data.js',enGuide:'philippians-study-guide.js',esData:'philippians-study-data-es.js',
    enPage:'philippians-study.html',esPage:'es/filipenses-estudio.html',esCanonical:'https://nolabelsdesignedbygod.org/es/filipenses-estudio.html',
    pair:`'philippians-study${html}':'es/filipenses-estudio${html}'`,hubHref:`href="filipenses-estudio${html}"`,completion:'6 lecciones completas',
    esDataSrc:'../philippians-study-data-es.js?v=1.0.0',i18nVersion:'1.12.0'
  },
  {
    label:'1 Peter',expected:8,
    enData:'first-peter-study-data.js',enGuide:'first-peter-study-guide.js',esData:'first-peter-study-data-es.js',
    enPage:'first-peter-study.html',esPage:'es/primera-pedro-estudio.html',esCanonical:'https://nolabelsdesignedbygod.org/es/primera-pedro-estudio.html',
    pair:`'first-peter-study${html}':'es/primera-pedro-estudio${html}'`,hubHref:`href="primera-pedro-estudio${html}"`,completion:'8 lecciones completas',
    esDataSrc:'../first-peter-study-data-es.js?v=1.0.0',i18nVersion:'1.14.0'
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
  const en=loadBookSeries(config.enData,config.enGuide);
  const es=loadBookSeries(config.esData);
  if(!en||!es){errors.push(`${config.label}: unable to load English and Spanish study data.`);continue;}
  if(en.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} English lessons, found ${en.lessons?.length??0}.`);
  if(es.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} Spanish lessons, found ${es.lessons?.length??0}.`);
  if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push(`${config.label}: Spanish study must declare Nueva Traducción Viviente (NTV) as its Scripture standard.`);
  for(const guideField of ['seriesGuideBlocks','postLessonMapGuideBlocks']){
    if(Array.isArray(en[guideField])||Array.isArray(es[guideField])){
      if((es[guideField]?.length??0)!==(en[guideField]?.length??0))errors.push(`${config.label}: Spanish ${guideField} count ${es[guideField]?.length??0} does not match English ${en[guideField]?.length??0}.`);
    }
  }
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
  for(const version of ['RVR60','NVI','NBLA'])rejectVersion(`${config.label} Spanish data`,spanishData,version);
  for(const englishLeak of ['Discussion Questions','Personal examination','Weekly practice','Closing prayer','Leader guidance','TEACHING MOVEMENT'])reject(`${config.label} Spanish data`,spanishData,englishLeak);
  const page=read(config.esPage);
  expect(`${config.label} Spanish page`,page,'<html lang="es"');
  expect(`${config.label} Spanish page`,page,config.esCanonical);
  expect(`${config.label} Spanish page`,page,`hreflang="en" href="https://nolabelsdesignedbygod.org/${config.enPage}"`);
  expect(`${config.label} Spanish page`,page,config.esDataSrc);
  expect(`${config.label} Spanish page`,page,'../book-study-series.js?v=0.1.0');
  expect(`${config.label} Spanish page`,page,'../book-study-series-es.js?v=1.1.0');
  expect(`${config.label} Spanish page`,page,`../nldg-i18n.js?v=${config.i18nVersion}`);
  const englishPage=read(config.enPage);
  expect(`${config.label} English page`,englishPage,`nldg-i18n.js?v=${config.i18nVersion}`);
  expect(`${config.label} route pair`,i18n,config.pair);
  expect('Spanish study hub',hub,config.hubHref);
  expect('Spanish study hub',hub,config.completion);
}

expect('Spanish study hub',hub,'Estudios por libro');
expect('Spanish study hub',hub,'cuatro series completas y revisadas');
expect('Spanish study hub',hub,'nldg-i18n.js?v=1.14.0');
for(const marker of ['Estudio bíblico libro por libro','Lección $1 de $2','El progreso se guarda en este dispositivo','Referencia bíblica: NTV','location.pathname.split'])expect('Spanish book-series adapter',adapter,marker);
reject('Spanish book-series adapter',adapter,'rut-estudio.');
reject('Spanish book-series adapter',adapter,'filipenses-estudio.');
reject('Spanish book-series adapter',adapter,'primera-pedro-estudio.');
expect('Spanish Ruth geography bridge',mapBridge,"rut:{");
expect('Spanish Ruth geography bridge',mapBridge,'Ubica Rut en el mundo bíblico');
expect('Spanish Ruth geography bridge',mapBridge,'../biblical-map-tribes.html');
expect('Spanish Philippians geography bridge',mapBridge,"filipenses:{");
expect('Spanish Philippians geography bridge',mapBridge,'Ubica Filipenses en el mundo misionero de Pablo');
expect('Spanish Philippians geography bridge',mapBridge,'../biblical-map-paul.html');
expect('Spanish geography bridge',mapBridge,'inglés');

if(exists('philippians-study-data-es.js')){
  const ph=loadBookSeries('philippians-study-data-es.js');
  const lesson2=ph.lessons?.[1],lesson3=ph.lessons?.[2],lesson5=ph.lessons?.[4],lesson6=ph.lessons?.[5];
  if(!lesson2?.teaching?.[5]?.heading?.includes('ABUSO'))errors.push('Philippians lesson 2 must preserve the safeguard that suffering never justifies abuse.');
  if(!lesson3?.caution?.toLowerCase().includes('abuso'))errors.push('Philippians lesson 3 must preserve the humility/abuse safeguard.');
  if(!lesson5?.caution?.includes('atención médica')||!lesson5?.caution?.includes('consejería'))errors.push('Philippians lesson 5 must preserve medical and counseling language around anxiety.');
  if(!lesson6?.teaching?.[2]?.heading?.includes('FILIPENSES 4:13')||!lesson6?.teaching?.[2]?.body?.includes('no promete victoria en cada ambición personal'))errors.push('Philippians lesson 6 must preserve the contextual reading of Philippians 4:13.');
  if(!lesson6?.teaching?.[4]?.body?.includes('colaboradores generosos'))errors.push('Philippians lesson 6 must preserve the partnership context of Philippians 4:19.');
  if(!lesson6?.caution?.includes('explotación')||!lesson6?.caution?.includes('salarios retenidos'))errors.push('Philippians lesson 6 must preserve the contentment safeguard against exploitation.');
}

if(exists('first-peter-study-data-es.js')){
  const pe=loadBookSeries('first-peter-study-data-es.js');
  const lesson1=pe.lessons?.[0],lesson4=pe.lessons?.[3],lesson5=pe.lessons?.[4],lesson6=pe.lessons?.[5],lesson7=pe.lessons?.[6],lesson8=pe.lessons?.[7];
  for(const lesson of pe.lessons||[])if(!String(lesson.scripture||'').startsWith('1 Pedro '))errors.push(`1 Peter lesson ${lesson.number}: Scripture reference must use the Spanish book name 1 Pedro.`);
  if(!lesson1?.teaching?.[4]?.body?.toLowerCase().includes('no exige celebrar el abuso'))errors.push('1 Peter lesson 1 must preserve the safeguard that trials do not make abuse good.');
  if(!lesson4?.teaching?.[2]?.body?.includes('trata de personas')||!lesson4?.teaching?.[2]?.body?.includes('abuso laboral'))errors.push('1 Peter lesson 4 must reject slavery, trafficking, and workplace abuse as Christian ideals.');
  if(!lesson4?.teaching?.[4]?.body?.includes('control coercitivo')||!lesson4?.teaching?.[4]?.body?.includes('violencia sexual'))errors.push('1 Peter lesson 4 must preserve the domestic-abuse safeguard in the household text.');
  if(!lesson5?.teaching?.[1]?.body?.includes('denunciar')||!lesson5?.teaching?.[1]?.body?.includes('protección legal'))errors.push('1 Peter lesson 5 must preserve reporting, boundaries, and lawful-protection language.');
  if(!lesson6?.teaching?.[1]?.body?.includes('No oculta abuso')||!lesson6?.teaching?.[1]?.body?.includes('conducta depredadora'))errors.push('1 Peter lesson 6 must preserve the warning that love never conceals abuse, crime, or predatory conduct.');
  if(!lesson6?.teaching?.[4]?.body?.includes('toda crítica')||!lesson6?.teaching?.[4]?.body?.includes('persecución'))errors.push('1 Peter lesson 6 must preserve the warning against labeling every criticism as persecution.');
  if(!lesson7?.teaching?.[3]?.body?.includes('explotación')||!lesson7?.teaching?.[4]?.body?.includes('liderazgo coercitivo'))errors.push('1 Peter lesson 7 must preserve anti-exploitation and anti-domination leadership safeguards.');
  if(!lesson8?.context?.includes('no promueve fascinación con los demonios'))errors.push('1 Peter lesson 8 must preserve sober spiritual-warfare framing.');
  if(!pe.lessons?.every(x=>x.caution?.includes('permanecer en peligro')&&x.caution?.includes('protección legal')))errors.push('1 Peter: every lesson must preserve the shared safety guidance around danger and legal protection.');
  const commitments=(pe.postLessonMapGuideBlocks||[]).map(x=>x.text||'').join(' ');
  for(const phrase of ['dignidad','seguridad','consentimiento','rendición de cuentas'])if(!commitments.includes(phrase))errors.push(`1 Peter leader commitments must preserve ${phrase}.`);
}

const jamesRequired=['james-series.html','james-series-data.js','james-series-data-es.js','james-series.js','es/santiago-estudio.html'];
const jamesSpanishRoute='santiago-estudio'+html;
const jamesLibraryRoute='estudios-biblicos'+html;
for(const file of jamesRequired)if(!exists(file))errors.push(`James: required bilingual resource is missing: ${file}`);
if(jamesRequired.every(exists)){
  const en=loadJamesSeries('james-series-data.js');
  const es=loadJamesSeries('james-series-data-es.js');
  if(en?.lessons?.length!==10)errors.push(`James: expected 10 English lessons, found ${en?.lessons?.length??0}.`);
  if(es?.lessons?.length!==10)errors.push(`James: expected 10 Spanish lessons, found ${es?.lessons?.length??0}.`);
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('James: Spanish study must declare Nueva Traducción Viviente (NTV) as its Scripture standard.');
  if(es?.route!==jamesSpanishRoute)errors.push('James: Spanish route metadata must resolve to the Santiago study page.');
  if(es?.libraryHref!==jamesLibraryRoute)errors.push('James: Spanish library route metadata must resolve to the Spanish Bible Study Library.');
  for(const field of ['suggestedFlow','leaderChecklist'])if(!Array.isArray(es?.[field])||es[field].length!==en?.[field]?.length)errors.push(`James: Spanish ${field} must match the English item count.`);
  for(let i=0;i<Math.min(en?.lessons?.length||0,es?.lessons?.length||0);i++){
    const a=en.lessons[i],b=es.lessons[i],label=`James week ${i+1}`;
    if(a.week!==b.week)errors.push(`${label}: week number mismatch.`);
    for(const field of ['title','scripture','goal','discussionLabel','prayerFocus'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
    for(const arrayField of ['teachingNotes','discussion','leaderTips']){
      if(!Array.isArray(b?.[arrayField]))errors.push(`${label}: Spanish ${arrayField} is not an array.`);
      else if(b[arrayField].length!==a?.[arrayField]?.length)errors.push(`${label}: Spanish ${arrayField} count ${b[arrayField].length} does not match English ${a?.[arrayField]?.length??0}.`);
    }
    if(!String(b?.scripture||'').startsWith('Santiago '))errors.push(`${label}: Scripture reference must use the Spanish book name Santiago.`);
  }
  const jamesData=read('james-series-data-es.js');
  for(const version of ['RVR60','NVI','NBLA'])rejectVersion('James Spanish data',jamesData,version);
  for(const leak of ['Discussion Questions','Teaching Notes','Leader Tips','Prayer Focus','Begin Week 1','Open Lesson'])reject('James Spanish data',jamesData,leak);
  if(!es?.lessons?.[0]?.leaderTips?.some(x=>x.includes('sin minimizar el dolor')))errors.push('James week 1 must preserve the source safeguard against minimizing pain.');
  if(!es?.lessons?.[2]?.leaderTips?.some(x=>x.includes('libre de vergüenza')))errors.push('James week 3 must preserve shame-free leadership guidance around temptation.');
  if(!es?.lessons?.[4]?.goal?.includes('sin favoritismo'))errors.push('James week 5 must preserve the anti-favoritism goal.');
  if(!es?.lessons?.[5]?.leaderTips?.some(x=>x.includes('gracia')&&x.includes('desempeño')))errors.push('James week 6 must preserve grace-over-performance guidance.');
  if(!es?.lessons?.[7]?.teachingNotes?.some(x=>x.includes('ambición egoísta')))errors.push('James week 8 must preserve the source warning about selfish ambition.');
  const page=read('es/santiago-estudio.html');
  expect('James Spanish page',page,'<html lang="es"');
  expect('James Spanish page',page,'https://nolabelsdesignedbygod.org/es/santiago-estudio.html');
  expect('James Spanish page',page,'hreflang="en" href="https://nolabelsdesignedbygod.org/james-series.html"');
  expect('James Spanish page',page,'../james-series-data-es.js?v=1.0.0');
  expect('James Spanish page',page,'../james-series.js?v=1.2.0');
  expect('James Spanish page',page,'../nldg-i18n.js?v=1.13.0');
  const englishPage=read('james-series.html');
  expect('James English page',englishPage,'james-series.js?v=1.2.0');
  expect('James English page',englishPage,'nldg-i18n.js?v=1.13.0');
  expect('James route pair',i18n,`'james-series${html}':'es/${jamesSpanishRoute}'`);
  expect('Spanish study hub',hub,`href="${jamesSpanishRoute}"`);
  expect('Spanish study hub',hub,'10 lecciones completas');
  const engine=read('james-series.js');
  for(const marker of ["route=s.route||'james-series.html'","Object.assign(labels,s.labels||{})","Bible Studies","Recommended Session Length","Progress is saved on this device.","key='nldg-series-james'"])expect('Bilingual James engine',engine,marker);
  reject('Bilingual James engine',engine,jamesSpanishRoute);
}

if(errors.length){
  console.error('Spanish Book Series Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Book Series Audit PASSED');
console.log('OK: Ruth has 5 complete English/Spanish lessons with matched structure.');
console.log('OK: Philippians has 6 complete English/Spanish lessons with matched structure.');
console.log('OK: James has 10 complete English/Spanish weeks with matched teaching, discussion, leader-tip, and prayer structure.');
console.log('OK: 1 Peter has 8 complete English/Spanish lessons with matched source-guide and lesson structure.');
console.log('OK: NTV is declared without mixing Spanish Bible-version labels.');
console.log('OK: Philippians contextual safeguards remain protected.');
console.log('OK: James pain, shame-free, anti-favoritism, grace, and selfish-ambition safeguards remain protected.');
console.log('OK: 1 Peter preserves safeguards around suffering, slavery, domestic harm, reporting, exploitation, leadership power, and sober spiritual resistance.');
console.log('OK: all four English/Spanish book-series route pairs and Spanish library entries are protected.');
