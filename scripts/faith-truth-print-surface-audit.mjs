import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const pass=[];
const expect=(condition,ok,bad)=>condition?pass.push(ok):failures.push(bad);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});

try{
  const response=await page.goto(`${BASE_URL}/current-events-series.html?week=1`,{waitUntil:'networkidle',timeout:30000});
  expect(response&&response.status()<400,'Week 1 loaded successfully.',`Week 1 returned HTTP ${response?.status()??'no response'}.`);
  await page.waitForSelector('.v2-view-tabs [data-view="print"]',{state:'visible',timeout:10000});
  await page.locator('.v2-view-tabs [data-view="print"]').click();
  await page.evaluate(()=>{window.__v2PrintCalls=0;window.print=()=>{window.__v2PrintCalls+=1}});

  const participantButton=page.locator('[data-v2-print="participant"]');
  await participantButton.click();
  const screenState=await page.evaluate(()=>{
    const surface=document.querySelector('#v2-print-surface');
    const packet=surface?.querySelector('[data-v2-packet="participant"]');
    const original=document.querySelector('.series-lesson > .v2-participant-guide');
    return{
      calls:window.__v2PrintCalls,
      mode:document.body.dataset.v2Print||'',
      surfaceExists:Boolean(surface),
      packetExists:Boolean(packet),
      packetText:(packet?.innerText||'').replace(/\s+/g,' ').trim(),
      originalHidden:Boolean(original?.hidden)
    };
  });
  expect(screenState.calls===1,'Participant print invokes the browser print flow once.',`Participant print invoked the browser ${screenState.calls} times.`);
  expect(screenState.mode==='participant','Participant print mode is set before printing.',`Print mode was ${screenState.mode||'unset'}.`);
  expect(screenState.surfaceExists&&screenState.packetExists,'Participant printing builds a dedicated print surface.','Dedicated participant print surface was not built.');
  expect(screenState.packetText.length>1200,'Participant print surface contains substantial lesson text.',`Participant print surface contained only ${screenState.packetText.length} text characters.`);
  expect(/Participant Guide/i.test(screenState.packetText)&&/Faith & Truth/i.test(screenState.packetText),'Participant print surface includes packet identity and series text.','Participant print surface is missing its packet identity or series text.');
  expect(screenState.originalHidden,'The live participant tab can remain hidden while its print copy is available.','The audit did not reproduce the hidden-live-panel state from the Print tab.');

  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  const afterprintLength=await page.locator('#v2-print-surface [data-v2-packet="participant"]').innerText().then(text=>text.trim().length).catch(()=>0);
  expect(afterprintLength>1200,'An early afterprint event does not clear the dedicated packet.',`Dedicated packet was cleared after afterprint (${afterprintLength} characters remain).`);

  await page.emulateMedia({media:'print'});
  const printState=await page.evaluate(()=>{
    const surface=document.querySelector('#v2-print-surface');
    const packet=surface?.querySelector('[data-v2-packet="participant"]');
    const main=document.querySelector('main');
    const rect=packet?.getBoundingClientRect();
    const textNode=packet?.querySelector('p,li,h2,h3');
    return{
      surfaceDisplay:surface?getComputedStyle(surface).display:'missing',
      mainDisplay:main?getComputedStyle(main).display:'missing',
      packetDisplay:packet?getComputedStyle(packet).display:'missing',
      packetHeight:rect?.height||0,
      packetColor:textNode?getComputedStyle(textNode).color:'missing',
      bodyBackground:getComputedStyle(document.body).backgroundColor
    };
  });
  expect(printState.surfaceDisplay!=='none'&&printState.packetDisplay!=='none','Print media shows the dedicated participant packet.','Dedicated participant packet is hidden in print media.');
  expect(printState.mainDisplay==='none','Print media hides the live webpage and prints only the dedicated surface.',`Live main content display is ${printState.mainDisplay} in print media.`);
  expect(printState.packetHeight>500,'Dedicated participant packet has measurable printable height.',`Dedicated participant packet height was only ${Math.round(printState.packetHeight)}px.`);
  expect(printState.packetColor==='rgb(17, 17, 17)'||printState.packetColor==='rgb(0, 0, 0)','Printable lesson text is dark rather than invisible white.',`Printable text color was ${printState.packetColor}.`);
  expect(printState.bodyBackground==='rgb(255, 255, 255)','Print canvas is white.',`Print canvas background was ${printState.bodyBackground}.`);
  await page.emulateMedia({media:'screen'});

  await page.locator('[data-v2-print="all"]').click();
  const allState=await page.evaluate(()=>({calls:window.__v2PrintCalls,packets:[...document.querySelectorAll('#v2-print-surface .v2-print-surface-packet')].map(node=>node.dataset.v2Packet)}));
  expect(allState.calls===2,'Complete Package invokes a second print flow.',`Expected 2 total print calls after Complete Package, found ${allState.calls}.`);
  expect(JSON.stringify(allState.packets)===JSON.stringify(['participant','leader','teaching']),'Complete Package builds participant, leader, and teaching packets.','Complete Package did not build all three packets in order.');
}finally{
  await browser.close();
}

console.log(`# Faith & Truth Dedicated Print Surface Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${pass.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
