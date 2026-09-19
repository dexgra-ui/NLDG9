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
  'ancient-writing-wisdom-solomon.html'
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

try{
  await open('homepage','index.html');
  await page.waitForFunction(()=>document.querySelector('#home-latest')?.children.length>0,{timeout:5000}).catch(()=>{});
  const homeLatest=await page.locator('#home-latest').innerText().catch(()=>'');
  expect(homeLatest.includes('Wisdom of Solomon: Historical & Biblical Guide'),'Homepage Latest surfaces the newest Wisdom of Solomon detailed guide.','Homepage Latest did not surface the newest Wisdom of Solomon detailed guide after the shared library loaded.');
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
  await page.setViewportSize({width:390,height:844});
  expect((await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)),'Wisdom of Solomon guide has no horizontal overflow at 390px.','Wisdom of Solomon guide overflows horizontally at 390px.');
  const wisdomInternalLink=page.locator('.detail-connection-list a').first();
  const wisdomLinkBox=await wisdomInternalLink.boundingBox();
  expect(Boolean(wisdomLinkBox&&wisdomLinkBox.height>=44),'Wisdom canonical-study links meet the 44px mobile touch target.','Wisdom canonical-study links are below the 44px mobile touch target.');
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
