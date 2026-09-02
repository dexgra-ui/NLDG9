import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentByKey } from './spanish-old-testament-manifest.mjs';

const errors=[];
const read=p=>fs.readFileSync(p,'utf8');
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const fail=m=>errors.push(m);
const html='.ht'+'ml';
const js='.j'+'s';
const enData='leviticus-study-data'+js;
const enGuide='leviticus-study-guide'+js;
const esData='leviticus-study-data-es'+js;
const enPage='leviticus-study'+html;
const esPage=['es','levitico-estudio'+html].join('/');
const hubPath=['es','estudios-biblicos'+html].join('/');
const i18nPath='nldg-i18n'+js;
const required=[enData,enGuide,esData,enPage,esPage,hubPath,i18nPath];
const book=spanishOldTestamentByKey.get('leviticus');
for(const file of required)if(!fs.existsSync(file))fail(`Missing ${file}.`);
if(book?.status!=='published')fail('Leviticus must be marked published in the Spanish Old Testament manifest.');

if(!errors.length){
  const en=load(enData,enGuide),es=load(esData);
  if(es?.slug!=='levitico-estudio')fail('Spanish Leviticus slug must be levitico-estudio.');
  if(es?.book!=='Levítico')fail('Spanish book name must be Levítico.');
  if(es?.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Leviticus must declare Nueva Traducción Viviente (NTV).');
  if(en?.lessons?.length!==8||es?.lessons?.length!==8)fail('Leviticus must retain eight lessons in both languages.');
  const fields=['title','scripture','question','truth','goal','opening','context','examination','challenge','caution','prayer'];
  for(let i=0;i<8;i++){
    const a=en.lessons[i],b=es.lessons[i],label=`Leviticus lesson ${i+1}`;
    if(a?.number!==b?.number)fail(`${label}: lesson number mismatch.`);
    for(const field of fields)if(!String(b?.[field]||'').trim())fail(`${label}: missing ${field}.`);
    for(const field of ['supporting','teaching','questions'])if((b?.[field]?.length??-1)!==(a?.[field]?.length??0))fail(`${label}: ${field} count must match English.`);
    for(const move of b?.teaching||[])if(!move?.heading?.trim()||!move?.body?.trim())fail(`${label}: incomplete teaching movement.`);
    if(!String(b?.scripture||'').startsWith('Levítico '))fail(`${label}: Scripture reference must use Levítico.`);
  }
  for(const field of ['seriesMainScripture','seriesQuestion','seriesOpening','seriesContext','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es?.[field]||'').trim())fail(`Leviticus series foundation missing ${field}.`);
  if((es?.seriesTeaching?.length??0)!==6)fail('Leviticus series foundation must retain six teaching movements.');
  if((es?.seriesQuestions?.length??0)!==8)fail('Leviticus series foundation must retain eight discussion questions.');
  const data=read(esData);
  for(const version of ['RVR60','NVI','NBLA'])if(new RegExp(`\\b${version}\\b`).test(data))fail(`Spanish Leviticus contains disallowed Bible version ${version}.`);
  const [l1,l2,l3,l4,l5,l6,l7,l8]=es.lessons;
  if(!l1.teaching[2].body.includes('no se compra con riqueza')||!l1.teaching[3].body.includes('nunca permiso para dañar')||!l1.teaching[4].body.includes('reparación material')||!l1.teaching[5].body.includes('transparencia financiera'))fail('Lesson 1 must preserve access, nonviolence, restitution, and financial-accountability safeguards.');
  if(!l2.teaching[3].body.includes('no permite amenazar')||!l2.teaching[3].body.includes('juicio pertenece a Dios')||!l2.teaching[4].body.includes('nunca debe usarse para suprimir el duelo')||!l2.teaching[5].body.includes('deben escuchar'))fail('Lesson 2 must preserve non-coercive leadership, grief care, and accountability safeguards.');
  if(!l3.teaching[0].body.includes('moralmente neutrales')||!l3.teaching[0].body.includes('no significa que una persona sea pecadora')||!l3.teaching[1].body.includes('respetar la práctica judía')||!l3.teaching[2].body.includes('nunca debe sostener vergüenza')||!l3.teaching[3].body.includes('enfermedad de Hansen')||!l3.teaching[3].body.includes('no prueban pecado')||!l3.teaching[4].body.includes('profesionales médicos')||!l3.teaching[5].body.includes('adaptaciones razonables'))fail('Lesson 3 must preserve ritual/moral distinction, Jewish respect, body dignity, medical care, and disability safeguards.');
  if(!l4.teaching[0].body.includes('rendición de cuentas')||!l4.teaching[2].body.includes('grupo vulnerable')||!l4.teaching[4].body.includes('No autoriza autolesión')||!l4.teaching[4].body.includes('trastornos alimentarios')||!l4.teaching[5].body.includes('abuso repetido'))fail('Lesson 4 must preserve accountable leadership, anti-scapegoating, self-harm, eating-disorder, and abuse safeguards.');
  if(!l5.teaching[1].body.includes('violación')||!l5.teaching[1].body.includes('incesto')||!l5.teaching[1].body.includes('coerción')||!l5.teaching[1].body.includes('trata')||!l5.teaching[1].body.includes('sin culpar a víctimas')||!l5.teaching[2].body.includes('nunca concede permiso para coerción')||!l5.teaching[3].body.includes('Los cristianos difieren')||!l5.teaching[3].body.includes('violencia')||!l5.teaching[4].body.includes('No son mandatos')||!l5.teaching[5].body.includes('racismo'))fail('Lesson 5 must preserve consent, survivor safety, interpretive humility, ancient-penalty, and anti-targeting safeguards.');
  if(!l6.teaching[1].body.includes('pobres e inmigrantes')||!l6.teaching[2].body.includes('compensación justa')||!l6.teaching[3].body.includes('discapacidad')||!l6.teaching[3].body.includes('accesibilidad')||!l6.teaching[5].body.includes('rechaza represalias'))fail('Lesson 6 must preserve immigrant, worker, disability, accessibility, and non-retaliation protections.');
  if(!l7.teaching[1].body.includes('generaciones futuras')||!l7.teaching[4].body.includes('depredadores')||!l7.teaching[5].body.includes('esclavitud racial')||!l7.teaching[5].body.includes('trata de personas')||!l7.teaching[5].body.includes('trabajo forzado'))fail('Lesson 7 must preserve stewardship, anti-predatory lending, slavery, trafficking, and forced-labor safeguards.');
  if(!l8.teaching[0].body.includes('fórmula de prosperidad')||!l8.teaching[1].body.includes('enfermedad')||!l8.teaching[1].body.includes('discapacidad')||!l8.teaching[2].body.includes('antisemitismo')||!l8.teaching[5].body.includes('voluntarios y transparentes')||!l8.teaching[5].body.includes('presionar contribuciones financieras'))fail('Lesson 8 must preserve anti-prosperity, suffering, antisemitism, and financial-coercion safeguards.');
  const guide=String(es.seriesLeaderGuidance||'');
  for(const phrase of ['estado ritual','discapacidad','menstruación','sexualidad','atención médica','transparencia financiera','antisemitismo','esclavitud','trata','trabajo forzado','coerción sexual'])if(!guide.includes(phrase))fail(`Leviticus leader guidance must preserve ${phrase}.`);
  const english=read(enPage),spanish=read(esPage),hub=read(hubPath),i18n=read(i18nPath);
  if(!english.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/levitico-estudio'+html+'"'))fail('English Leviticus page must link Spanish alternate.');
  if(!english.includes('nldg-i18n'+js+'?v=1.41.0'))fail('English Leviticus page must load current language switcher.');
  for(const marker of ['<html lang="es"','https://nolabelsdesignedbygod.org/es/levitico-estudio'+html,'hreflang="en" href="https://nolabelsdesignedbygod.org/leviticus-study'+html+'"','../leviticus-study-data-es'+js+'?v=1.0.0','../book-study-series-es'+js+'?v=1.1.0','../nldg-i18n'+js+'?v=1.41.0'])if(!spanish.includes(marker))fail(`Spanish Leviticus page missing ${marker}.`);
  if(!i18n.includes("'leviticus-study"+html+"':'es/levitico-estudio"+html+"'"))fail('Leviticus bilingual route is missing.');
  if(!hub.includes('href="levitico-estudio'+html+'"'))fail('Spanish Leviticus library card is missing.');
  if(!hub.includes('treinta y una series completas y revisadas'))fail('Spanish library count must be thirty-one series.');
}

if(errors.length){console.error('Spanish Leviticus study audit failed:');for(const error of errors)console.error(`- ${error}`);process.exit(1);}
console.log('Spanish Leviticus study audit passed.');
