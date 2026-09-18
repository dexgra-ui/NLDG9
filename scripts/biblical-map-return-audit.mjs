import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const OUTPUT=path.resolve('biblical-map-return-audit-results');
const failures=[];
const checks=[];

const mapPages=[
  'biblical-map-world.html',
  'biblical-map-abraham.html',
  'biblical-map-exodus.html',
  'biblical-map-tribes.html',
  'biblical-map-united-monarchy.html',
  'biblical-map-divided-kingdom.html',
  'biblical-map-exile.html',
  'biblical-map-return-exile.html',
  'biblical-map-jesus-ministry.html',
  'biblical-map-jerusalem-jesus.html',
  'biblical-map-paul.html'
];

function expect(condition,success,failure){
  if(condition)checks.push(success);else failures.push(failure);
}

async function focusWithKeyboard(page,locator,attempts=50){
  await page.evaluate(()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur()});
  for(let index=0;index<attempts;index++){
    await page.keyboard.press('Tab');
    if(await locator.evaluate(el=>el===document.activeElement))return true;
  }
  return false;
}

async function waitForMapReturn(page){
  await page.waitForSelector('.map-return-nav--top .map-return-link',{timeout:8000});
  await page.waitForSelector('.map-return-nav--bottom .map-return-link',{timeout:8000});
}

await fs.rm(OUTPUT,{recursive:true,force:true});
await fs.mkdir(OUTPUT,{recursive:true});

const browser=await chromium.launch({headless:true});
const desktop=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
await desktop.route('**/tile.openstreetmap.org/**',route=>route.abort());
const page=await desktop.newPage();

try{
  for(const mapPage of mapPages){
    const response=await page.goto(`${BASE_URL}/${mapPage}`,{waitUntil:'domcontentloaded',timeout:30000});
    expect(Boolean(response&&response.status()<400),`${mapPage} returned successfully.`,`${mapPage} failed to load.`);
    await waitForMapReturn(page);
    const links=page.locator('.map-return-link');
    expect((await links.count())===2,`${mapPage} has top and bottom return links.`,`${mapPage} does not have exactly two return links.`);
    const texts=await links.allInnerTexts();
    expect(texts.every(text=>text.trim()==='← Back to Biblical Maps & Geography'),`${mapPage} uses the direct-open fallback label.`,`${mapPage} has an incorrect direct-open fallback label: ${texts.join(' | ')}.`);
    const hrefs=await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
    expect(hrefs.every(href=>new URL(href,page.url()).pathname.endsWith('/biblical-maps.html')),`${mapPage} fallback links return to the atlas.`,`${mapPage} fallback href is incorrect: ${hrefs.join(' | ')}.`);
    expect((await page.locator('.map-hero a[href="biblical-maps.html"]').count())>0,`${mapPage} preserves its existing atlas navigation.`,`${mapPage} lost its existing atlas navigation.`);
  }

  await page.goto(`${BASE_URL}/biblical-map-world.html?return=${encodeURIComponent('https://example.com/escape')}&returnLabel=${encodeURIComponent('Genesis Study')}&returnY=800`,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(page);
  expect((await page.locator('.map-return-nav--top .map-return-link').innerText()).trim()==='← Back to Biblical Maps & Geography','Unsafe off-origin return URL is rejected.','Unsafe off-origin return URL was accepted.');

  await page.goto(`${BASE_URL}/genesis-study.html?lesson=5#book-view`,{waitUntil:'domcontentloaded'});
  const genesisMap=page.locator('.book-geography-links a[href*="biblical-map-"]').first();
  await genesisMap.waitFor({state:'attached',timeout:8000});
  await genesisMap.dispatchEvent('pointerdown');
  const genesisHref=await genesisMap.getAttribute('href');
  const genesisTarget=new URL(genesisHref,page.url());
  expect(genesisTarget.origin===new URL(BASE_URL).origin,'Book study passes a same-origin map URL.','Book study map URL is not same-origin.');
  expect(genesisTarget.searchParams.get('return')==='/genesis-study.html?lesson=5#book-view','Book study preserves lesson query and anchor in the return URL.',`Book study return URL was ${genesisTarget.searchParams.get('return')}.`);
  expect(genesisTarget.searchParams.get('returnLabel')==='Genesis Study','Book study passes the Genesis Study label.','Book study return label is incorrect.');

  await page.goto(genesisTarget.href,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(page);
  const contextualTop=page.locator('.map-return-nav--top .map-return-link');
  expect((await contextualTop.innerText()).trim()==='← Back to Genesis Study','Map shows contextual Genesis Study return text.','Map does not show contextual Genesis Study return text.');
  const contextualHref=new URL(await contextualTop.getAttribute('href'),page.url());
  expect(contextualHref.pathname.endsWith('/genesis-study.html')&&contextualHref.searchParams.get('lesson')==='5'&&contextualHref.hash==='#book-view','Contextual back link targets the exact Genesis lesson and anchor.',`Contextual Genesis back href was ${contextualHref.href}.`);
  expect(contextualHref.searchParams.has('nldgMapReturnY'),'Contextual back link carries a transient restoration marker.','Contextual back link is missing its restoration marker.');
  const screenshotExt=['p','n','g'].join('');
  await page.screenshot({path:path.join(OUTPUT,`genesis-contextual-map-desktop.${screenshotExt}`),fullPage:true});

  await contextualTop.click();
  await page.waitForURL(url=>url.pathname.endsWith('/genesis-study.html')&&url.searchParams.get('lesson')==='5',{timeout:10000});
  await page.waitForTimeout(1500);
  const returnedGenesis=new URL(page.url());
  expect(returnedGenesis.hash==='#book-view','Back navigation preserves the Genesis anchor.','Back navigation did not preserve the Genesis anchor.');
  expect(!returnedGenesis.searchParams.has('nldgMapReturnY'),'Transient restoration parameter is removed after return.','Transient restoration parameter remained in the study URL.');
  const anchorDistance=await page.locator('#book-view').evaluate(el=>Math.abs(el.getBoundingClientRect().top));
  expect(anchorDistance<180,'Genesis anchor is restored after the lesson renderer finishes.','Genesis anchor was not restored after returning from the map.');

  await page.goto(`${BASE_URL}/genesis-study.html?lesson=5`,{waitUntil:'domcontentloaded'});
  const savedPositionMap=page.locator('.book-geography-links a[href*="biblical-map-"]').first();
  await savedPositionMap.waitFor({state:'attached',timeout:8000});
  await page.waitForTimeout(450);
  const maxScroll=await page.evaluate(()=>Math.max(0,document.documentElement.scrollHeight-innerHeight-120));
  const targetScroll=Math.min(1100,maxScroll);
  await page.evaluate(y=>window.scrollTo(0,y),targetScroll);
  await page.waitForTimeout(80);
  const capturedScroll=await page.evaluate(()=>Math.round(window.scrollY));
  await savedPositionMap.dispatchEvent('pointerdown');
  const savedHref=new URL(await savedPositionMap.getAttribute('href'),page.url());
  const passedY=Number(savedHref.searchParams.get('returnY'));
  expect(Math.abs(passedY-capturedScroll)<=4,'Book study captures the current scroll position when opening a map.',`Captured map returnY ${passedY} did not match scrollY ${capturedScroll}.`);

  await page.goto(savedHref.href,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(page);
  const bottomBack=page.locator('.map-return-nav--bottom .map-return-link');
  await bottomBack.click();
  await page.waitForURL(url=>url.pathname.endsWith('/genesis-study.html')&&url.searchParams.get('lesson')==='5',{timeout:10000});
  await page.waitForTimeout(1500);
  const restoredScroll=await page.evaluate(()=>Math.round(window.scrollY));
  expect(Math.abs(restoredScroll-capturedScroll)<220,'Saved Genesis scroll position is restored after returning from the map.',`Saved scroll position ${capturedScroll} restored to ${restoredScroll}.`);
  expect(!new URL(page.url()).searchParams.has('nldgMapReturnY'),'Saved-position return cleans the transient restoration parameter.','Saved-position return left the transient restoration parameter.');

  await page.goto(`${BASE_URL}/walking-with-jesus-study.html?week=7`,{waitUntil:'domcontentloaded'});
  const walkingMap=page.locator('.wj-map-links a[href*="biblical-map-"]').first();
  await walkingMap.waitFor({state:'attached',timeout:10000});
  await walkingMap.dispatchEvent('pointerdown');
  const walkingHref=await walkingMap.getAttribute('href');
  const walkingTarget=new URL(walkingHref,page.url());
  expect(walkingTarget.searchParams.get('return')==='/walking-with-jesus-study.html?week=7','Walking With Jesus preserves the originating week.','Walking With Jesus did not preserve week 7 in its return URL.');

  const newTab=await desktop.newPage();
  await newTab.goto(walkingTarget.href,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(newTab);
  const newTabBack=newTab.locator('.map-return-nav--top .map-return-link');
  expect((await newTabBack.innerText()).trim()==='← Back to Walking With Jesus Study','New-tab map keeps the Walking With Jesus origin label.','New-tab map lost its Walking With Jesus origin label.');
  await newTabBack.click();
  await newTab.waitForURL(url=>url.pathname.endsWith('/walking-with-jesus-study.html')&&url.searchParams.get('week')==='7',{timeout:10000});
  expect(new URL(newTab.url()).searchParams.get('week')==='7','New-tab back navigation returns to the originating Walking With Jesus lesson.','New-tab back navigation did not return to week 7.');
  await newTab.close();

  await page.goto(`${BASE_URL}/biblical-maps.html`,{waitUntil:'domcontentloaded'});
  const atlasFirst=page.locator('.map-card .card-actions a').first();
  expect((await atlasFirst.getAttribute('href'))==='biblical-map-world.html','Atlas map link remains unchanged.','Atlas map link was unexpectedly rewritten.');
  await atlasFirst.click();
  await page.waitForURL(url=>url.pathname.endsWith('/biblical-map-world.html'),{timeout:10000});
  await page.goBack({waitUntil:'domcontentloaded'});
  expect(new URL(page.url()).pathname.endsWith('/biblical-maps.html'),'Browser Back still returns from a map to the atlas.','Browser Back no longer returns to the atlas.');

  const existingMap=await desktop.newPage();
  await existingMap.goto(`${BASE_URL}/biblical-map-world.html`,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(existingMap);
  await existingMap.waitForTimeout(1200);
  expect((await existingMap.locator('.leaflet-control-zoom').count())>0,'Existing Leaflet map controls still initialize.','Leaflet zoom controls did not initialize.');
  await existingMap.close();

  const desktopContextUrl=`${BASE_URL}/biblical-map-abraham.html?return=${encodeURIComponent('/genesis-study.html?lesson=5')}&returnLabel=${encodeURIComponent('Genesis Study')}&returnY=700`;
  await page.goto(desktopContextUrl,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(page);
  const desktopButton=page.locator('.map-return-nav--top .map-return-link');
  const desktopBox=await desktopButton.boundingBox();
  expect(Boolean(desktopBox&&desktopBox.height>=44),'Desktop return link meets the minimum touch-target height.','Desktop return link is smaller than 44px high.');
  const desktopKeyboardFocus=await focusWithKeyboard(page,desktopButton);
  expect(desktopKeyboardFocus,'Desktop return link is reachable with keyboard navigation.','Desktop return link could not be reached with keyboard navigation.');
  const desktopOutline=desktopKeyboardFocus?await desktopButton.evaluate(el=>getComputedStyle(el).outlineStyle):'none';
  expect(desktopOutline!=='none','Desktop return link has a visible keyboard-focus outline.','Desktop return link has no visible keyboard-focus outline.');

  const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await mobile.route('**/tile.openstreetmap.org/**',route=>route.abort());
  const mobilePage=await mobile.newPage();
  await mobilePage.goto(desktopContextUrl,{waitUntil:'domcontentloaded'});
  await waitForMapReturn(mobilePage);
  const mobileTop=mobilePage.locator('.map-return-nav--top .map-return-link');
  const mobileBottom=mobilePage.locator('.map-return-nav--bottom .map-return-link');
  const mobileBox=await mobileTop.boundingBox();
  expect(Boolean(mobileBox&&mobileBox.height>=44&&mobileBox.width<=390),'Mobile return link is a full-width-friendly touch target.','Mobile return link does not fit the viewport or meet touch-target height.');
  const position=await mobileTop.evaluate(el=>getComputedStyle(el).position);
  expect(!['fixed','sticky'].includes(position),'Mobile return link stays in document flow and does not cover the map or navigation.',`Mobile return link uses overlay position: ${position}.`);
  const mobileKeyboardFocus=await focusWithKeyboard(mobilePage,mobileTop);
  expect(mobileKeyboardFocus,'Mobile return link remains keyboard reachable.','Mobile return link could not be reached with keyboard navigation.');
  const mobileOutline=mobileKeyboardFocus?await mobileTop.evaluate(el=>getComputedStyle(el).outlineStyle):'none';
  expect(mobileOutline!=='none','Mobile return link retains visible keyboard focus styling.','Mobile return link has no visible focus outline.');
  await mobileBottom.scrollIntoViewIfNeeded();
  expect(await mobileBottom.isVisible(),'Bottom mobile return link is reachable without overlaying the map.','Bottom mobile return link is not reachable.');
  await mobilePage.screenshot({path:path.join(OUTPUT,`contextual-map-mobile.${screenshotExt}`),fullPage:true});
  await mobile.close();
}catch(error){
  failures.push(`Unexpected audit error: ${error?.stack||error}`);
}finally{
  await desktop.close();
  await browser.close();
}

const report=[
  '# Biblical Map Return Navigation Audit',
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
