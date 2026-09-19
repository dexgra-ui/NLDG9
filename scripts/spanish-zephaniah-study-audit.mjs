import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='zephaniah-study-data'+js,enGuide='zephaniah-study-guide'+js,esData='zephaniah-study-data-es'+js,enPage='zephaniah-study'+html,esPage=['es','sofonias-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('zephaniah')?.status!=='published')fail('Zephaniah must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Sofonías':'Zephaniah','Amós':'Amos','Isaías':'Isaiah','Mateo':'Matthew','Romanos':'Romans','Miqueas':'Micah','Salmo':'Psalm','Santiago':'James','Jeremías':'Jeremiah','Ezequiel':'Ezekiel','Lucas':'Luke','Efesios':'Ephesians','Apocalipsis':'Revelation','1 Tesalonicenses':'1 Thessalonians'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const normList=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);

 if(es?.slug!=='sofonias-estudio')fail('Spanish Zephaniah slug must be sofonias-estudio.');
 if(es?.book!=='Sofonías')fail('Spanish book name must be Sofonías.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Zephaniah must declare Nueva Traducción Viviente (NTV).');
 if(es?.themeLabel!=='Verdad clave')fail('Spanish Zephaniah theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true||en?.lessonSubtitleMode!==true)fail('Zephaniah must retain lesson subtitle mode in both languages.');
 if(en?.lessons?.length!==4||es?.lessons?.length!==4)fail('Zephaniah must retain four lessons in both languages.');
 if(JSON.stringify(normList(es.seriesMainScripture))!==JSON.stringify(normList(en.seriesMainScripture)))fail('Zephaniah series main Scripture references must match English exactly.');

 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<4;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Zephaniah lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Sofonías '))fail(`${label}: Scripture reference must begin with Sofonías.`);
 }
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Zephaniah series foundation missing ${field}.`);
 if((en?.seriesTeaching?.length??0)!==8||(es?.seriesTeaching?.length??0)!==8)fail('Zephaniah series guide must retain eight teaching movements.');
 if((en?.seriesQuestions?.length??0)!==8||(es?.seriesQuestions?.length??0)!==8)fail('Zephaniah series guide must retain eight discussion questions.');
 if(String(en?.seriesContext||'').split('\n\n').filter(Boolean).length!==2||String(es?.seriesContext||'').split('\n\n').filter(Boolean).length!==2)fail('Zephaniah series context must retain two paragraphs in both languages.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Zephaniah contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['Josiah-era dating humility',['los intentos de fechar la profecía con mayor precisión son debatidos']],
  ['Hezekiah identification humility',['el texto no hace explícita esa identificación']],
  ['no modern disaster assignment',['no afirmes que un huracán, guerra, enfermedad, elección, crisis económica']],
  ['no end-times date setting',['no pongas fecha al regreso de cristo']],
  ['Judah is not a modern state',['no supongas que judá en tiempos de josías equivale directamente a un estado moderno']],
  ['ancient nations not ethnic hostility',['no conviertas los oráculos contra filistea, moab, amón, cus o asiria en desprecio étnico']],
  ['humility not abuse',['humildad no requiere reconciliación insegura, silencio sobre abuso ni renuncia a protección legítima']],
  ['Philistia not modern land claim',['no debe reutilizarse como texto de prueba para reclamos territoriales modernos']],
  ['Cush restraint',['el texto da pocos detalles acerca de cus aquí']],
  ['God presence not institutional certification',['su presencia no certifica liderazgo abusivo']],
  ['leader criticism not rebellion',['no equipares crítica a líderes con rebelión contra dios']],
  ['accountability and due process',['responsabilidad, evidencia, debido proceso, seguridad y corrección veraz']],
  ['Zephaniah 3:17 translation humility',['los detalles de traducción alrededor de la frase central difieren']],
  ['corporate restoration not personal guarantee',['esto es restauración corporativa del pacto y no una garantía']],
  ['vulnerable centered',['el cojo y el desterrado son reunidos']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Zephaniah safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/sofonias-estudio'+html+'"'))fail('English Zephaniah page must link Spanish alternate.');
 if(!english.includes('zephaniah-study-data'+js+'?v=1.1.0')||!english.includes('zephaniah-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0')||!english.includes('nldg-i18n'+js+'?v=1.73.0'))fail('English Zephaniah page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/sofonias-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/zephaniah-study'+html+'"','../zephaniah-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.73.0'])if(!spanish.includes(marker))fail(`Spanish Zephaniah page missing ${marker}.`);
 if(!i18n.includes("'zephaniah-study"+html+"':'es/sofonias-estudio"+html+"'"))fail('Zephaniah bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Zephaniah study audit failed:');for(const error of errors)console.error('- '+error);process.exit(1);}
console.log('Spanish Zephaniah study audit passed.');
