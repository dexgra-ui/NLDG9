import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8'),exists=p=>fs.existsSync(p),errors=[];
const html='.ht'+'ml',js='.j'+'s';
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const enPage='john-study'+html,enData='john-study-data'+js,enGuide='john-study-guide'+js,esData='john-study-data-es'+js,esPage=['es','juan-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing Juan bilingual resource: ${file}`);
if(required.every(exists)){
 const en=load(enData,enGuide),es=load(esData);
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)errors.push('Juan must retain 8 English and 8 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('Juan must declare Nueva Traducción Viviente (NTV).');
 for(let i=0;i<8;i++){const a=en.lessons?.[i],b=es.lessons?.[i],label=`Juan lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','practice','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('Juan '))errors.push(`${label}: Scripture reference must use Juan.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`Juan series foundation missing ${field}.`);
 if(es?.seriesTeaching?.length!==en?.seriesTeaching?.length)errors.push('Juan seriesTeaching count must match English.');
 if(es?.seriesQuestions?.length!==en?.seriesQuestions?.length)errors.push('Juan seriesQuestions count must match English.');
 const data=read(esData);for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Juan Spanish data contains disallowed Bible version ${version}.`);
 const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
 if(!l1.teaching[1].body.includes('no son vergonzosos')||!l1.teaching[5].body.includes('antisemita'))errors.push('Lesson 1 must preserve embodied dignity and anti-antisemitism safeguards.');
 if(!l2.teaching[3].body.includes('no debe sensacionalizarse')||!l2.teaching[5].body.includes('testimonio de las mujeres'))errors.push('Lesson 2 must preserve Samaritan-woman dignity and women-witness safeguards.');
 if(!l3.teaching[0].body.includes('autonomía')||!l3.teaching[0].body.includes('carecen de fe')||!l3.teaching[5].body.includes('sin coaccionar'))errors.push('Lesson 3 must preserve disability, healing, and non-coercion safeguards.');
 if(!l4.teaching[1].body.includes('manuscritos más antiguos')||!l4.teaching[3].body.includes('no es castigo')||!l4.teaching[5].body.includes('control sin límites'))errors.push('Lesson 4 must preserve textual, disability, and shepherding safeguards.');
 if(!l5.teaching[0].body.includes('no es fórmula')||!l5.teaching[2].body.includes('no es falta de fe')||!l5.teaching[5].body.includes('nunca excusa'))errors.push('Lesson 5 must preserve unanswered-prayer, grief, and justice safeguards.');
 if(!l6.teaching[0].body.includes('actos degradantes')||!l6.teaching[1].body.includes('protege la maldad')||!l6.teaching[4].body.includes('abuso o trauma'))errors.push('Lesson 6 must preserve servant, secrecy, and trauma safeguards.');
 if(!l7.teaching[0].body.includes('ocultar abuso')||!l7.teaching[2].body.includes('no culpa a todo el pueblo judío')||!l7.teaching[2].body.includes('ejecución romana'))errors.push('Lesson 7 must preserve abuse and anti-antisemitism safeguards.');
 if(!l8.teaching[0].body.includes('testimonio de las mujeres')||!l8.teaching[2].body.includes('no lo avergüenza')||!l8.teaching[5].body.includes('responsabilidad'))errors.push('Lesson 8 must preserve women-witness, honest-doubt, and accountable-restoration safeguards.');
 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 expect('John English page',english,'hreflang="es" href="https://nolabelsdesignedbygod.org/es/juan-estudio'+html+'"');
 expect('John Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/john-study'+html+'"');
 expect('John Spanish page',spanish,'john-study-data-es'+js);
 expect('John route map',i18n,"'john-study"+html+"':'es/juan-estudio"+html+"'");
 expect('Spanish study hub',hub,'veinticinco series completas y revisadas');
 expect('Spanish study hub',hub,'href="juan-estudio'+html+'"');
 expect('Spanish study hub',hub,'Juan: La Palabra se hizo carne, dio su vida y resucitó');
 expect('Spanish study hub',hub,'8 lecciones completas');
}
if(errors.length){console.error('Spanish John audit failed:\n- '+errors.join('\n- '));process.exit(1);}
console.log('Spanish John audit passed.');