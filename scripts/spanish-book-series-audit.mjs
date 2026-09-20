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
  const context={window:{}};
  vm.createContext(context);
  for(const file of files)vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_BOOK_STUDY;
};
const loadJamesSeries=file=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(read(file),context,{filename:file});
  return context.window.NLDG_JAMES_SERIES;
};

const commonRequired=['book-study-series.js','book-study-series-es.js','es/biblical-study-map-links.js','nldg-i18n.js','es/estudios-biblicos.html','es/libro-por-libro.html'];
const standardSeries=[
  {label:'Ruth',expected:5,bookPrefix:'Rut ',enData:'ruth-study-data.js',enGuide:'ruth-study-guide.js',esData:'ruth-study-data-es.js',enPage:'ruth-study.html',esPage:'es/rut-estudio.html',esRoute:'rut-estudio',canonical:'https://nolabelsdesignedbygod.org/es/rut-estudio.html',completion:'5 lecciones completas',i18nVersion:'1.45.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'Philippians',expected:6,bookPrefix:'Filipenses ',enData:'philippians-study-data.js',enGuide:'philippians-study-guide.js',esData:'philippians-study-data-es.js',enPage:'philippians-study.html',esPage:'es/filipenses-estudio.html',esRoute:'filipenses-estudio',canonical:'https://nolabelsdesignedbygod.org/es/filipenses-estudio.html',completion:'6 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'Hebrews',expected:8,bookPrefix:'Hebreos ',enData:'hebrews-study-data.js',enGuide:'hebrews-study-guide.js',esData:'hebrews-study-data-es.js',enPage:'hebrews-study.html',esPage:'es/hebreos-estudio.html',esRoute:'hebreos-estudio',canonical:'https://nolabelsdesignedbygod.org/es/hebreos-estudio.html',completion:'8 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'1 Peter',expected:8,bookPrefix:'1 Pedro ',enData:'first-peter-study-data.js',enGuide:'first-peter-study-guide.js',esData:'first-peter-study-data-es.js',enPage:'first-peter-study.html',esPage:'es/primera-pedro-estudio.html',esRoute:'primera-pedro-estudio',canonical:'https://nolabelsdesignedbygod.org/es/primera-pedro-estudio.html',completion:'8 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'2 Peter',expected:5,bookPrefix:'2 Pedro ',enData:'second-peter-study-data.js',enGuide:'second-peter-study-guide.js',esData:'second-peter-study-data-es.js',enPage:'second-peter-study.html',esPage:'es/segunda-pedro-estudio.html',esRoute:'segunda-pedro-estudio',canonical:'https://nolabelsdesignedbygod.org/es/segunda-pedro-estudio.html',completion:'5 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'1 John',expected:7,bookPrefix:'1 Juan ',enData:'first-john-study-data.js',enGuide:'first-john-study-guide.js',esData:'first-john-study-data-es.js',enPage:'first-john-study.html',esPage:'es/primera-juan-estudio.html',esRoute:'primera-juan-estudio',canonical:'https://nolabelsdesignedbygod.org/es/primera-juan-estudio.html',completion:'7 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'2 John',expected:3,bookPrefix:'2 Juan ',enData:'second-john-study-data.js',enGuide:'second-john-study-guide.js',esData:'second-john-study-data-es.js',enPage:'second-john-study.html',esPage:'es/segunda-juan-estudio.html',esRoute:'segunda-juan-estudio',canonical:'https://nolabelsdesignedbygod.org/es/segunda-juan-estudio.html',completion:'3 lecciones completas',i18nVersion:'1.79.0',dataVersion:'1.1.0',rendererVersion:'0.2.0',adapterVersion:'1.2.0'},
  {label:'3 John',expected:3,bookPrefix:'3 Juan ',enData:'third-john-study-data.js',enGuide:'third-john-study-guide.js',esData:'third-john-study-data-es.js',enPage:'third-john-study.html',esPage:'es/tercera-juan-estudio.html',esRoute:'tercera-juan-estudio',canonical:'https://nolabelsdesignedbygod.org/es/tercera-juan-estudio.html',completion:'3 lecciones completas',i18nVersion:'1.18.0'},
  {label:'Jude',expected:4,bookPrefix:'Judas ',enData:'jude-study-data.js',enGuide:'jude-study-guide.js',esData:'jude-study-data-es.js',enPage:'jude-study.html',esPage:'es/judas-estudio.html',esRoute:'judas-estudio',canonical:'https://nolabelsdesignedbygod.org/es/judas-estudio.html',completion:'4 lecciones completas',i18nVersion:'1.19.0'},
  {label:'Revelation',expected:8,bookPrefix:'Apocalipsis ',enData:'revelation-study-data.js',enGuide:'revelation-study-guide.js',esData:'revelation-study-data-es.js',enPage:'revelation-study.html',esPage:'es/apocalipsis-estudio.html',esRoute:'apocalipsis-estudio',canonical:'https://nolabelsdesignedbygod.org/es/apocalipsis-estudio.html',completion:'8 lecciones completas',i18nVersion:'1.20.0'}
];

for(const file of commonRequired)if(!exists(file))errors.push(`Required shared bilingual book-series resource is missing: ${file}`);
const i18n=read('nldg-i18n.js');
const hub=read('es/estudios-biblicos.html');
const library=read('es/libro-por-libro.html');
const adapter=read('book-study-series-es.js');
const mapBridge=read('es/biblical-study-map-links.js');
const requiredLessonFields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];

for(const config of standardSeries){
  const required=[config.enData,config.enGuide,config.esData,config.enPage,config.esPage];
  for(const file of required)if(!exists(file))errors.push(`${config.label}: required bilingual resource is missing: ${file}`);
  if(!required.every(exists))continue;

  const en=loadBookSeries(config.enData,config.enGuide);
  const es=loadBookSeries(config.esData);
  if(!en||!es){errors.push(`${config.label}: unable to load English and Spanish study data.`);continue;}
  if(en.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} English lessons, found ${en.lessons?.length??0}.`);
  if(es.lessons?.length!==config.expected)errors.push(`${config.label}: expected ${config.expected} Spanish lessons, found ${es.lessons?.length??0}.`);
  if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push(`${config.label}: Spanish study must declare Nueva Traducción Viviente (NTV) as its Scripture standard.`);

  for(const guideField of ['seriesGuideBlocks','postLessonMapGuideBlocks']){
    if((es[guideField]?.length??0)!==(en[guideField]?.length??0))errors.push(`${config.label}: Spanish ${guideField} count ${es[guideField]?.length??0} does not match English ${en[guideField]?.length??0}.`);
  }

  for(let i=0;i<Math.min(en.lessons?.length||0,es.lessons?.length||0);i++){
    const a=en.lessons[i],b=es.lessons[i],lessonLabel=`${config.label} lesson ${i+1}`;
    if(a.number!==b.number)errors.push(`${lessonLabel}: lesson number mismatch.`);
    for(const field of requiredLessonFields)if(!String(b?.[field]||'').trim())errors.push(`${lessonLabel}: missing Spanish ${field}.`);
    for(const arrayField of ['supporting','teaching','questions']){
      if(!Array.isArray(b?.[arrayField]))errors.push(`${lessonLabel}: Spanish ${arrayField} is not an array.`);
      else if(b[arrayField].length!==(a?.[arrayField]?.length??0))errors.push(`${lessonLabel}: Spanish ${arrayField} count ${b[arrayField].length} does not match English ${a?.[arrayField]?.length??0}.`);
    }
    for(const movement of b.teaching||[])if(!movement.heading?.trim()||!movement.body?.trim())errors.push(`${lessonLabel}: incomplete Spanish teaching movement.`);
    if(!String(b?.scripture||'').startsWith(config.bookPrefix))errors.push(`${lessonLabel}: Scripture reference must use Spanish book name ${config.bookPrefix.trim()}.`);
  }

  const spanishData=read(config.esData);
  for(const version of ['RVR60','NVI','NBLA'])rejectVersion(`${config.label} Spanish data`,spanishData,version);
  for(const leak of ['Discussion Questions','Personal Examination','Weekly Practice','Closing Prayer','Leader Guidance','TEACHING MOVEMENT'])reject(`${config.label} Spanish data`,spanishData,leak);

  const page=read(config.esPage);
  expect(`${config.label} Spanish page`,page,'<html lang="es"');
  expect(`${config.label} Spanish page`,page,config.canonical);
  expect(`${config.label} Spanish page`,page,`hreflang="en" href="https://nolabelsdesignedbygod.org/${config.enPage}"`);
  expect(`${config.label} Spanish page`,page,`../${config.esData}?v=${config.dataVersion||'1.0.0'}`);
  expect(`${config.label} Spanish page`,page,`../book-study-series.js?v=${config.rendererVersion||'0.1.0'}`);
  expect(`${config.label} Spanish page`,page,`../book-study-series-es.js?v=${config.adapterVersion||'1.1.0'}`);
  expect(`${config.label} Spanish page`,page,`../nldg-i18n.js?v=${config.i18nVersion}`);

  const englishPage=read(config.enPage);
  expect(`${config.label} English page`,englishPage,`nldg-i18n.js?v=${config.i18nVersion}`);
  expect(`${config.label} route pair`,i18n,`'${config.enPage}':'es/${config.esRoute}${html}'`);
  expect('Spanish book-by-book library',library,`href="${config.esRoute}${html}"`);
  expect('Spanish book-by-book library',library,config.completion.replace(' completas',''));
}

expect('Spanish study hub',hub,'Estudios por libro');
expect('Spanish study hub',hub,'once series completas y revisadas');
expect('Spanish study hub',hub,'nldg-i18n.js?v=1.21.0');
for(const marker of ['Estudio bíblico libro por libro','Lección $1 de $2','El progreso se guarda en este dispositivo','Referencia bíblica: NTV','location.pathname.split'])expect('Spanish book-series adapter',adapter,marker);
for(const route of ['rut-estudio.','filipenses-estudio.','hebreos-estudio.','primera-pedro-estudio.','segunda-pedro-estudio.','primera-juan-estudio.','segunda-juan-estudio.','tercera-juan-estudio.','judas-estudio.','apocalipsis-estudio.'])reject('Spanish book-series adapter',adapter,route);
expect('Spanish Ruth geography bridge',mapBridge,"rut:{");
expect('Spanish Ruth geography bridge',mapBridge,'../biblical-map-tribes.html');
expect('Spanish Philippians geography bridge',mapBridge,"filipenses:{");
expect('Spanish Philippians geography bridge',mapBridge,'../biblical-map-paul.html');
expect('Spanish geography bridge',mapBridge,'inglés');

if(exists('hebrews-study-data-es.js')){
  const s=loadBookSeries('hebrews-study-data-es.js'),l2=s.lessons?.[1],l3=s.lessons?.[2],l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6],l8=s.lessons?.[7];
  if((s.seriesTeaching?.length??0)!==8)errors.push('Hebrews must retain eight series-level teaching movements.');
  if((s.seriesQuestions?.length??0)!==8)errors.push('Hebrews must retain eight series-level discussion questions.');
  if(String(s.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)errors.push('Hebrews must retain two series-level Scripture Context paragraphs.');
  for(const [i,lesson] of (s.lessons||[]).entries()){
    const label=`Hebrews lesson ${i+1}`;
    if((lesson.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((lesson.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((lesson.questions?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    if((lesson.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two Scripture Context paragraphs.`);
    if((lesson.jesusParagraphs?.length??0)!==1||(lesson.guardrailParagraphs?.length??0)!==1||!String(lesson.closingTakeaway||'').trim())errors.push(`${label}: must retain Jesus Connection, Do Not Miss This, and Closing Takeaway.`);
  }
  const all=JSON.stringify(s);
  if(!l2?.guardrailParagraphs?.[0]?.includes('motivos'))errors.push('Hebrews lesson 2 must reject leaders claiming access to hidden motives.');
  if(!l3?.guardrailParagraphs?.[0]?.includes('escrupulosidad')||!l3?.guardrailParagraphs?.[0]?.includes('aterrorizar'))errors.push('Hebrews lesson 3 must preserve the non-terrorizing reading of Hebrews 6.');
  if(!l4?.guardrailParagraphs?.[0]?.includes('judaísmo')||!all.includes('antisemitismo'))errors.push('Hebrews lesson 4 must reject antisemitic better-covenant readings.');
  if(!l5?.guardrailParagraphs?.[0]?.includes('abuso doméstico')||!l5?.guardrailParagraphs?.[0]?.includes('autolesión'))errors.push('Hebrews lesson 5 must preserve abuse-safe sacrifice language.');
  if(!l6?.guardrailParagraphs?.[0]?.includes('controlar asistencia')||!l6?.guardrailParagraphs?.[0]?.includes('pecado intencional'))errors.push('Hebrews lesson 6 must preserve non-coercive attendance and warning-passage guidance.');
  if(!l7?.guardrailParagraphs?.[0]?.includes('resultados')||!l7?.guardrailParagraphs?.[0]?.includes('fe'))errors.push('Hebrews lesson 7 must reject outcome-based measures of faith.');
  if(!l8?.guardrailParagraphs?.[0]?.includes('disciplina divina')||!all.includes('obediencia ciega'))errors.push('Hebrews lesson 8 must preserve discipline and leadership abuse safeguards.');
  for(const phrase of ['advertencia de manipulación','disciplina de abuso','liderazgo de control','seguridad','cuidado calificado','responsabilidades de reporte'])if(!s.seriesLeaderGuidance?.includes(phrase))errors.push(`Hebrews leader safeguards must preserve ${phrase}.`);
}

if(exists('philippians-study-data-es.js')){
  const s=loadBookSeries('philippians-study-data-es.js'),l2=s.lessons?.[1],l3=s.lessons?.[2],l5=s.lessons?.[4],l6=s.lessons?.[5];
  if(!l2?.guardrailParagraphs?.[0]?.includes('abuso')||!l2?.guardrailParagraphs?.[0]?.includes('morir es ganancia'))errors.push('Philippians lesson 2 must preserve suffering, abuse, and death-language safeguards.');
  if(!l3?.caution?.toLowerCase().includes('abuso'))errors.push('Philippians lesson 3 must preserve the humility/abuse safeguard.');
  if(!l5?.caution?.includes('atención médica')||!l5?.caution?.includes('salud mental'))errors.push('Philippians lesson 5 must preserve medical and mental-health care language around anxiety.');
  if(!l6?.guardrailParagraphs?.[0]?.includes('Filipenses 4:13')||!l6?.teaching?.[3]?.body?.includes('no garantiza'))errors.push('Philippians lesson 6 must preserve the contextual reading of Philippians 4:13.');
  if(!l6?.guardrailParagraphs?.[0]?.includes('4:19')||!l6?.context?.includes('colaboradores generosos'))errors.push('Philippians lesson 6 must preserve the partnership context of Philippians 4:19.');
}

if(exists('first-peter-study-data-es.js')){
  const en=loadBookSeries('first-peter-study-data.js','first-peter-study-guide.js');
  const s=loadBookSeries('first-peter-study-data-es.js');
  const bookNames={'1 Pedro':'1 Peter','Salmo':'Psalm','Juan':'John','Romanos':'Romans','2 Corintios':'2 Corinthians','Efesios':'Ephesians','Levítico':'Leviticus','Hebreos':'Hebrews','1 Juan':'1 John','Éxodo':'Exodus','Oseas':'Hosea','Isaías':'Isaiah','Mateo':'Matthew','Daniel':'Daniel','Marcos':'Mark','Hechos':'Acts','Génesis':'Genesis','Proverbios':'Proverbs','Colosenses':'Colossians','Santiago':'James','1 Corintios':'1 Corinthians','Ezequiel':'Ezekiel'};
  const normRef=r=>{for(const [a,b] of Object.entries(bookNames))if(String(r||'').startsWith(a+' '))return b+String(r).slice(a.length);return String(r||'');};
  const normList=x=>String(x||'').split(';').map(v=>normRef(v.trim())).filter(Boolean);
  if((s.seriesTeaching?.length??0)!==8)errors.push('1 Peter must retain eight series-level teaching movements.');
  if((s.seriesQuestions?.length??0)!==8)errors.push('1 Peter must retain eight series-level discussion questions.');
  if(String(s.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)errors.push('1 Peter must retain two series-level Scripture Context paragraphs.');
  if(JSON.stringify(normList(s.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))errors.push('1 Peter series Scripture references must match English after book-name normalization.');
  for(const [i,lesson] of (s.lessons||[]).entries()){
    const label=`1 Peter lesson ${i+1}`,eng=en.lessons?.[i];
    if((lesson.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((lesson.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((lesson.questions?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    if((lesson.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two Scripture Context paragraphs.`);
    if((lesson.jesusParagraphs?.length??0)!==1||(lesson.guardrailParagraphs?.length??0)!==1||!String(lesson.closingTakeaway||'').trim())errors.push(`${label}: must retain Jesus Connection, Do Not Miss This, and Closing Takeaway.`);
    if(normRef(lesson.scripture)!==String(eng?.scripture||''))errors.push(`${label}: main Scripture reference must match English after book-name normalization.`);
    if(JSON.stringify((lesson.supporting||[]).map(normRef))!==JSON.stringify(eng?.supporting||[]))errors.push(`${label}: supporting Scripture references must match English after book-name normalization.`);
  }
  const all=JSON.stringify(s).toLowerCase(),l3=s.lessons?.[2],l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6],l8=s.lessons?.[7];
  if(!s.seriesContext?.includes('autoría directa')||!s.seriesContext?.includes('Silvano'))errors.push('1 Peter series context must preserve authorship and Silvanus nuance.');
  if(!all.includes('antisemitismo')||!l3?.guardrailParagraphs?.[0]?.includes('nacionalismo cristiano'))errors.push('1 Peter lesson 3 must preserve anti-antisemitism and anti-nationalist safeguards.');
  if(!l4?.guardrailParagraphs?.[0]?.includes('trata de personas')||!l4?.guardrailParagraphs?.[0]?.includes('denunciar'))errors.push('1 Peter lesson 4 must preserve anti-slavery and reporting safeguards.');
  if(!l5?.guardrailParagraphs?.[0]?.includes('protección legal')||!l5?.guardrailParagraphs?.[0]?.includes('silencio forzado'))errors.push('1 Peter lesson 5 must preserve domestic-abuse, lawful-protection, and non-silencing safeguards.');
  if(!l6?.guardrailParagraphs?.[0]?.includes('espíritus encarcelados')||!l6?.guardrailParagraphs?.[0]?.includes('bautismo'))errors.push('1 Peter lesson 6 must preserve interpretive humility around spirits and baptism.');
  if(!l7?.guardrailParagraphs?.[0]?.includes('amor cubre pecados')||!l7?.guardrailParagraphs?.[0]?.includes('ocultar abuso'))errors.push('1 Peter lesson 7 must preserve the warning that love never conceals abuse.');
  if(!l8?.guardrailParagraphs?.[0]?.includes('liderazgo dominante')||!l8?.guardrailParagraphs?.[0]?.includes('tratamiento profesional'))errors.push('1 Peter lesson 8 must preserve anti-domination and anxiety-care safeguards.');
  for(const phrase of ['violencia doméstica','daño sexual','trata','liderazgo coercitivo','seguridad','apoyo calificado','responsabilidades de denuncia'])if(!s.seriesLeaderGuidance?.includes(phrase))errors.push(`1 Peter leader safeguards must preserve ${phrase}.`);
}

if(exists('second-peter-study-data-es.js')){
  const en=loadBookSeries('second-peter-study-data.js','second-peter-study-guide.js');
  const s=loadBookSeries('second-peter-study-data-es.js');
  const bookNames={'2 Pedro':'2 Peter','Juan':'John','Gálatas':'Galatians','Efesios':'Ephesians','Filipenses':'Philippians','Colosenses':'Colossians','Salmo':'Psalm','Mateo':'Matthew','Lucas':'Luke','2 Timoteo':'2 Timothy','1 Corintios':'1 Corinthians','Deuteronomio':'Deuteronomy','Hechos':'Acts','1 Timoteo':'1 Timothy','Judas':'Jude','Isaías':'Isaiah','Apocalipsis':'Revelation'};
  const normRef=r=>{for(const [a,b] of Object.entries(bookNames))if(String(r||'').startsWith(a+' '))return b+String(r).slice(a.length);return String(r||'');};
  const normList=x=>String(x||'').split(';').map(v=>normRef(v.trim())).filter(Boolean);
  if((s.seriesTeaching?.length??0)!==8)errors.push('2 Peter must retain eight series-level teaching movements.');
  if((s.seriesQuestions?.length??0)!==8)errors.push('2 Peter must retain eight series-level discussion questions.');
  if(String(s.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)errors.push('2 Peter must retain two series-level Scripture Context paragraphs.');
  if(JSON.stringify(normList(s.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))errors.push('2 Peter series Scripture references must match English after book-name normalization.');
  for(const [i,lesson] of (s.lessons||[]).entries()){
    const label=`2 Peter lesson ${i+1}`,eng=en.lessons?.[i];
    if((lesson.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((lesson.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((lesson.questions?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    if((lesson.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two Scripture Context paragraphs.`);
    if((lesson.jesusParagraphs?.length??0)!==1||(lesson.guardrailParagraphs?.length??0)!==1||!String(lesson.closingTakeaway||'').trim())errors.push(`${label}: must retain Jesus Connection, Do Not Miss This, and Closing Takeaway.`);
    if(normRef(lesson.scripture)!==String(eng?.scripture||''))errors.push(`${label}: main Scripture reference must match English after book-name normalization.`);
    if(JSON.stringify((lesson.supporting||[]).map(normRef))!==JSON.stringify(eng?.supporting||[]))errors.push(`${label}: supporting Scripture references must match English after book-name normalization.`);
  }
  const all=JSON.stringify(s).toLowerCase(),l1=s.lessons?.[0],l2=s.lessons?.[1],l3=s.lessons?.[2],l4=s.lessons?.[3],l5=s.lessons?.[4];
  if(!s.seriesContext?.includes('autoría petrina directa')||!s.seriesContext?.includes('relación con Judas'))errors.push('2 Peter series context must preserve authorship and Jude-relationship nuance.');
  if(!l1?.guardrailParagraphs?.[0]?.includes('se convierten en dioses')||!l1?.guardrailParagraphs?.[0]?.includes('perfección'))errors.push('2 Peter lesson 1 must preserve divine-nature and perfectionism safeguards.');
  if(!l2?.guardrailParagraphs?.[0]?.includes('estudio personal')||!l2?.guardrailParagraphs?.[0]?.includes('infalible'))errors.push('2 Peter lesson 2 must preserve private-interpretation and interpretive-humility safeguards.');
  if(!l3?.guardrailParagraphs?.[0]?.includes('Exige evidencia')||!l3?.guardrailParagraphs?.[0]?.includes('deshumanizar')||!all.includes('rumor'))errors.push('2 Peter lesson 3 must preserve evidence-based, anti-rumor, and anti-dehumanization safeguards.');
  if(!l4?.guardrailParagraphs?.[0]?.includes('calendarios especulativos')||!l4?.guardrailParagraphs?.[0]?.includes('pánico')||!l4?.guardrailParagraphs?.[0]?.includes('mil años'))errors.push('2 Peter lesson 4 must reject date-setting, panic, and the thousand-year formula.');
  if(!l5?.guardrailParagraphs?.[0]?.includes('preguntas honestas')||!l5?.guardrailParagraphs?.[0]?.includes('27 libros')||!l5?.guardrailParagraphs?.[0]?.includes('control exclusivo'))errors.push('2 Peter lesson 5 must preserve honest-question, canon, and interpretive-control safeguards.');
  for(const phrase of ['cultura de acusación','evidencia pública','rumores','reportes apropiados','personas vulnerables'])if(!s.seriesLeaderGuidance?.includes(phrase))errors.push(`2 Peter leader safeguards must preserve ${phrase}.`);
}

if(exists('first-john-study-data-es.js')){
  const en=loadBookSeries('first-john-study-data.js','first-john-study-guide.js');
  const s=loadBookSeries('first-john-study-data-es.js');
  const bookNames={'1 Juan':'1 John','Juan':'John','Lucas':'Luke','2 Pedro':'2 Peter','Colosenses':'Colossians','Salmo':'Psalm','Hebreos':'Hebrews','Romanos':'Romans','Deuteronomio':'Deuteronomy','Mateo':'Matthew','Santiago':'James','Hechos':'Acts','2 Tesalonicenses':'2 Thessalonians','Judas':'Jude','Gálatas':'Galatians','1 Corintios':'1 Corinthians'};
  const normRef=r=>{for(const [a,b] of Object.entries(bookNames))if(String(r||'').startsWith(a+' '))return b+String(r).slice(a.length);return String(r||'');};
  const normList=x=>String(x||'').split(';').map(v=>normRef(v.trim())).filter(Boolean);
  if((s.seriesTeaching?.length??0)!==8)errors.push('1 John must retain eight series-level teaching movements.');
  if((s.seriesQuestions?.length??0)!==8)errors.push('1 John must retain eight series-level discussion questions.');
  if(String(s.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)errors.push('1 John must retain two series-level Scripture Context paragraphs.');
  if(JSON.stringify(normList(s.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))errors.push('1 John series Scripture references must match English after book-name normalization.');
  for(const [i,lesson] of (s.lessons||[]).entries()){
    const label=`1 John lesson ${i+1}`,eng=en.lessons?.[i];
    if((lesson.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((lesson.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((lesson.questions?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    if((lesson.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two Scripture Context paragraphs.`);
    if((lesson.jesusParagraphs?.length??0)!==1||(lesson.guardrailParagraphs?.length??0)!==1||!String(lesson.closingTakeaway||'').trim())errors.push(`${label}: must retain Jesus Connection, Do Not Miss This, and Closing Takeaway.`);
    if(normRef(lesson.scripture)!==String(eng?.scripture||''))errors.push(`${label}: main Scripture reference must match English after book-name normalization.`);
    if(JSON.stringify((lesson.supporting||[]).map(normRef))!==JSON.stringify(eng?.supporting||[]))errors.push(`${label}: supporting Scripture references must match English after book-name normalization.`);
  }
  const all=JSON.stringify(s).toLowerCase(),l2=s.lessons?.[1],l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6];
  if(!s.seriesContext?.includes('no nombra a su autor')||!s.seriesContext?.includes('círculo joánico'))errors.push('1 John series context must preserve authorship nuance.');
  if(!l2?.guardrailParagraphs?.[0]?.includes('confesión pública')||!l2?.guardrailParagraphs?.[0]?.includes('ayuda profesional'))errors.push('1 John lesson 2 must preserve disclosure and professional-help safeguards.');
  if(!l4?.guardrailParagraphs?.[0]?.includes('insulto partidista')||!l4?.guardrailParagraphs?.[0]?.includes('infalible'))errors.push('1 John lesson 4 must preserve careful antichrist and anointing safeguards.');
  if(!l5?.guardrailParagraphs?.[0]?.includes('escrupulosidad')||!l5?.guardrailParagraphs?.[0]?.includes('TOC')||!l5?.guardrailParagraphs?.[0]?.includes('autolesión'))errors.push('1 John lesson 5 must preserve scrupulosity, OCD, and self-harm safeguards.');
  if(!l6?.guardrailParagraphs?.[0]?.includes('trastornos de ansiedad')||!l6?.guardrailParagraphs?.[0]?.includes('consejería')||!l6?.guardrailParagraphs?.[0]?.includes('medicación'))errors.push('1 John lesson 6 must preserve anxiety-care safeguards.');
  if(!l7?.guardrailParagraphs?.[0]?.includes('victoria política')||!l7?.guardrailParagraphs?.[0]?.includes('resultados garantizados')||!l7?.guardrailParagraphs?.[0]?.includes('pecado que lleva a muerte'))errors.push('1 John lesson 7 must preserve political-victory, prayer-outcome, and sin-leading-to-death safeguards.');
  for(const phrase of ['escrupulosidad','confesión pública','anticristo','infalibilidad personal','ansiedad','pecado que lleva a muerte'])if(!all.includes(phrase))errors.push(`1 John safeguards must preserve ${phrase}.`);
}

if(exists('second-john-study-data-es.js')){
  const en=loadBookSeries('second-john-study-data.js','second-john-study-guide.js');
  const s=loadBookSeries('second-john-study-data-es.js');
  const bookNames={'2 Juan':'2 John','Juan':'John','1 Juan':'1 John','3 Juan':'3 John','Efesios':'Ephesians','Colosenses':'Colossians','1 Timoteo':'1 Timothy','Lucas':'Luke','Romanos':'Romans','1 Corintios':'1 Corinthians','Tito':'Titus'};
  const normRef=r=>{for(const [a,b] of Object.entries(bookNames))if(String(r||'').startsWith(a+' '))return b+String(r).slice(a.length);return String(r||'');};
  const normList=x=>String(x||'').split(';').map(v=>normRef(v.trim())).filter(Boolean);
  if((s.seriesTeaching?.length??0)!==8)errors.push('2 John must retain eight series-level teaching movements.');
  if((s.seriesQuestions?.length??0)!==8)errors.push('2 John must retain eight series-level discussion questions.');
  if(String(s.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)errors.push('2 John must retain two series-level Scripture Context paragraphs.');
  if(JSON.stringify(normList(s.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))errors.push('2 John series Scripture references must match English after book-name normalization.');
  for(const [i,lesson] of (s.lessons||[]).entries()){
    const label=`2 John lesson ${i+1}`,eng=en.lessons?.[i];
    if((lesson.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((lesson.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((lesson.questions?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    if((lesson.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two Scripture Context paragraphs.`);
    if((lesson.jesusParagraphs?.length??0)!==1||(lesson.guardrailParagraphs?.length??0)!==1||!String(lesson.closingTakeaway||'').trim())errors.push(`${label}: must retain Jesus Connection, Do Not Miss This, and Closing Takeaway.`);
    if(normRef(lesson.scripture)!==String(eng?.scripture||''))errors.push(`${label}: main Scripture reference must match English after book-name normalization.`);
    if(JSON.stringify((lesson.supporting||[]).map(normRef))!==JSON.stringify(eng?.supporting||[]))errors.push(`${label}: supporting Scripture references must match English after book-name normalization.`);
  }
  const all=JSON.stringify(s).toLowerCase(),l1=s.lessons?.[0],l2=s.lessons?.[1],l3=s.lessons?.[2];
  if(!s.seriesContext?.includes('el anciano')||!s.seriesContext?.includes('señora elegida')||!s.seriesContext?.includes('respaldo públicamente'))errors.push('2 John series context must preserve elder, elect-lady, and endorsement nuance.');
  if(!l1?.guardrailParagraphs?.[0]?.includes('crueldad')||!l1?.guardrailParagraphs?.[0]?.includes('perfeccionismo'))errors.push('2 John lesson 1 must preserve truth/love and non-perfectionist safeguards.');
  if(!l2?.guardrailParagraphs?.[0]?.includes('desacuerdo político')||!l2?.guardrailParagraphs?.[0]?.includes('anticristo')||!l2?.guardrailParagraphs?.[0]?.includes('afirmaciones reales'))errors.push('2 John lesson 2 must preserve careful antichrist and evidence-based discernment safeguards.');
  if(!l3?.guardrailParagraphs?.[0]?.includes('ruptura familiar')||!l3?.guardrailParagraphs?.[0]?.includes('ayuda de emergencia')||!l3?.guardrailParagraphs?.[0]?.includes('respaldo automático'))errors.push('2 John lesson 3 must preserve anti-shunning, emergency-compassion, and endorsement safeguards.');
  for(const phrase of ['adversarios políticos','denunciantes','doxxing','rumor','aislamiento punitivo'])if(!all.includes(phrase))errors.push(`2 John safeguards must preserve ${phrase}.`);
}

if(exists('third-john-study-data-es.js')){
  const s=loadBookSeries('third-john-study-data-es.js'),l2=s.lessons?.[1],l3=s.lessons?.[2],guide=(s.postLessonMapGuideBlocks||[]).map(x=>x.text||'').join(' ');
  if(!l2?.context?.includes('liderazgo espiritual coercitivo'))errors.push('3 John lesson 2 must name coercive spiritual leadership explicitly.');
  if(!l2?.teaching?.[2]?.body?.includes('acusaciones falsas')||!l2?.teaching?.[4]?.body?.includes('crea temor'))errors.push('3 John lesson 2 must preserve safeguards around slander and fear-based leadership.');
  if(!l2?.teaching?.[5]?.body?.includes('abuso de autoridad'))errors.push('3 John lesson 2 must preserve the source statement that love does not require silence about abuse of authority.');
  if(!l3?.teaching?.[3]?.body?.includes('múltiples testigos'))errors.push('3 John lesson 3 must preserve multiple-witness credibility guidance.');
  if(!l3?.teaching?.[5]?.body?.includes('amigos, no de seguidores'))errors.push('3 John lesson 3 must preserve the source contrast between friends and followers.');
  for(const phrase of ['evidencia clara','liderazgo coercitivo','experiencias traumáticas','confidencialidad','reportes de daño'])if(!guide.includes(phrase))errors.push(`3 John leader safeguards must preserve ${phrase}.`);
}

if(exists('jude-study-data-es.js')){
  const s=loadBookSeries('jude-study-data-es.js'),l1=s.lessons?.[0],l2=s.lessons?.[1],l3=s.lessons?.[2],l4=s.lessons?.[3],guide=(s.postLessonMapGuideBlocks||[]).map(x=>x.text||'').join(' ');
  if(!l1?.context?.includes('desacuerdo menor')||!l1?.teaching?.[3]?.body?.includes('preferencias personales'))errors.push('Jude lesson 1 must distinguish core gospel threats from secondary or personal disagreements.');
  if(!l2?.context?.includes('se discuten entre intérpretes')||!l2?.context?.includes('no requieren especulación'))errors.push('Jude lesson 2 must preserve interpretive humility around debated Jewish traditions.');
  if(!l2?.teaching?.[2]?.body?.includes('no autoriza rumores')||!l2?.teaching?.[2]?.body?.includes('no podemos demostrar'))errors.push('Jude lesson 2 must reject rumor-driven or overconfident spiritual-warfare claims.');
  if(!l3?.teaching?.[2]?.body?.includes('no invita a fijar fechas')||!l3?.teaching?.[2]?.body?.includes('titulares'))errors.push('Jude lesson 3 must reject date-setting and headline speculation.');
  if(!l4?.teaching?.[4]?.body?.includes('misericordia')||!l4?.teaching?.[4]?.body?.includes('sospecha automática'))errors.push('Jude lesson 4 must preserve compassionate care for doubters.');
  if(!l4?.teaching?.[5]?.body?.includes('Dios')||!l4?.teaching?.[5]?.body?.includes('control'))errors.push('Jude lesson 4 must ground final security in God rather than human control.');
  for(const phrase of ['No llames falsa enseñanza a cada desacuerdo','evidencia','rumores','control centrado en el líder','experiencias traumáticas','confidencialidad','ayuda pastoral o profesional'])if(!guide.includes(phrase))errors.push(`Jude leader safeguards must preserve ${phrase}.`);
  if(!s.lessons?.every(x=>x.caution?.includes('superioridad nacional')&&x.caution?.includes('rumores')))errors.push('Jude must reject national superiority and rumor in severe-warning applications.');
}

if(exists('revelation-study-data-es.js')){
  const s=loadBookSeries('revelation-study-data-es.js'),l1=s.lessons?.[0],l3=s.lessons?.[2],l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6],l8=s.lessons?.[7];
  const guides=[...(s.seriesGuideBlocks||[]),...(s.postLessonMapGuideBlocks||[])].map(x=>x.text||'').join(' ');
  if(!s.theme?.includes('no para fijar fechas')||!s.theme?.includes('descifrar partidos políticos'))errors.push('Revelation foundation must reject date-setting and partisan decoding.');
  for(const phrase of ['cronologías debatidas','antisemitismo','señalamiento étnico','pánico tecnológico','violencia cristiana'])if(!guides.includes(phrase))errors.push(`Revelation interpretive safeguards must preserve ${phrase}.`);
  if(!l1?.teaching?.[3]?.body?.includes('buscar seguridad')||!l1?.teaching?.[5]?.body?.includes('insulto contra las mujeres'))errors.push('Revelation lesson 1 must preserve safety and non-gendered Jezebel safeguards.');
  if(!l3?.teaching?.[1]?.body?.includes('rechaza la supremacía étnica')||!l3?.teaching?.[4]?.body?.includes('maneras distintas'))errors.push('Revelation lesson 3 must preserve ethnic-equality and 144,000 humility safeguards.');
  if(!l4?.teaching?.[4]?.body?.includes('no en resistencia religiosa armada'))errors.push('Revelation lesson 4 must reject armed-religious-resistance readings of the witnesses.');
  if(!l5?.teaching?.[2]?.body?.includes('sin llamar casualmente “la bestia”')||!l5?.teaching?.[4]?.body?.includes('vacunas')||!l5?.teaching?.[4]?.body?.includes('microchips'))errors.push('Revelation lesson 5 must reject casual beast labels and vaccine/microchip panic.');
  if(!l6?.teaching?.[2]?.body?.includes('una sola nación actual')||!l6?.teaching?.[3]?.body?.includes('vidas humanas'))errors.push('Revelation lesson 6 must preserve Babylon humility and anti-exploitation teaching.');
  if(!l7?.teaching?.[1]?.body?.includes('no autoriza guerra cristiana')||!l7?.teaching?.[3]?.body?.includes('premilenial')||!l7?.teaching?.[4]?.body?.includes('No debe usarse como amenaza'))errors.push('Revelation lesson 7 must preserve nonviolence, millennial humility, and non-coercive judgment teaching.');
  if(!l8?.teaching?.[0]?.body?.includes('no almas escapando')||!l8?.teaching?.[2]?.body?.includes('nunca debe alimentar antisemitismo')||!l8?.teaching?.[5]?.body?.includes('No calculamos fechas'))errors.push('Revelation lesson 8 must preserve embodied hope, anti-antisemitism, and no-date-setting safeguards.');
  if(!s.lessons?.every(x=>x.caution?.includes('antisemitismo')&&x.caution?.includes('vacunas')&&x.caution?.includes('microchips')&&x.caution?.includes('violencia cristiana')))errors.push('Revelation leader guidance must reject antisemitism, technology panic, and Christian violence throughout the series.');
}

const jamesRequired=['james-series.html','james-series-data.js','james-series-data-es.js','james-series.js','es/santiago-estudio.html'];
for(const file of jamesRequired)if(!exists(file))errors.push(`James: required bilingual resource is missing: ${file}`);
if(jamesRequired.every(exists)){
  const en=loadJamesSeries('james-series-data.js');
  const es=loadJamesSeries('james-series-data-es.js');
  const refMap=[
    ['2 Corintios','2 Corinthians'],['1 Corintios','1 Corinthians'],['1 Tesalonicenses','1 Thessalonians'],['1 Pedro','1 Peter'],['2 Pedro','2 Peter'],['1 Juan','1 John'],['1 Reyes','1 Kings'],
    ['Santiago','James'],['Génesis','Genesis'],['Josué','Joshua'],['Romanos','Romans'],['Efesios','Ephesians'],['Proverbios','Proverbs'],['Mateo','Matthew'],['Colosenses','Colossians'],['Gálatas','Galatians'],['Miqueas','Micah'],['Lucas','Luke'],['Juan','John'],['Levítico','Leviticus'],['Deuteronomio','Deuteronomy'],['Filipenses','Philippians'],['Hebreos','Hebrews'],['Marcos','Mark']
  ];
  const normRef=value=>{const s=String(value||'').trim();for(const [esName,enName] of refMap)if(s===esName||s.startsWith(esName+' '))return enName+s.slice(esName.length);return s;};
  const refList=value=>String(value||'').split(';').map(x=>normRef(x)).filter(Boolean);
  if(en?.lessons?.length!==10||es?.lessons?.length!==10)errors.push('James must retain 10 English and 10 Spanish weeks.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('James: Spanish study must declare Nueva Traducción Viviente (NTV).');
  if(JSON.stringify(refList(es?.seriesMainScripture))!==JSON.stringify(refList(en?.seriesMainScripture)))errors.push('James: series Scripture references must retain normalized English/Spanish parity.');
  if((en?.seriesContextParagraphs?.length??0)!==2||(es?.seriesContextParagraphs?.length??0)!==2)errors.push('James: series must retain two context paragraphs in both languages.');
  if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)errors.push('James: series must retain eight teaching movements in both languages.');
  if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)errors.push('James: series must retain eight discussion questions in both languages.');
  for(const field of ['seriesQuestion','seriesOpening','seriesJesusConnection','seriesGuardrail','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesClosingTakeaway','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`James: missing Spanish ${field}.`);
  for(let i=0;i<10;i++){
    const a=en.lessons?.[i],b=es.lessons?.[i],label=`James week ${i+1}`;
    if(a?.week!==b?.week)errors.push(`${label}: week number mismatch.`);
    if(normRef(b?.scripture)!==String(a?.scripture||''))errors.push(`${label}: main Scripture reference mismatch.`);
    if(JSON.stringify((b?.supporting||[]).map(normRef))!==JSON.stringify(a?.supporting||[]))errors.push(`${label}: supporting Scripture references mismatch.`);
    if((a?.supporting?.length??0)!==5||(b?.supporting?.length??0)!==5)errors.push(`${label}: must retain five supporting Scriptures.`);
    if((a?.contextParagraphs?.length??0)!==2||(b?.contextParagraphs?.length??0)!==2)errors.push(`${label}: must retain two context paragraphs.`);
    if((a?.teaching?.length??0)!==8||(b?.teaching?.length??0)!==8)errors.push(`${label}: must retain eight teaching movements.`);
    if((a?.discussion?.length??0)!==8||(b?.discussion?.length??0)!==8)errors.push(`${label}: must retain eight discussion questions.`);
    for(const field of ['title','scripture','question','truth','goal','opening','jesusConnection','guardrail','examination','practice','leaderGuidance','closingTakeaway','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  }
  const all=JSON.stringify(es).toLowerCase();
  for(const phrase of ['salvación por obras','culpar a víctimas','abuso','atención médica','chisme','rendición de cuentas','robo de salario','no prometas','confesión'])if(!all.includes(phrase))errors.push(`James: missing safeguard/theme ${JSON.stringify(phrase)}.`);
  for(const version of ['RVR60','NVI','NBLA'])rejectVersion('James Spanish data',JSON.stringify(es),version);
  expect('James Spanish page',read('es/santiago-estudio.html'),'../james-series-data-es.js?v=1.1.0');
  expect('James Spanish page',read('es/santiago-estudio.html'),'../james-series.js?v=1.3.0');
  expect('James Spanish page',read('es/santiago-estudio.html'),'../nldg-i18n.js?v=1.79.0');
  expect('James English page',read('james-series.html'),'james-series-data.js?v=1.1.0');
  expect('James English page',read('james-series.html'),'james-series.js?v=1.3.0');
  expect('James English page',read('james-series.html'),'nldg-i18n.js?v=1.79.0');
  expect('James route pair',i18n,`'james-series${html}':'es/santiago-estudio${html}'`);
}

if(errors.length){
  console.error('Spanish Book Series Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Book Series Audit PASSED');
console.log('OK: Ruth 5, Philippians 6, James 10, Hebrews 8, 1 Peter 8, 2 Peter 5, 1 John 7, 2 John 3, 3 John 3, Jude 4, and Revelation 8 have protected English/Spanish parity.');
console.log('OK: NTV is declared without mixed Spanish Bible-version labels.');
console.log('OK: all eleven published Spanish book-series routes and library entries are protected.');
console.log('OK: book-specific pastoral and interpretive safeguards remain enforced.');
