/* ALIVEMAEX — shared app.js
   Läuft auf jeder Seite. Injiziert die globalen Ebenen (Korn, Dichte,
   Lichtbrechungs-Filter, Sound) und startet nur, was die Seite braucht. */

/* ---------- RELEASES: Datenfile (RAUMRISS speist hier ein / hier editieren) ---------- */
const RELEASES = [
  { title:"Boys Never Bleed", date:"2026", url:"https://open.spotify.com/artist/0aiBlkcHQ2Nqta7K7JBS3d", accent:"#1E74D9", archived:false, cover:"assets/web/cover-bnb.jpg" },
];

/* ---------- globale Ebenen injizieren ---------- */
(function inject(){
  // Filmkorn
  if(!document.querySelector('.grain')){
    const g=document.createElement('div'); g.className='grain'; document.body.appendChild(g);
  }
  // SVG-Filter (Kaustik + Lichtbrechung)
  if(!document.getElementById('caustic')){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','0'); svg.setAttribute('height','0'); svg.setAttribute('aria-hidden','true');
    svg.style.position='absolute';
    svg.innerHTML=`
      <filter id="caustic">
        <feTurbulence type="fractalNoise" baseFrequency="0.010 0.016" numOctaves="2" seed="7" result="n">
          <animate attributeName="baseFrequency" dur="52s" values="0.010 0.016;0.016 0.024;0.010 0.016" repeatCount="indefinite"/>
        </feTurbulence>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.78  0 0 0 0 0.94  0 0 0 0 0.9  0 0 0 0.9 0"/>
      </filter>
      <filter id="refract">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="4" result="w">
          <animate attributeName="baseFrequency" dur="34s" values="0.006 0.011;0.010 0.017;0.006 0.011" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="20" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="refract-soft">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="9" result="w">
          <animate attributeName="baseFrequency" dur="28s" values="0.008 0.014;0.013 0.02;0.008 0.014" repeatCount="indefinite"/>
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="9" xChannelSelector="R" yChannelSelector="G"/>
      </filter>`;
    document.body.appendChild(svg);
  }
  // Dichte-Ebene
  if(!document.querySelector('.density')){
    const d=document.createElement('div'); d.className='density';
    d.innerHTML='<div class="tint"></div><div class="milk"></div><div class="press"></div>';
    document.body.appendChild(d);
  }
  // Sound-Toggle + Audio
  if(!document.getElementById('soundtoggle')){
    const btn=document.createElement('button'); btn.id='soundtoggle'; btn.className='soundtoggle lower'; btn.setAttribute('aria-label','toggle sound');
    btn.innerHTML='<span class="eq"><i></i><i></i><i></i><i></i></span><span class="lbl">sound</span>';
    document.body.appendChild(btn);
    const au=document.createElement('audio'); au.id='track'; au.src='assets/web/boys-never-bleed.mp3'; au.loop=true; au.preload='none';
    document.body.appendChild(au);
  }
})();

/* ---------- RELEASES rendern (nur wenn #releases existiert) ---------- */
(function renderReleases(){
  const relBox=document.getElementById('releases'); if(!relBox) return;
  relBox.innerHTML = RELEASES.map(r => {
    const cov = r.cover
      ? `<img src="${r.cover}" alt="${r.title}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />`
      : '';
    const title = r.cover ? '' : `<span class="rt display">${r.title}</span>`;
    return `
    <a class="release reveal" data-cat="${r.archived ? 'archiv' : 'aktuell'}" ${r.archived ? 'style="display:none;background:'+r.accent+'"' : 'style="background:'+r.accent+'"'} href="${r.url}" target="_blank" rel="noopener">
      <div class="cov">${cov}</div>
      <div class="meta">
        <div style="display:flex;justify-content:space-between;align-items:flex-start"><span class="rname lower">alivemaex</span>${title}</div>
        <div class="rfoot"><span class="rdate lower">${r.date}</span><span class="play lower">listen</span></div>
      </div>
    </a>`; }).join('');

  // Reiter nur bei vorhandenem Archiv
  const hasArchive = RELEASES.some(r=>r.archived);
  const tabsEl = document.querySelector('.tabs');
  if(!hasArchive){ if(tabsEl) tabsEl.style.display='none'; }
  else {
    const tabBtns=document.querySelectorAll('.tab');
    tabBtns.forEach(btn=>btn.addEventListener('click',()=>{ tabBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const c=btn.dataset.tab; document.querySelectorAll('.release').forEach(r=>{ r.style.display=(r.dataset.cat===c)?'':'none'; }); }));
  }
})();

/* ---------- Visuals rendern (nur wenn #fragTiles existiert) ---------- */
(function renderVisuals(){
  const box=document.getElementById('fragTiles'); if(!box) return;
  const PHOTOS = ["assets/web/ph-239.jpg","assets/web/ph-574.jpg","assets/web/ph-497.jpg"];
  box.innerHTML = PHOTOS.map(src=>`
    <div class="tile">
      <img class="bg" src="${src}" alt="" loading="lazy" />
      <div class="grade" style="background:radial-gradient(60% 50% at 50% 30%, rgba(201,154,58,.5), transparent 70%)"></div>
    </div>`).join('');
})();

/* ---------- Reveal ---------- */
const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Hero-Parallax (nur Startseite) ---------- */
(function parallax(){
  const hc=document.querySelector('.hero-center'); if(!hc) return;
  addEventListener('scroll',()=>{ const y=scrollY; if(y<innerHeight){ hc.style.transform=`translateY(${y*0.16}px)`; hc.style.opacity=String(Math.max(0,1-y/760)); } },{passive:true});
})();

/* ---------- Dichte: Ferne wird milchig mit der Tiefe ---------- */
(function density(){
  const milk=document.querySelector('.density .milk'); if(!milk) return;
  let ticking=false;
  addEventListener('scroll',()=>{
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{
      const max=document.body.scrollHeight-innerHeight;
      const p=max>0?Math.min(1,scrollY/max):0;
      milk.style.opacity=(p*0.9).toFixed(3);
      ticking=false;
    });
  },{passive:true});
})();

/* ---------- Cursor-Taucherlicht ---------- */
(function diver(){
  const dl=document.createElement('div'); dl.className='diverlight'; document.body.appendChild(dl);
  let tx=innerWidth/2, ty=innerHeight/2, x=tx, y=ty, on=false;
  addEventListener('mousemove',e=>{ tx=e.clientX; ty=e.clientY; if(!on){on=true; dl.style.opacity='1';} },{passive:true});
  (function loop(){ x+=(tx-x)*0.08; y+=(ty-y)*0.08; dl.style.transform=`translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
})();

/* ---------- Sound-Toggle (sitewide) ---------- */
(function sound(){
  const track=document.getElementById('track'), btn=document.getElementById('soundtoggle');
  if(!track||!btn) return;
  const lbl=btn.querySelector('.lbl');
  let fadeTimer=null;
  function fadeTo(target){
    clearInterval(fadeTimer);
    fadeTimer=setInterval(()=>{
      const step=0.04, d=target-track.volume;
      if(Math.abs(d)<=step){ track.volume=target; clearInterval(fadeTimer); if(target===0) track.pause(); }
      else track.volume+=Math.sign(d)*step;
    },40);
  }
  btn.addEventListener('click',()=>{
    if(track.paused){
      track.volume=0; track.play().then(()=>{ fadeTo(0.7); btn.classList.add('playing'); lbl.textContent='sound on'; }).catch(()=>{});
    } else { fadeTo(0); btn.classList.remove('playing'); lbl.textContent='sound'; }
  });
})();

/* ---------- Hero-Video langsamer (nur Startseite) ---------- */
(function heroSpeed(){
  const v=document.querySelector('.hero-media'); if(!v) return;
  const set=()=>{ try{ v.playbackRate=0.6; }catch(e){} };
  set(); v.addEventListener('loadedmetadata',set); v.addEventListener('play',set);
})();

/* ---------- Jahr im Footer ---------- */
document.querySelectorAll('#yr').forEach(el=>el.textContent=new Date().getFullYear());
