import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('content-surface-browser-audit-results');
const failures=[];
const checks=[];

const requiredTitles=[
  'Before You Hit Share',
  'Both of Them Are My Neighbor',
  'Grace for the Changing Season',
  'Worship After Sunday',
  'We Raised the Generation We Complain About'
];

const sitemapPaths=[
  'articles/before-you-hit-share.html',
  'articles/both-of-them-are-my-neighbor.html',
  'articles/we-raised-the-generation-we-complain-about.html',
  'devotionals/you-dont-have-to-see-the-whole-road.html',
  'devotionals/grace-for-this-season.html',
  'devotionals/check-the-mirror-first.html',
  'devotionals/look-for-the-fruit.html',
  'devotionals/worship-after-sunday.html',
  'newsletter/grace-for-the-changing-season.html',
  'other-ancient-writings.html',
  'ancient-writing-1-enoch.html',
  'ancient-writing-jubilees.html',
  'ancient-writing-wisdom-solomon.html',
  'ancient-writing-sirach.html',
  'ancient-writing-maccabees.html',
  'ancient-writing-meqabyan.html',
  'ancient-writing-assumption-moses.html',
  'ancient-writing-jannes-jambres.html',
  'ancient-writing-jashar.html',
  'ancient-writing-wars-of-lord.html',
  'ancient-writing-nathan-gad.html',
  'ancient-writing-royal-chronicles.html'
];

function expect(condition,success,failure){
  if(condition)checks.push(success);else failures.push(failure);
}

await fs.rm(OUTPUT,{recursive:true,force:true});
await fs.mkdir(OUTPUT,{recursive:true});

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push(error.message));

async function open(name,url){
  pageErrors.length=0;
  const response=await page.goto(`${BASE_URL}/${url}`,{waitUntil:'domcontentloaded',timeout:30000});
  expect(response&&response.status()<400,`${name} returned a successful response.`,`${name} returned HTTP ${response?.status()??'no response'}.`);
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(250);
  expect(pageErrors.length===0,`${name} loaded without page errors.`,`${name} page errors: ${pageErrors.join(' | ')}`);
  expect((await page.locator('h1').count())===1,`${name} has one H1.`,`${name} does not have exactly one H1.`);
  await page.screenshot({path:path.join(OUTPUT,`${name}.png`),fullPage:true});
}

async function checkBookStudyQuestionRendering(name,url){
  await open(name,url);
  const result=await page.evaluate(()=>{
    const heading=[...document.querySelectorAll('.lesson-panel h2')].find(node=>node.textContent?.trim()==='Discussion Questions');
    const panel=heading?.closest('.lesson-panel');
    const list=panel?.querySelector('ol');
    const items=[...(list?.querySelectorAll('li')||[])].map(item=>item.textContent?.trim()||'');
    return {
      hasOrderedList:Boolean(list&&list.tagName==='OL'),
      items,
      manuallyNumbered:items.filter(item=>/^\d+\.\s+/.test(item))
    };
  });
  expect(result.hasOrderedList&&result.items.length===8,`${name} renders eight discussion questions in the shared ordered list.`,`${name} did not render eight discussion questions in an ordered list.`);
  expect(result.manuallyNumbered.length===0,`${name} discussion questions rely only on ordered-list numbering.`,`${name} still renders manual numeric prefixes: ${result.manuallyNumbered.join(' | ')}`);
}

async function checkBookStudyPrint(name,url,{spanish=false}={}){
  await open(name,url);
  await page.evaluate(()=>{window.__nldgPrintCalls=0;window.print=()=>{window.__nldgPrintCalls+=1}});
  const tools=page.locator('.lesson-print-tools');
  expect((await tools.count())===1,`${name} exposes the split lesson print control.`,`${name} is missing the split lesson print control.`);
  const summary=tools.locator('summary');
  const expectedPrintLabel=spanish?'Imprimir':'Print';
  expect((await summary.innerText().catch(()=>''))===expectedPrintLabel,`${name} uses the expected print control label.`,`${name} print control label was not ${expectedPrintLabel}.`);

  await summary.click();
  const options=await tools.locator('[data-print-mode]').allInnerTexts();
  const expectedOptions=spanish?['Guía del participante','Guía para líderes','Imprimir ambos']:['Participant Handout','Leader Guide','Print Both'];
  expect(JSON.stringify(options)===JSON.stringify(expectedOptions),`${name} offers participant, leader, and combined print choices.`,`${name} print choices were: ${options.join(' | ')}.`);

  await tools.locator('[data-print-mode="participant"]').click();
  await page.waitForTimeout(50);
  const participant=await page.locator('#book-print-surface').innerText().catch(()=>'');
  const participantHeadings=await page.locator('#book-print-surface .print-section h2').allInnerTexts();
  const teachingHeading=spanish?'Movimientos de enseñanza':'Teaching Movements';
  const leaderGuidanceHeading=spanish?'Guía para líderes':'Leader Guidance';
  expect(participant.includes(expectedOptions[0]),`${name} builds a participant handout.`,`${name} did not build the participant handout.`);
  expect(!participantHeadings.includes(teachingHeading)&&!participantHeadings.includes(leaderGuidanceHeading),`${name} participant handout omits teaching movements and leader guidance.`,`${name} participant handout exposed leader-only material.`);
  expect((await page.locator('#book-print-surface .print-answer-lines').count())>=9,`${name} participant handout includes writing space.`,`${name} participant handout is missing writing space.`);
  expect((await page.locator('#book-print-surface .print-question-list li').count())===8,`${name} participant handout includes all eight discussion questions.`,`${name} participant handout does not include eight discussion questions.`);
  await page.emulateMedia({media:'print'});
  const printVisibility=await page.evaluate(()=>({
    surface:getComputedStyle(document.querySelector('#book-print-surface')).display,
    main:getComputedStyle(document.querySelector('main')).display
  }));
  expect(printVisibility.surface!=='none'&&printVisibility.main==='none',`${name} print media shows only the print packet.`,`${name} print media did not isolate the print packet.`);
  await page.emulateMedia({media:'screen'});

  await summary.click();
  await tools.locator('[data-print-mode="leader"]').click();
  await page.waitForTimeout(50);
  const leader=await page.locator('#book-print-surface').innerText().catch(()=>'');
  const leaderHeadings=await page.locator('#book-print-surface .print-section h2').allInnerTexts();
  expect(leader.includes(expectedOptions[1]),`${name} builds a leader guide.`,`${name} did not build the leader guide.`);
  expect(leaderHeadings.includes(teachingHeading),`${name} leader guide includes teaching movements.`,`${name} leader guide is missing teaching movements.`);
  expect(leaderHeadings.includes(leaderGuidanceHeading),`${name} leader guide includes leader guidance.`,`${name} leader guide is missing leader guidance.`);

  await summary.click();
  await tools.locator('[data-print-mode="both"]').click();
  await page.waitForTimeout(50);
  expect((await page.locator('#book-print-surface .print-packet').count())===2,`${name} Print Both builds participant and leader packets.`,`${name} Print Both did not build two packets.`);
  const calls=await page.evaluate(()=>window.__nldgPrintCalls);
  expect(calls===3,`${name} print actions invoke the browser print flow.`,`${name} invoked the browser print flow ${calls} times instead of 3.`);
}

try{
  await open('homepage','index.html');
  await page.waitForFunction(()=>document.querySelector('#home-latest')?.children.length>0,{timeout:5000}).catch(()=>{});
  const homeLatest=await page.locator('#home-latest').innerText().catch(()=>'');
  expect(homeLatest.includes('Royal Chronicles and Other Named Records: Historical & Biblical Guide'),'Homepage Latest surfaces the newest Royal Chronicles detailed guide.','Homepage Latest did not surface the newest Royal Chronicles detailed guide after the shared library loaded.');
  const featuredSeries=await page.locator('#home-featured .content-series').allInnerTexts().catch(()=>[]);
  const latestSeries=await page.locator('#home-latest .content-series').allInnerTexts().catch(()=>[]);
  const duplicateSeries=latestSeries.filter(series=>series&&featuredSeries.includes(series));
  expect(duplicateSeries.length===0,'Homepage Latest preserves featured-series duplicate prevention.',`Homepage Latest repeated featured series: ${duplicateSeries.join(', ')}.`);

  await open('studies','studies.html');
  await page.evaluate(()=>localStorage.removeItem('nldg-study-state'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(250);
  const kidsJourneyCount=await page.locator('#collection-grid a[href="growing-with-jesus.html"]').count();
  const youthJourneyCount=await page.locator('#collection-grid a[href="following-jesus-for-yourself.html"]').count();
  const griefJourneyCount=await page.locator('#collection-grid a[href="faith-when-your-heart-is-hurting.html"]').count();
  const collectionText=await page.locator('#collection-grid').innerText().catch(()=>'');
  const collectionHrefs=await page.locator('#collection-grid .journey-collection-card .collection-action').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
  const expectedCollectionHrefs=['new-believers.html','growing-with-jesus.html','following-jesus-for-yourself.html','standalone-studies.html','after-benediction-series.html','preferences-idols-series.html','marriage-family.html','men-of-faith.html','women-of-faith.html','difficult-questions.html','faith-when-your-heart-is-hurting.html','leadership.html'];
  expect(kidsJourneyCount===1,'Bible Studies shows exactly one Growing with Jesus collection card.',`Bible Studies rendered ${kidsJourneyCount} Growing with Jesus collection links.`);
  expect(youthJourneyCount===1,'Bible Studies shows exactly one Following Jesus for Yourself collection card.',`Bible Studies rendered ${youthJourneyCount} Following Jesus for Yourself collection links.`);
  expect(griefJourneyCount===1,'Bible Studies shows exactly one static Faith When Your Heart Is Hurting card.',`Bible Studies rendered ${griefJourneyCount} grief collection links.`);
  expect(!collectionText.includes('Complete Kids Series'),'Bible Studies no longer renders the retired Complete Kids Series card.','Bible Studies still rendered the retired Complete Kids Series card.');
  expect(!collectionText.includes('Complete Youth Series'),'Bible Studies no longer renders the retired Complete Youth Series card.','Bible Studies still rendered the retired Complete Youth Series card.');
  expect(JSON.stringify(collectionHrefs)===JSON.stringify(expectedCollectionHrefs),'Bible Studies preserves the intended discipleship and life collection order.',`Bible Studies collection order was ${collectionHrefs.join(' → ')}.`);
  expect((await page.locator('#collection-grid a[href="book-by-book.html"]').count())===0,'Book-by-Book is not duplicated in the discipleship collection grid.','Book-by-Book is still duplicated in the discipleship collection grid.');
  expect((await page.locator('#collection-grid a[href="other-ancient-writings.html"]').count())===0,'Other Ancient Writings is not duplicated in the discipleship collection grid.','Other Ancient Writings is still duplicated in the discipleship collection grid.');
  expect((await page.locator('#collection-grid a[href="technology-ai.html"]').count())===0,'Technology & AI is not presented as a standalone discipleship collection.','Technology & AI is still presented as a standalone discipleship collection.');
  expect((await page.locator('.featured-journeys-grid .featured-journey').count())===2,'Bible Studies presents two compact featured journeys.','Bible Studies does not present exactly two featured journeys.');
  expect((await page.locator('.featured-unit-link[href="technology-ai.html"]').count())===1,'Technology & AI is nested under Faith & Truth as a featured unit.','Technology & AI is not nested under Faith & Truth.');
  expect((await page.locator('.collections-intro .study-guiding-principle').count())===1,'The guiding philosophy sits with the Bible Studies introduction.','The guiding philosophy is not positioned in the Bible Studies introduction.');
  expect(await page.locator('#study-journey-section').isHidden(),'A visitor with no saved study activity does not see an empty My Study Journey dashboard.','The empty My Study Journey dashboard is visible to a visitor with no activity.');

  const referencePaths=await page.locator('.study-reference-paths-grid a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
  expect(JSON.stringify(referencePaths)===JSON.stringify(['book-by-book.html','topics.html','biblical-maps.html','other-ancient-writings.html']),'Bible Studies exposes the four requested study and reference paths.',`Bible Studies reference paths were ${referencePaths.join(' → ')}.`);

  for(const [name,url] of [
    ['revelation-question-rendering','revelation-study.html?lesson=1'],
    ['first-john-question-rendering','first-john-study.html?lesson=1'],
    ['hebrews-question-rendering','hebrews-study.html?lesson=1'],
    ['titus-question-rendering','titus-study.html?lesson=1']
  ]){
    await checkBookStudyQuestionRendering(name,url);
  }

  await checkBookStudyPrint('revelation-smart-print','revelation-study.html?lesson=1');
  await checkBookStudyPrint('revelation-spanish-smart-print','es/apocalipsis-estudio.html?lesson=1',{spanish:true});

  await open('other-ancient-writings','other-ancient-writings.html');
  const ancientMain=await page.locator('main').innerText();
  const exactNotice='These writings are included for historical and biblical study. Their presence here does not erase the differences between Christian traditions or automatically identify every work as Scripture. Each resource explains how the writing has been received and why it matters for understanding the biblical world.';
  expect(ancientMain.includes(exactNotice),'Ancient Writings includes the required canonical-status notice.','Ancient Writings is missing the required introductory notice.');
  expect((await page.locator('.ancient-section').count())===3,'Ancient Writings has the three requested major sections.','Ancient Writings does not have exactly three major content sections.');
  expect((await page.locator('[data-ancient-writing-id]').count())===13,'Ancient Writings renders all 13 phase-one overview cards.',`Ancient Writings rendered ${await page.locator('[data-ancient-writing-id]').count()} overview cards instead of 13.`);
  const ancientCardCompleteness=await page.locator('[data-ancient-writing-id]').evaluateAll(cards=>cards.map(card=>({
    title:card.querySelector('h3')?.textContent?.trim()||'untitled',
    hasDate:[...card.querySelectorAll('dt')].some(dt=>dt.textContent?.includes('Date')),
    hasCanon:[...card.querySelectorAll('dt')].some(dt=>dt.textContent?.includes('Canonical status')),
    hasConnection:[...card.querySelectorAll('dt')].some(dt=>dt.textContent?.includes('Connection type')),
    hasExternalSource:Boolean(card.querySelector('.ancient-links a[target="_blank"]')),
    hasCanonicalReturn:Boolean(card.querySelector('.ancient-links a:not([target])'))
  })));
  const incompleteAncientCards=ancientCardCompleteness.filter(card=>!card.hasDate||!card.hasCanon||!card.hasConnection||!card.hasExternalSource||!card.hasCanonicalReturn);
  expect(incompleteAncientCards.length===0,'Every Ancient Writings card includes date, canon, connection type, source, and canonical-study return link.',`Incomplete Ancient Writings cards: ${incompleteAncientCards.map(card=>card.title).join(', ')}.`);
  expect(ancientMain.includes('Complete translations are intentionally deferred'),'Ancient Writings explicitly defers complete translations pending verification.','Ancient Writings does not clearly defer complete translations pending verification.');
  for(const title of ['1 Enoch','Jubilees','Wisdom of Solomon','Sirach (Ben Sira / Ecclesiasticus)','1 and 2 Maccabees','Ethiopian Meqabyan','The Assumption / Testament of Moses Tradition and Jude 9','Jannes and Jambres in 2 Timothy 3:8','Book of Jashar','Book of the Wars of the Lord','Records of Nathan and Gad','Royal Chronicles and Other Named Records']){
    expect(ancientMain.includes(title),`Ancient Writings includes ${title}.`,`Ancient Writings is missing ${title}.`);
  }
  const enochText=await page.locator('[id="1-enoch"]').innerText();
  expect(enochText.includes('Jude 14–15')&&enochText.includes('Ethiopian Orthodox Tewahedo'),'1 Enoch card identifies the Jude quotation and Ethiopian canonical reception.','1 Enoch card is missing its quotation or canonical-status distinction.');
  const meqabyanText=await page.locator('#ethiopian-meqabyan').innerText();
  expect(meqabyanText.toLowerCase().includes('not the same')&&meqabyanText.includes('Greek 1 and 2 Maccabees'),'Meqabyan card explicitly distinguishes Ethiopian Meqabyan from Greek Maccabees.','Meqabyan card does not clearly distinguish the Ethiopian and Greek works.');
  const jasharText=await page.locator('#book-jashar').innerText();
  expect(jasharText.includes('Modern publications')&&jasharText.includes('unquestionably identical'),'Jashar card warns against identifying modern Jashar publications with the lost biblical source.','Jashar card is missing the modern-publication caution.');
  const assumptionText=await page.locator('#assumption-moses').innerText();
  expect(assumptionText.includes('surviving')&&assumptionText.includes('debated'),'Moses tradition card labels the incomplete and disputed textual relationship.','Moses tradition card overstates or omits the disputed textual relationship.');
  const ancientNav=page.locator('.section-navigation a[href="other-ancient-writings.html"]');
  expect((await ancientNav.count())===1&&await ancientNav.getAttribute('aria-current')==='page','Ancient Writings is integrated into Bible Studies contextual navigation.','Ancient Writings contextual navigation is missing or not active.');
  const crossLinkLabel=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('1-enoch')?.label||'');
  expect(crossLinkLabel==='Related Ancient Writing: Learn about 1 Enoch and its connection to Jude 14–15.','Ancient-writing cross-link API produces the requested 1 Enoch/Jude wording.',`Ancient-writing cross-link label was: ${crossLinkLabel}`);
  const crossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('1-enoch')?.href||'');
  expect(crossLinkHref==='ancient-writing-1-enoch.html','The 1 Enoch cross-link registry routes to the detailed guide.',`The 1 Enoch cross-link registry routed to ${crossLinkHref}.`);
  expect((await page.locator('[id="1-enoch"] a[href="ancient-writing-1-enoch.html"]').count())===1,'The 1 Enoch overview card links to its detailed guide.','The 1 Enoch overview card is missing its detailed-guide link.');
  const jubileesCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('jubilees')?.href||'');
  expect(jubileesCrossLinkHref==='ancient-writing-jubilees.html','The Jubilees cross-link registry routes to the detailed guide.',`The Jubilees cross-link registry routed to ${jubileesCrossLinkHref}.`);
  expect((await page.locator('#jubilees a[href="ancient-writing-jubilees.html"]').count())===1,'The Jubilees overview card links to its detailed guide.','The Jubilees overview card is missing its detailed-guide link.');
  const wisdomCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('wisdom-solomon')?.href||'');
  expect(wisdomCrossLinkHref==='ancient-writing-wisdom-solomon.html','The Wisdom of Solomon cross-link registry routes to the detailed guide.',`The Wisdom of Solomon cross-link registry routed to ${wisdomCrossLinkHref}.`);
  expect((await page.locator('#wisdom-solomon a[href="ancient-writing-wisdom-solomon.html"]').count())===1,'The Wisdom of Solomon overview card links to its detailed guide.','The Wisdom of Solomon overview card is missing its detailed-guide link.');
  const sirachCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('sirach')?.href||'');
  expect(sirachCrossLinkHref==='ancient-writing-sirach.html','The Sirach cross-link registry routes to the detailed guide.',`The Sirach cross-link registry routed to ${sirachCrossLinkHref}.`);
  expect((await page.locator('#sirach a[href="ancient-writing-sirach.html"]').count())===1,'The Sirach overview card links to its detailed guide.','The Sirach overview card is missing its detailed-guide link.');
  const maccabeesCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('maccabees')?.href||'');
  expect(maccabeesCrossLinkHref==='ancient-writing-maccabees.html','The Maccabees cross-link registry routes to the detailed guide.',`The Maccabees cross-link registry routed to ${maccabeesCrossLinkHref}.`);
  expect((await page.locator('#maccabees a[href="ancient-writing-maccabees.html"]').count())===1,'The Maccabees overview card links to its detailed guide.','The Maccabees overview card is missing its detailed-guide link.');
  const meqabyanCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('ethiopian-meqabyan')?.href||'');
  expect(meqabyanCrossLinkHref==='ancient-writing-meqabyan.html','The Meqabyan cross-link registry routes to the detailed guide.',`The Meqabyan cross-link registry routed to ${meqabyanCrossLinkHref}.`);
  expect((await page.locator('#ethiopian-meqabyan a[href="ancient-writing-meqabyan.html"]').count())===1,'The Meqabyan overview card links to its detailed guide.','The Meqabyan overview card is missing its detailed-guide link.');
  const assumptionCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('assumption-moses')?.href||'');
  expect(assumptionCrossLinkHref==='ancient-writing-assumption-moses.html','The Assumption / Testament of Moses cross-link registry routes to the detailed guide.',`The Moses tradition cross-link registry routed to ${assumptionCrossLinkHref}.`);
  expect((await page.locator('#assumption-moses a[href="ancient-writing-assumption-moses.html"]').count())===1,'The Assumption / Testament of Moses overview card links to its detailed guide.','The Assumption / Testament of Moses overview card is missing its detailed-guide link.');
  const jannesCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('jannes-jambres')?.href||'');
  expect(jannesCrossLinkHref==='ancient-writing-jannes-jambres.html','The Jannes and Jambres cross-link registry routes to the detailed guide.',`The Jannes and Jambres cross-link registry routed to ${jannesCrossLinkHref}.`);
  expect((await page.locator('#jannes-jambres a[href="ancient-writing-jannes-jambres.html"]').count())===1,'The Jannes and Jambres overview card links to its detailed guide.','The Jannes and Jambres overview card is missing its detailed-guide link.');
  const jasharCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('book-jashar')?.href||'');
  expect(jasharCrossLinkHref==='ancient-writing-jashar.html','The Book of Jashar cross-link registry routes to the detailed guide.',`The Book of Jashar cross-link registry routed to ${jasharCrossLinkHref}.`);
  expect((await page.locator('#book-jashar a[href="ancient-writing-jashar.html"]').count())===1,'The Book of Jashar overview card links to its detailed guide.','The Book of Jashar overview card is missing its detailed-guide link.');
  const warsCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('wars-of-lord')?.href||'');
  expect(warsCrossLinkHref==='ancient-writing-wars-of-lord.html','The Wars of the Lord cross-link registry routes to the detailed guide.',`The Wars of the Lord cross-link registry routed to ${warsCrossLinkHref}.`);
  expect((await page.locator('#wars-of-lord a[href="ancient-writing-wars-of-lord.html"]').count())===1,'The Wars of the Lord overview card links to its detailed guide.','The Wars of the Lord overview card is missing its detailed-guide link.');
  const nathanGadCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('nathan-gad')?.href||'');
  expect(nathanGadCrossLinkHref==='ancient-writing-nathan-gad.html','The Nathan and Gad cross-link registry routes to the detailed guide.',`The Nathan and Gad cross-link registry routed to ${nathanGadCrossLinkHref}.`);
  expect((await page.locator('#nathan-gad a[href="ancient-writing-nathan-gad.html"]').count())===1,'The Nathan and Gad overview card links to its detailed guide.','The Nathan and Gad overview card is missing its detailed-guide link.');
  const royalCrossLinkHref=await page.evaluate(()=>window.NLDG_ANCIENT_WRITINGS_API?.relatedLink('royal-chronicles')?.href||'');
  expect(royalCrossLinkHref==='ancient-writing-royal-chronicles.html','The Royal Chronicles cross-link registry routes to the detailed guide.',`The Royal Chronicles cross-link registry routed to ${royalCrossLinkHref}.`);
  expect((await page.locator('#royal-chronicles a[href="ancient-writing-royal-chronicles.html"]').count())===1,'The Royal Chronicles overview card links to its detailed guide.','The Royal Chronicles overview card is missing its detailed-guide link.');

  await open('1-enoch-guide','ancient-writing-1-enoch.html');
  const enochGuide=await page.locator('main').innerText();
  expect(enochGuide.includes('What is 1 Enoch?'),'1 Enoch guide includes a clear orientation section.','1 Enoch guide is missing its orientation section.');
  for(const sectionTitle of ['Book of the Watchers','Book of Parables / Similitudes','Astronomical Book / Book of Luminaries','Dream Visions','Epistle of Enoch and concluding materials']){
    expect(enochGuide.includes(sectionTitle),`1 Enoch guide includes ${sectionTitle}.`,`1 Enoch guide is missing ${sectionTitle}.`);
  }
  expect(enochGuide.includes('Aramaic fragments recovered among the Dead Sea Scrolls'),'1 Enoch guide explains the Qumran Aramaic evidence.','1 Enoch guide is missing the Qumran Aramaic evidence.');
  expect(enochGuide.includes('canonical in the Ethiopian Orthodox Tewahedo Church')||enochGuide.includes('belongs to the biblical canon of the Ethiopian Orthodox Tewahedo Church'),'1 Enoch guide accurately identifies Ethiopian Orthodox Tewahedo canonical reception.','1 Enoch guide is missing Ethiopian Orthodox Tewahedo canonical reception.');
  expect(enochGuide.includes('Jude 14–15 and 1 Enoch 1:9'),'1 Enoch guide identifies the direct Jude quotation connection.','1 Enoch guide is missing the direct Jude quotation connection.');
  expect(enochGuide.includes('Genesis 6:1–4 and the Watchers'),'1 Enoch guide distinguishes the Genesis 6 interpretive expansion.','1 Enoch guide is missing the Genesis 6 Watchers connection.');
  expect(enochGuide.includes('NLDG is not reproducing a complete translation yet.'),'1 Enoch guide defers full-text reproduction pending verification.','1 Enoch guide does not clearly defer full-text reproduction.');
  expect(enochGuide.includes('It is misleading to say simply that “the church removed Enoch from the Bible.”'),'1 Enoch guide rejects the oversimplified removed-from-the-Bible claim.','1 Enoch guide is missing the canon-history caution.');
  expect(!enochGuide.includes('Phase 2'),'1 Enoch public guide omits internal development-phase language.','1 Enoch public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'1 Enoch guide provides a substantial academic and primary source list.','1 Enoch guide does not provide enough research sources.');
  expect((await page.locator('a[href="other-ancient-writings.html"]').count())>=2,'1 Enoch guide provides clear return paths to Other Ancient Writings.','1 Enoch guide does not provide clear return paths to Other Ancient Writings.');
  expect((await page.locator('a[href="jude-study.html"]').count())>=1,'1 Enoch guide links back to the canonical Jude study.','1 Enoch guide is missing the Jude study return link.');
  expect((await page.locator('a[href="ancient-writing-jubilees.html"]').count())>=1,'1 Enoch guide links forward to the detailed Jubilees guide.','1 Enoch guide is missing its Jubilees detail link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'1 Enoch guide has no horizontal overflow at 390px.','1 Enoch guide overflows horizontally at 390px.');
  const enochInternalLink=page.locator('.detail-connection-list a').first();
  const enochLinkBox=await enochInternalLink.boundingBox();
  expect(Boolean(enochLinkBox&&enochLinkBox.height>=44),'1 Enoch canonical-study links meet the 44px mobile touch target.','1 Enoch canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('jubilees-guide','ancient-writing-jubilees.html');
  const jubileesGuide=await page.locator('main').innerText();
  expect(jubileesGuide.includes('What is the Book of Jubilees?'),'Jubilees guide includes a clear orientation section.','Jubilees guide is missing its orientation section.');
  for(const sectionTitle of ['Moses receives heavenly revelation','Creation, Sabbath, Watchers, flood','Abraham, Isaac, Jacob, and covenant','Joseph & Egypt','Passover, deliverance, and law']){
    expect(jubileesGuide.includes(sectionTitle),`Jubilees guide includes ${sectionTitle}.`,`Jubilees guide is missing ${sectionTitle}.`);
  }
  expect(jubileesGuide.includes('fourteen copies of Jubilees among the Dead Sea Scrolls, all in Hebrew'),'Jubilees guide explains the recent Oxford count of Hebrew Qumran copies.','Jubilees guide is missing the Hebrew Qumran manuscript evidence.');
  expect(jubileesGuide.includes('Older cataloguing sometimes counts fifteen'),'Jubilees guide explains why manuscript counts can differ.','Jubilees guide is missing the manuscript-count caution.');
  expect(jubileesGuide.includes('364 days, or exactly fifty-two weeks'),'Jubilees guide explains the 364-day calendar structure.','Jubilees guide is missing the 364-day calendar structure.');
  expect(jubileesGuide.includes('not simply the astronomical solar year'),'Jubilees guide qualifies the common solar-calendar shorthand.','Jubilees guide overstates or fails to qualify the solar-calendar label.');
  expect(jubileesGuide.includes('Ethiopian Orthodox Tewahedo Church'),'Jubilees guide identifies Ethiopian Orthodox Tewahedo canonical reception.','Jubilees guide is missing Ethiopian canonical reception.');
  expect(jubileesGuide.includes('Unlike the clear Jude quotation of 1 Enoch'),'Jubilees guide distinguishes its biblical relationship from the direct Enoch quotation in Jude.','Jubilees guide does not clearly distinguish direct quotation from interpretive relationship.');
  expect(jubileesGuide.includes('Not a missing edition of Genesis.'),'Jubilees guide rejects the missing/uncut Genesis misconception.','Jubilees guide is missing the Genesis guardrail.');
  expect(jubileesGuide.includes('NLDG is not reproducing a complete translation yet.'),'Jubilees guide defers full-text reproduction pending verification.','Jubilees guide does not clearly defer full-text reproduction.');
  expect(!jubileesGuide.includes('Phase 2'),'Jubilees public guide omits internal development-phase language.','Jubilees public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=9,'Jubilees guide provides a substantial academic and primary source list.','Jubilees guide does not provide enough research sources.');
  expect((await page.locator('a[href="genesis-study.html"]').count())>=1&&(await page.locator('a[href="exodus-study.html"]').count())>=1,'Jubilees guide links back to Genesis and Exodus canonical studies.','Jubilees guide is missing Genesis or Exodus return links.');
  expect((await page.locator('a[href="ancient-writing-1-enoch.html"]').count())>=1,'Jubilees guide cross-links to the detailed 1 Enoch guide.','Jubilees guide is missing its 1 Enoch comparison link.');
  expect((await page.locator('a[href="ancient-writing-wisdom-solomon.html"]').count())>=1,'Jubilees guide links forward to the detailed Wisdom of Solomon guide.','Jubilees guide is missing its Wisdom of Solomon detail link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Jubilees guide has no horizontal overflow at 390px.','Jubilees guide overflows horizontally at 390px.');
  const jubileesInternalLink=page.locator('.detail-connection-list a').first();
  const jubileesLinkBox=await jubileesInternalLink.boundingBox();
  expect(Boolean(jubileesLinkBox&&jubileesLinkBox.height>=44),'Jubilees canonical-study links meet the 44px mobile touch target.','Jubilees canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('wisdom-solomon-guide','ancient-writing-wisdom-solomon.html');
  const wisdomGuide=await page.locator('main').innerText();
  expect(wisdomGuide.includes('What is the Wisdom of Solomon?'),'Wisdom of Solomon guide includes a clear orientation section.','Wisdom of Solomon guide is missing its orientation section.');
  for(const sectionTitle of ['Righteousness, persecution, and immortality','Solomon praises and seeks Wisdom','Wisdom and providence in Israel’s history']){
    expect(wisdomGuide.includes(sectionTitle),`Wisdom of Solomon guide includes ${sectionTitle}.`,`Wisdom of Solomon guide is missing ${sectionTitle}.`);
  }
  expect(wisdomGuide.includes('anonymous Jewish work written in Greek'),'Wisdom guide identifies anonymous Greek composition.','Wisdom guide does not clearly identify its anonymous Greek composition.');
  expect(wisdomGuide.includes('Solomon is the literary voice, not the historical author.'),'Wisdom guide distinguishes literary persona from historical authorship.','Wisdom guide risks attributing the work to the historical Solomon.');
  expect(wisdomGuide.includes('Roman Catholic and Eastern Orthodox traditions'),'Wisdom guide identifies Catholic and Orthodox canonical reception.','Wisdom guide is missing Catholic and Orthodox canonical reception.');
  expect(wisdomGuide.includes('not part of the Protestant Old Testament canon'),'Wisdom guide identifies the Protestant canon distinction.','Wisdom guide is missing the Protestant canon distinction.');
  expect(wisdomGuide.includes('Wisdom 13–14 and Romans 1:18–32'),'Wisdom guide includes the Romans idolatry parallel.','Wisdom guide is missing the Romans parallel.');
  expect(wisdomGuide.includes('Wisdom 7:26 and Hebrews 1:3'),'Wisdom guide includes the Hebrews Wisdom-language parallel.','Wisdom guide is missing the Hebrews parallel.');
  expect(wisdomGuide.includes('not directly quoted by the New Testament')||wisdomGuide.includes('Not directly quoted by the New Testament.'),'Wisdom guide distinguishes New Testament echoes from direct quotation.','Wisdom guide overstates New Testament dependence as direct quotation.');
  expect(wisdomGuide.includes('Not Greek philosophy replacing Jewish faith.'),'Wisdom guide guards against flattening the work into Greek philosophy.','Wisdom guide is missing its Greek/Jewish intellectual guardrail.');
  expect(wisdomGuide.includes('NLDG is not reproducing a complete translation yet.'),'Wisdom guide defers full-text reproduction pending rights and textual verification.','Wisdom guide does not clearly defer full-text reproduction.');
  expect(!wisdomGuide.includes('Phase 2'),'Wisdom public guide omits internal development-phase language.','Wisdom public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=9,'Wisdom guide provides a substantial academic and primary source list.','Wisdom guide does not provide enough research sources.');
  expect((await page.locator('a[href="proverbs-study.html"]').count())>=1&&(await page.locator('a[href="romans-study.html"]').count())>=1,'Wisdom guide links back to canonical Proverbs and Romans studies.','Wisdom guide is missing Proverbs or Romans return links.');
  expect((await page.locator('a[href="ancient-writing-jubilees.html"]').count())>=1,'Wisdom guide cross-links to the detailed Jubilees guide.','Wisdom guide is missing its Jubilees comparison link.');
  expect((await page.locator('a[href="ancient-writing-sirach.html"]').count())>=1,'Wisdom guide links forward to the detailed Sirach guide.','Wisdom guide is missing its Sirach detail link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Wisdom of Solomon guide has no horizontal overflow at 390px.','Wisdom of Solomon guide overflows horizontally at 390px.');
  const wisdomInternalLink=page.locator('.detail-connection-list a').first();
  const wisdomLinkBox=await wisdomInternalLink.boundingBox();
  expect(Boolean(wisdomLinkBox&&wisdomLinkBox.height>=44),'Wisdom canonical-study links meet the 44px mobile touch target.','Wisdom canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('sirach-guide','ancient-writing-sirach.html');
  const sirachGuide=await page.locator('main').innerText();
  expect(sirachGuide.includes('What is Sirach?'),'Sirach guide includes a clear orientation section.','Sirach guide is missing its orientation section.');
  expect(sirachGuide.includes('Ben Sira')&&sirachGuide.includes('Jerusalem'),'Sirach guide identifies the named Jerusalem sage Ben Sira.','Sirach guide is missing its named Jerusalem authorship.');
  expect(sirachGuide.includes('author’s grandson')&&sirachGuide.includes('after 117 BCE'),'Sirach guide explains the grandson’s Greek translation.','Sirach guide is missing the grandson translation history.');
  expect(sirachGuide.includes('Cairo Geniza')&&sirachGuide.includes('Masada'),'Sirach guide explains the rediscovered Hebrew manuscript evidence.','Sirach guide is missing key Hebrew manuscript evidence.');
  expect(sirachGuide.includes('Wisdom takes root in Israel’s covenant life'),'Sirach guide explains the Wisdom/Torah synthesis.','Sirach guide is missing the Wisdom/Torah synthesis.');
  expect(sirachGuide.includes('Sirach’s portrayal of women requires context and discernment'),'Sirach guide includes the gender-context reading caution.','Sirach guide is missing the gender-context reading caution.');
  expect(sirachGuide.includes('context does not require Christians to reproduce every ancient social assumption as a timeless command'),'Sirach guide prevents historical context from becoming automatic moral endorsement.','Sirach guide is missing the social-assumption guardrail.');
  expect(sirachGuide.includes('Roman Catholic and Eastern Orthodox traditions')||sirachGuide.includes('Roman Catholic tradition'),'Sirach guide identifies Catholic and Orthodox canonical reception.','Sirach guide is missing Catholic and Orthodox canonical reception.');
  expect(sirachGuide.includes('not part of the Protestant Old Testament canon'),'Sirach guide identifies the Protestant canon distinction.','Sirach guide is missing the Protestant canon distinction.');
  expect(sirachGuide.includes('Sirach 28:2 and Matthew 6:12–15'),'Sirach guide includes the forgiveness parallel with Matthew.','Sirach guide is missing the Matthew forgiveness parallel.');
  expect(sirachGuide.includes('Sirach 5:11 and James 1:19'),'Sirach guide includes the listening/speech parallel with James.','Sirach guide is missing the James parallel.');
  expect(sirachGuide.includes('New Testament parallels are not automatically quotations.'),'Sirach guide distinguishes NT parallels from direct quotation.','Sirach guide overstates NT parallels as quotations.');
  expect(sirachGuide.includes('Sirach is not Ecclesiastes.'),'Sirach guide distinguishes Ecclesiasticus from Ecclesiastes.','Sirach guide is missing the Ecclesiasticus/Ecclesiastes distinction.');
  expect(sirachGuide.includes('NLDG is not reproducing a complete translation yet.'),'Sirach guide defers full-text reproduction pending textual and rights verification.','Sirach guide does not clearly defer full-text reproduction.');
  expect(!sirachGuide.includes('Phase 2'),'Sirach public guide omits internal development-phase language.','Sirach public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'Sirach guide provides a substantial academic and primary source list.','Sirach guide does not provide enough research sources.');
  expect((await page.locator('a[href="proverbs-study.html"]').count())>=1&&(await page.locator('a[href="james-series.html"]').count())>=1,'Sirach guide links back to canonical Proverbs and James studies.','Sirach guide is missing Proverbs or James return links.');
  expect((await page.locator('a[href="ancient-writing-wisdom-solomon.html"]').count())>=1,'Sirach guide cross-links to the detailed Wisdom of Solomon guide.','Sirach guide is missing its Wisdom comparison link.');
  expect((await page.locator('a[href="ancient-writing-maccabees.html"]').count())>=1,'Sirach guide links forward to the detailed Maccabees guide.','Sirach guide is missing its Maccabees next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Sirach guide has no horizontal overflow at 390px.','Sirach guide overflows horizontally at 390px.');
  const sirachInternalLink=page.locator('.detail-connection-list a').first();
  const sirachLinkBox=await sirachInternalLink.boundingBox();
  expect(Boolean(sirachLinkBox&&sirachLinkBox.height>=44),'Sirach canonical-study links meet the 44px mobile touch target.','Sirach canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('maccabees-guide','ancient-writing-maccabees.html');
  const maccabeesGuide=await page.locator('main').innerText();
  expect(maccabeesGuide.includes('Two independent books, not a two-volume sequel'),'Maccabees guide clearly orients readers to two independent works.','Maccabees guide is missing the independent-works orientation.');
  expect(maccabeesGuide.includes('Antiochus IV Epiphanes')&&maccabeesGuide.includes('Mattathias')&&maccabeesGuide.includes('164 BCE'),'Maccabees guide includes the Seleucid crisis, Mattathias, and Temple-rededication timeline.','Maccabees guide is missing core historical timeline markers.');
  expect(maccabeesGuide.includes('originally composed in Hebrew')&&maccabeesGuide.includes('around 100 BCE'),'Maccabees guide identifies 1 Maccabees language and approximate date.','Maccabees guide is missing 1 Maccabees authorship/date/language details.');
  expect(maccabeesGuide.includes('epitome')&&maccabeesGuide.includes('Jason of Cyrene')&&maccabeesGuide.includes('composed in Greek'),'Maccabees guide identifies 2 Maccabees as Jason of Cyrene epitome written in Greek.','Maccabees guide is missing the Jason of Cyrene epitome distinction.');
  expect(maccabeesGuide.includes('They overlap, but they are not the same project'),'Maccabees guide includes a clear side-by-side comparison.','Maccabees guide is missing the comparison section.');
  expect(maccabeesGuide.includes('2 Maccabees 6–7')&&maccabeesGuide.includes('bodily resurrection'),'Maccabees guide covers martyrdom and resurrection theology.','Maccabees guide is missing martyrdom or resurrection theology.');
  expect(maccabeesGuide.includes('2 Maccabees 12:39–46')&&maccabeesGuide.includes('Roman Catholic interpretation')&&maccabeesGuide.includes('Eastern Orthodox interpretation')&&maccabeesGuide.includes('Protestant interpretation'),'Maccabees guide distinguishes Christian readings of prayer for the dead.','Maccabees guide is missing the tradition-specific 2 Maccabees 12 treatment.');
  expect(maccabeesGuide.includes('Calling the books simply “noncanonical” is inaccurate'),'Maccabees guide uses tradition-specific canon wording.','Maccabees guide flattens canonical reception.');
  expect(maccabeesGuide.includes('Historical correspondence does not by itself settle every claim about prophecy fulfillment'),'Maccabees guide distinguishes Daniel historical background from prophecy-fulfillment claims.','Maccabees guide overstates the Daniel fulfillment claim.');
  expect(maccabeesGuide.includes('John 10:22')&&maccabeesGuide.includes('Feast of Dedication'),'Maccabees guide connects Hanukkah with John 10:22.','Maccabees guide is missing the John 10:22 Feast of Dedication connection.');
  expect(maccabeesGuide.includes('Hebrews 11:35')&&maccabeesGuide.includes('uncertain literary dependence should not be presented as a direct quotation'),'Maccabees guide cautiously labels the Hebrews 11:35 martyr-tradition relationship.','Maccabees guide overstates the Hebrews 11:35 dependence.');
  expect(maccabeesGuide.includes('NLDG is not reproducing complete translations yet.'),'Maccabees guide defers full-text reproduction pending verification.','Maccabees guide does not clearly defer full-text reproduction.');
  expect(!maccabeesGuide.includes('Phase 2'),'Maccabees public guide omits internal development-phase language.','Maccabees public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=10,'Maccabees guide provides a substantial academic and primary source list.','Maccabees guide does not provide enough research sources.');
  expect((await page.locator('a[href="daniel-study.html"]').count())>=1&&(await page.locator('a[href="john-study.html"]').count())>=1&&(await page.locator('a[href="hebrews-study.html"]').count())>=1,'Maccabees guide links back to Daniel, John, and Hebrews studies.','Maccabees guide is missing Daniel, John, or Hebrews return links.');
  expect((await page.locator('a[href="ancient-writing-sirach.html"]').count())>=1,'Maccabees guide links back to the previous Sirach guide.','Maccabees guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-meqabyan.html"]').count())>=1,'Maccabees guide links forward to the detailed Meqabyan guide.','Maccabees guide is missing its Meqabyan next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Maccabees guide has no horizontal overflow at 390px.','Maccabees guide overflows horizontally at 390px.');
  const maccabeesInternalLink=page.locator('.detail-connection-list a').first();
  const maccabeesLinkBox=await maccabeesInternalLink.boundingBox();
  expect(Boolean(maccabeesLinkBox&&maccabeesLinkBox.height>=44),'Maccabees canonical-study links meet the 44px mobile touch target.','Maccabees canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('meqabyan-guide','ancient-writing-meqabyan.html');
  const meqabyanGuide=await page.locator('main').innerText();
  expect(meqabyanGuide.includes('Meqabyan is not Greek Maccabees'),'Meqabyan guide clearly distinguishes the Ethiopic books from Greek Maccabees.','Meqabyan guide is missing its central identity distinction.');
  expect(meqabyanGuide.includes('What can be said with confidence?'),'Meqabyan guide separates established evidence from uncertain claims.','Meqabyan guide is missing its evidence-first section.');
  expect(meqabyanGuide.includes('British Library Or. 505')&&meqabyanGuide.includes('British Library Or. 506'),'Meqabyan guide identifies concrete Ge\'ez manuscript witnesses.','Meqabyan guide is missing the British Library manuscript witnesses.');
  expect(meqabyanGuide.includes('Dating is not secure')&&meqabyanGuide.includes('Authorship is not secure'),'Meqabyan guide explicitly marks dating and authorship uncertainty.','Meqabyan guide overstates dating or authorship certainty.');
  expect(meqabyanGuide.includes('Why Ethiopian book counts can look confusing'),'Meqabyan guide explains variable Ethiopian canon counting.','Meqabyan guide is missing the canon-count explanation.');
  expect(meqabyanGuide.includes('A working orientation, not a pretend critical edition')&&meqabyanGuide.includes('1 Meqabyan')&&meqabyanGuide.includes('2 Meqabyan')&&meqabyanGuide.includes('3 Meqabyan'),'Meqabyan guide orients readers to all three books while labeling the outline provisional.','Meqabyan guide is missing its three-book orientation.');
  expect(meqabyanGuide.includes('Meqabyan and Greek Maccabees side by side'),'Meqabyan guide includes a direct comparison with Greek Maccabees.','Meqabyan guide is missing the Greek Maccabees comparison.');
  expect(meqabyanGuide.includes('No Greek-Maccabees substitution.')&&meqabyanGuide.includes('Antiochus IV, Judas Maccabeus, and the Temple rededication'),'Meqabyan guide guards against mislabeled Greek Maccabees editions.','Meqabyan guide is missing the Greek-Maccabees substitution guardrail.');
  expect(meqabyanGuide.includes('Say whose canon you mean'),'Meqabyan guide presents tradition-specific canonical reception.','Meqabyan guide is missing tradition-specific canon framing.');
  expect(meqabyanGuide.includes('NLDG is not reproducing complete Meqabyan translations yet.'),'Meqabyan guide defers full-text reproduction pending source verification.','Meqabyan guide does not clearly defer full-text reproduction.');
  expect(!meqabyanGuide.includes('Phase 2'),'Meqabyan public guide omits internal development-phase language.','Meqabyan public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=9,'Meqabyan guide provides a substantial academic, church, and manuscript source list.','Meqabyan guide does not provide enough research sources.');
  expect((await page.locator('a[href="first-kings-study.html"]').count())>=1&&(await page.locator('a[href="daniel-study.html"]').count())>=1&&(await page.locator('a[href="hebrews-study.html"]').count())>=1,'Meqabyan guide links back to 1 Kings, Daniel, and Hebrews studies.','Meqabyan guide is missing 1 Kings, Daniel, or Hebrews return links.');
  expect((await page.locator('a[href="ancient-writing-maccabees.html"]').count())>=1,'Meqabyan guide links back to the separate Maccabees guide.','Meqabyan guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-assumption-moses.html"]').count())>=1,'Meqabyan guide links forward to the detailed Moses tradition guide.','Meqabyan guide is missing its Moses tradition next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Meqabyan guide has no horizontal overflow at 390px.','Meqabyan guide overflows horizontally at 390px.');
  const meqabyanInternalLink=page.locator('.detail-connection-list a').first();
  const meqabyanLinkBox=await meqabyanInternalLink.boundingBox();
  expect(Boolean(meqabyanLinkBox&&meqabyanLinkBox.height>=44),'Meqabyan canonical-study links meet the 44px mobile touch target.','Meqabyan canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('assumption-moses-guide','ancient-writing-assumption-moses.html');
  const assumptionGuide=await page.locator('main').innerText();
  expect(assumptionGuide.includes('The surviving text does not contain Jude 9’s dispute scene.'),'Moses tradition guide states the central surviving-text limitation.','Moses tradition guide fails to distinguish the extant text from Jude 9’s lost dispute scene.');
  expect(assumptionGuide.includes('Three overlapping pieces of evidence'),'Moses tradition guide separates the surviving manuscript, lost Assumption tradition, and Jude 9.','Moses tradition guide is missing its three-evidence orientation.');
  expect(assumptionGuide.includes('“Testament,” “Assumption,” “Ascension,” or simply a Moses fragment?'),'Moses tradition guide explains the title and identification problem.','Moses tradition guide is missing the title-identification discussion.');
  expect(assumptionGuide.includes('single fragmentary Latin palimpsest')||assumptionGuide.includes('one damaged Latin manuscript'),'Moses tradition guide identifies the single incomplete Latin witness.','Moses tradition guide is missing the manuscript limitation.');
  expect(assumptionGuide.includes('1861 · Antonio Ceriani'),'Moses tradition guide includes Ceriani’s 1861 publication.','Moses tradition guide is missing the Ceriani manuscript-history marker.');
  expect(assumptionGuide.includes('4 BCE to 30 CE')&&assumptionGuide.includes('not a precise composition date'),'Moses tradition guide presents the approximate date range with uncertainty.','Moses tradition guide overstates or omits the dating uncertainty.');
  expect(assumptionGuide.includes('Taxo and his sons')&&assumptionGuide.includes('God’s kingdom and the defeat of evil'),'Moses tradition guide covers the surviving work’s persecution and eschatological themes.','Moses tradition guide is missing Taxo or eschatological hope.');
  expect(assumptionGuide.includes('Jude 9 and the dispute over Moses’ body'),'Moses tradition guide includes the key Jude 9 connection.','Moses tradition guide is missing the Jude 9 connection.');
  expect(assumptionGuide.includes('weaker than a direct quotation we can verify against a surviving manuscript'),'Moses tradition guide distinguishes likely source relationship from a verifiable quotation.','Moses tradition guide overstates Jude 9 as a recoverable direct quotation.');
  expect(assumptionGuide.includes('Surviving Testament vs. lost Assumption tradition'),'Moses tradition guide includes a direct evidence comparison.','Moses tradition guide is missing the surviving/lost tradition comparison.');
  expect(assumptionGuide.includes('Influential does not mean canonical'),'Moses tradition guide keeps literary use distinct from canonical status.','Moses tradition guide is missing its canon guardrail.');
  expect(assumptionGuide.includes('The surviving manuscript does not contain Jude 9’s dispute scene.')&&assumptionGuide.includes('“Testament” and “Assumption” are not automatically interchangeable titles.'),'Moses tradition guide includes both central reading guardrails.','Moses tradition guide is missing the central title or manuscript guardrail.');
  expect(assumptionGuide.includes('NLDG is not reproducing a complete translation yet.'),'Moses tradition guide defers full-text reproduction pending textual verification.','Moses tradition guide does not clearly defer full-text reproduction.');
  expect(!assumptionGuide.includes('Phase 2'),'Moses tradition public guide omits internal development-phase language.','Moses tradition public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'Moses tradition guide provides a substantial academic and primary source list.','Moses tradition guide does not provide enough research sources.');
  expect((await page.locator('a[href="jude-study.html"]').count())>=1&&(await page.locator('a[href="deuteronomy-study.html"]').count())>=1&&(await page.locator('a[href="zechariah-study.html"]').count())>=1,'Moses tradition guide links back to Jude, Deuteronomy, and Zechariah studies.','Moses tradition guide is missing Jude, Deuteronomy, or Zechariah return links.');
  expect((await page.locator('a[href="ancient-writing-meqabyan.html"]').count())>=1,'Moses tradition guide links back to the previous Meqabyan guide.','Moses tradition guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-jannes-jambres.html"]').count())>=1,'Moses tradition guide links forward to the detailed Jannes and Jambres guide.','Moses tradition guide is missing its Jannes and Jambres next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Moses tradition guide has no horizontal overflow at 390px.','Moses tradition guide overflows horizontally at 390px.');
  const assumptionInternalLink=page.locator('.detail-connection-list a').first();
  const assumptionLinkBox=await assumptionInternalLink.boundingBox();
  expect(Boolean(assumptionLinkBox&&assumptionLinkBox.height>=44),'Moses tradition canonical-study links meet the 44px mobile touch target.','Moses tradition canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('jannes-jambres-guide','ancient-writing-jannes-jambres.html');
  const jannesGuide=await page.locator('main').innerText();
  expect(jannesGuide.includes('2 Timothy names them. Exodus does not.'),'Jannes guide states the canonical naming distinction.','Jannes guide is missing the Exodus/2 Timothy naming distinction.');
  expect(jannesGuide.includes('Three layers, one developing tradition'),'Jannes guide separates Exodus, the naming tradition, and the apocryphon.','Jannes guide is missing its three-layer orientation.');
  expect(jannesGuide.includes('The Damascus Document changes the timeline'),'Jannes guide includes the pre-Christian Damascus Document evidence.','Jannes guide is missing the pre-Christian naming evidence.');
  expect(jannesGuide.includes('Yannes and his brother')&&jannesGuide.includes('predates 2 Timothy'),'Jannes guide explains the pre-Christian form with one named brother.','Jannes guide overstates or omits the Damascus Document form.');
  expect(jannesGuide.includes('The Book / Apocryphon of Jannes and Jambres'),'Jannes guide distinguishes the separate literary work.','Jannes guide is missing the apocryphon section.');
  expect(jannesGuide.includes('2019 · Ethiopic fragment')&&jannesGuide.includes('2025 · complete Ethiopic version reported'),'Jannes guide includes the newer Ethiopic textual evidence.','Jannes guide is missing the 2019 or 2025 Ethiopic evidence.');
  expect(jannesGuide.includes('Did 2 Timothy quote the Book of Jannes and Jambres?'),'Jannes guide directly addresses the literary-dependence question.','Jannes guide is missing the source-dependence discussion.');
  expect(jannesGuide.includes('whether it directly cites the particular apocryphal book we can partially reconstruct remains uncertain'),'Jannes guide carefully limits the direct-source claim.','Jannes guide overstates 2 Timothy as a direct citation of the apocryphon.');
  expect(jannesGuide.includes('Exodus, Damascus Document, 2 Timothy, and the apocryphon'),'Jannes guide includes a clear four-source comparison.','Jannes guide is missing the source comparison.');
  expect(jannesGuide.includes('The naming tradition is older than 2 Timothy.')&&jannesGuide.includes('2 Timothy 3:8 is not labeled a verified direct quotation.'),'Jannes guide includes the central reading guardrails.','Jannes guide is missing the naming-age or direct-quotation guardrail.');
  expect(jannesGuide.includes('NLDG is not reproducing a complete translation yet.'),'Jannes guide defers full-text reproduction pending critical verification.','Jannes guide does not clearly defer full-text reproduction.');
  expect(!jannesGuide.includes('Phase 2'),'Jannes public guide omits internal development-phase language.','Jannes public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'Jannes guide provides a substantial academic and primary source list.','Jannes guide does not provide enough research sources.');
  expect((await page.locator('a[href="second-timothy-study.html"]').count())>=1&&(await page.locator('a[href="exodus-study.html"]').count())>=1,'Jannes guide links back to 2 Timothy and Exodus studies.','Jannes guide is missing 2 Timothy or Exodus return links.');
  expect((await page.locator('a[href="ancient-writing-assumption-moses.html"]').count())>=1,'Jannes guide links back to the previous Moses tradition guide.','Jannes guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-jashar.html"]').count())>=1,'Jannes guide links forward to the detailed Book of Jashar guide.','Jannes guide is missing its Book of Jashar next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Jannes guide has no horizontal overflow at 390px.','Jannes guide overflows horizontally at 390px.');
  const jannesInternalLink=page.locator('.detail-connection-list a').first();
  const jannesLinkBox=await jannesInternalLink.boundingBox();
  expect(Boolean(jannesLinkBox&&jannesLinkBox.height>=44),'Jannes canonical-study links meet the 44px mobile touch target.','Jannes canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('jashar-guide','ancient-writing-jashar.html');
  const jasharGuide=await page.locator('main').innerText();
  expect(jasharGuide.includes('A lost work explicitly named inside the Hebrew Bible'),'Jashar guide clearly identifies the work as lost.','Jashar guide does not clearly identify the biblical work as lost.');
  expect(jasharGuide.includes('What does “Book of Jashar” mean?'),'Jashar guide includes a clear title/orientation section.','Jashar guide is missing its title/orientation section.');
  expect(jasharGuide.includes('Joshua 10:12–13')&&jasharGuide.includes('The sun-and-moon poem'),'Jashar guide covers the Joshua citation and poem.','Jashar guide is missing the Joshua citation treatment.');
  expect(jasharGuide.includes('2 Samuel 1:17–27')&&jasharGuide.includes('David’s lament for Saul and Jonathan'),'Jashar guide covers the Samuel citation and lament.','Jashar guide is missing the 2 Samuel citation treatment.');
  expect(jasharGuide.includes('Probably a collection of remembered heroic poetry'),'Jashar guide labels the poetic-collection conclusion as an inference.','Jashar guide is missing the careful literary-character section.');
  expect(jasharGuide.includes('The ancient Greek Septuagint form of Joshua does not preserve the Jashar citation'),'Jashar guide acknowledges the Joshua Septuagint variation.','Jashar guide is missing the Septuagint textual-history caution.');
  expect(jasharGuide.includes('The medieval Sefer haYashar is a different work'),'Jashar guide distinguishes the medieval Sefer haYashar.','Jashar guide fails to separate the medieval Sefer haYashar from the lost source.');
  expect(jasharGuide.includes('Three different things called Jashar / Jasher'),'Jashar guide compares the lost source, medieval midrash, and English Pseudo-Jasher.','Jashar guide is missing its identity comparison.');
  expect(jasharGuide.includes('Being cited by Scripture is not the same as being a canonical Bible book'),'Jashar guide keeps citation distinct from canonical status.','Jashar guide is missing its canon-use distinction.');
  expect(jasharGuide.includes('The original Book of Jashar has not been recovered.')&&jasharGuide.includes('The medieval Sefer haYashar is not treated as the lost biblical source.'),'Jashar guide includes its two central identity guardrails.','Jashar guide is missing a central lost-source identity guardrail.');
  expect(jasharGuide.includes('There is no complete ancient Jashar text to reproduce'),'Jashar guide accurately describes full-text status.','Jashar guide incorrectly suggests a complete ancient text survives.');
  expect(!jasharGuide.includes('Phase 2'),'Jashar public guide omits internal development-phase language.','Jashar public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=7,'Jashar guide provides a substantial research source list.','Jashar guide does not provide enough research sources.');
  expect((await page.locator('a[href="joshua-study.html"]').count())>=1&&(await page.locator('a[href="second-samuel-study.html"]').count())>=1&&(await page.locator('a[href="numbers-study.html"]').count())>=1,'Jashar guide links back to Joshua, 2 Samuel, and Numbers studies.','Jashar guide is missing Joshua, 2 Samuel, or Numbers return links.');
  expect((await page.locator('a[href="ancient-writing-jannes-jambres.html"]').count())>=1,'Jashar guide links back to the previous Jannes and Jambres guide.','Jashar guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-wars-of-lord.html"]').count())>=1,'Jashar guide links forward to the detailed Wars of the Lord guide.','Jashar guide is missing its Wars of the Lord next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Jashar guide has no horizontal overflow at 390px.','Jashar guide overflows horizontally at 390px.');
  const jasharInternalLink=page.locator('.detail-connection-list a').first();
  const jasharLinkBox=await jasharInternalLink.boundingBox();
  expect(Boolean(jasharLinkBox&&jasharLinkBox.height>=44),'Jashar canonical-study links meet the 44px mobile touch target.','Jashar canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('wars-of-lord-guide','ancient-writing-wars-of-lord.html');
  const warsGuide=await page.locator('main').innerText();
  expect(warsGuide.includes('One secure citation. Many later guesses.'),'Wars of the Lord guide states its central evidence limit.','Wars of the Lord guide is missing its one-secure-citation guardrail.');
  expect(warsGuide.includes('What does Numbers 21:14 actually preserve?'),'Wars of the Lord guide begins with the canonical source notice.','Wars of the Lord guide is missing its Numbers 21:14 orientation.');
  expect(warsGuide.includes('The Arnon border and Israel’s wilderness itinerary'),'Wars of the Lord guide explains the Arnon border context.','Wars of the Lord guide is missing the Arnon setting.');
  expect(warsGuide.includes('Waheb, Suphah, and a passage ancient translators already struggled with'),'Wars of the Lord guide explains the difficult textual wording.','Wars of the Lord guide is missing the Waheb/Suphah textual problem.');
  expect(warsGuide.includes('Was “Wars of the Lord” certainly the book’s title?'),'Wars of the Lord guide acknowledges the title-text tradition question.','Wars of the Lord guide overstates the title as textually uniform.');
  expect(warsGuide.includes('The boundaries of the quotation are debated'),'Wars of the Lord guide explains disputed quotation scope.','Wars of the Lord guide is missing quotation-boundary uncertainty.');
  expect(warsGuide.includes('verses 14–15 as the safest immediate citation context'),'Wars of the Lord guide labels broader source assignments as proposals.','Wars of the Lord guide overstates broader Numbers 21 poetry as certain quotation.');
  expect(warsGuide.includes('The text does not give us a secure date or compiler'),'Wars of the Lord guide preserves dating and authorship uncertainty.','Wars of the Lord guide overstates date or authorship.');
  expect(warsGuide.includes('Was it the same book as Jashar?')&&warsGuide.includes('no evidence'),'Wars of the Lord guide rejects unsupported identity with Jashar.','Wars of the Lord guide fails to guard against Jashar conflation.');
  expect(warsGuide.includes('Does Exodus 17:14 refer to this same lost book?')&&warsGuide.includes('interesting possibility, not a recoverable fact'),'Wars of the Lord guide labels the Exodus 17 connection as speculative.','Wars of the Lord guide overstates Exodus 17:14 as a second citation.');
  expect(warsGuide.includes('A source named by Scripture is not automatically a separate canonical book'),'Wars of the Lord guide distinguishes source use from canonization.','Wars of the Lord guide is missing its canon/source-use distinction.');
  expect(warsGuide.includes('There is no complete ancient text to publish'),'Wars of the Lord guide clearly states the full-text limitation.','Wars of the Lord guide implies a complete ancient text survives.');
  expect(!warsGuide.includes('Phase 2'),'Wars of the Lord public guide omits internal development-phase language.','Wars of the Lord public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'Wars of the Lord guide provides a substantial research source list.','Wars of the Lord guide does not provide enough research sources.');
  expect((await page.locator('a[href="numbers-study.html"]').count())>=1&&(await page.locator('a[href="exodus-study.html"]').count())>=1&&(await page.locator('a[href="ancient-writing-jashar.html"]').count())>=1,'Wars of the Lord guide links back to Numbers, Exodus, and Jashar resources.','Wars of the Lord guide is missing Numbers, Exodus, or Jashar links.');
  expect((await page.locator('a[href="ancient-writing-nathan-gad.html"]').count())>=1,'Wars of the Lord guide links forward to the detailed Nathan and Gad guide.','Wars of the Lord guide is missing its Nathan and Gad next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Wars of the Lord guide has no horizontal overflow at 390px.','Wars of the Lord guide overflows horizontally at 390px.');
  const warsInternalLink=page.locator('.detail-connection-list a').first();
  const warsLinkBox=await warsInternalLink.boundingBox();
  expect(Boolean(warsLinkBox&&warsLinkBox.height>=44),'Wars of the Lord canonical-study links meet the 44px mobile touch target.','Wars of the Lord canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('nathan-gad-guide','ancient-writing-nathan-gad.html');
  const nathanGadGuide=await page.locator('main').innerText();
  expect(nathanGadGuide.includes('Chronicles names three records in David’s source notice.'),'Nathan and Gad guide keeps Samuel visible in the primary source notice.','Nathan and Gad guide incorrectly reduces 1 Chronicles 29:29 to only two records.');
  expect(nathanGadGuide.includes('What does 1 Chronicles 29:29 actually say?'),'Nathan and Gad guide begins with the primary Chronicles source notice.','Nathan and Gad guide is missing its 1 Chronicles 29:29 orientation.');
  expect(nathanGadGuide.includes('Samuel, Nathan, and Gad belong to different parts of David’s story'),'Nathan and Gad guide explains all three prophetic witnesses.','Nathan and Gad guide is missing its three-witness orientation.');
  expect(nathanGadGuide.includes('Nathan is cited for both David and Solomon'),'Nathan and Gad guide includes Nathan’s second source notice for Solomon.','Nathan and Gad guide is missing 2 Chronicles 9:29 or Nathan’s Solomon connection.');
  expect(nathanGadGuide.includes('What we cannot establish is whether 1 Chronicles 29:29 and 2 Chronicles 9:29 refer to one continuous Nathan collection'),'Nathan and Gad guide preserves uncertainty about Nathan source identity.','Nathan and Gad guide overstates the two Nathan notices as one certain document.');
  expect(nathanGadGuide.includes('Gad appears across David’s career'),'Nathan and Gad guide covers Gad’s canonical ministry.','Nathan and Gad guide is missing Gad’s narrative setting.');
  expect(nathanGadGuide.includes('Are these records simply our books of Samuel?'),'Nathan and Gad guide directly addresses the canonical-Samuel identity question.','Nathan and Gad guide is missing the canonical Samuel relationship.');
  expect(nathanGadGuide.includes('a one-to-one identity between a cited record and an existing canonical book')||nathanGadGuide.includes('one-to-one identity between a cited record and an existing canonical book'),'Nathan and Gad guide rejects an unprovable one-to-one identity with canonical books.','Nathan and Gad guide overstates identity with canonical Samuel.');
  expect(nathanGadGuide.includes('What about the extant Words of Gad the Seer?')||nathanGadGuide.includes('What about the extant'), 'Nathan and Gad guide discusses the later Words of Gad manuscript.','Nathan and Gad guide is missing the extant Words of Gad discussion.');
  expect(nathanGadGuide.includes('Same attributed prophet')&&nathanGadGuide.includes('same ancient source'),'Nathan and Gad guide clearly separates attribution from textual identity.','Nathan and Gad guide conflates the Cochin manuscript with Chronicles’ Gad record.');
  expect(nathanGadGuide.includes('No securely identified ancient “Book of Nathan” survives independently'),'Nathan and Gad guide preserves the Nathan full-text limitation.','Nathan and Gad guide implies a securely recovered Book of Nathan exists.');
  expect(nathanGadGuide.includes('Prophetic records are not automatically separate canonical books'),'Nathan and Gad guide distinguishes source citation from canonization.','Nathan and Gad guide is missing its canon/source-use distinction.');
  expect(nathanGadGuide.includes('The cited source records are not independently recoverable'),'Nathan and Gad guide clearly states the full-text limitation.','Nathan and Gad guide implies the Chronicles source records are independently recoverable.');
  expect(!nathanGadGuide.includes('Phase 2'),'Nathan and Gad public guide omits internal development-phase language.','Nathan and Gad public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=8,'Nathan and Gad guide provides a substantial research source list.','Nathan and Gad guide does not provide enough research sources.');
  expect((await page.locator('a[href="first-chronicles-study.html"]').count())>=1&&(await page.locator('a[href="second-chronicles-study.html"]').count())>=1&&(await page.locator('a[href="second-samuel-study.html"]').count())>=1&&(await page.locator('a[href="first-samuel-study.html"]').count())>=1,'Nathan and Gad guide links back to the relevant Samuel and Chronicles studies.','Nathan and Gad guide is missing one or more canonical-study links.');
  expect((await page.locator('a[href="ancient-writing-wars-of-lord.html"]').count())>=1,'Nathan and Gad guide links back to the previous Wars of the Lord guide.','Nathan and Gad guide is missing previous-guide navigation.');
  expect((await page.locator('a[href="ancient-writing-royal-chronicles.html"]').count())>=1,'Nathan and Gad guide links forward to the detailed Royal Chronicles guide.','Nathan and Gad guide is missing its Royal Chronicles next-guide link.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Nathan and Gad guide has no horizontal overflow at 390px.','Nathan and Gad guide overflows horizontally at 390px.');
  const nathanGadInternalLink=page.locator('.detail-connection-list a').first();
  const nathanGadLinkBox=await nathanGadInternalLink.boundingBox();
  expect(Boolean(nathanGadLinkBox&&nathanGadLinkBox.height>=44),'Nathan and Gad canonical-study links meet the 44px mobile touch target.','Nathan and Gad canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('royal-chronicles-guide','ancient-writing-royal-chronicles.html');
  const royalGuide=await page.locator('main').innerText();
  expect(royalGuide.includes('“Book of the chronicles” does not mean our biblical Chronicles.'),'Royal Chronicles guide states the central identity distinction.','Royal Chronicles guide is missing the annals/canonical-Chronicles distinction.');
  expect(royalGuide.includes('Two royal kingdoms, two recurring source formulas'),'Royal Chronicles guide separates Israel and Judah annals.','Royal Chronicles guide is missing its Israel/Judah source orientation.');
  expect(royalGuide.includes('Chronicles of the Kings of Israel')&&royalGuide.includes('Chronicles of the Kings of Judah'),'Royal Chronicles guide covers both recurring Kings source formulas.','Royal Chronicles guide is missing one of the two royal-annals traditions.');
  expect(royalGuide.includes('The Book of the Acts of Solomon'),'Royal Chronicles guide includes Solomon’s distinct source title.','Royal Chronicles guide is missing the Acts of Solomon source.');
  expect(royalGuide.includes('Chronicles names additional historical records'),'Royal Chronicles guide explains the Chronicler’s broader source world.','Royal Chronicles guide is missing Chronicles’ additional source notices.');
  expect(royalGuide.includes('the midrash of the book of the kings'),'Royal Chronicles guide includes the distinct 2 Chronicles 24:27 source label.','Royal Chronicles guide is missing the midrash of the Book of Kings notice.');
  expect(royalGuide.includes('The cited annals are not the canonical books of 1–2 Chronicles'),'Royal Chronicles guide clearly separates lost annals from canonical Chronicles.','Royal Chronicles guide conflates the lost annals with canonical Chronicles.');
  expect(royalGuide.includes('Plausible, but the surviving evidence does not let us inspect the archive'),'Royal Chronicles guide keeps official-court-record claims cautious.','Royal Chronicles guide overstates official archive identification.');
  expect(royalGuide.includes('The royal annals are sources named by Scripture, not separate canonical books'),'Royal Chronicles guide distinguishes source use from canonization.','Royal Chronicles guide is missing its canon/source-use distinction.');
  expect(royalGuide.includes('The royal source books are not independently recoverable'),'Royal Chronicles guide clearly states the lost-source limitation.','Royal Chronicles guide implies independent recovery of the royal annals.');
  expect(royalGuide.includes('You’ve reached the end of the current detailed Ancient Writings catalog.'),'Royal Chronicles guide closes the current detailed catalog without inventing a next resource.','Royal Chronicles guide is missing its end-of-catalog navigation.');
  expect(!royalGuide.includes('Phase 2'),'Royal Chronicles public guide omits internal development-phase language.','Royal Chronicles public guide exposes internal Phase 2 language.');
  expect((await page.locator('.ancient-source-grid a[target="_blank"]').count())>=9,'Royal Chronicles guide provides a substantial primary/source list.','Royal Chronicles guide does not provide enough research sources.');
  expect((await page.locator('a[href="first-kings-study.html"]').count())>=1&&(await page.locator('a[href="second-kings-study.html"]').count())>=1&&(await page.locator('a[href="second-chronicles-study.html"]').count())>=1,'Royal Chronicles guide links back to Kings and Chronicles studies.','Royal Chronicles guide is missing one or more canonical-study links.');
  expect((await page.locator('a[href="ancient-writing-nathan-gad.html"]').count())>=1,'Royal Chronicles guide links back to the previous Nathan and Gad guide.','Royal Chronicles guide is missing previous-guide navigation.');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Royal Chronicles guide has no horizontal overflow at 390px.','Royal Chronicles guide overflows horizontally at 390px.');
  const royalInternalLink=page.locator('.detail-connection-list a').first();
  const royalLinkBox=await royalInternalLink.boundingBox();
  expect(Boolean(royalLinkBox&&royalLinkBox.height>=44),'Royal Chronicles canonical-study links meet the 44px mobile touch target.','Royal Chronicles canonical-study links are below the 44px mobile touch target.');
  await page.setViewportSize({width:1440,height:1000});

  await open('other-ancient-writings-mobile','other-ancient-writings.html');
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Ancient Writings has no horizontal overflow at 390px.','Ancient Writings overflows horizontally at 390px.');
  const firstAncientLink=page.locator('.ancient-links a').first();
  const firstAncientBox=await firstAncientLink.boundingBox();
  expect(Boolean(firstAncientBox&&firstAncientBox.height>=44),'Ancient Writings mobile links meet the 44px touch-target height.','Ancient Writings mobile links are below the 44px touch-target height.');
  await page.setViewportSize({width:1440,height:1000});


  await open('search','search.html');
  const search=page.locator('#site-search');
  for(const title of requiredTitles){
    await search.fill(title);
    await page.waitForTimeout(250);
    const results=await page.locator('#search-results').innerText().catch(()=>'');
    expect(results.includes(title),`Search finds ${title}.`,`Search did not find ${title}.`);
  }
  await search.fill('Other Ancient Writings');
  await page.waitForTimeout(250);
  const ancientSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(ancientSearchResults.includes('Other Ancient Writings'),'Search finds Other Ancient Writings.','Search did not find Other Ancient Writings.');
  await search.fill('1 Enoch');
  await page.waitForTimeout(250);
  const enochSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(enochSearchResults.includes('1 Enoch: Historical & Biblical Guide'),'Search finds the detailed 1 Enoch guide.','Search did not find the detailed 1 Enoch guide.');
  await search.fill('Jubilees');
  await page.waitForTimeout(250);
  const jubileesSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(jubileesSearchResults.includes('Jubilees: Historical & Biblical Guide'),'Search finds the detailed Jubilees guide.','Search did not find the detailed Jubilees guide.');
  await search.fill('Wisdom of Solomon');
  await page.waitForTimeout(250);
  const wisdomSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(wisdomSearchResults.includes('Wisdom of Solomon: Historical & Biblical Guide'),'Search finds the detailed Wisdom of Solomon guide.','Search did not find the detailed Wisdom of Solomon guide.');
  await search.fill('Sirach');
  await page.waitForTimeout(250);
  const sirachSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(sirachSearchResults.includes('Sirach: Historical & Biblical Guide'),'Search finds the detailed Sirach guide.','Search did not find the detailed Sirach guide.');
  await search.fill('Maccabees');
  await page.waitForTimeout(250);
  const maccabeesSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(maccabeesSearchResults.includes('1 and 2 Maccabees: Historical & Biblical Guide'),'Search finds the detailed Maccabees guide.','Search did not find the detailed Maccabees guide.');
  await search.fill('Meqabyan');
  await page.waitForTimeout(250);
  const meqabyanSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(meqabyanSearchResults.includes('Ethiopian Meqabyan: Historical & Biblical Guide'),'Search finds the detailed Meqabyan guide.','Search did not find the detailed Meqabyan guide.');
  await search.fill('Assumption of Moses');
  await page.waitForTimeout(250);
  const assumptionSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(assumptionSearchResults.includes('Assumption / Testament of Moses: Historical & Biblical Guide'),'Search finds the detailed Moses tradition guide.','Search did not find the detailed Moses tradition guide.');
  await search.fill('Jannes and Jambres');
  await page.waitForTimeout(250);
  const jannesSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(jannesSearchResults.includes('Jannes and Jambres: Historical & Biblical Guide'),'Search finds the detailed Jannes and Jambres guide.','Search did not find the detailed Jannes and Jambres guide.');
  await search.fill('Book of Jashar');
  await page.waitForTimeout(250);
  const jasharSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(jasharSearchResults.includes('Book of Jashar: Historical & Biblical Guide'),'Search finds the detailed Book of Jashar guide.','Search did not find the detailed Book of Jashar guide.');
  await search.fill('Book of the Wars of the Lord');
  await page.waitForTimeout(250);
  const warsSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(warsSearchResults.includes('Book of the Wars of the Lord: Historical & Biblical Guide'),'Search finds the detailed Wars of the Lord guide.','Search did not find the detailed Wars of the Lord guide.');
  await search.fill('Records of Nathan and Gad');
  await page.waitForTimeout(250);
  const nathanGadSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(nathanGadSearchResults.includes('Records of Nathan and Gad: Historical & Biblical Guide'),'Search finds the detailed Nathan and Gad guide.','Search did not find the detailed Nathan and Gad guide.');
  await search.fill('Royal Chronicles and Other Named Records');
  await page.waitForTimeout(250);
  const royalSearchResults=await page.locator('#search-results').innerText().catch(()=>'');
  expect(royalSearchResults.includes('Royal Chronicles and Other Named Records: Historical & Biblical Guide'),'Search finds the detailed Royal Chronicles guide.','Search did not find the detailed Royal Chronicles guide.');


  await open('site-map','site-map.html');
  await page.waitForFunction(()=>document.querySelector('#site-map-content-index')?.textContent?.includes('Before You Hit Share'),{timeout:5000}).catch(()=>{});
  const siteMapText=await page.locator('#site-map-content-index').innerText().catch(()=>'');
  for(const title of requiredTitles){
    expect(siteMapText.includes(title),`Site Map lists ${title}.`,`Site Map did not list ${title}.`);
  }
  expect(siteMapText.includes('Other Ancient Writings'),'Generated Site Map index lists Other Ancient Writings.','Generated Site Map index is missing Other Ancient Writings.');
  expect(siteMapText.includes('1 Enoch: Historical & Biblical Guide'),'Generated Site Map index lists the detailed 1 Enoch guide.','Generated Site Map index is missing the detailed 1 Enoch guide.');
  expect(siteMapText.includes('Jubilees: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Jubilees guide.','Generated Site Map index is missing the detailed Jubilees guide.');
  expect(siteMapText.includes('Wisdom of Solomon: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Wisdom of Solomon guide.','Generated Site Map index is missing the detailed Wisdom of Solomon guide.');
  expect(siteMapText.includes('Sirach: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Sirach guide.','Generated Site Map index is missing the detailed Sirach guide.');
  expect(siteMapText.includes('1 and 2 Maccabees: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Maccabees guide.','Generated Site Map index is missing the detailed Maccabees guide.');
  expect(siteMapText.includes('Ethiopian Meqabyan: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Meqabyan guide.','Generated Site Map index is missing the detailed Meqabyan guide.');
  expect(siteMapText.includes('Assumption / Testament of Moses: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Moses tradition guide.','Generated Site Map index is missing the detailed Moses tradition guide.');
  expect(siteMapText.includes('Jannes and Jambres: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Jannes and Jambres guide.','Generated Site Map index is missing the detailed Jannes and Jambres guide.');
  expect(siteMapText.includes('Book of Jashar: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Book of Jashar guide.','Generated Site Map index is missing the detailed Book of Jashar guide.');
  expect(siteMapText.includes('Book of the Wars of the Lord: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Wars of the Lord guide.','Generated Site Map index is missing the detailed Wars of the Lord guide.');
  expect(siteMapText.includes('Records of Nathan and Gad: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Nathan and Gad guide.','Generated Site Map index is missing the detailed Nathan and Gad guide.');
  expect(siteMapText.includes('Royal Chronicles and Other Named Records: Historical & Biblical Guide'),'Generated Site Map index lists the detailed Royal Chronicles guide.','Generated Site Map index is missing the detailed Royal Chronicles guide.');
  expect((await page.locator('.site-map-grid a[href="other-ancient-writings.html"]').count())>0,'Manual Site Map Bible Studies section links Other Ancient Writings.','Manual Site Map is missing Other Ancient Writings.');


  await open('news','news.html');
  const newsText=await page.locator('main').innerText();
  expect(newsText.includes('Grace for the Changing Season'),'News archive includes Newsletter Issue 02.','News archive is missing Newsletter Issue 02.');
  expect((await page.locator('a[href="newsletter/grace-for-the-changing-season.html"]').count())>0,'News Issue 02 links to the published newsletter.','News Issue 02 link is missing or incorrect.');

  await open('podcast','podcast.html');
  const podcastText=await page.locator('main').innerText();
  expect(podcastText.includes('Episode Preview'),'Podcast uses Episode Preview.','Podcast is missing the Episode Preview label.');
  expect(!podcastText.includes('EP 03'),'Podcast no longer presents an unestablished EP 03 label.','Podcast still contains EP 03.');
  expect((await page.locator('#signup-form').count())===0,'Podcast inactive signup form is removed.','Podcast still contains the inactive signup form.');
  expect((await page.locator('a[href="https://substack.com/@nolabelsdesignedbygod"]').count())>0,'Podcast links to Substack.','Podcast Substack link is missing.');
  expect((await page.locator('a[href="https://www.facebook.com/NoLabelsDesignedbyGod"]').count())>0,'Podcast links to Facebook.','Podcast Facebook link is missing.');
  expect(podcastText.includes('has not launched yet'),'Podcast explicitly preserves pre-launch status.','Podcast does not clearly state that it has not launched yet.');

  await open('devotionals','devotionals.html');
  await page.waitForFunction(()=>document.querySelector('#devoCurrentTitle')?.textContent?.includes('Worship After Sunday'),{timeout:5000}).catch(()=>{});
  const currentDevotional=await page.locator('#devoCurrentTitle').innerText().catch(()=>'');
  expect(currentDevotional.includes('Worship After Sunday'),'Devotionals shows Worship After Sunday as the current devotional.','Devotionals did not promote Worship After Sunday as current.');
  expect((await page.locator('.section-navigation a[href="dashboard.html"]').filter({hasText:'My Journey'}).count())>0,'Devotionals shared navigation includes My Journey.','Devotionals shared navigation is missing My Journey.');

  const sitemapResponse=await context.request.get(`${BASE_URL}/sitemap.xml`);
  expect(sitemapResponse.ok(),'sitemap.xml returned successfully.','sitemap.xml did not return successfully.');
  const sitemap=await sitemapResponse.text();
  for(const item of sitemapPaths){
    expect(sitemap.includes(item),`sitemap.xml includes ${item}.`,`sitemap.xml is missing ${item}.`);
  }
}finally{
  await browser.close();
}

const report=[
  '# Content Surface Browser Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Result: **${failures.length?'FAILED':'PASSED'}** with ${failures.length} failure(s).`,
  '',
  '## Checks',
  '',
  ...checks.map(item=>`- ${item}`),
  '',
  '## Failures',
  '',
  ...(failures.length?failures.map(item=>`- ${item}`):['- None.']),
  ''
].join('\n');
await fs.writeFile(path.join(OUTPUT,'report.md'),report,'utf8');
console.log(report);
if(failures.length)process.exitCode=1;
