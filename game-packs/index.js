window.NLDG_GAME_PACK_INDEX={version:'1.1.0',packs:[
{id:'general-bible',name:'General Bible',src:'game-packs/general-bible.js',status:'active',games:['scripture-or-suspicion','jeopardy','wheel','survey'],audiences:['kids','teens','adults','family','mixed']},
{id:'general-bible-expanded',name:'General Bible Expanded',src:'game-packs/general-bible-expanded.js',status:'active',games:['scripture-or-suspicion','jeopardy','wheel','survey','finish-the-verse','who-am-i'],audiences:['kids','teens','adults','family','mixed']}
]};
if(document.readyState==='loading'){
 const loaded=[...document.scripts].map(script=>script.getAttribute('src')||'');
 window.NLDG_GAME_PACK_INDEX.packs.filter(pack=>pack.status==='active'&&!loaded.some(src=>src.split('?')[0]===pack.src)).forEach(pack=>document.write(`<script src="${pack.src}?v=${window.NLDG_GAME_PACK_INDEX.version}"><\/script>`));
}
