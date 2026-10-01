import process from 'node:process';
import { webkit } from 'playwright';

const BASE_URL=process.env.AUDIT_BASE_URL||'http://127.0.0.1:4173';
const failures=[];
const passes=[];
const expect=(condition,ok,bad)=>condition?passes.push(ok):failures.push(bad);
const browser=await webkit.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});

try{
  const response=await page.goto(`${BASE_URL}/current-events-series.html?week=1`,{waitUntil:'networkidle',timeout:30000});
  expect(response&&response.status()<400,'Week 1 loads in WebKit.',`Week 1 returned HTTP ${response?.status()??'no response'} in WebKit.`);
  await page.waitForSelector('#v2-print-surface',{state:'attached',timeout:10000});

  const prebuilt=await page.evaluate(()=>{
    const surface=document.querySelector('#v2-print-surface');
    const participant=document.querySelector('#v2-print-surface [data-v2-packet="participant"]');
    const header=participant?.querySelector('.v2-print-surface-header h1');
    const surfaceStyle=surface?getComputedStyle(surface):null;
    const headerRect=header?.getBoundingClientRect();
    return{
      packetNames:[...document.querySelectorAll('#v2-print-surface [data-v2-packet]')].map(node=>node.dataset.v2Packet),
      participantText:(participant?.innerText||'').replace(/\s+/g,' ').trim(),
      surfaceDisplay:surfaceStyle?.display||'missing',
      surfacePosition:surfaceStyle?.position||'missing',
      surfaceLeft:surface?.getBoundingClientRect().left??0,
      surfaceAriaHidden:surface?.getAttribute('aria-hidden')||'',
      headerWidth:headerRect?.width||0,
      headerHeight:headerRect?.height||0
    };
  });
  expect(JSON.stringify(prebuilt.packetNames)===JSON.stringify(['participant','leader','teaching']),'WebKit sees all three print packets before the user taps Print.',`Prebuilt packet order was ${JSON.stringify(prebuilt.packetNames)}.`);
  expect(prebuilt.participantText.length>1200,'The prebuilt participant packet already contains substantial lesson text.',`Prebuilt participant packet contained only ${prebuilt.participantText.length} text characters.`);
  expect(prebuilt.surfaceDisplay!=='none'&&prebuilt.surfacePosition==='fixed'&&prebuilt.surfaceLeft<-1000&&prebuilt.headerWidth>0&&prebuilt.headerHeight>0,'WebKit lays out the offscreen packet before the print tap.',`Pre-print surface display=${prebuilt.surfaceDisplay}, position=${prebuilt.surfacePosition}, left=${Math.round(prebuilt.surfaceLeft)}, header=${Math.round(prebuilt.headerWidth)}x${Math.round(prebuilt.headerHeight)}.`);
  expect(prebuilt.surfaceAriaHidden==='true','The prebuilt packet is excluded from normal screen accessibility/layout audits before printing.',`Pre-print aria-hidden was ${prebuilt.surfaceAriaHidden||'missing'}.`);

  await page.locator('.v2-view-tabs [data-view="print"]').click();
  await page.evaluate(()=>{window.__v2PrintCalls=0;window.print=()=>{window.__v2PrintCalls+=1}});
  await page.locator('[data-v2-print="participant"]').click();
  const immediate=await page.evaluate(()=>({calls:window.__v2PrintCalls,mode:document.body.dataset.v2Print||'',surfaceAriaHidden:document.querySelector('#v2-print-surface')?.getAttribute('aria-hidden')||''}));
  expect(immediate.calls===1,'Participant printing remains inside the user tap in WebKit.',`WebKit saw ${immediate.calls} print calls.`);
  expect(immediate.mode==='participant','Participant print mode is active in WebKit.',`WebKit print mode was ${immediate.mode||'unset'}.`);
  expect(immediate.surfaceAriaHidden==='','The print tap exposes the prebuilt packet to WebKit before window.print().',`WebKit print surface still had aria-hidden=${immediate.surfaceAriaHidden}.`);

  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  const afterprintText=await page.locator('#v2-print-surface [data-v2-packet="participant"]').innerText().catch(()=>'');
  expect(afterprintText.trim().length>1200,'An early WebKit afterprint event leaves the prebuilt packet intact.',`Only ${afterprintText.trim().length} participant characters remained after afterprint.`);

  await page.emulateMedia({media:'print'});
  const printState=await page.evaluate(()=>{
    const surface=document.querySelector('#v2-print-surface');
    const participant=document.querySelector('#v2-print-surface [data-v2-packet="participant"]');
    const leader=document.querySelector('#v2-print-surface [data-v2-packet="leader"]');
    const teaching=document.querySelector('#v2-print-surface [data-v2-packet="teaching"]');
    const firstSection=participant?.querySelector('section');
    const candidates=[...participant?.querySelectorAll('h1,h2,h3,h4,p,li,strong,span')||[]];
    const textNodes=candidates.filter(node=>{
      const style=getComputedStyle(node);const rect=node.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)>0&&rect.width>0&&rect.height>0&&(node.textContent||'').trim();
    });
    const sample=textNodes[0]||candidates.find(node=>(node.textContent||'').trim())||null;
    const sampleStyle=sample?getComputedStyle(sample):null;
    const sampleRect=sample?.getBoundingClientRect();
    return{
      surfaceDisplay:surface?getComputedStyle(surface).display:'missing',
      participantDisplay:participant?getComputedStyle(participant).display:'missing',
      leaderDisplay:leader?getComputedStyle(leader).display:'missing',
      teachingDisplay:teaching?getComputedStyle(teaching).display:'missing',
      mainDisplay:getComputedStyle(document.querySelector('main')).display,
      participantHeight:participant?.getBoundingClientRect().height||0,
      visibleTextCount:textNodes.length,
      firstTextColor:sampleStyle?.color||'missing',
      firstTextFill:sampleStyle?.webkitTextFillColor||'missing',
      firstTextDisplay:sampleStyle?.display||'missing',
      firstTextVisibility:sampleStyle?.visibility||'missing',
      firstTextOpacity:sampleStyle?.opacity||'missing',
      firstTextWidth:sampleRect?.width||0,
      firstTextHeight:sampleRect?.height||0,
      sectionBreakInside:firstSection?getComputedStyle(firstSection).breakInside:'missing',
      sectionPageBreakInside:firstSection?getComputedStyle(firstSection).pageBreakInside:'missing'
    };
  });
  expect(printState.surfaceDisplay!=='none'&&printState.participantDisplay!=='none','WebKit print media shows the participant print surface.','WebKit hid the participant print surface.');
  expect(printState.leaderDisplay==='none'&&printState.teachingDisplay==='none','WebKit participant mode hides the other prebuilt packets.',`WebKit showed leader=${printState.leaderDisplay}, teaching=${printState.teachingDisplay}.`);
  expect(printState.mainDisplay==='none','WebKit print media excludes the live webpage.',`WebKit main display was ${printState.mainDisplay}.`);
  expect(printState.participantHeight>1000&&printState.visibleTextCount>20,'WebKit lays out substantial visible participant content.',`WebKit participant height=${Math.round(printState.participantHeight)}, visible text nodes=${printState.visibleTextCount}; sample display=${printState.firstTextDisplay}, visibility=${printState.firstTextVisibility}, opacity=${printState.firstTextOpacity}, rect=${Math.round(printState.firstTextWidth)}x${Math.round(printState.firstTextHeight)}.`);
  expect((printState.firstTextColor==='rgb(17, 17, 17)'||printState.firstTextColor==='rgb(0, 0, 0)')&&(printState.firstTextFill==='rgb(17, 17, 17)'||printState.firstTextFill==='rgb(0, 0, 0)'),'WebKit printable text and text fill are dark.',`WebKit printable color=${printState.firstTextColor}, text-fill=${printState.firstTextFill}.`);
  expect(printState.sectionBreakInside!=='avoid'&&printState.sectionPageBreakInside!=='avoid','Long Faith & Truth sections are allowed to paginate in WebKit.',`WebKit section break rules were break-inside=${printState.sectionBreakInside}, page-break-inside=${printState.sectionPageBreakInside}.`);
}finally{
  await browser.close();
}

console.log(`# Faith & Truth WebKit Print Audit\n\nResult: ${failures.length?'FAILED':'PASSED'}\n\n${passes.map(item=>`PASS: ${item}`).join('\n')}${failures.length?`\n\n${failures.map(item=>`FAIL: ${item}`).join('\n')}`:''}`);
if(failures.length)process.exitCode=1;
