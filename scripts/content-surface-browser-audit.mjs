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
  'other-ancient-writings.html'
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
  expect(homeLatest.includes('Other Ancient Writings'),'Homepage Latest surfaces Other Ancient Writings for study discovery.','Homepage Latest did not surface Other Ancient Writings after the shared library loaded.');
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


  await open('site-map','site-map.html');
  await page.waitForFunction(()=>document.querySelector('#site-map-content-index')?.textContent?.includes('Before You Hit Share'),{timeout:5000}).catch(()=>{});
  const siteMapText=await page.locator('#site-map-content-index').innerText().catch(()=>'');
  for(const title of requiredTitles){
    expect(siteMapText.includes(title),`Site Map lists ${title}.`,`Site Map did not list ${title}.`);
  }
  expect(siteMapText.includes('Other Ancient Writings'),'Generated Site Map index lists Other Ancient Writings.','Generated Site Map index is missing Other Ancient Writings.');
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
