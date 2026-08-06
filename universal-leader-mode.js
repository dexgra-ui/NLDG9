(()=>{
if(window.NLDG_UNIVERSAL_LEADER_MODE_LOADED)return;
window.NLDG_UNIVERSAL_LEADER_MODE_LOADED=true;

const page=location.pathname.split('/').pop()||'index.html';
const pageWithQuery=page+location.search;
const excluded=new Set([
 'index.html','studies.html','study-library.html','current-events-series.html','james-series.html',
 'women-of-faith.html','men-of-faith.html','marriage-family.html','difficult-questions.html',
 'leadership.html','sunday-school.html','technology-ai.html','ministry-tools.html','dashboard.html'
]);
const individualType=item=>/study|lesson/i.test(String(item?.type||''))&&!/collection|library|series/i.test(String(item?.type||''));
const findItem=()=>{
 const items=window.NLDG_CONTENT||window.NLDG_LIBRARY||[];
 return items.find(item=>item.url===pageWithQuery)||items.find(item=>item.url===page)||items.find(item=>item.id===document.body.dataset.studyPage);
};
const addStyle=href=>{
 if([...document.styleSheets].some(sheet=>sheet.href?.includes(href.split('?')[0])))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
};
const loadScript=src=>new Promise((resolve,reject)=>{
 const base=src.split('?')[0];
 const existing=[...document.scripts].find(script=>script.src.includes(base));
 if(existing){resolve();return;}
 const script=document.createElement('script');script.src=src;script.async=false;script.onload=resolve;script.onerror=reject;document.body.appendChild(script);
});
const eligible=item=>{
 if(!item||!individualType(item))return false;
 if(excluded.has(page)&&!(page==='current-events-series.html'&&location.search))return false;
 if(!document.querySelector('main'))return false;
 return Boolean(document.querySelector('.lesson-wrap,.study-content,.wof-study-content,.mof-study-content,.mf-study-content,article'));
};
const boot=async()=>{
 if(document.querySelector('.study-view-controls,#expanded-leader-guide'))return;
 const item=findItem();
 if(!eligible(item))return;
 document.body.dataset.studyPage=document.body.dataset.studyPage||item.id;
 document.body.dataset.studyTitle=document.body.dataset.studyTitle||item.title||'';
 document.body.dataset.studySeries=document.body.dataset.studySeries||item.series||'';
 addStyle('expanded-leader-guide.css?v=1.1.0');
 addStyle('teaching-dashboard.css?v=1.0.0');
 addStyle('teaching-notebook.css?v=1.0.0');
 addStyle('presentation-mode.css?v=1.0.0');
 addStyle('leader-resource-drawer.css?v=1.0.0');
 addStyle('scripture-study-panel.css?v=1.0.0');
 addStyle('discussion-manager.css?v=1.0.0');
 addStyle('print-center.css?v=1.0.0');
 addStyle('teaching-analytics.css?v=1.0.0');
 try{
  await loadScript('leader-guide-data.js?v=1.1.0');
  await loadScript('expanded-leader-guide.js?v=1.2.0');
  await loadScript('teaching-analytics.js?v=1.0.0');
  await loadScript('teaching-dashboard.js?v=1.1.0');
  await loadScript('teaching-notebook.js?v=1.1.0');
  await loadScript('scripture-study-data.js?v=7.2.0');
  await loadScript('scripture-study-panel.js?v=1.0.0');
  await loadScript('discussion-manager.js?v=1.0.0');
  await loadScript('leader-resource-drawer.js?v=1.0.0');
  await loadScript('print-center.js?v=1.0.0');
  await loadScript('presentation-mode.js?v=1.1.0');
 }catch(error){console.warn('Universal Leader Mode could not load.',error);}
};

if(window.NLDG_CONTENT||window.NLDG_LIBRARY)boot();
window.addEventListener('nldg-library-ready',boot);
window.addEventListener('load',()=>setTimeout(boot,0),{once:true});
setTimeout(boot,800);
})();
