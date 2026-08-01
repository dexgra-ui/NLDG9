import { promises as fs } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require=createRequire(import.meta.url);
const axeModulePath=['axe-core','axe','min','js'];
const axeSource=await fs.readFile(require.resolve(`${axeModulePath[0]}/${axeModulePath.slice(1).join('.')}`),'utf8');
const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const pass=(condition,message)=>{if(!condition)failures.push(message)};

const [game,integration,contactLinks,sitemap]=await Promise.all([
 fs.readFile('bible-survey-game.html','utf8'),
 fs.readFile('survey-game-integration.js','utf8'),
 fs.readFile('contact-links.js','utf8'),
 fs.readFile('sitemap.xml','utf8')
]);

for(const marker of ['id="start"','id="answers"','id="strikeButton"','id="awardRound"','id="undo"','id="fullscreen"','const BANK=']){
 pass(game.includes(marker),`Game file is missing ${marker}.`);
}
for(const audience of ['preschool','kids','teens','adults','family'])pass(game.includes(`"${audience}"`),`Game bank is missing ${audience}.`);
pass(integration.includes('Bible Survey Showdown')&&integration.includes('data-survey-showdown'),'Game Center integration is incomplete.');
pass(contactLinks.includes('survey-game-integration.js?v=1.0.0'),'Sitewide loader does not load the game integration.');
pass(sitemap.includes('https://nolabelsdesignedbygod.org/bible-survey-game.html'),'Sitemap is missing Bible Survey Showdown.');

const browser=await chromium.launch({headless:true});
try{
 for(const width of [375,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
  const page=await context.newPage();
  const response=await page.goto(`${BASE_URL}/bible-survey-game.html?group=family`,{waitUntil:'networkidle'});
  pass(response&&response.status()<400,`Game returned an error at ${width}px.`);
  const structure=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
   h1:document.querySelectorAll('h1').length,
   imagesMissingAlt:[...document.images].filter(image=>!image.hasAttribute('alt')).length
  }));
  pass(structure.overflow<=2,`Game has ${structure.overflow}px horizontal overflow at ${width}px.`);
  pass(structure.h1===1,`Game has ${structure.h1} H1 headings at ${width}px.`);
  pass(structure.imagesMissingAlt===0,`Game has images without alt text at ${width}px.`);
  if(width===1440){
   await page.addScriptTag({content:axeSource});
   const axe=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']},resultTypes:['violations']}));
   axe.violations.filter(item=>['critical','serious'].includes(item.impact)).forEach(item=>failures.push(`Accessibility: ${item.id} (${item.impact}) ${item.help}.`));
  }
  await context.close();
 }

 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage();
 await page.goto(`${BASE_URL}/bible-survey-game.html?group=family`,{waitUntil:'networkidle'});
 await page.fill('#teamOne','Team Hope');
 await page.fill('#teamTwo','Team Faith');
 await page.click('#start');
 await page.waitForSelector('#gameView:not(.hidden)');
 pass(await page.locator('.answer-tile').count()>=5,'The game did not render a complete answer board.');
 await page.locator('.answer-tile').first().click();
 const bank=Number(await page.locator('#bank').innerText());
 pass(bank>0,'Revealing an answer did not add to the round bank.');
 await page.click('#strikeButton');
 pass(await page.locator('.strike.on').count()===1,'Strike control did not show a strike.');
 await page.click('#awardRound');
 const score=Number(await page.locator('#teamScore0').innerText());
 pass(score===bank,'Awarding the round did not add the bank to the active team.');
 await page.click('#undo');
 pass(Number(await page.locator('#teamScore0').innerText())===0,'Undo did not reverse the round award.');
 await page.click('#stealMode');
 pass((await page.locator('#controlNote').innerText()).includes('steal'),'Steal mode did not switch the active team.');

 await page.goto(`${BASE_URL}/play.html`,{waitUntil:'networkidle'});
 await page.waitForSelector('[data-survey-showdown]');
 pass(await page.locator('[data-survey-showdown]').count()>=2,'Game Center is missing the Survey Showdown card or quick-launch link.');

 await page.goto(`${BASE_URL}/search.html`,{waitUntil:'networkidle'});
 await page.waitForTimeout(700);
 await page.fill('#site-search','Bible Survey Showdown');
 await page.waitForTimeout(250);
 pass((await page.locator('#search-results').innerText()).includes('Bible Survey Showdown'),'Site search does not find Bible Survey Showdown.');
 await context.close();
}finally{
 await browser.close();
}

if(failures.length){
 console.error(`Bible Survey Showdown audit FAILED with ${failures.length} problem(s):`);
 failures.forEach(item=>console.error(`- ${item}`));
 process.exit(1);
}
console.log('Bible Survey Showdown audit PASSED: responsive layout, accessibility, answer reveals, strikes, scoring, undo, steal mode, Game Center placement, and search.');
