(()=>{
const STORAGE_KEY='nldg-leadership-toolkit-v1';
const tools=[...document.querySelectorAll('.ltk-tool[data-tool]')];
if(!tools.length)return;
const readState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return {}}};
const writeState=state=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(error){console.warn('Leadership Toolkit could not be saved.',error)}};
const state=readState();
const fieldsFor=tool=>[...tool.querySelectorAll('[data-field]')];
const valueOf=field=>field.type==='checkbox'?field.checked:field.value;
const setValue=(field,value)=>{if(field.type==='checkbox')field.checked=Boolean(value);else field.value=value??''};
const statusFor=tool=>tool.querySelector('.ltk-status');
const setStatus=(tool,message,tone='saved')=>{const status=statusFor(tool);if(!status)return;status.textContent=message;status.dataset.tone=tone;clearTimeout(status._timer);if(message)status._timer=setTimeout(()=>{status.textContent=''},2600)};
const toolState=id=>state[id]||{};
const refreshProgress=()=>{
 const complete=tools.filter(tool=>tool.dataset.complete==='true').length;
 const label=document.getElementById('toolkitProgressLabel');
 const bar=document.getElementById('toolkitProgressBar');
 if(label)label.textContent=`${complete} of ${tools.length} tools marked complete`;
 if(bar)bar.style.width=`${complete/tools.length*100}%`;
};
const saveTool=tool=>{
 const id=tool.dataset.tool;
 const values={};
 fieldsFor(tool).forEach(field=>values[field.dataset.field]=valueOf(field));
 state[id]={...(state[id]||{}),values,complete:tool.dataset.complete==='true',updated:Date.now()};
 writeState(state);
 setStatus(tool,'Saved on this device.');
 refreshProgress();
};
const restoreTool=tool=>{
 const saved=toolState(tool.dataset.tool);
 const values=saved.values||{};
 fieldsFor(tool).forEach(field=>{if(Object.prototype.hasOwnProperty.call(values,field.dataset.field))setValue(field,values[field.dataset.field])});
 tool.dataset.complete=saved.complete?'true':'false';
 const completeButton=tool.querySelector('[data-action="complete"]');
 if(completeButton){completeButton.setAttribute('aria-pressed',String(Boolean(saved.complete)));completeButton.textContent=saved.complete?'✓ Marked Complete':'Mark Complete'}
};
tools.forEach(tool=>{
 restoreTool(tool);
 fieldsFor(tool).forEach(field=>field.addEventListener('input',()=>setStatus(tool,'Unsaved changes','unsaved')));
 tool.querySelector('[data-action="save"]')?.addEventListener('click',()=>saveTool(tool));
 tool.querySelector('[data-action="complete"]')?.addEventListener('click',event=>{
   const next=tool.dataset.complete!=='true';
   tool.dataset.complete=String(next);
   event.currentTarget.setAttribute('aria-pressed',String(next));
   event.currentTarget.textContent=next?'✓ Marked Complete':'Mark Complete';
   saveTool(tool);
 });
 tool.querySelector('[data-action="clear"]')?.addEventListener('click',()=>{
   if(!confirm('Clear the saved information for this Leadership Toolkit section?'))return;
   fieldsFor(tool).forEach(field=>setValue(field,field.type==='checkbox'?false:''));
   tool.dataset.complete='false';
   const completeButton=tool.querySelector('[data-action="complete"]');
   if(completeButton){completeButton.setAttribute('aria-pressed','false');completeButton.textContent='Mark Complete'}
   delete state[tool.dataset.tool];writeState(state);setStatus(tool,'Section cleared.');refreshProgress();
 });
 tool.querySelector('[data-action="print"]')?.addEventListener('click',()=>{
   document.body.dataset.printTool=tool.dataset.tool;
   window.print();
 });
});
window.addEventListener('afterprint',()=>delete document.body.dataset.printTool);
document.getElementById('saveAllToolkit')?.addEventListener('click',()=>{tools.forEach(saveTool);const status=document.getElementById('toolkitGlobalStatus');if(status){status.textContent='All six tools saved on this device.';setTimeout(()=>status.textContent='',2600)}});
document.getElementById('clearAllToolkit')?.addEventListener('click',()=>{
 if(!confirm('Clear all saved Leadership Toolkit information from this device?'))return;
 localStorage.removeItem(STORAGE_KEY);
 tools.forEach(tool=>{fieldsFor(tool).forEach(field=>setValue(field,field.type==='checkbox'?false:''));tool.dataset.complete='false';const button=tool.querySelector('[data-action="complete"]');if(button){button.setAttribute('aria-pressed','false');button.textContent='Mark Complete'}});
 Object.keys(state).forEach(key=>delete state[key]);refreshProgress();
 const status=document.getElementById('toolkitGlobalStatus');if(status)status.textContent='All saved toolkit information cleared.';
});
refreshProgress();
})();
