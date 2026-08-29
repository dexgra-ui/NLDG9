(()=>{
  const root=document.getElementById('walking-with-jesus-root');
  if(!root)return;
  const params=new URLSearchParams(location.search);
  const week=Math.max(1,Math.min(21,Number(params.get('week')||1)));
  const spanish=params.get('lang')==='es';

  const style=document.createElement('style');
  style.textContent='.wj-map-resource{margin:1rem 0 1.5rem;padding:1.05rem 1.15rem;border:1px solid rgba(24,59,112,.16);border-left:5px solid #c79b45;border-radius:16px;background:linear-gradient(135deg,#fffaf0,#f6f8fc);box-shadow:0 8px 22px rgba(6,18,45,.05)}.wj-map-resource .kicker{margin:0 0 .25rem}.wj-map-resource h2{margin:.1rem 0 .45rem;font-size:clamp(1.25rem,2vw,1.6rem)}.wj-map-resource p{margin:.25rem 0 .8rem}.wj-map-links{display:flex;gap:.65rem;flex-wrap:wrap}.wj-map-links a{display:inline-flex;align-items:center;gap:.35rem;padding:.6rem .85rem;border-radius:999px;background:#06122d;color:#fff;text-decoration:none;font-weight:800;font-size:.9rem}.wj-map-links a.secondary{background:#fff;color:#183b70;border:1px solid rgba(24,59,112,.22)}';
  document.head.appendChild(style);

  const ministryNotes={
    5:'Cana and the first sign',7:'Samaria and Sychar',13:'Galilee and the Sea of Galilee',14:'The Sea of Galilee',17:'Bethany near Jerusalem',18:'Caesarea Philippi',19:'The approach to Jerusalem'
  };

  function addMaps(){
    if(root.querySelector('.wj-map-resource'))return true;
    const hero=root.querySelector('.wj-hero');
    const heading=root.querySelector('h1');
    if(!hero||!heading||/Loading/i.test(heading.textContent))return false;

    const section=document.createElement('section');
    section.className='wj-map-resource';
    const note=ministryNotes[week]||'the geographic setting of this Gospel journey';
    const finalWeeks=week>=19;
    section.innerHTML=spanish
      ? `<p class="kicker">Explora la geografía</p><h2>Ubica esta lección en el mapa.</h2><p>Consulta ${note}. Los mapas distinguen entre ubicaciones bien establecidas y sitios o rutas debatidos.</p><div class="wj-map-links"><a href="biblical-map-jesus-ministry.html">🗺️ Ministerio de Jesús</a>${finalWeeks?'<a class="secondary" href="biblical-map-jerusalem-jesus.html">🗺️ Jerusalén en tiempos de Jesús</a>':''}</div>`
      : `<p class="kicker">Explore the Geography</p><h2>Put this lesson on the map.</h2><p>Explore ${note}. NLDG maps distinguish well-established locations from debated sites and reconstructed routes.</p><div class="wj-map-links"><a href="biblical-map-jesus-ministry.html">🗺️ Jesus’ Ministry Map</a>${finalWeeks?'<a class="secondary" href="biblical-map-jerusalem-jesus.html">🗺️ Jerusalem in Jesus’ Time</a>':''}</div>`;
    hero.insertAdjacentElement('afterend',section);
    return true;
  }

  if(addMaps())return;
  const observer=new MutationObserver(()=>{if(addMaps())observer.disconnect();});
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  setTimeout(()=>{addMaps();observer.disconnect();},3000);
})();