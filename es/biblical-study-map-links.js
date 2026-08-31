(()=>{
 const s=window.NLDG_BOOK_STUDY,hero=document.getElementById('book-hero');
 if(!s||!hero||document.querySelector('.book-geography-resource'))return;
 if(String(s.book||'').trim().toLocaleLowerCase('es')!=='rut')return;
 const style=document.createElement('style');
 style.textContent='.book-geography-resource{margin:1rem auto 1.5rem;max-width:1180px;padding:1.05rem 1.15rem;border:1px solid rgba(24,59,112,.16);border-left:5px solid #c79b45;border-radius:16px;background:linear-gradient(135deg,#fffaf0,#f6f8fc);box-shadow:0 8px 22px rgba(6,18,45,.05)}.book-geography-resource .kicker{margin:0 0 .2rem}.book-geography-resource h2{margin:.1rem 0 .45rem;font-size:clamp(1.2rem,2vw,1.55rem)}.book-geography-resource p{margin:.25rem 0 .8rem}.book-geography-links{display:flex;gap:.6rem;flex-wrap:wrap}.book-geography-links a{display:inline-flex;align-items:center;padding:.58rem .82rem;border-radius:999px;background:#06122d;color:#fff;text-decoration:none;font-weight:800;font-size:.9rem}@media(max-width:640px){.book-geography-resource{margin:0 .85rem 1.2rem}.book-geography-links{display:grid}.book-geography-links a{justify-content:center;width:100%;box-sizing:border-box}}';
 document.head.appendChild(style);
 const section=document.createElement('section');
 section.className='book-geography-resource';section.setAttribute('aria-label','Recursos de geografía bíblica');
 section.innerHTML='<p class="kicker">Explora la geografía</p><h2>Ubica Rut en el mundo bíblico.</h2><p>Consulta las asignaciones tribales aproximadas y lugares clave sin tratar las fronteras antiguas como límites modernos exactos. El recurso cartográfico enlazado todavía está disponible solamente en inglés.</p><div class="book-geography-links"><a href="../biblical-map-tribes.html" lang="en">🗺️ Conquista y las doce tribus · inglés</a><a href="../biblical-maps.html" lang="en">Ver todos los mapas · inglés</a></div>';
 hero.insertAdjacentElement('afterend',section);
})();
