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
  'newsletter/grace-for-the-changing-season.html'
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
  expect(homeLatest.includes('Both of Them Are My Neighbor'),'Homepage Latest includes current extension-library content.','Homepage Latest did not include Both of Them Are My Neighbor after the full library loaded.');
  const featuredSeries=await page.locator('#home-featured .content-series').allInnerTexts().catch(()=>[]);
  const latestSeries=await page.locator('#home-latest .content-series').allInnerTexts().catch(()=>[]);
  const duplicateSeries=latestSeries.filter(series=>series&&featuredSeries.includes(series));
  expect(duplicateSeries.length===0,'Homepage Latest preserves featured-series duplicate prevention.',`Homepage Latest repeated featured series: ${duplicateSeries.join(', ')}.`);

  await open('search','search.html');
  const search=page.locator('#site-search');
  for(const title of requiredTitles){
    await search.fill(title);
    await page.waitForTimeout(250);
    const results=await page.locator('#search-results').innerText().catch(()=>'');
    expect(results.includes(title),`Search finds ${title}.`,`Search did not find ${title}.`);
  }

  await open('site-map','site-map.html');
  await page.waitForFunction(()=>document.querySelector('#site-map-content-index')?.textContent?.includes('Before You Hit Share'),{timeout:5000}).catch(()=>{});
  const siteMapText=await page.locator('#site-map-content-index').innerText().catch(()=>'');
  for(const title of requiredTitles){
    expect(siteMapText.includes(title),`Site Map lists ${title}.`,`Site Map did not list ${title}.`);
  }

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
