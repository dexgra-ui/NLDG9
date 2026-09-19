import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='jonah-study-data'+js,enGuide='jonah-study-guide'+js,esData='jonah-study-data-es'+js,enPage='jonah-study'+html,esPage=['es','jonas-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('jonah')?.status!=='published')fail('Jonah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Jonás':'Jonah','2 Reyes':'2 Kings','Salmo':'Psalm','Proverbios':'Proverbs','Marcos':'Mark','Santiago':'James','Efesios':'Ephesians','Jeremías':'Jeremiah','Joel':'Joel','Mateo':'Matthew','Lucas':'Luke','2 Corintios':'2 Corinthians','Éxodo':'Exodus','Romanos':'Romans'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='jonas-estudio')fail('Spanish Jonah slug must be jonas-estudio.');
 if(es?.book!=='Jonás')fail('Spanish Jonah book name must be Jonás.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Jonah must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Jonah must retain four lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Jonah lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b.scripture)!==a.scripture)fail(`${label}: main Scripture range must match English.`);
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain two Scripture-context paragraphs.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Jonás '))fail(`${label}: Scripture reference must begin with Jonás.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Jonah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Jonah must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Jonah series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Jonah series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Jonah series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Jonah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['setting humility',['escenario narrativo del siglo viii a.c.','la fecha precisa de composición y la clasificación literaria del libro son debatidas']],
  ['Nineveh capital restraint',['más tarde llegó a ser capital del imperio bajo senaquerib','no debe llamarse simplemente capital en el escenario de jonás']],
  ['lots not prescribed',['echar suertes se narra, no se prescribe','no uses las suertes de los marineros como método cristiano de guía']],
  ['disaster blame rejected',['no tenemos autoridad para diagnosticar huracanes','no afirmes que cada crisis revela un pecado oculto']],
  ['self-harm restraint',['el texto no presenta la autodestrucción como modelo espiritual','no romantices la petición de jonás de ser arrojado al mar']],
  ['fish species restraint',['el texto no identifica ballena ni otra especie','no insistas en que el pez era una ballena']],
  ['rescue not maturity',['el rescate de dios precede la mejora moral completa','el rescate no elimina la necesidad de discipulado continuo']],
  ['idol irony',['la afirmación sobre ídolos contiene ironía narrativa']],
  ['three-days geography humility',['no debe forzarse como una medición moderna exacta']],
  ['king title restraint',['no debemos añadir más precisión histórica que la que ofrece el texto']],
  ['animals no moral guilt',['los animales no son presentados como moralmente culpables','los animales participan en el duelo, no en culpa moral']],
  ['repentance behavior',['apartarse del mal y de la violencia','el arrepentimiento debe incluir responsabilidad, restitución, tratamiento, denuncia y protección apropiadas']],
  ['relenting framework',['jeremías 18 ayuda a entender advertencias proféticas','no presentes a dios como voluble por desistir']],
  ['temporary repentance restraint',['no cada política ni cada generación futura','no afirmes que una respuesta temporal borra injusticia posterior']],
  ['plant species restraint',['la especie exacta de la planta es incierta','no identifiques con certeza la especie de la planta']],
  ['120k humility',['el texto no exige una sola explicación','no insistas en que los 120,000 solo pueden significar']],
  ['death wish safety',['el deseo de morir de jonás no es elogiado','prioriza seguridad inmediata y apoyo profesional o de crisis']],
  ['enemy love and safety',['el amor al enemigo nunca debe usarse para presionar a víctimas hacia reconciliación insegura','no uses amor al enemigo para forzar contacto inseguro']],
  ['mercy justice together',['la compasión busca arrepentimiento y vida; no exige ingenuidad','buscar justicia sin venganza']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Jonah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/jonas-estudio'+html+'"'))fail('English Jonah page must link Spanish alternate.');
 if(!english.includes('jonah-study-data'+js+'?v=1.1.0')||!english.includes('jonah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Jonah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/jonas-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/jonah-study'+html+'"','../jonah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.69.0'])if(!spanish.includes(marker))fail(`Spanish Jonah page missing ${marker}.`);
 if(!i18n.includes("'jonah-study"+html+"':'es/jonas-estudio"+html+"'"))fail('Jonah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Jonah study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Jonah study audit passed.');
