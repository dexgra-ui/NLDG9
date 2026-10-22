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
