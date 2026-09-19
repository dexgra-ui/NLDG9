import fs from 'node:fs';import vm from 'node:vm';
const errors=[],read=p=>fs.readFileSync(p,'utf8'),exists=fs.existsSync,fail=m=>errors.push(m),html='.ht'+'ml',js='.j'+'s';
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const enData='galatians-study-data'+js,enGuide='galatians-study-guide'+js,esData='galatians-study-data-es'+js,enPage='galatians-study'+html,esPage=['es','galatas-estudio'+html].join('/'),hub=['es','estudios-biblicos'+html].join('/'),i18n='nldg-i18n'+js;
for(const f of [enData,enGuide,esData,enPage,esPage,hub,i18n,'book-study-series'+js,'book-study-series-es'+js])if(!exists(f))fail('Missing '+f);
if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Gálatas':'Galatians','Génesis':'Genesis','Éxodo':'Exodus','Levítico':'Leviticus','Números':'Numbers','Deuteronomio':'Deuteronomy','Josué':'Joshua','Jueces':'Judges','Rut':'Ruth','Salmo':'Psalm','Salmos':'Psalms','Proverbios':'Proverbs','Eclesiastés':'Ecclesiastes','Isaías':'Isaiah','Jeremías':'Jeremiah','Ezequiel':'Ezekiel','Daniel':'Daniel','Oseas':'Hosea','Joel':'Joel','Amós':'Amos','Habacuc':'Habakkuk','Jonás':'Jonah','Miqueas':'Micah','Zacarías':'Zechariah','Malaquías':'Malachi','Mateo':'Matthew','Marcos':'Mark','Lucas':'Luke','Juan':'John','Hechos':'Acts','Romanos':'Romans','1 Corintios':'1 Corinthians','2 Corintios':'2 Corinthians','Efesios':'Ephesians','Filipenses':'Philippians','Colosenses':'Colossians','1 Tesalonicenses':'1 Thessalonians','2 Tesalonicenses':'2 Thessalonians','1 Timoteo':'1 Timothy','2 Timoteo':'2 Timothy','Tito':'Titus','Santiago':'James','Judas':'Jude','Hebreos':'Hebrews','1 Pedro':'1 Peter','2 Pedro':'2 Peter','Apocalipsis':'Revelation'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const list=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es.slug!=='galatas-estudio')fail('Spanish Galatians slug must be galatas-estudio.');
 if(es.book!=='Gálatas')fail('Spanish book name must be Gálatas.');
 if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Galatians must declare Nueva Traducción Viviente (NTV).');
 if(es.themeLabel!=='Verdad clave')fail('Spanish Galatians theme label must be Verdad clave.');
 if(es.lessonSubtitleMode!==true||en.lessonSubtitleMode!==true)fail('Galatians must retain lesson subtitle mode.');
 if(en.lessons?.length!==8||es.lessons?.length!==8)fail('Galatians must retain eight lessons in both languages.');
 if(JSON.stringify(list(es.seriesMainScripture))!==JSON.stringify(list(en.seriesMainScripture)))fail('Series Scripture references must match English.');
 if(es.seriesTeaching?.length!==8||en.seriesTeaching?.length!==8)fail('Series must retain eight teaching movements.');
 if(es.seriesQuestions?.length!==8||en.seriesQuestions?.length!==8)fail('Series must retain eight discussion questions.');
 if(String(es.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)fail('Spanish series context must retain two paragraphs.');
 for(const f of ['seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es[f]||'').trim())fail('Spanish Galatians series missing '+f+'.');
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Galatians lesson '+(i+1);
  if(a.number!==b.number)fail(label+': number mismatch.');
  if(norm(b.scripture)!==a.scripture)fail(label+': main Scripture mismatch.');
  if(JSON.stringify((b.supporting||[]).map(norm))!==JSON.stringify(a.supporting||[]))fail(label+': supporting Scripture mismatch.');
  for(const f of ['title','subtitle','scripture','question','truth','goal','opening','context','examination','challenge','caution','closingTakeaway','prayer'])if(!String(b[f]||'').trim())fail(label+': missing '+f+'.');
  if((b.supporting?.length||0)!==5)fail(label+': must retain five supporting Scriptures.');
  if((b.teaching?.length||0)!==8)fail(label+': must retain eight teaching movements.');
  if((b.questions?.length||0)!==8)fail(label+': must retain eight discussion questions.');
  if((b.contextParagraphs?.length||0)!==2)fail(label+': must retain two context paragraphs.');
  if((b.jesusParagraphs?.length||0)!==1)fail(label+': must retain Jesus Connection.');
  if((b.guardrailParagraphs?.length||0)!==1)fail(label+': must retain Do Not Miss This.');
  for(const m of b.teaching||[])if(!String(m.heading||'').trim()||!String(m.body||'').trim())fail(label+': incomplete teaching movement.');
 }
 const all=JSON.stringify(es).toLowerCase();
 for(const phrase of ['antisemitismo','pueblo judío','obras de la ley','fidelidad de cristo','gálatas 3:28','antiárabes','mujeres','circuncisión','salud mental','abuso','israel de dios','geopolíticas','nueva traducción viviente'])if(!all.includes(phrase.toLowerCase()))fail('Missing safeguard/theme: '+phrase);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(JSON.stringify(es)))fail('Spanish Galatians contains disallowed Bible version '+version+'.');
 const ep=read(enPage),sp=read(esPage),im=read(i18n),hb=read(hub);
 if(!ep.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/galatas-estudio'+html+'"'))fail('English bilingual route missing.');
 if(!sp.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/galatians-study'+html+'"'))fail('Spanish bilingual route missing.');
 if(!sp.includes('galatians-study-data-es'+js+'?v=1.1.0')||!sp.includes('book-study-series'+js+'?v=0.2.0')||!sp.includes('book-study-series-es'+js+'?v=1.2.0'))fail('Spanish Galatians assets are stale.');
 if(!im.includes("'galatians-study"+html+"':'es/galatas-estudio"+html+"'"))fail('i18n Galatians route missing.');
 if(!hb.includes('href="galatas-estudio'+html+'"'))fail('Spanish library route missing.');
 if(!hb.includes('Sesenta y seis series completas y revisadas'))fail('Spanish library completion state missing.');
}
if(errors.length){console.error('Spanish Galatians audit failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Spanish Galatians audit passed: English/Spanish reference parity, NTV standard, 5/8/8/2 structure, safeguards, assets, routes, and completed library state validated.');
