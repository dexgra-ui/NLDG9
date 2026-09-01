import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(p,'utf8');
const exists=p=>fs.existsSync(p);
const errors=[];
const html='.ht'+'ml';
const expect=(label,source,value)=>{if(!source.includes(value))errors.push(`${label}: missing ${JSON.stringify(value)}`)};
const load=(...files)=>{const context={window:{}};vm.createContext(context);for(const file of files)vm.runInContext(read(file),context,{filename:file});return context.window.NLDG_BOOK_STUDY;};
const required=['first-corinthians-study.html','first-corinthians-study-data.js','first-corinthians-study-guide.js','first-corinthians-study-data-es.js',['es','primera-corintios-estudio'+html].join('/'),'es/estudios-biblicos.html','nldg-i18n.js','book-study-series.js','book-study-series-es.js'];
for(const file of required)if(!exists(file))errors.push(`Missing 1 Corintios bilingual resource: ${file}`);
if(required.every(exists)){
 const en=load('first-corinthians-study-data.js','first-corinthians-study-guide.js');
 const es=load('first-corinthians-study-data-es.js');
 if(en?.lessons?.length!==8||es?.lessons?.length!==8)errors.push('1 Corintios must retain 8 English and 8 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('1 Corintios must declare Nueva Traducción Viviente (NTV).');
 for(let i=0;i<8;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`1 Corintios lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','practice','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  if(!String(b?.scripture||'').startsWith('1 Corintios '))errors.push(`${label}: Scripture reference must use 1 Corintios.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`1 Corintios series foundation missing ${field}.`);
 if(es?.seriesTeaching?.length!==en?.seriesTeaching?.length)errors.push('1 Corintios seriesTeaching count must match English.');
 if(es?.seriesQuestions?.length!==en?.seriesQuestions?.length)errors.push('1 Corintios seriesQuestions count must match English.');
 const data=read('first-corinthians-study-data-es.js');
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))errors.push(`Spanish data contains disallowed Bible version ${version}.`);
 const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
 if(!l1.teaching[5].body.includes('personas vulnerables')||!l1.teaching[1].body.includes('idolatría'))errors.push('Lesson 1 must preserve accountable leadership safeguards.');
 if(!l2.teaching[1].body.includes('proceso justo')||!l2.teaching[3].body.includes('delitos')||!l2.teaching[4].body.includes('coerción'))errors.push('Lesson 2 must preserve fair discipline, legal safety, and consent safeguards.');
 if(!l3.teaching[0].body.includes('coerción')||!l3.teaching[3].body.includes('violencia')||!l3.teaching[3].body.includes('seguridad'))errors.push('Lesson 3 must preserve mutual consent and safety safeguards.');
 if(!l4.teaching[2].body.includes('personas controladoras')||!l4.teaching[3].body.includes('pago justo')||!l4.teaching[4].body.includes('abuso'))errors.push('Lesson 4 must preserve conscience, labor, and abuse safeguards.');
 if(!l5.teaching[1].body.includes('mujeres')||!l5.teaching[2].body.includes('dominación')||!l5.teaching[5].body.includes('humillación pública'))errors.push('Lesson 5 must preserve worship dignity safeguards.');
 if(!l6.teaching[4].body.includes('Discapacidad')||!l6.teaching[5].body.includes('denuncia daño'))errors.push('Lesson 6 must preserve disability and harm-reporting safeguards.');
 if(!l7.teaching[1].body.includes('abuso')||!l7.teaching[2].body.includes('secretos')||!l7.teaching[5].body.includes('interpretación contextual'))errors.push('Lesson 7 must preserve love, truth, and contextual interpretation safeguards.');
 if(!l8.teaching[4].body.includes('dignidad')||!l8.teaching[5].body.includes('responsabilidad cotidiana'))errors.push('Lesson 8 must preserve embodied dignity and responsible hope.');
 const enPage=read('first-corinthians-study.html'),esPage=read(['es','primera-corintios-estudio'+html].join('/')),hub=read('es/estudios-biblicos.html'),i18n=read('nldg-i18n.js');
 expect('English page',enPage,'hreflang="es" href="https://nolabelsdesignedbygod.org/es/primera-corintios-estudio'+html+'"');
 expect('Spanish page',esPage,'hreflang="en" href="https://nolabelsdesignedbygod.org/first-corinthians-study'+html+'"');
 expect('Spanish page',esPage,'first-corinthians-study-data-es.js');
 expect('Route map',i18n,"'first-corinthians-study"+html+"':'es/primera-corintios-estudio"+html+"'");
 expect('Spanish hub',hub,'href="primera-corintios-estudio'+html+'"');
 expect('Spanish hub',hub,'1 Corintios: Unidad, santidad, amor y resurrección');
 expect('Spanish hub',hub,'8 lecciones completas');
}
if(errors.length){console.error('Spanish 1 Corinthians audit failed:\n- '+errors.join('\n- '));process.exit(1);}
console.log('Spanish 1 Corinthians audit passed.');