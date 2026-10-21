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
      state.append(p,button);
      const sync=document.createElement('div');
      sync.style.marginTop='1rem';
      const upload=document.createElement('button');
      upload.type='button';upload.className='button secondary';upload.textContent='Back up study progress';
      const restore=document.createElement('button');
      restore.type='button';restore.className='button secondary';restore.textContent='Restore saved progress';
      restore.style.marginLeft='.5rem';
      sync.append(upload,restore);state.append(sync);
      const safeArray=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'&&x.length<300):[];}catch{return [];}};
      const savedIds=()=>[...new Set([...safeArray('nldg-completed-v1'),...window.NLDG_PERSONAL?.completed?.()||[]])];
      const favoriteIds=()=>[...new Set([...safeArray('nldg-favorites-v1'),...window.NLDG_PERSONAL?.favorites?.()||[]])];
      const run=async(kind)=>{
        upload.disabled=true;restore.disabled=true;
        try{
          const uid=data.user.id;
          if(kind==='upload'){
            const completed=savedIds();
            const favorites=favoriteIds();
            const {data:remote,error:readError}=await journeyClient.from('journey_progress').select('content_id').eq('user_id',uid).eq('lesson_id','').eq('completed',true);
            if(readError)throw readError;
            const missing=completed.filter(id=>!remote.some(row=>row.content_id===id));
            if(missing.length){const {error}=await journeyClient.from('journey_progress').upsert(missing.map(id=>({user_id:uid,content_id:id,lesson_id:'',completed:true,progress_percent:100})),{onConflict:'user_id,content_id,lesson_id'});if(error)throw error;}
            const {data:remoteFavorites,error:bookmarkError}=await journeyClient.from('journey_bookmarks').select('content_id').eq('user_id',uid);
            if(bookmarkError)throw bookmarkError;
            const newFavorites=favorites.filter(id=>!remoteFavorites.some(row=>row.content_id===id));
            if(newFavorites.length){const {error}=await journeyClient.from('journey_bookmarks').upsert(newFavorites.map(id=>({user_id:uid,content_id:id})),{onConflict:'user_id,content_id'});if(error)throw error;}
            show('Backed up '+completed.length+' completed resources and '+favorites.length+' bookmarks. Your local data remains untouched.');
          }else{
            const [{data:progress,error:progressError},{data:bookmarks,error:bookmarkError}]=await Promise.all([
              journeyClient.from('journey_progress').select('content_id').eq('user_id',uid).eq('lesson_id','').eq('completed',true),
              journeyClient.from('journey_bookmarks').select('content_id').eq('user_id',uid)
            ]);
            if(progressError||bookmarkError)throw progressError||bookmarkError;
            const completed=[...new Set([...safeArray('nldg-completed-v1'),...progress.map(row=>row.content_id)])];
            const favorites=[...new Set([...safeArray('nldg-favorites-v1'),...bookmarks.map(row=>row.content_id)])];
            if(!confirm('Add '+progress.length+' saved completions and '+bookmarks.length+' bookmarks to this browser? Existing browser data will be kept.'))return;
            localStorage.setItem('nldg-completed-v1',JSON.stringify(completed));
            localStorage.setItem('nldg-favorites-v1',JSON.stringify(favorites));
            show('Saved progress restored. Reload the dashboard to see updates.');
          }
        }catch(error){console.error('Journey sync failed',error);show('Sync could not finish. Your browser data was not deleted. Please try again later.');}
        finally{upload.disabled=false;restore.disabled=false;}
      };
      upload.addEventListener('click',()=>run('upload'));
      restore.addEventListener('click',()=>run('restore'));
      show('Account connected. Study completions and bookmarks can be backed up or restored manually. Reading plans, private notes and prayers stay on this browser.');
    }
  } catch {show('Account status is unavailable. You can still use My Journey without signing in.');}
}
form?.addEventListener('submit',async event=>{
  event.preventDefault();
  const email=document.getElementById('journey-account-email').value.trim();
  const button=form.querySelector('button');button.disabled=true;
  show('Requesting your secure email link…');
  try{
    const {error}=await journeyClient.auth.signInWithOtp({
      email,
      options:{emailRedirectTo:new URL('journey-auth.html',location.href).href,shouldCreateUser:true}
    });
    if(error)throw error;
    show('Check your inbox for a sign-in link. You can continue using My Journey while you wait.');
  }catch{show('Could not send a sign-in link. Please try again later.');}
  finally{button.disabled=false;}
});
journeyClient.auth.onAuthStateChange(()=>{setTimeout(render,0);});
render();
