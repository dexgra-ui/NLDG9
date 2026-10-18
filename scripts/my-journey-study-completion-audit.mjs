import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const passes=[];
const check=(ok,pass,fail)=>ok?passes.push(pass):failures.push(fail);
const browser=await chromium.launch({headless:true});

async function clearStorage(page){
  await page.goto(`${BASE_URL}/studies.html`,{waitUntil:'networkidle',timeout:30000});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
}
async function openStudyFromLibrary(page,title,href){
  await page.goto(`${BASE_URL}/studies.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(url=>(window.NLDG_STUDIES||[]).some(item=>item.url===url),href,{timeout:12000});
  const listed=await page.evaluate(url=>(window.NLDG_STUDIES||[]).some(item=>item.url===url&&item.status==='published'),href);
  check(listed,`Bible Studies catalog includes ${title}.`,`Bible Studies catalog is missing ${title}.`);
  await page.goto(`${BASE_URL}/${href}`,{waitUntil:'networkidle',timeout:30000});
}
async function dashboardText(page){
  await page.goto(`${BASE_URL}/dashboard.html`,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>Boolean(window.NLDG_PERSONAL),null,{timeout:12000});
  await page.waitForTimeout(600);
  return page.locator('#completed-grid').innerText();
}

try{
  const context=await browser.newContext({viewport:{width:1280,height:900}});
  const page=await context.newPage();

  await clearStorage(page);
  await openStudyFromLibrary(page,"Learning to See Yourself Through God's Eyes",'study-identity.html');
  await page.locator('#complete-study').waitFor({state:'visible',timeout:12000});
  await page.locator('#complete-study').click();
  const growingState=await page.evaluate(()=>JSON.parse(localStorage.getItem('nldg-study-state')||'{}').identity);
  check(Boolean(growingState?.completed),'A regular study completed from Bible Studies writes canonical completion state.','Regular Bible Studies completion did not write canonical state.');
  let text=await dashboardText(page);
  check(text.includes("Learning to See Yourself Through God's Eyes"),'A completed study opened from Bible Studies appears in My Journey.','Completed Bible Study is missing from My Journey.');

  await clearStorage(page);
  await openStudyFromLibrary(page,'Command, Conviction, or Preference?','preferences-idols-series.html?lesson=1');
  await page.locator('#toggle-complete').waitFor({state:'visible',timeout:12000});
  const duplicateHidden=await page.locator('#complete-study').evaluate(el=>el.hidden).catch(()=>true);
  check(duplicateHidden,'Custom series does not expose a second competing completion button.','Custom series still shows duplicate completion controls.');
  await Promise.all([
    page.waitForNavigation({waitUntil:'networkidle',timeout:30000}),
    page.locator('#toggle-complete').click()
  ]);
  const preferenceState=await page.evaluate(()=>JSON.parse(localStorage.getItem('nldg-series-preferences-idols')||'{}'));
  check(preferenceState.completed?.includes(1),'Native series completion remains stored in its existing series key.','Native series completion was not saved.');
  text=await dashboardText(page);
  check(text.includes('Command, Conviction, or Preference?'),'A native series completion appears in My Journey.','Native series completion is missing from My Journey.');

  await clearStorage(page);
  await page.evaluate(()=>{
    localStorage.setItem('nldg-series-after-benediction',JSON.stringify({completed:[1],updated:Date.now()-2000}));
    localStorage.setItem('nldg-faith-hurting-es',JSON.stringify({completed:[1],updated:Date.now()-1000}));
  });
  text=await dashboardText(page);
  check(text.includes('Who Are You After Church?'),'Previously saved After the Benediction progress is recovered in My Journey.','Existing After the Benediction progress was not recovered.');
  check(text.includes('Grief Is Not a Lack of Faith'),'Previously saved bilingual Faith When Your Heart Is Hurting progress is recovered in My Journey.','Existing Faith When Your Heart Is Hurting progress was not recovered.');

  const afterCard=page.locator('#completed-grid .unified-content-card').filter({hasText:'Who Are You After Church?'}).first();
  await afterCard.locator('.complete-toggle').waitFor({state:'visible',timeout:10000});
  await afterCard.locator('.complete-toggle').click();
  const afterState=await page.evaluate(()=>JSON.parse(localStorage.getItem('nldg-series-after-benediction')||'{}'));
  check(!afterState.completed?.includes(1),'Marking a series-managed study incomplete from My Journey updates its native series state.','My Journey did not update the native series completion state.');

  const stats=await page.locator('#stat-completed').innerText();
  check(Number.parseInt(stats,10)>=1,'Completed Studies statistic includes recovered series completions.','Completed Studies statistic did not include series completions.');

  const publicTitles=await page.evaluate(()=>window.NLDG_CONTENT?.map(item=>item.title)||[]);
  check(!publicTitles.includes('Respecting Boundaries'),'Under-review Respecting Boundaries remains outside the public catalog.','Respecting Boundaries was exposed while loading supplemental study catalogs.');

  await context.close();
}finally{
  await browser.close();
}

console.log(`# My Journey Study Completion Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${passes.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
