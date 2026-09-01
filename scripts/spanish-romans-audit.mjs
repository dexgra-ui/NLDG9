import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const html='.ht'+'ml';
const js='.j'+'s';
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const enPage='romans-study'+html,enData='romans-study-data'+js,enGuide='romans-study-guide'+js,esData='romans-study-data-es'+js;
const esPage=['es','romanos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Romanos bilingual resource: ${file}`);
if(required.every(exists)){
 const en=load(enData,enGuide),es=load(esData);
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)errors.push('Romanos must retain 8 English and 8 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Romanos must declare Nueva Traducción Viviente (NTV).');
 for(let i=0;i<8;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`Romanos lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','practice','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Romanos '))errors.push(`${label}: Scripture reference must use Romanos.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`Romanos series foundation missing ${field}.`);
 if(es?.seriesTeaching?.length!==en?.seriesTeaching?.length)errors.push('Romanos seriesTeaching count must match English.');
 if(es?.seriesQuestions?.length!==en?.seriesQuestions?.length)errors.push('Romanos seriesQuestions count must match English.');
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Romanos Spanish data contains disallowed Bible version ${version}.`);
 const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
 if(!l1.teaching[4].body.includes('acoso')||!l1.teaching[4].body.includes('pecado heterosexual')||!l1.teaching[5].body.includes('superioridad'))errors.push('Lesson 1 must preserve universal-sin and anti-harassment safeguards.');
 if(!l2.teaching[4].body.includes('personas judías')||!l2.teaching[1].body.includes('humillación'))errors.push('Lesson 2 must preserve anti-contempt and mercy safeguards.');
 if(!l3.teaching[2].body.includes('arrogancia gentil')||!l3.teaching[4].body.includes('pasivamente'))errors.push('Lesson 3 must preserve anti-boasting and suffering safeguards.');
 if(!l4.teaching[3].body.includes('esclavitud humana')||!l4.teaching[4].body.includes('Torá'))errors.push('Lesson 4 must preserve slavery and anti-Jewish-misuse safeguards.');
 if(!l5.teaching[2].body.includes('padre abusivo')||!l5.teaching[4].body.includes('culpar')||!l5.teaching[4].body.includes('silenciar'))errors.push('Lesson 5 must preserve trauma-aware and suffering safeguards.');
 if(!l6.teaching[4].body.includes('antisemitismo')||!l6.teaching[5].body.includes('explotación política'))errors.push('Lesson 6 must preserve anti-antisemitism and anti-exploitation safeguards.');
 if(!l7.teaching[4].body.includes('tribunales')||!l7.teaching[4].body.includes('denuncias')||!l7.teaching[5].body.includes('no obediencia ilimitada'))errors.push('Lesson 7 must preserve legal protection and accountable-authority safeguards.');
 if(!l8.teaching[1].body.includes('abuso')||!l8.teaching[2].body.includes('ofensa manipuladora')||!l8.teaching[5].body.includes('mujeres'))errors.push('Lesson 8 must preserve harm, conscience, and women-in-ministry safeguards.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 expect('Romans English page',english,'hreflang="es" href="https://nolabelsdesignedbygod.org/es/romanos-estudio'+html+'"');
 expect('Romans Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/romans-study'+html+'"');
 expect('Romans Spanish page',spanish,'romans-study-data-es'+js);
 expect('Romans route map',i18n,"'romans-study"+html+"':'es/romanos-estudio"+html+"'");
 expect('Spanish study hub',hub,'veintitrés series completas y revisadas');
 expect('Spanish study hub',hub,'href="romanos-estudio'+html+'"');
 expect('Spanish study hub',hub,'Romanos: El evangelio, la gracia y una familia transformada');
 expect('Spanish study hub',hub,'8 lecciones completas');
}
if(errors.length){console.error('Spanish Romans audit failed:\n- '+errors.join('\n- '));process.exit(1);}
console.log('Spanish Romans audit passed.');