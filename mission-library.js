(()=>{
if(window.NLDG_MISSION_LIBRARY_SCRIPT_LOADED)return;
window.NLDG_MISSION_LIBRARY_SCRIPT_LOADED=true;
const item={id:'our-mission',type:'Ministry Page',title:'Our Mission',description:'Learn why No Labels, Designed by God exists, what we believe, who we serve, and how the ministry helps people move beyond labels and grow in Christ.',url:'mission.html',category:'Ministry Information',series:'No Labels, Designed by God',scripture:['Genesis 1:27','Ephesians 2:10','Matthew 28:19-20'],book:'Various',topics:['mission','identity in Christ','image of God','discipleship','truth and grace','church resources','family ministry'],audience:['Seekers','New Believers','Families','Small Groups','Churches','Leaders'],difficulty:'All Levels',duration:5,featured:true,status:'published',publishedAt:'2026-08-01',updatedAt:'2026-08-01'};
function register(){
 if(!window.NLDG_LIBRARY)return false;
 if(!window.NLDG_LIBRARY.some(existing=>existing.id===item.id))window.NLDG_LIBRARY.push(item);
 window.NLDG_STUDIES=window.NLDG_LIBRARY.filter(entry=>entry.type==='Study'&&entry.status==='published');
 window.NLDG_CONTENT=window.NLDG_LIBRARY.filter(entry=>entry.status==='published');
 window.NLDG_MISSION_LIBRARY_LOADED=true;
 window.dispatchEvent(new Event('nldg-library-ready'));
 return true;
}
if(register())return;
window.addEventListener('nldg-library-ready',register);
let attempts=0;
const timer=setInterval(()=>{attempts++;if(register()||attempts>50)clearInterval(timer)},120);
})();
