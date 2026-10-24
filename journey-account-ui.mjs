import { journeyClient } from './journey-supabase-client.mjs';
const status=document.getElementById('journey-account-status');
const state=document.getElementById('journey-account-state');
const form=document.getElementById('journey-account-form');
const show=(message)=>{status.textContent=message;};
async function render(){
  try {
    const {data,error}=await journeyClient.auth.getUser();
    if(error && error.name!=='AuthSessionMissingError') throw error;
    if(data?.user){
      state.replaceChildren();
      const p=document.createElement('p');p.textContent='Signed in as '+(data.user.email||'your account');
      const button=document.createElement('button');button.type='button';button.className='button secondary';button.textContent='Sign out';
      button.addEventListener('click',async()=>{
        button.disabled=true;
        const {error}=await journeyClient.auth.signOut();
        if(error){show('Unable to sign out. Please try again.');button.disabled=false;return;}
        show('Signed out. Your saved browser data has not been deleted.');
        window.location.reload();
      });
      form.hidden=true;verifyForm.hidden=true;state.append(p,button);
      show('Account connected. Cross-device progress sync is not enabled yet.');
    }
  } catch {show('Account status is unavailable. You can still use My Journey without signing in.');}
}
let pendingEmail='';
const verifyForm=document.createElement('form');
verifyForm.hidden=true;
verifyForm.setAttribute('aria-label','Verify email sign-in code');
verifyForm.innerHTML='<label for="journey-account-code">Six-digit email code</label><input id="journey-account-code" name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="123456"><button type="submit" class="button primary">Verify code</button>';
form?.insertAdjacentElement('afterend',verifyForm);
verifyForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const code=verifyForm.querySelector('input').value.trim();
  if(!pendingEmail||!/^[0-9]{6}$/.test(code)){show('Enter the six-digit code from your email.');return;}
  const button=verifyForm.querySelector('button');button.disabled=true;
  show('Verifying your code…');
  try{
    const {error}=await journeyClient.auth.verifyOtp({email:pendingEmail,token:code,type:'email'});
    if(error)throw error;
    verifyForm.hidden=true;form.hidden=true;pendingEmail='';
    show('Signed in successfully.');await render();
  }catch{show('Code could not be verified. Check the latest email or request a new code.');}
  finally{button.disabled=false;}
});
form?.addEventListener('submit',async event=>{
  event.preventDefault();
  const email=document.getElementById('journey-account-email').value.trim().toLowerCase();
  const button=form.querySelector('button');button.disabled=true;
  show('Requesting your secure email code…');
  try{
    const {error}=await journeyClient.auth.signInWithOtp({
      email,
      options:{emailRedirectTo:new URL('journey-auth.html',location.href).href,shouldCreateUser:true}
    });
    if(error)throw error;
    pendingEmail=email;verifyForm.hidden=false;verifyForm.querySelector('input').focus();
    show('Check your inbox for the six-digit sign-in code, then enter it here.');
  }catch{show('Could not send a sign-in code. Please try again later.');}
  finally{button.disabled=false;}
});
journeyClient.auth.onAuthStateChange(()=>{setTimeout(render,0);});
render();


/* Explicit, device-to-device backup. No journal, prayer, reflection, or profile data. */
const backupPanel=document.createElement('section');
backupPanel.setAttribute('aria-label','Progress backup and restore');
backupPanel.innerHTML='<h3>Move your progress between devices</h3><p>Download a backup of study completion, favorites, and reading plans. Restore it on your other device. This is manual, not automatic sync. Private notes, prayers, and reflections are excluded.</p><button type="button" class="button secondary" id="journey-backup">Back Up Progress</button> <button type="button" class="button secondary" id="journey-restore">Restore Progress</button><input type="file" id="journey-restore-file" accept="application/json,.json" hidden><p id="journey-transfer-status" role="status"></p>';
document.querySelector('.journey-account')?.append(backupPanel);
const transferStatus=backupPanel.querySelector('#journey-transfer-status');
const transferKeys=['nldg-completed-v1','nldg-favorites-v1','nldg-plans-v1','nldg-study-state'];
const isProgressKey=k=>/^nldg-(?:book-|series-)[a-z0-9-]+$/.test(k)&&!/(prayer|note|journal|reflection|private)/.test(k);
const safeRead=k=>{try{return JSON.parse(localStorage.getItem(k));}catch{return null;}};
const mergeProgress=(oldValue,newValue)=>{
  if(Array.isArray(oldValue)&&Array.isArray(newValue)){
    const all=[...oldValue,...newValue];
    const seen=new Set();
    return all.filter(item=>{const id=typeof item==='object'&&item!==null?(item.id??JSON.stringify(item)):JSON.stringify(item);if(seen.has(id))return false;seen.add(id);return true;});
  }
  if(oldValue&&newValue&&typeof oldValue==='object'&&typeof newValue==='object'&&!Array.isArray(oldValue)&&!Array.isArray(newValue)){
    const out={...newValue,...oldValue};
    for(const key of Object.keys(newValue)){
      if(key==='completed'&&Array.isArray(newValue[key])&&Array.isArray(oldValue[key]))out[key]=mergeProgress(oldValue[key],newValue[key]);
      else if(key in oldValue&&oldValue[key]&&newValue[key]&&typeof oldValue[key]==='object'&&typeof newValue[key]==='object')out[key]=mergeProgress(oldValue[key],newValue[key]);
    }
    return out;
  }
  return oldValue??newValue;
};
backupPanel.querySelector('#journey-backup').addEventListener('click',()=>{
  const keys=[...transferKeys,...Object.keys(localStorage).filter(isProgressKey)];
  const data={format:'nldg-progress-backup',version:1,created:new Date().toISOString(),items:{}};
  keys.forEach(key=>{const value=safeRead(key);if(value!==null)data.items[key]=value;});
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='nldg-progress-backup.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  transferStatus.textContent='Backup downloaded. Keep the file private and open it on your other device to restore.';
});
const fileInput=backupPanel.querySelector('#journey-restore-file');
backupPanel.querySelector('#journey-restore').addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',async()=>{
  const file=fileInput.files?.[0];if(!file)return;
  try{
    if(file.size>1024*1024)throw Error('Backup file is too large.');
    const data=JSON.parse(await file.text());
    if(data?.format!=='nldg-progress-backup'||data.version!==1||!data.items||typeof data.items!=='object'||Array.isArray(data.items))throw Error('Not a supported NLDG progress backup.');
    const entries=Object.entries(data.items).filter(([k])=>transferKeys.includes(k)||isProgressKey(k));
    if(!entries.length)throw Error('No supported progress found.');
    const changes=entries.map(([k,v])=>[k,JSON.stringify(mergeProgress(safeRead(k),v))]);
    if(!confirm('Merge '+changes.length+' progress records into this device? Existing completion and favorites will be kept. Private notes and prayers will not be touched.'))return;
    changes.forEach(([k,v])=>localStorage.setItem(k,v));
    transferStatus.textContent='Progress restored. Reloading to update your dashboard.';
    location.reload();
  }catch(error){transferStatus.textContent='Restore failed: '+error.message;}
  finally{fileInput.value='';}
});
