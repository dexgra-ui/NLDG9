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

const enPage='second-corinthians-study'+html;
const enData='second-corinthians-study-data'+js;
const enGuide='second-corinthians-study-guide'+js;
const esData='second-corinthians-study-data-es'+js;
const esPage=['es','segunda-corintios-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enPage,enData,enGuide,esData,esPage,hubPath,i18nPath,'book-study-series'+js,'book-study-series-es'+js];
for(const file of required)if(!exists(file))errors.push(`Missing 2 Corintios bilingual resource: ${file}`);

if(required.every(exists)){
 const en=load(enData,enGuide);
 const es=load(esData);
 if(en?.lessons?.length!==6||es?.lessons?.length!==6)errors.push('2 Corintios must retain 6 English and 6 Spanish lessons.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')errors.push('2 Corintios must declare Nueva Traducción Viviente (NTV).');
 for(let i=0;i<6;i++){
  const a=en.lessons?.[i],b=es.lessons?.[i],label=`2 Corintios lesson ${i+1}`;
  if(a?.number!==b?.number)errors.push(`${label}: lesson number mismatch.`);
  for(const field of ['title','scripture','question','truth','goal','opening','context','examination','practice','caution','prayer'])if(!String(b?.[field]||'').trim())errors.push(`${label}: missing Spanish ${field}.`);
  for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??0)!==(a?.[field]?.length??0))errors.push(`${label}: ${field} count mismatch.`);
  for(const movement of b?.teaching||[])if(!String(movement?.heading||'').trim()||!String(movement?.body||'').trim())errors.push(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('2 Corintios '))errors.push(`${label}: Scripture reference must use 2 Corintios.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())errors.push(`2 Corintios series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==(en?.seriesTeaching?.length??0))errors.push('2 Corintios seriesTeaching count must match English.');
 if((es?.seriesQuestions?.length??0)!==(en?.seriesQuestions?.length??0))errors.push('2 Corintios seriesQuestions count must match English.');
 const data=read(esData);
 for(const version of ['RVR60','NVI','NBLA'])rejectVersion('2 Corintios Spanish data',data,version);
 const [l1,l2,l3,l4,l5,l6]=es.lessons||[];
 if(!l1?.teaching?.[2]?.body?.includes('atención médica')||!l1?.teaching?.[2]?.body?.includes('consejería')||!l1?.teaching?.[2]?.body?.includes('planificación de seguridad')||!l1?.teaching?.[5]?.body?.includes('límites')||!l1?.teaching?.[5]?.body?.includes('reconstruir confianza'))errors.push('2 Corintios lesson 1 must preserve crisis-care and safe-forgiveness safeguards.');
 if(!l2?.teaching?.[3]?.body?.includes('testimonios fabricados')||!l2?.teaching?.[3]?.body?.includes('secretos financieros')||!l2?.teaching?.[4]?.body?.includes('abuso')||!l2?.teaching?.[4]?.body?.includes('incompetencia')||!l2?.teaching?.[4]?.body?.includes('daño prevenible'))errors.push('2 Corintios lesson 2 must preserve transparent ministry and weakness-not-harm safeguards.');
 if(!l3?.teaching?.[1]?.body?.includes('no es negar evidencia')||!l3?.teaching?.[4]?.body?.includes('no fabrica paz mediante negación')||!l3?.teaching?.[5]?.body?.includes('arrepentimiento')||!l3?.teaching?.[5]?.body?.includes('restitución')||!l3?.teaching?.[5]?.body?.includes('seguridad'))errors.push('2 Corintios lesson 3 must preserve truthful, accountable reconciliation.');
 if(!l4?.teaching?.[0]?.body?.includes('consentimiento')||!l4?.teaching?.[2]?.body?.includes('privacidad sabia y límites')||!l4?.teaching?.[3]?.body?.includes('prejuicio racial')||!l4?.teaching?.[5]?.body?.includes('reconstruyen gradualmente'))errors.push('2 Corintios lesson 4 must preserve consent, privacy, anti-prejudice, and gradual-trust safeguards.');
 if(!l5?.teaching?.[0]?.body?.includes('personas vulnerables')||!l5?.teaching?.[1]?.body?.includes('riqueza garantizada')||!l5?.teaching?.[2]?.body?.includes('deudas')||!l5?.teaching?.[4]?.body?.includes('registros claros')||!l5?.teaching?.[4]?.body?.includes('conflictos de interés')||!l5?.teaching?.[5]?.body?.includes('coerción'))errors.push('2 Corintios lesson 5 must preserve voluntary, proportional, transparent generosity.');
 if(!l6?.teaching?.[1]?.body?.includes('acceso sin límites a cuerpos, dinero, decisiones, secretos o lealtad')||!l6?.teaching?.[3]?.body?.includes('tratamiento')||!l6?.teaching?.[4]?.heading?.includes('Debilidad no es abuso')||!l6?.teaching?.[4]?.body?.includes('evadir rendición de cuentas'))errors.push('2 Corintios lesson 6 must preserve limited authority, care, and weakness-not-abuse safeguards.');
 const caution=String(es.lessons?.[0]?.caution||'');
 for(const phrase of ['silenciar personas','excusar mala conducta','exigir dinero','presionar reconciliación','abuso','peligro','angustia severa','conducta criminal','seguridad','atención calificada','responsabilidades de denuncia','carácter demostrado'])if(!caution.includes(phrase))errors.push(`2 Corintios common leader guidance must preserve ${phrase}.`);
 const seriesText=[...(es.seriesTeaching||[]).flatMap(x=>[x.heading||'',x.body||'']),es.seriesLeaderGuidance||''].join(' ');
 for(const phrase of ['autoridad espiritual no elimina la necesidad de transparencia','no es acceso forzado','El perdón nunca exige secreto','confianza inmediata','restauración automática a un cargo','regresar al peligro','nunca debe ser forzado por vergüenza','riqueza garantizada'])if(!seriesText.includes(phrase))errors.push(`2 Corintios series foundation must preserve ${phrase}.`);
 const i18n=read(i18nPath),hub=read(hubPath),english=read(enPage),spanish=read(esPage);
 expect('2 Corintios route pair',i18n,`'second-corinthians-study${html}':'es/segunda-corintios-estudio${html}'`);
 expect('2 Corinthians English page',english,'nldg-i18n'+js+'?v=1.31.0');
 expect('2 Corintios Spanish page',spanish,'../nldg-i18n'+js+'?v=1.31.0');
 expect('2 Corintios Spanish page',spanish,'https://nolabelsdesignedbygod.org/es/segunda-corintios-estudio'+html);
 expect('2 Corintios Spanish page',spanish,'hreflang="en" href="https://nolabelsdesignedbygod.org/second-corinthians-study'+html+'"');
 expect('Spanish study hub',hub,'href="segunda-corintios-estudio'+html+'"');
 expect('Spanish study hub',hub,'2 Corintios: Consuelo, reconciliación, generosidad y fuerza en la debilidad');
 expect('Spanish study hub',hub,'6 lecciones completas');
 expect('Spanish study hub',hub,'../nldg-i18n'+js+'?v=');
}

if(errors.length){console.error('Spanish 2 Corinthians Audit FAILED');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish 2 Corinthians Audit PASSED');
console.log('OK: 2 Corintios retains 6/6 English-Spanish lesson parity and the full rich study foundation.');
console.log('OK: NTV, routing, trauma care, reconciliation, consent, transparent generosity, limited authority, and weakness-with-accountability safeguards are protected.');