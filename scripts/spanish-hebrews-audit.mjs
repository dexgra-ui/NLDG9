import fs from 'node:fs';import vm from 'node:vm';
const errors=[],read=p=>fs.readFileSync(p,'utf8'),exists=fs.existsSync,fail=m=>errors.push(m),html='.ht'+'ml',js='.j'+'s';
const load=(...files)=>{const c={window:{}};vm.createContext(c);for(const file of files)vm.runInContext(read(file),c,{filename:file});return c.window.NLDG_BOOK_STUDY;};
const enData='hebrews-study-data'+js,enGuide='hebrews-study-guide'+js,esData='hebrews-study-data-es'+js,enPage='hebrews-study'+html,esPage=['es','hebreos-estudio'+html].join('/'),hub=['es','estudios-biblicos'+html].join('/'),library=['es','libro-por-libro'+html].join('/'),i18n='nldg-i18n'+js;
for(const f of [enData,enGuide,esData,enPage,esPage,hub,library,i18n,'book-study-series'+js,'book-study-series-es'+js])if(!exists(f))fail('Missing '+f);
if(!errors.length){
 const en=load(enData,enGuide),es=load(esData);
 const names={'Hebreos':'Hebrews','Salmo':'Psalm','Jeremías':'Jeremiah','Habacuc':'Habakkuk','Juan':'John','Colosenses':'Colossians','Números':'Numbers','Mateo':'Matthew','1 Corintios':'1 Corinthians','Santiago':'James','Génesis':'Genesis','Filipenses':'Philippians','2 Pedro':'2 Peter','Judas':'Jude','Lucas':'Luke','Romanos':'Romans','Levítico':'Leviticus','Isaías':'Isaiah','1 Pedro':'1 Peter','1 Tesalonicenses':'1 Thessalonians','Éxodo':'Exodus','Daniel':'Daniel','Proverbios':'Proverbs','Gálatas':'Galatians'};
 const norm=r=>{for(const [a,b] of Object.entries(names))if(r.startsWith(a+' '))return b+r.slice(a.length);return r;};
 const list=s=>String(s||'').split(';').map(x=>norm(x.trim())).filter(Boolean);
 if(es.slug!=='hebreos-estudio')fail('Spanish Hebrews slug mismatch.');
 if(es.book!=='Hebreos')fail('Spanish book name mismatch.');
 if(es.scriptureStandard!=='Nueva Traducción Viviente (NTV)')fail('Spanish Hebrews must declare Nueva Traducción Viviente (NTV).');
 if(en.lessons?.length!==8||es.lessons?.length!==8)fail('Hebrews must retain eight lessons.');
 if(es.lessonSubtitleMode!==true||en.lessonSubtitleMode!==true)fail('Hebrews must retain lesson subtitle mode.');
 if(JSON.stringify(list(es.seriesMainScripture))!==JSON.stringify(list(en.seriesMainScripture)))fail('Series Scripture references must match English.');
 if(es.seriesTeaching?.length!==8||en.seriesTeaching?.length!==8)fail('Series must retain eight teaching movements.');
 if(es.seriesQuestions?.length!==8||en.seriesQuestions?.length!==8)fail('Series must retain eight discussion questions.');
 if(String(es.seriesContext||'').split(/\n\n+/).filter(Boolean).length!==2)fail('Spanish series context must retain two paragraphs.');
 for(const f of ['seriesJesusConnection','seriesGuardrail','seriesClosingTakeaway','seriesExamination','seriesPractice','seriesLeaderGuidance','seriesPrayer'])if(!String(es[f]||'').trim())fail('Spanish Hebrews series missing '+f+'.');
 for(let i=0;i<8;i++){
  const a=en.lessons[i],b=es.lessons[i],label='Hebrews lesson '+(i+1);
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
  if(!String(b.closingTakeaway||'').trim())fail(label+': must retain Closing Takeaway.');
 }
 const all=JSON.stringify(es).toLowerCase();
 for(const phrase of ['permanece anónima','antisemitismo','pueblo judío','judaísmo','toc','escrupulosidad','autolesión','abuso doméstico','obediencia ciega','disciplina divina','fe fuerte','guardianes humanos','salud mental','manipulación'])if(!all.includes(phrase))fail('Missing safeguard/theme: '+phrase);
 for(const version of ['RVR60','NVI','NBLA'])if(new RegExp('\\b'+version+'\\b').test(JSON.stringify(es)))fail('Spanish Hebrews contains disallowed Bible version '+version+'.');
 const ep=read(enPage),sp=read(esPage),im=read(i18n),hb=read(hub),lb=read(library);
 if(!ep.includes('hreflang="es" href="https://nolabelsdesignedbygod.org/es/hebreos-estudio'+html+'"'))fail('English bilingual route missing.');
 if(!sp.includes('hreflang="en" href="https://nolabelsdesignedbygod.org/hebrews-study'+html+'"'))fail('Spanish bilingual route missing.');
 if(!ep.includes('hebrews-study-data'+js+'?v=1.1.0')||!ep.includes('hebrews-study-guide'+js+'?v=1.1.0')||!ep.includes('book-study-series'+js+'?v=0.2.0')||!ep.includes('nldg-i18n'+js+'?v=1.79.0'))fail('English Hebrews assets are stale.');
 if(!sp.includes('hebrews-study-data-es'+js+'?v=1.1.0')||!sp.includes('book-study-series'+js+'?v=0.2.0')||!sp.includes('book-study-series-es'+js+'?v=1.2.0')||!sp.includes('nldg-i18n'+js+'?v=1.79.0'))fail('Spanish Hebrews assets are stale.');
 if(!im.includes("'hebrews-study"+html+"':'es/hebreos-estudio"+html+"'"))fail('i18n Hebrews route missing.');
 if(!lb.includes('href="hebreos-estudio'+html+'"'))fail('Spanish book-by-book library route missing.');
 if(!hb.includes('Sesenta y seis series completas y revisadas'))fail('Spanish study-library completion state missing.');
}
if(errors.length){console.error('Spanish Hebrews audit failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Spanish Hebrews audit passed: NTV, exact normalized Scripture-reference parity, eight-lesson 5/8/8/2 structure, safeguards, routes, current assets, and completed Spanish library state validated.');
