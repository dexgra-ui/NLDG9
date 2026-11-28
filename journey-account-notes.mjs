import { journeyClient } from './journey-supabase-client.mjs';

// Stage 2: account-scoped journal notes only. Existing local notes are never
// uploaded or deleted without an explicit per-note import selection.
const TABLE='journey_private_entries';
const localNotes=()=>Array.isArray(window.NLDG_PERSONAL?.notes?.())?window.NLDG_PERSONAL.notes():[];
let generation=0;
let current={mode:'loading',userId:null,notes:[],message:'Checking your account…'};

const publish=next=>{
  current=next;
  document.dispatchEvent(new CustomEvent('nldg:account-notes-state',{detail:next}));
};
const errorMessage='Account notes are unavailable. No browser notes were uploaded or erased. Please try again.';
const normalizeText=(value,max=20000)=>String(value??'').slice(0,max);
const normalizeNote=note=>({
  title:normalizeText(note.title,240),
  journal:normalizeText(note.journal),
  prayer:normalizeText(note.prayer),
  questions:normalizeText(note.questions),
  scriptures:normalizeText(note.scriptures,4000),
  contentId:normalizeText(note.contentId,240)
});
const fromRow=row=>{
  const body=row.body&&typeof row.body==='object'&&!Array.isArray(row.body)?row.body:{};
  return {id:String(row.entry_id),...normalizeNote(body),updatedAt:Date.parse(row.updated_at)||Date.now()};
};
async function resolveUser(){
  const {data,error}=await journeyClient.auth.getUser();
  if(error&&error.name!=='AuthSessionMissingError')throw error;
  return data?.user??null;
}
async function load(){
  const request=++generation;
  publish({mode:'loading',userId:null,notes:[],message:'Checking account notes…'});
  try{
    const user=await resolveUser();
    if(request!==generation)return;
    if(!user){
      publish({mode:'guest',userId:null,notes:[],message:'Notes saved in this browser are not linked to an account.'});
      return;
    }
    const uid=user.id;
    const {data,error}=await journeyClient.from(TABLE)
      .select('entry_id,body,updated_at')
      .eq('user_id',uid).eq('kind','note')
      .order('updated_at',{ascending:false});
    if(request!==generation)return;
    if(error)throw error;
    publish({mode:'account',userId:uid,notes:(data||[]).map(fromRow),message:'Account notes available across devices.'});
  }catch(error){
    if(request!==generation)return;
    console.error('My Journey account notes unavailable',error);
    publish({mode:'error',userId:null,notes:[],message:errorMessage});
  }
}
const owner=async()=>{
  if(current.mode!=='account'||!current.userId)throw Error('Sign in and load your account notes first.');
  const user=await resolveUser();
  if(!user||user.id!==current.userId)throw Error('Your sign-in changed. Reload account notes.');
  return user.id;
};
const requireSuccess=({error})=>{if(error)throw error;};
const withWrite=async work=>{
  const uid=await owner(),request=generation;
  await work(uid);
  if(request!==generation)throw Error('Your account changed while saving. Refresh your account notes.');
  await load();
  if(current.mode!=='account'||current.userId!==uid)throw Error('Could not confirm the saved account note. Refresh and check your notes.');
  return true;
};
async function create(fields){
  return withWrite(async uid=>{
    const entryId='note-'+crypto.randomUUID();
    requireSuccess(await journeyClient.from(TABLE).insert({
      user_id:uid,entry_id:entryId,kind:'note',body:normalizeNote(fields)
    }));
  });
}
async function remove(id){
  return withWrite(async uid=>{
    const entryId=String(id);
    if(!entryId||entryId.length>200)throw Error('Invalid note identifier.');
    requireSuccess(await journeyClient.from(TABLE).delete()
      .eq('user_id',uid).eq('kind','note').eq('entry_id',entryId));
  });
}
async function importSelected(ids){
  const values=localNotes();
  const allowed=new Map(values.filter(x=>x&&typeof x.id==='string'&&x.id.length<=180)
    .map(note=>[note.id,note]));
  const selected=[...new Set(ids)].map(id=>allowed.get(id));
  if(!selected.length||selected.some(x=>!x))throw Error('Choose valid notes from this browser.');
  return withWrite(async uid=>{
    const rows=selected.map(note=>({
      user_id:uid,entry_id:note.id,kind:'note',body:normalizeNote(note)
    }));
    // Ignore collisions: an existing account note must never be overwritten
    // by a stale local copy. The local source is also left untouched.
    requireSuccess(await journeyClient.from(TABLE).upsert(rows,{
      onConflict:'user_id,entry_id',ignoreDuplicates:true
    }));
  });
}
window.NLDG_ACCOUNT_NOTES={getState:()=>current,refresh:load,create,remove,importSelected};

const importArea=document.getElementById('note-import-tools');
const importStatus=document.getElementById('note-import-status');
const reviewButton=document.getElementById('note-import-review-button');
const reviewArea=document.getElementById('note-import-review');
const importList=document.getElementById('note-import-list');
const importConfirm=document.getElementById('note-import-confirm');
const importCancel=document.getElementById('note-import-cancel');
const importNotice=document.getElementById('note-import-description');
const setImportStatus=message=>{if(importStatus)importStatus.textContent=message;};
const closeReview=()=>{if(reviewArea)reviewArea.hidden=true;if(importList)importList.replaceChildren();};
function updateImport(){
  const enabled=current.mode==='account';
  if(!importArea)return;
  importArea.hidden=!enabled;
  if(!enabled){closeReview();return;}
  const count=localNotes().length;
  if(importNotice)importNotice.textContent=count
    ?`${count} note(s) saved in this browser are separate from your account. Review them and select only notes that belong to you before importing.`
    :'No existing browser-only notes were found. New notes will save directly to your account.';
  if(reviewButton)reviewButton.hidden=!count;
}
reviewButton?.addEventListener('click',()=>{
  if(current.mode!=='account')return;
  closeReview();
  const notes=localNotes();
  for(const note of notes){
    if(!note||typeof note.id!=='string'||note.id.length>180)continue;
    const label=document.createElement('label');
    const check=document.createElement('input');check.type='checkbox';check.value=note.id;check.name='import-note';
    const title=document.createElement('span');title.textContent=' '+String(note.title||'Untitled note');
    label.append(check,title);
    const line=document.createElement('div');line.append(label);importList.append(line);
  }
  reviewArea.hidden=false;
  setImportStatus('Select only your own browser notes. Import does not remove the originals.');
});
importCancel?.addEventListener('click',()=>{closeReview();setImportStatus('Import cancelled. Browser notes were not changed.');});
importConfirm?.addEventListener('click',async()=>{
  if(current.mode!=='account')return;
  const ids=[...importList.querySelectorAll('input:checked')].map(input=>input.value);
  if(!ids.length){setImportStatus('Select at least one note to import.');return;}
  const confirmed=window.confirm(`Import ${ids.length} selected browser note(s) into your signed-in account? Only import your own notes. Existing account notes will not be overwritten; browser notes remain here.`);
  if(!confirmed)return;
  importConfirm.disabled=true;setImportStatus('Importing selected notes into your account…');
  try{
    await importSelected(ids);
    closeReview();setImportStatus('Import completed. Account notes refreshed. Existing account notes were not overwritten.');
  }catch(error){
    console.error('My Journey note import failed',error);
    setImportStatus('Could not complete the import. No browser notes were erased. Please try again.');
  }finally{importConfirm.disabled=false;}
});
document.addEventListener('nldg:account-notes-state',updateImport);
document.addEventListener('nldg:account-notes-lock',()=>{
  generation+=1;
  publish({mode:'loading',userId:null,notes:[],message:'Updating account access…'});
});
journeyClient.auth.onAuthStateChange((event)=>{
  if(['INITIAL_SESSION','SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event))setTimeout(load,0);
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&current.mode==='account')load();});
window.addEventListener('focus',()=>{if(current.mode==='account')load();});
load();
