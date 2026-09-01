import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8'),exists=p=>fs.existsSync(p),errors=[];
const html='.ht'+'ml',js='.j'+'s';
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const enPage='acts-study'+html,enData='acts-study-data'+js,enGuide='acts-study-guide'+js,esData='acts-study-data-es'+js,esPage=['es','hechos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Hechos bilingual resource: ${file}`);
if(required.every(exists)){
 const en=load(enData,enGuide),es=load(esData);
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)errors.push('Hechos must retain 8 English and 8 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Hechos must declare Nueva Traducción Viviente (NTV).');
 for(let i=0;i<8;i++){const a=en.lessons?.[i],b=es.lessons?.[i],label=`Hechos lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','practice','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Hechos '))errors.push(`${label}: Scripture reference must use Hechos.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`Hechos series foundation missing ${field}.`);
 if(es?.seriesTeaching?.length!==en?.seriesTeaching?.length)errors.push('Hechos seriesTeaching count must match English.');
 if(es?.seriesQuestions?.length!==en?.seriesQuestions?.length)errors.push('Hechos seriesQuestions count must match English.');
 const data=read(esData);for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Hechos Spanish data contains disallowed Bible version ${version}.`);
 const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
 if(!l1.teaching[3].body.includes('jerarquía de valor')||!l1.teaching[5].body.includes('voluntariamente')||!l1.teaching[5].body.includes('salvaguardas'))errors.push('Lesson 1 must preserve gift-equality and voluntary-generosity safeguards.');
 if(!l2.teaching[0].body.includes('no accesorios')||!l2.teaching[1].body.includes('carece de fe')||!l2.teaching[4].body.includes('disciplina violenta'))errors.push('Lesson 2 must preserve disability, healing, and nonviolent-discipline safeguards.');
 if(!l3.teaching[0].body.includes('desigualdad')||!l3.teaching[2].body.includes('no permiso')||!l3.teaching[3].body.includes('no hace justa'))errors.push('Lesson 3 must preserve equity, anti-antisemitism, and justice safeguards.');
 if(!l4.teaching[1].body.includes('víctimas')||!l4.teaching[1].body.includes('salvaguardas')||!l4.teaching[2].body.includes('evidencia'))errors.push('Lesson 4 must preserve victim safety and evidence-based trust.');
 if(!l5.teaching[0].body.includes('rendición de cuentas')||!l5.teaching[3].body.includes('transparente')||!l5.teaching[5].body.includes('no a un empresario'))errors.push('Lesson 5 must preserve accountable leadership, transparent aid, and non-celebrity mission.');
 if(!l6.teaching[0].body.includes('ni romantizarse')||!l6.teaching[4].body.includes('antisemitismo')||!l6.teaching[5].body.includes('sin declarar'))errors.push('Lesson 6 must preserve suffering, anti-antisemitism, and conflict safeguards.');
 if(!l7.teaching[0].body.includes('culpa colectiva')||!l7.teaching[3].body.includes('remunerar justamente')||!l7.teaching[5].body.includes('poder sin rendición de cuentas'))errors.push('Lesson 7 must preserve anti-blame, fair-pay, and leadership-accountability safeguards.');
 if(!l8.teaching[1].body.includes('no es prueba')||!l8.teaching[2].body.includes('derechos legales')||!l8.teaching[4].body.includes('protege a los presos'))errors.push('Lesson 8 must preserve due-process, legal-rights, and humane-action safeguards.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 expect('Acts English page',english,'hreflang="es" href="https://nolabelsdesignedbygod.org/es/hechos-estudio'+html+'"');
 expect('Acts Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/acts-study'+html+'"');
 expect('Acts Spanish page',spanish,'acts-study-data-es'+js);
 expect('Acts route map',i18n,"'acts-study"+html+"':'es/hechos-estudio"+html+"'");
 expect('Spanish study hub',hub,'href="hechos-estudio'+html+'"');
 expect('Spanish study hub',hub,'Hechos: Testimonio capacitado por el Espíritu desde Jerusalén hasta Roma');
 expect('Spanish study hub',hub,'8 lecciones completas');
}
if(errors.length){console.error('Spanish Acts audit failed:\n- '+errors.join('\n- '));process.exit(1);}
console.log('Spanish Acts audit passed.');