import fs from 'node:fs';
import vm from 'node:vm';

const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const rejectVersion=(label,source,version)=>{if(new RegExp(`\\b${version}\\b`).test(source))errors.push(`${label}: contains disallowed Bible version label ${JSON.stringify(version)}`)};
const html='.ht'+'ml';
const js='.j'+'s';
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const guideText=s=>[
 ...(s.seriesOverviewParagraphs||[]),
 ...(s.seriesGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[]),...(x.paragraphs||[])]),
 ...(s.postLessonMapGuideBlocks||[]).flatMap(x=>[x.text||'',...(x.items||[]),...(x.paragraphs||[])])
].join(' ');

const enPage='galatians-study'+html;
const enData='galatians-study-data'+js;
const enGuide='galatians-study-guide'+js;
const esData='galatians-study-data-es'+js;
const esPage=['es','galatas-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Gálatas bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)errors.push('Gálatas must retain 8 English and 8 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Gálatas must declare Nueva Traducción Viviente (NTV).');
 for(const field of ['seriesGuideBlocks','postLessonMapGuideBlocks'])if((es?.[field]?.length??0)!==(en?.[field]?.length??0))errors.push(`Gálatas ${field} count must match English.`);
 for(let i=0;i<8;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Gálatas lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Gálatas '))errors.push(`${label}: Scripture reference must use Gálatas.`);
 }
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('Gálatas Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons||[];
 if(!l1?.caution?.includes('acusaciones descuidadas')||!l1?.caution?.includes('distorsión del evangelio central')||!l1?.caution?.includes('desacuerdo ordinario'))errors.push('Gálatas lesson 1 must distinguish core gospel distortion from ordinary disagreement.');
 if(!l2?.caution?.includes('prácticas judías')||!l2?.caution?.includes('inherentemente malas')||!l2?.caution?.includes('obligar a los gentiles'))errors.push('Gálatas lesson 2 must preserve non-anti-Jewish and anti-coercion safeguards.');
 if(!l3?.caution?.includes('dureza')||!l3?.caution?.includes('evidencia')||!l3?.caution?.includes('daño')||!l3?.caution?.includes('restauración'))errors.push('Gálatas lesson 3 must preserve proportional, evidence-based correction.');
 if(!l4?.caution?.includes('antisemitas')||!l4?.teaching?.[4]?.body?.includes('Antiguo Testamento')||!l4?.teaching?.[5]?.body?.includes('mayor valor, acceso o herencia'))errors.push('Gálatas lesson 4 must preserve anti-antisemitism, Old Testament dignity, and equal-belonging safeguards.');
 if(!l5?.caution?.includes('antisemitas')||!l5?.caution?.includes('antiárabes')||!l5?.caution?.includes('misóginos')||!l5?.teaching?.[5]?.body?.includes('mujeres, árabes ni judíos'))errors.push('Gálatas lesson 5 must reject racial, anti-Arab, antisemitic, and misogynistic misuse of the allegory.');
 if(!l6?.caution?.includes('No llamen legalismo a toda disciplina')||!l6?.teaching?.[5]?.body?.includes('sirven voluntariamente'))errors.push('Gálatas lesson 6 must distinguish legalism from discipline and freedom from autonomy.');
 if(!l7?.caution?.includes('atacar grupos seleccionados')||!l7?.caution?.includes('ira, división, envidia')||!l7?.teaching?.[5]?.body?.includes('no es una competencia'))errors.push('Gálatas lesson 7 must reject selective weaponization and performance comparison.');
 if(!l8?.caution?.includes('abuso')||!l8?.caution?.includes('violencia')||!l8?.caution?.includes('delitos')||!l8?.caution?.includes('autoridades apropiadas')||!l8?.caution?.includes('apoyo profesional'))errors.push('Gálatas lesson 8 must preserve safe, accountable restoration safeguards.');
 const guide=guideText(es);
 for(const phrase of ['antisemitismo','desprecio por el judaísmo','Antiguo Testamento es malo','identidad y pertenencia iguales en Cristo','borrar culturas','seguridad y rendición de cuentas','abuso o delitos en privado'])if(!guide.includes(phrase))errors.push(`Gálatas guide must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('Gálatas route pair',i18n,`'galatians-study${html}':'es/galatas-estudio${html}'`);
 expect('Galatians English page',english,'nldg-i18n'+js+'?v=1.30.0');
 expect('Gálatas Spanish page',spanish,'../nldg-i18n'+js+'?v=1.30.0');
 expect('Gálatas Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/galatas-estudio'+html);
 expect('Gálatas Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/galatians-study'+html+'"');
 expect('Spanish study hub',hub,'veinte series completas y revisadas');
 expect('Spanish study hub',hub,'href="galatas-estudio'+html+'"');
 expect('Spanish study hub',hub,'Gálatas: Gracia, fe, libertad y el Espíritu');
 expect('Spanish study hub',hub,'8 lecciones completas');
 expect('Spanish study hub',hub,'nldg-i18n'+js+'?v=1.30.0');
}

if(errors.length){console.error('Spanish Galatians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Galatians Audit PASSED');
console.log('OK: Gálatas retains 8/8 English-Spanish lesson parity and guide structure.');
console.log('OK: NTV, routing, gospel-grace, anti-antisemitism, equal-belonging, freedom, Spirit-formation, and safe-restoration safeguards are protected.');