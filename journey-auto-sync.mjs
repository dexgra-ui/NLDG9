import {journeyClient} from './journey-supabase-client.mjs';
const root=document.querySelector('.journey-account');
if(root){
const panel=document.createElement('section');panel.innerHTML='<h3>Automatic progress sync (preview)</h3><p>Share completed resources, series lessons, favorites and reading-plan days across signed-in devices. Private notes, prayers and reflections are excluded. Existing completion is preserved.</p><label><input id="journey-cloud-opt" type="checkbox"> Enable automatic sync on this device</label><p id="journey-cloud-status" role="status"></p>';root.append(panel);
const toggle=panel.querySelector('input'),status=panel.querySelector('#journey-cloud-status'),opt='nldg-cloud-sync-enabled-v1';
toggle.checked=localStorage.getItem(opt)==='yes';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const write=(k,v)=>{const s=JSON.stringify(v);if(localStorage.getItem(k)!==s){localStorage.setItem(k,s);return true}return false};
const union=(a,b)=>[...new Set([...a,...b])];
const good=s=>typeof s==='string'&&s.length>0&&s.length<200;
let busy=false;
async function sync(){
if(busy||!toggle.checked||document.hidden)return;busy=true;
try{
const {data:{user},error:authError}=await journeyClient.auth.getUser();
if(authError||!user){status.textContent='Sign in to synchronize.';return}
status.textContent='Checking cloud progress…';
const uid=user.id;
const [p,b,plans]=await Promise.all([journeyClient.from('journey_progress').select('content_id,lesson_id').eq('user_id',uid).eq('completed',true),journeyClient.from('journey_bookmarks').select('content_id').eq('user_id',uid),journeyClient.from('journey_reading_plans').select('plan_id,completed_days').eq('user_id',uid)]);
if(p.error||b.error||plans.error)throw p.error||b.error||plans.error;
const local=[],completed=read('nldg-completed-v1'),state=read('nldg-study-state');
if(Array.isArray(completed))completed.filter(good).forEach(content_id=>local.push({content_id,lesson_id:''}));
if(state&&typeof state==='object')Object.entries(state).forEach(([content_id,v])=>{if(good(content_id)&&v?.completed)local.push({content_id,lesson_id:''})});
for(const key of Object.keys(localStorage).filter(k=>/^nldg-(book-|series-)[a-z0-9-]+$/.test(k))){
const v=read(key);if(!Array.isArray(v?.completed))continue;
v.completed.forEach(n=>{if(/^\d{1,4}$/.test(String(n)))local.push({content_id:key,lesson_id:String(n)})});
}
const remote=p.data||[],remoteSet=new Set(remote.map(x=>JSON.stringify([x.content_id,x.lesson_id])));
const all=new Map([...remote,...local].map(x=>[JSON.stringify([x.content_id,x.lesson_id]),x]));
const missing=[...all].filter(([k])=>!remoteSet.has(k)).map(([,x])=>({...x,user_id:uid,completed:true,progress_percent:100}));
if(missing.length){const {error}=await journeyClient.from('journey_progress').upsert(missing,{onConflict:'user_id,content_id,lesson_id'});if(error)throw error}
const remoteFav=(b.data||[]).map(x=>x.content_id),localFav=read('nldg-favorites-v1'),allFav=union(remoteFav,Array.isArray(localFav)?localFav.filter(good):[]);
const favMissing=allFav.filter(x=>!remoteFav.includes(x));
if(favMissing.length){const {error}=await journeyClient.from('journey_bookmarks').upsert(favMissing.map(content_id=>({user_id:uid,content_id})),{onConflict:'user_id,content_id'});if(error)throw error}
const localPlans=read('nldg-plans-v1'),active=localPlans?.active,cloudPlans=new Map((plans.data||[]).map(x=>[x.plan_id,x.completed_days||[]]));
if(active&&good(active.id)){const days=union(cloudPlans.get(active.id)||[],active.completedDays||[]);if(days.length!==(cloudPlans.get(active.id)||[]).length){const {error}=await journeyClient.from('journey_reading_plans').upsert({user_id:uid,plan_id:active.id,completed_days:days},{onConflict:'user_id,plan_id'});if(error)throw error}cloudPlans.set(active.id,days)}
let changed=false;
changed=write('nldg-completed-v1',union(Array.isArray(completed)?completed:[],[...all.values()].filter(x=>x.lesson_id==='').map(x=>x.content_id)))||changed;
changed=write('nldg-favorites-v1',allFav)||changed;
for(const key of new Set([...all.values()].filter(x=>x.lesson_id!==''&&/^nldg-(book-|series-)/.test(x.content_id)).map(x=>x.content_id))){
const old=read(key)||{},lessons=[...all.values()].filter(x=>x.content_id===key&&/^\d+$/.test(x.lesson_id)).map(x=>Number(x.lesson_id));
changed=write(key,{...old,completed:union(Array.isArray(old.completed)?old.completed:[],lessons)})||changed;
}
if(active&&cloudPlans.has(active.id)){changed=write('nldg-plans-v1',{...localPlans,active:{...active,completedDays:union(active.completedDays||[],cloudPlans.get(active.id))}})||changed}
status.textContent=changed?'Progress imported. Refresh to update the display.':'Cloud progress is up to date.';
}catch(e){status.textContent='Sync failed; your device progress remains safe.';console.error(e)}finally{busy=false}
}
toggle.addEventListener('change',()=>{if(toggle.checked){localStorage.setItem(opt,'yes');sync()}else{localStorage.removeItem(opt);status.textContent='Sync paused on this device.'}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
window.addEventListener('focus',sync);setInterval(sync,15000);
journeyClient.auth.onAuthStateChange(()=>setTimeout(sync,0));sync();
}