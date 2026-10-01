import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const checks=[];
const expect=(condition,success,failure)=>{if(condition)checks.push(success);else failures.push(failure)};

const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));

async function open(name,url){
  errors.length=0;
  const response=await page.goto(`${BASE_URL}/${url}`,{waitUntil:'domcontentloaded',timeout:30000});
  expect(response&&response.status()<400,`${name} returned successfully.`,`${name} returned HTTP ${response?.status()??'no response'}.`);
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(300);
  expect(errors.length===0,`${name} loaded without page errors.`,`${name} page errors: ${errors.join(' | ')}`);
}

async function checkCoverage(name,url,{spanish=false,leaderPhrase=''}={}){
  await open(name,url);
  await page.waitForSelector('.coverage-print-tools',{timeout:5000}).catch(()=>{});
  const tools=page.locator('.coverage-print-tools');
  expect((await tools.count())===1,`${name} exposes one smart print control.`,`${name} is missing the smart print control.`);
  if((await tools.count())!==1)return;

  const summaryText=(await tools.locator('summary').innerText()).trim();
  expect(summaryText===(spanish?'Imprimir':'Print'),`${name} uses the expected print label.`,`${name} print label was “${summaryText}”.`);
  await page.evaluate(()=>{window.__coveragePrintCalls=0;window.print=()=>{window.__coveragePrintCalls+=1}});

  await tools.locator('summary').click();
  const choices=await tools.locator('[data-coverage-print]').allInnerTexts();
  const expectedChoices=spanish?['Guía del participante','Guía para líderes','Imprimir ambos']:['Participant Handout','Leader Guide','Print Both'];
  expect(JSON.stringify(choices)===JSON.stringify(expectedChoices),`${name} offers participant, leader, and combined printing.`,`${name} choices were ${choices.join(' | ')}.`);

  await tools.locator('[data-coverage-print="participant"]').click();
  const participantCalls=await page.evaluate(()=>window.__coveragePrintCalls);
  expect(participantCalls===1,`${name} invokes participant printing directly from the tap.`,`${name} participant print did not invoke synchronously.`);
  await page.waitForTimeout(50);
  const participant=page.locator('#study-print-coverage-surface .coverage-participant');
  expect((await participant.count())===1,`${name} builds a participant packet.`,`${name} did not build a participant packet.`);
  const participantText=await participant.innerText().catch(()=>'');
  expect(!/Leader depth note|Parent \/ Teacher Note|Leader Guidance|Nota de profundidad para líderes/i.test(participantText),`${name} participant packet removes leader-only notes.`,`${name} participant packet exposed leader-only notes.`);
  expect((await participant.locator('.coverage-answer-lines').count())>0,`${name} participant packet includes writing space.`,`${name} participant packet is missing writing space.`);
  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  expect((await participant.count())===1,`${name} preserves its packet if afterprint fires early on iOS.`,`${name} removed its packet after an early afterprint event.`);
  await page.emulateMedia({media:'print'});
  const visibility=await page.evaluate(()=>({surface:getComputedStyle(document.querySelector('#study-print-coverage-surface')).display,main:getComputedStyle(document.querySelector('main')).display}));
  expect(visibility.surface!=='none'&&visibility.main==='none',`${name} print media isolates the generated packet.`,`${name} print media did not isolate the generated packet.`);
  await page.emulateMedia({media:'screen'});

  await tools.locator('summary').click();
  await tools.locator('[data-coverage-print="leader"]').click();
  await page.waitForTimeout(50);
  const leader=page.locator('#study-print-coverage-surface .coverage-leader');
  expect((await leader.count())===1,`${name} builds a leader packet.`,`${name} did not build a leader packet.`);
  const leaderText=await leader.innerText().catch(()=>'');
  if(leaderPhrase)expect(leaderText.includes(leaderPhrase),`${name} leader packet preserves its leader-specific material.`,`${name} leader packet is missing “${leaderPhrase}”.`);

  await tools.locator('summary').click();
  await tools.locator('[data-coverage-print="both"]').click();
  await page.waitForTimeout(50);
  expect((await page.locator('#study-print-coverage-surface .coverage-print-packet').count())===2,`${name} Print Both builds two packets.`,`${name} Print Both did not build participant and leader packets.`);
  const calls=await page.evaluate(()=>window.__coveragePrintCalls);
  expect(calls===3,`${name} invokes the browser print flow for all three choices.`,`${name} invoked print ${calls} times instead of 3.`);
}

async function checkUnifiedPrintCenter(){
  const name='faith-truth-unified-print';
  await open(name,'current-events-series.html?week=1');
  await page.waitForSelector('.print-center-launch',{timeout:5000}).catch(()=>{});
  const launch=page.locator('.print-center-launch');
  expect((await launch.count())===1,'Faith & Truth exposes the Unified Print Center.','Faith & Truth is missing the Unified Print Center launch control.');
  if((await launch.count())!==1)return;
  await page.evaluate(()=>{window.__unifiedPrintCalls=0;window.print=()=>{window.__unifiedPrintCalls+=1}});
  await launch.click();
  await page.locator('[data-print-preset="participant"]').click();
  await page.locator('[data-print-now]').click();
  await page.waitForTimeout(50);
  expect((await page.locator('.nldg-print-packet').count())===1,'Faith & Truth builds the Unified Print Center packet.','Faith & Truth did not build a print packet.');
  expect((await page.locator('.print-packet-participant').count())===1,'Faith & Truth packet includes participant content.','Faith & Truth packet is missing participant content.');
  expect((await page.evaluate(()=>window.__unifiedPrintCalls))===1,'Faith & Truth invokes browser printing directly from the print action.','Faith & Truth did not invoke browser printing directly.');
  await page.emulateMedia({media:'print'});
  const printState=await page.evaluate(()=>{
    const packet=document.querySelector('.nldg-print-packet');
    const cover=document.querySelector('.print-packet-cover');
    const logo=cover?.querySelector('img');
    const coverStyle=cover?getComputedStyle(cover):null;
    const logoStyle=logo?getComputedStyle(logo):null;
    const colored=[...document.querySelectorAll('.nldg-print-packet *')].filter(node=>{
      const bg=getComputedStyle(node).backgroundColor;
      return bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'&&bg!=='rgb(255, 255, 255)';
    }).slice(0,8).map(node=>({tag:node.tagName,className:node.className,bg:getComputedStyle(node).backgroundColor}));
    return {
      packetDisplay:packet?getComputedStyle(packet).display:'missing',
      mainDisplay:getComputedStyle(document.querySelector('main')).display,
      coverHeight:cover?.getBoundingClientRect().height||0,
      coverBreakAfter:coverStyle?.breakAfter||'',
      logoDisplay:logoStyle?.display||'missing',
      colored
    };
  });
  expect(printState.packetDisplay!=='none'&&printState.mainDisplay==='none','Faith & Truth print media isolates the generated packet.','Faith & Truth print media did not isolate the generated packet.');
  expect(printState.logoDisplay==='none','Faith & Truth hides the raster logo in print to prevent iPhone page overflow.',`Faith & Truth print logo display was ${printState.logoDisplay}.`);
  expect(printState.coverHeight<400,'Faith & Truth uses a compact print-safe title block instead of a full decorative cover page.',`Faith & Truth print cover height was ${Math.round(printState.coverHeight)}px.`);
  expect(printState.coverBreakAfter!=='page','Faith & Truth no longer forces a page break after the title block.','Faith & Truth still forces a page break after the title block.');
  expect(printState.colored.length===0,'Faith & Truth strips dark/blue decorative backgrounds from printed packet content.',`Faith & Truth retained colored print backgrounds: ${JSON.stringify(printState.colored)}.`);
  await page.emulateMedia({media:'screen'});
}

try{
  await checkCoverage('walking-with-jesus','walking-with-jesus-study.html?week=3',{leaderPhrase:'Leader depth note'});
  await checkCoverage('growing-with-jesus','growing-with-jesus-god-made-me-on-purpose.html',{leaderPhrase:'Parent / Teacher Note'});
  await checkCoverage('following-jesus-for-yourself','following-jesus-for-yourself-known-by-god.html');
  await checkCoverage('preparing-to-walk','preparing-walk-with-jesus.html?lesson=3');
  await checkCoverage('cross-empty-tomb','cross-empty-tomb.html?lesson=1',{leaderPhrase:'Leader depth note'});
  await checkCoverage('walking-with-jesus-spanish','es/caminando-con-jesus-estudio.html?week=3',{spanish:true,leaderPhrase:'Nota de profundidad para líderes'});
  await checkUnifiedPrintCenter();

  await open('book-by-book-control','revelation-study.html?lesson=1');
  expect((await page.locator('.lesson-print-tools').count())===1,'Book-by-Book keeps its existing smart print control.','Book-by-Book lost its existing smart print control.');
  expect((await page.locator('.coverage-print-tools').count())===0,'The coverage bridge does not duplicate Book-by-Book printing.','The coverage bridge duplicated the Book-by-Book print control.');
}finally{
  await browser.close();
}

console.log(`# Study Print Coverage Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${checks.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
