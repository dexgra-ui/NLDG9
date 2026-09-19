import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentBooks, spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='malachi-study-data'+js,enGuide='malachi-study-guide'+js,esData='malachi-study-data-es'+js,enPage='malachi-study'+html,esPage=['es','malaquias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('malachi')?.status!=='published')fail('Malachi must be marked published in the Spanish Old Testament manifest.');
if(spanishOldTestamentBooks.filter(book=>book.status==='published').length!==39)fail('All 39 Old Testament books must be published in Spanish.');
if(spanishOldTestamentBooks.some(book=>book.status==='prepared'))fail('No Old Testament book should remain prepared after Malachi.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={
  'Malaquías':'Malachi','Génesis':'Genesis','Deuteronomio':'Deuteronomy','Abdías':'Obadiah','Romanos':'Romans',
  'Levítico':'Leviticus','Ezequiel':'Ezekiel','Santiago':'James','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians',
  'Efesios':'Ephesians','Mateo':'Matthew','Lucas':'Luke','Salmo':'Psalm','Apocalipsis':'Revelation'
 };
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);

 if(es?.slug!=='malaquias-estudio')fail('Spanish Malachi slug must be malaquias-estudio.');
 if(es?.book!=='Malaquías')fail('Spanish book name must be Malaquías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Malachi must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Malachi theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Malachi must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==5||es?.lessons?.length!==5)fail('Malachi must retain five lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Malachi series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<5;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Malachi lesson ${i+1}`;
  if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
  if(norm(b?.scripture)!==a?.scripture)fail(`${label}: main Scripture range must match English exactly.`);
  if(JSON.stringify((b?.supporting||[]).map(norm))!==JSON.stringify(a?.supporting||[]))fail(`${label}: supporting passages must match English exactly.`);
  for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
  for(const field of ['supporting','teaching','questions','openingParagraphs','contextParagraphs','jesusParagraphs','guardrailParagraphs'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
  if((b?.supporting?.length??0)!==5)fail(`${label}: must retain exactly five supporting passages.`);
  if((b?.teaching?.length??0)!==8)fail(`${label}: must retain eight teaching movements.`);
  if((b?.questions?.length??0)!==8)fail(`${label}: must retain eight passage-based questions.`);
  if((b?.contextParagraphs?.length??0)!==2)fail(`${label}: must retain exactly two Scripture-context paragraphs.`);
  if((b?.jesusParagraphs?.length??0)!==1)fail(`${label}: must retain one Jesus Connection paragraph.`);
  if((b?.guardrailParagraphs?.length??0)!==1)fail(`${label}: must retain one Do Not Miss This paragraph.`);
  for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim()||!(move?.paragraphs?.length))fail(`${label}: incomplete teaching movement.`);
  if(!String(b?.scripture||'').startsWith('Malaquías '))fail(`${label}: Scripture reference must begin with Malaquías.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Malachi series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Malachi series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Malachi series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Malachi series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Malachi contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['postexilic dating humility',['no da una fecha exacta']],
  ['election not ethnic superiority',['la elección es gracia y vocación, no prueba de superioridad étnica']],
  ['Edom not ethnic contempt',['el blanco no es la etnia como tal']],
  ['disability dignity',['la dignidad humana nunca debe medirse por elegibilidad sacrificial']],
  ['leader accountability',['el liderazgo espiritual responde tanto por carácter como por enseñanza']],
  ['interethnic marriage protection',['este pasaje no debe usarse para prohibir matrimonio interracial o interétnico']],
  ['divorce translation humility',['el hebreo del versículo 16 es difícil']],
  ['abuse safety',['separación, protección legal y otros límites pueden ser necesarios frente al abuso']],
  ['refiner not abuse',['no dan permiso a líderes espirituales para infligir sufrimiento en nombre de refinar personas']],
  ['wage justice',['robo de salarios']],
  ['tithing not prosperity',['no una tasa universal de inversión por cada donación']],
  ['poor people not shamed',['no avergüences a personas pobres']],
  ['book of remembrance not mystical ledger',['no una técnica espiritual para ganar lugar en un cuaderno celestial literal']],
  ['sun of righteousness humility',['no es citada explícitamente en el nuevo testamento como título de jesús']],
  ['Elijah to John',['lucas 1:17 describe explícitamente a juan el bautista viniendo en el espíritu y poder de elías']],
  ['safe family reconciliation',['reconciliación segura requiere arrepentimiento, responsabilidad, consentimiento']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Malachi safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/malaquias-estudio'+html+'"'))fail('English Malachi page must link Spanish alternate.');
 if(!english.includes('malachi-study-data'+js+'?v=1.1.0')||!english.includes('malachi-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.76.0'))fail('English Malachi page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/malaquias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/malachi-study'+html+'"','../malachi-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.76.0'])if(!spanish.includes(marker))fail(`Spanish Malachi page missing ${marker}.`);
 if(!i18n.includes("'malachi-study"+html+"':'es/malaquias-estudio"+html+"'"))fail('Malachi bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Malachi study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Malachi study audit passed.');
