import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml',js='.j'+'s';
const enData='amos-study-data'+js,enGuide='amos-study-guide'+js,esData='amos-study-data-es'+js,enPage='amos-study'+html,esPage=['es','amos-estudio'+html].join('/'),hubPath=['es','estudios-biblicos'+html].join('/'),i18nPath='nldg-i18n'+js;
for(const file of [enData,enGuide,esData,enPage,esPage,hubPath,i18nPath])if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(spanishOldTestamentByKey.get('amos')?.status!=='published')fail('Amos must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Amós':'Amos','Deuteronomio':'Deuteronomy','Isaías':'Isaiah','Romanos':'Romans','Santiago':'James','Lucas':'Luke','Génesis':'Genesis','Ezequiel':'Ezekiel','1 Pedro':'1 Peter','Hebreos':'Hebrews','Oseas':'Hosea','Apocalipsis':'Revelation','Miqueas':'Micah','Mateo':'Matthew','Filipenses':'Philippians','1 Timoteo':'1 Timothy','Números':'Numbers','Jeremías':'Jeremiah','Hechos':'Acts','1 Tesalonicenses':'1 Thessalonians','Salmo':'Psalm'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 if(es?.slug!=='amos-estudio')fail('Spanish Amos slug must be amos-estudio.');
 if(es?.book!=='Amós')fail('Spanish Amos book name must be Amós.');
 if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Amos must declare Nueva Traducción Viviente (NTV).');
 if(en?.lessons?.length!==7||es?.lessons?.length!==7)fail('Amos must retain seven lessons in both languages.');
 const fields=['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'];
 for(let i=0;i<7;i++){
  const a=en.lessons[i],b=es.lessons[i],label=`Amos lesson ${i+1}`;
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
  if(!String(b?.scripture||'').startsWith('Amós '))fail(`${label}: Scripture reference must begin with Amós.`);
 }
 if(es?.themeLabel!=='Verdad clave')fail('Amos theme label must be Verdad clave.');
 if(es?.lessonSubtitleMode!==true)fail('Amos must retain lesson subtitle mode.');
 for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer','seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway'])if(!String(es?.[field]||'').trim())fail(`Amos series foundation missing ${field}.`);
 if((es?.seriesTeaching?.length??0)!==8||(en?.seriesTeaching?.length??0)!==8)fail('Amos series guide must retain eight teaching movements.');
 if((es?.seriesQuestions?.length??0)!==8||(en?.seriesQuestions?.length??0)!==8)fail('Amos series guide must retain eight discussion questions.');

 const raw=read(esData),all=JSON.stringify(es).toLowerCase();
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(raw))fail(`Spanish Amos contains disallowed Bible version ${version}.`);
 const safeguards=[
  ['historical setting',['tecóa','jeroboam ii','siglo viii']],
  ['ancient nations not modern codes',['no son códigos para odio étnico moderno','no deben convertirse en etiquetas para enemigos raciales']],
  ['sexual-text humility',['la situación exacta de amós 2:7 es debatida','no debe etiquetarse con seguridad como prostituta de culto']],
  ['known not superiority',['no significa que dios ignore a otros pueblos','superioridad étnica']],
  ['two-walk context',['amós 3:3–6 forma una cadena','no es principalmente una regla universal sobre matrimonio']],
  ['prophecy testing',['las afirmaciones proféticas modernas siguen requiriendo examen','escritura, carácter, evidencia, comunidad y fruto']],
  ['Bashan anti-misogyny',['no autoriza misoginia ni vergüenza corporal','no uses «vacas de basán» para misoginia']],
  ['disaster blame rejected',['no es una fórmula para explicar cada tragedia moderna','no culpes a víctimas por tragedias']],
  ['prepare-meet context',['es advertencia de juicio','no conviertas «prepárate para encontrarte con tu dios» en una amenaza sin contexto']],
  ['justice nonpartisan',['no digas qué partido o candidato cumple amós','autocelebración partidista']],
  ['Amos 5 textual humility',['sikkuth, kiyyun, moloc o refán','dificultad textual de amós 5:26']],
  ['comfort not automatically sinful',['no condena descanso, belleza, comida, música o riqueza por sí mismos','no demonices descanso, música, arte']],
  ['Lo-debar wordplay',['lo-debar puede sonar como «nada»','karnaim']],
  ['anak uncertainty',['’anak','su material o sentido exacto es debatido']],
  ['not anti-clergy',['no condena el ministerio formado o sostenido','no ataques al clero formado']],
  ['Amaziah no retaliation',['no es una plantilla de represalia','no uses el juicio contra amasías para amenazar']],
  ['summer fruit wordplay',['qayits','qets']],
  ['famine no manipulation',['no significa que desaparezcan biblias','no uses el hambre de oír para manipular miedo']],
  ['Amos 9 universal sovereignty',['filisteos desde caftor','arameos desde kir']],
  ['textual variant Amos 9',['texto masorético','tradición griega','remanente de edom','remanente de la humanidad']],
  ['Acts 15 guardrails',['inclusión de gentiles','no autoriza antisemitismo']],
  ['political restraint',['no uses amós para prescribir un voto moderno','política incuestionable']],
  ['leader safety',['prioriza seguridad, atención calificada, protección legal','deberes aplicables de denuncia']]
 ];
 for(const [label,phrases] of safeguards)for(const phrase of phrases)if(!all.includes(phrase.toLowerCase()))fail(`Amos safeguard missing ${label}: ${phrase}.`);

 const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
 if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/amos-estudio'+html+'"'))fail('English Amos page must link Spanish alternate.');
 if(!english.includes('amos-study-data'+js+'?v=1.1.0')||!english.includes('amos-study-guide'+js+'?v=1.1.0')||!english.includes('book-study-series'+js+'?v=0.2.0'))fail('English Amos page must load corrected study assets.');
 for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/amos-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/amos-study'+html+'"','../amos-study-data-es'+js+'?v=1.1.0','../book-study-series'+js+'?v=0.2.0','../book-study-series-es'+js+'?v=1.2.0','../nldg-i18n'+js+'?v=1.67.0'])if(!spanish.includes(marker))fail(`Spanish Amos page missing ${marker}.`);
 if(!i18n.includes("'amos-study"+html+"':'es/amos-estudio"+html+"'"))fail('Amos bilingual route is missing.');
 if(!hub.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library must describe all sixty-six series.');
}
if(errors.length){console.error('Spanish Amos study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Amos study audit passed.');
