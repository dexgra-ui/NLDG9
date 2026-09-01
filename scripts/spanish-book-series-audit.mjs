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

const commonRequired=['book-study-series.js','book-study-series-es.js','es/biblical-study-map-links.js','nldg-i18n.js','es/estudios-biblicos.html'];
const standardSeries=[
  {
    label:'Ruth',expected:5,bookPrefix:'Rut ',
    enData:'ruth-study-data.js',enGuide:'ruth-study-guide.js',esData:'ruth-study-data-es.js',
    enPage:'ruth-study.html',esPage:'es/rut-estudio.html',esRoute:'rut-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/rut-estudio.html',completion:'5 lecciones completas',i18nVersion:'1.12.0'
  },
  {
    label:'Philippians',expected:6,bookPrefix:'Filipenses ',
    enData:'philippians-study-data.js',enGuide:'philippians-study-guide.js',esData:'philippians-study-data-es.js',
    enPage:'philippians-study.html',esPage:'es/filipenses-estudio.html',esRoute:'filipenses-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/filipenses-estudio.html',completion:'6 lecciones completas',i18nVersion:'1.12.0'
  },
  {
    label:'1 Peter',expected:8,bookPrefix:'1 Pedro ',
    enData:'first-peter-study-data.js',enGuide:'first-peter-study-guide.js',esData:'first-peter-study-data-es.js',
    enPage:'first-peter-study.html',esPage:'es/primera-pedro-estudio.html',esRoute:'primera-pedro-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/primera-pedro-estudio.html',completion:'8 lecciones completas',i18nVersion:'1.14.0'
  },
  {
    label:'2 Peter',expected:5,bookPrefix:'2 Pedro ',
    enData:'second-peter-study-data.js',enGuide:'second-peter-study-guide.js',esData:'second-peter-study-data-es.js',
    enPage:'second-peter-study.html',esPage:'es/segunda-pedro-estudio.html',esRoute:'segunda-pedro-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/segunda-pedro-estudio.html',completion:'5 lecciones completas',i18nVersion:'1.15.0'
  },
  {
    label:'1 John',expected:7,bookPrefix:'1 Juan ',
    enData:'first-john-study-data.js',enGuide:'first-john-study-guide.js',esData:'first-john-study-data-es.js',
    enPage:'first-john-study.html',esPage:'es/primera-juan-estudio.html',esRoute:'primera-juan-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/primera-juan-estudio.html',completion:'7 lecciones completas',i18nVersion:'1.16.0'
  },
  {
    label:'2 John',expected:3,bookPrefix:'2 Juan ',
    enData:'second-john-study-data.js',enGuide:'second-john-study-guide.js',esData:'second-john-study-data-es.js',
    enPage:'second-john-study.html',esPage:'es/segunda-juan-estudio.html',esRoute:'segunda-juan-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/segunda-juan-estudio.html',completion:'3 lecciones completas',i18nVersion:'1.17.0'
  },
  {
    label:'3 John',expected:3,bookPrefix:'3 Juan ',
    enData:'third-john-study-data.js',enGuide:'third-john-study-guide.js',esData:'third-john-study-data-es.js',
    enPage:'third-john-study.html',esPage:'es/tercera-juan-estudio.html',esRoute:'tercera-juan-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/tercera-juan-estudio.html',completion:'3 lecciones completas',i18nVersion:'1.18.0'
  },
  {
    label:'Jude',expected:4,bookPrefix:'Judas ',
    enData:'jude-study-data.js',enGuide:'jude-study-guide.js',esData:'jude-study-data-es.js',
    enPage:'jude-study.html',esPage:'es/judas-estudio.html',esRoute:'judas-estudio',
    canonical:'https://nolabelsdesignedbygod.org/es/judas-estudio.html',completion:'4 lecciones completas',i18nVersion:'1.19.0'
  }
];

for(const file of commonRequired)if(!exists(file))errors.push(`Required shared bilingual book-series resource is missing: ${file}`);
const i18n=read('nldg-i18n.js');
const hub=read('es/estudios-biblicos.html');
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
      else if(b[arrayField].length!==a?.[arrayField]?.length)errors.push(`${lessonLabel}: Spanish ${arrayField} count ${b[arrayField].length} does not match English ${a?.[arrayField]?.length??0}.`);
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
  expect(`${config.label} Spanish page`,page,`../${config.esData}?v=1.0.0`);
  expect(`${config.label} Spanish page`,page,'../book-study-series.js?v=0.1.0');
  expect(`${config.label} Spanish page`,page,'../book-study-series-es.js?v=1.1.0');
  expect(`${config.label} Spanish page`,page,`../nldg-i18n.js?v=${config.i18nVersion}`);

  const englishPage=read(config.enPage);
  expect(`${config.label} English page`,englishPage,`nldg-i18n.js?v=${config.i18nVersion}`);
  expect(`${config.label} route pair`,i18n,`'${config.enPage}':'es/${config.esRoute}${html}'`);
  expect('Spanish study hub',hub,`href="${config.esRoute}${html}"`);
  expect('Spanish study hub',hub,config.completion);
}

expect('Spanish study hub',hub,'Estudios por libro');
expect('Spanish study hub',hub,'nueve series completas y revisadas');
expect('Spanish study hub',hub,'nldg-i18n.js?v=1.19.0');
for(const marker of ['Estudio bíblico libro por libro','Lección $1 de $2','El progreso se guarda en este dispositivo','Referencia bíblica: NTV','location.pathname.split'])expect('Spanish book-series adapter',adapter,marker);
for(const route of ['rut-estudio.','filipenses-estudio.','primera-pedro-estudio.','segunda-pedro-estudio.','primera-juan-estudio.','segunda-juan-estudio.','tercera-juan-estudio.','judas-estudio.'])reject('Spanish book-series adapter',adapter,route);
expect('Spanish Ruth geography bridge',mapBridge,"rut:{");
expect('Spanish Ruth geography bridge',mapBridge,'../biblical-map-tribes.html');
expect('Spanish Philippians geography bridge',mapBridge,"filipenses:{");
expect('Spanish Philippians geography bridge',mapBridge,'../biblical-map-paul.html');
expect('Spanish geography bridge',mapBridge,'inglés');

// Book-specific interpretive and pastoral safeguards.
if(exists('philippians-study-data-es.js')){
  const s=loadBookSeries('philippians-study-data-es.js'),l2=s.lessons?.[1],l3=s.lessons?.[2],l5=s.lessons?.[4],l6=s.lessons?.[5];
  if(!l2?.teaching?.[5]?.heading?.includes('ABUSO'))errors.push('Philippians lesson 2 must preserve the safeguard that suffering never justifies abuse.');
  if(!l3?.caution?.toLowerCase().includes('abuso'))errors.push('Philippians lesson 3 must preserve the humility/abuse safeguard.');
  if(!l5?.caution?.includes('atención médica')||!l5?.caution?.includes('consejería'))errors.push('Philippians lesson 5 must preserve medical and counseling language around anxiety.');
  if(!l6?.teaching?.[2]?.body?.includes('no promete victoria en cada ambición personal'))errors.push('Philippians lesson 6 must preserve the contextual reading of Philippians 4:13.');
  if(!l6?.teaching?.[4]?.body?.includes('colaboradores generosos'))errors.push('Philippians lesson 6 must preserve the partnership context of Philippians 4:19.');
}

if(exists('first-peter-study-data-es.js')){
  const s=loadBookSeries('first-peter-study-data-es.js'),l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6],l8=s.lessons?.[7];
  if(!l4?.teaching?.[2]?.body?.includes('trata de personas')||!l4?.teaching?.[4]?.body?.includes('control coercitivo'))errors.push('1 Peter lesson 4 must preserve anti-slavery and domestic-abuse safeguards.');
  if(!l5?.teaching?.[1]?.body?.includes('denunciar')||!l5?.teaching?.[1]?.body?.includes('protección legal'))errors.push('1 Peter lesson 5 must preserve reporting and lawful-protection language.');
  if(!l6?.teaching?.[1]?.body?.includes('No oculta abuso'))errors.push('1 Peter lesson 6 must preserve the warning that love never conceals abuse.');
  if(!l7?.teaching?.[4]?.body?.includes('liderazgo coercitivo'))errors.push('1 Peter lesson 7 must preserve the anti-domination leadership safeguard.');
  if(!l8?.context?.includes('no promueve fascinación con los demonios'))errors.push('1 Peter lesson 8 must preserve sober spiritual-warfare framing.');
}

if(exists('second-peter-study-data-es.js')){
  const s=loadBookSeries('second-peter-study-data-es.js'),l3=s.lessons?.[2],l4=s.lessons?.[3],l5=s.lessons?.[4];
  if(!l3?.context?.includes('rumores')||!l3?.caution?.includes('Exige evidencia'))errors.push('2 Peter lesson 3 must distinguish vigilance from rumor and require evidence.');
  if(!l4?.caution?.includes('calendarios especulativos')||!l4?.caution?.includes('pánico'))errors.push('2 Peter lesson 4 must reject speculative date-setting and panic.');
  if(!l5?.caution?.includes('preguntas honestas')||!l5?.caution?.includes('control'))errors.push('2 Peter lesson 5 must distinguish honest questions from deliberate distortion and control.');
}

if(exists('first-john-study-data-es.js')){
  const s=loadBookSeries('first-john-study-data-es.js'),l2=s.lessons?.[1],l4=s.lessons?.[3],l5=s.lessons?.[4],l6=s.lessons?.[5],l7=s.lessons?.[6];
  if(!l2?.caution?.includes('no exige revelar públicamente'))errors.push('1 John lesson 2 must preserve appropriate disclosure guidance.');
  if(!l4?.teaching?.[2]?.body?.includes('oponente político')||!l4?.teaching?.[2]?.body?.includes('desacuerdo secundario'))errors.push('1 John lesson 4 must preserve careful use of the antichrist category.');
  if(!l5?.caution?.includes('escrupulosidad')||!l5?.caution?.includes('ansiedad espiritual'))errors.push('1 John lesson 5 must preserve scrupulosity and perfectionism safeguards.');
  if(!l6?.caution?.includes('consejería')||!l6?.caution?.includes('atención médica'))errors.push('1 John lesson 6 must preserve counseling and medical-care language around anxiety.');
  if(!l7?.teaching?.[2]?.body?.includes('control político')||!l7?.caution?.includes('especulación dogmática'))errors.push('1 John lesson 7 must reject political-control readings and preserve interpretive humility.');
}

if(exists('second-john-study-data-es.js')){
  const s=loadBookSeries('second-john-study-data-es.js'),l3=s.lessons?.[2],guide=(s.postLessonMapGuideBlocks||[]).map(x=>x.text||'').join(' ');
  if(!s.lessons?.every(x=>x.caution?.includes('basados en evidencia')&&x.caution?.includes('No avergüences')))errors.push('2 John must preserve evidence-based, non-shaming boundary guidance.');
  if(!l3?.context?.includes('no prohíbe la bondad común')||!l3?.teaching?.[3]?.body?.includes('compasión de emergencia'))errors.push('2 John lesson 3 must preserve ordinary-kindness and emergency-compassion safeguards.');
  for(const phrase of ['experiencias traumáticas','confidencialidad','temor a los de afuera'])if(!guide.includes(phrase))errors.push(`2 John leader safeguards must preserve ${phrase}.`);
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

// James uses its mature custom renderer and data shape.
const jamesRequired=['james-series.html','james-series-data.js','james-series-data-es.js','james-series.js','es/santiago-estudio.html'];
for(const file of jamesRequired)if(!exists(file))errors.push(`James: required bilingual resource is missing: ${file}`);
if(jamesRequired.every(exists)){
  const en=loadJamesSeries('james-series-data.js');
  const es=loadJamesSeries('james-series-data-es.js');
  if(en?.lessons?.length!==10||es?.lessons?.length!==10)errors.push('James must retain 10 English and 10 Spanish weeks.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('James: Spanish study must declare Nueva Traducción Viviente (NTV).');
  for(let i=0;i<10;i++){
    const a=en.lessons?.[i],b=es.lessons?.[i],label=`James week ${i+1}`;
    if(a?.week!==b?.week)errors.push(`${label}: week number mismatch.`);
    for(const field of ['title','scripture','goal','discussionLabel','prayerFocus'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
    for(const field of ['teachingNotes','discussion','leaderTips'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
    if(!String(b?.scripture||'').startsWith('Santiago '))errors.push(`${label}: Scripture reference must use Santiago.`);
  }
  if(!es?.lessons?.[0]?.leaderTips?.some(x=>x.includes('sin minimizar el dolor')))errors.push('James week 1 must preserve the safeguard against minimizing pain.');
  if(!es?.lessons?.[2]?.leaderTips?.some(x=>x.includes('libre de vergüenza')))errors.push('James week 3 must preserve shame-free leadership guidance.');
  if(!es?.lessons?.[5]?.leaderTips?.some(x=>x.includes('gracia')&&x.includes('desempeño')))errors.push('James week 6 must preserve grace-over-performance guidance.');
  expect('James Spanish page',read('es/santiago-estudio.html'),'../nldg-i18n.js?v=1.13.0');
  expect('James English page',read('james-series.html'),'nldg-i18n.js?v=1.13.0');
  expect('James route pair',i18n,`'james-series${html}':'es/santiago-estudio${html}'`);
}

if(errors.length){
  console.error('Spanish Book Series Audit FAILED');
  errors.forEach(error=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('Spanish Book Series Audit PASSED');
console.log('OK: Ruth 5, Philippians 6, James 10, 1 Peter 8, 2 Peter 5, 1 John 7, 2 John 3, 3 John 3, and Jude 4 have protected English/Spanish parity.');
console.log('OK: NTV is declared without mixed Spanish Bible-version labels.');
console.log('OK: all nine published Spanish book-series routes and library entries are protected.');
console.log('OK: book-specific pastoral and interpretive safeguards remain enforced.');