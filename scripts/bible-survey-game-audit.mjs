import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeModulePath=['axe-core','axe','min','js'];
const axeSource=await fs.readFile(require.resolve(`${axeModulePath[0]}/${axeModulePath.slice(1).join('.')}`),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const pass=(condition,message)=>{if(!condition)failures.push(message)};

const [host,game,integration,contactLinks,sitemap,serviceWorker]=await Promise.all([
 fs.readFile('bible-survey-host.html','utf8'),
 fs.readFile('bible-survey-game.html','utf8'),
 fs.readFile('survey-game-integration.js','utf8'),
 fs.readFile('contact-links.js','utf8'),
 fs.readFile('sitemap.xml','utf8'),
 fs.readFile('sw.js','utf8')
]);

for(const marker of ['Laptop or desktop required','Choose Extend','Open Audience Screen','Private Answer Key','id="startGame"','window.open','nldg-audience-live'])pass(host.includes(marker),`Laptop host is missing ${marker}.`);
for(const marker of ['id="start"','id="answers"','id="strikeButton"','id="awardRound"','id="undo"','const BANK='])pass(game.includes(marker),`Audience game file is missing ${marker}.`);
for(const audience of ['preschool','kids','teens','adults','family'])pass(game.includes(`"${audience}"`),`Game bank is missing ${audience}.`);
pass(integration.includes('Laptop Required')&&integration.includes('TV / Projector')&&integration.includes('bible-survey-host.html'),'Game Center does not clearly identify the laptop and second-display requirement.');
pass(contactLinks.includes('survey-game-integration.js?v=2.0.0'),'Sitewide loader does not load the updated game integration.');
pass(sitemap.includes('https://nolabelsdesignedbygod.org/bible-survey-host.html'),'Sitemap is missing the laptop host page.');
pass(serviceWorker.includes("'bible-survey-host.html'")&&serviceWorker.includes("'bible-survey-game.html'")&&serviceWorker.includes('survey-game-integration.js?v=2.0.0'),'Offline cache is missing Survey Showdown host assets.');

const browser=await chromium.launch({headless:true});
try{
 for(const width of [375,1024,1440]){
  const context=await browser.newContext({viewport:{width,height:950},deviceScaleFactor:1});
  const page=await context.newPage();
  const response=await page.goto(`${BASE_URL}/bible-survey-host.html?group=family`,{waitUntil:'networkidle'});
  pass(response&&response.status()<400,`Laptop host returned an error at ${width}px.`);
  const structure=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,imagesMissingAlt:[...document.images].filter(image=>!image.hasAttribute('alt')).length,requirement:document.getElementById('laptopRequirement')?.innerText||'',warningHidden:document.getElementById('deviceWarning')?.classList.contains('hidden')}));
  pass(structure.overflow<=2,`Laptop host has ${structure.overflow}px horizontal overflow at ${width}px.`);
  pass(structure.imagesMissingAlt===0,`Laptop host has images without alt text at ${width}px.`);
  pass(structure.requirement.includes('Laptop or desktop required'),'Laptop requirement is not visible.');
  if(width===375)pass(structure.warningHidden===false,'Small-screen warning is not visible on phone-sized screens.');
  if(width===1440){await page.addScriptTag({content:axeSource});const axe=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},resultTypes:['violations']}));axe.violations.filter(item=>['critical','serious'].includes(item.impact)).forEach(item=>failures.push(`Host accessibility: ${item.id} (${item.impact}) ${item.help}.`))}
  await context.close();
 }

 const context=await browser.newContext({viewport:{width:1366,height:950}});
 const hostPage=await context.newPage();
 await hostPage.goto(`${BASE_URL}/bible-survey-host.html?group=family`,{waitUntil:'networkidle'});
 pass(await hostPage.locator('#startGame').isDisabled(),'Start button should remain disabled until the audience screen connects.');
 await hostPage.fill('#teamOne','Team Hope');
 await hostPage.fill('#teamTwo','Team Faith');
 const [audiencePage]=await Promise.all([hostPage.waitForEvent('popup'),hostPage.click('#openAudience')]);
 await audiencePage.waitForLoadState('networkidle');
 await hostPage.waitForFunction(()=>document.getElementById('audienceStatus')?.textContent.includes('connected'));
 pass(!(await hostPage.locator('#startGame').isDisabled()),'Start button did not unlock after the audience screen connected.');
 pass(await audiencePage.locator('#nldgAudienceWaiting').isVisible(),'Audience screen did not show its connection and fullscreen instructions.');
 pass((await audiencePage.locator('#nldgAudienceWaiting').innerText()).includes('TV or projector'),'Audience waiting screen does not explain where to place the window.');
 await hostPage.click('#startGame');
 await hostPage.waitForSelector('#hostView:not(.hidden)');
 await audiencePage.waitForSelector('#gameView:not(.hidden)');
 pass(await hostPage.locator('[data-host-answer]').count()>=5,'Private host answer key did not render.');
 pass((await hostPage.locator('[data-host-answer]').first().innerText()).length>3,'Private answer key does not show answer text.');
 pass(await audiencePage.locator('.answer-tile.revealed').count()===0,'Audience board revealed an answer before the host selected it.');
 const audienceHostbarDisplay=await audiencePage.locator('.hostbar').evaluate(element=>getComputedStyle(element).display);
 pass(audienceHostbarDisplay==='none','Audience screen still exposes host controls.');
 await hostPage.locator('[data-host-answer]').first().click();
 await audiencePage.waitForSelector('.answer-tile.revealed');
 const bank=Number(await audiencePage.locator('#bank').innerText());
 pass(bank>0,'Host answer reveal did not update the audience round bank.');
 await hostPage.click('#addStrike');
 pass(await audiencePage.locator('.strike.on').count()===1,'Private host strike control did not update the audience board.');
 await hostPage.click('#award');
 const score=Number(await audiencePage.locator('#teamScore0').innerText());
 pass(score===bank,'Private host award control did not add the bank to the active team.');
 await hostPage.click('#undo');
 pass(Number(await audiencePage.locator('#teamScore0').innerText())===0,'Private host undo did not reverse the award.');
 pass(await hostPage.locator('[data-host-answer]').count()>=5,'Private answer key disappeared during gameplay.');

 await hostPage.goto(`${BASE_URL}/play.html`,{waitUntil:'networkidle'});
 await hostPage.waitForSelector('[data-survey-showdown]');
 const gameCenterText=await hostPage.locator('[data-survey-showdown]').allInnerTexts();
 pass(gameCenterText.join(' ').includes('Laptop Required')&&gameCenterText.join(' ').includes('TV / Projector'),'Game Center does not clearly show the device requirement.');
 pass(await hostPage.locator('a[href*="bible-survey-host.html"]').count()>=1,'Game Center does not launch the laptop host.');

 await hostPage.goto(`${BASE_URL}/search.html`,{waitUntil:'networkidle'});
 await hostPage.waitForTimeout(700);
 await hostPage.fill('#site-search','Bible Survey Showdown');
 await hostPage.waitForTimeout(250);
 const searchText=await hostPage.locator('#search-results').innerText();
 pass(searchText.includes('Bible Survey Showdown')&&searchText.toLowerCase().includes('laptop'),'Site search does not explain that Survey Showdown is laptop hosted.');
 await context.close();
}finally{await browser.close()}

if(failures.length){console.error(`Bible Survey Showdown laptop audit FAILED with ${failures.length} problem(s):`);failures.forEach(item=>console.error(`- ${item}`));process.exit(1)}
console.log('Bible Survey Showdown laptop audit PASSED: device labeling, private answer key, separate audience display, hidden audience controls, scoring, strikes, undo, Game Center placement, search, responsive layout, and accessibility.');
