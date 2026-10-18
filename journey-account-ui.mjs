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
      show('Account connected. Cross-device progress sync is not enabled yet.');
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
