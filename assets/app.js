/* ALIVEMAEX — shared app.js
   Läuft auf jeder Seite. Injiziert die globalen Ebenen (Korn, Dichte,
   Lichtbrechungs-Filter, Sound) und startet nur, was die Seite braucht. */

/* ---------- RELEASES: Datenfile (RAUMRISS speist hier ein / hier editieren)
   latest = neu (archived:false) · archive = Back-Katalog (archived:true)
   Cover der alten Releases kommen direkt von Spotify. ---------- */
const RELEASES = [
  { title:"Boys Never Bleed", date:"2026", url:"https://open.spotify.com/artist/0aiBlkcHQ2Nqta7K7JBS3d", cover:"assets/web/cover-bnb.jpg", archived:false },
  { title:"never the same", date:"2025", url:"https://open.spotify.com/album/5qL9vhStf41vYH2zvFYCzu", cover:"https://i.scdn.co/image/ab67616d0000b273854402ba7938f3e7b088d719", archived:true },
  { title:"herz rast", date:"2025", url:"https://open.spotify.com/album/5KpB5d7gyNJkHqXS8Ey9h1", cover:"https://i.scdn.co/image/ab67616d0000b2738cd408b6678ff1278b75d24b", archived:true },
  { title:"Betonwüstengrau", date:"2025", url:"https://open.spotify.com/album/6lFcxZ2FgCguVVCg1ShYwg", cover:"https://i.scdn.co/image/ab67616d0000b2737180861b2f03cb3af73fc18f", archived:true },
  { title:"Jemals", date:"2025", url:"https://open.spotify.com/album/0Dj3D5Lyq865JfzHwhNWIV", cover:"https://i.scdn.co/image/ab67616d0000b2730adc4391fb79e0b2fbad0c33", archived:true },
  { title:"I Hate Myself", date:"2025", url:"https://open.spotify.com/album/6tti53zmDBJ3eZbSvaAGoC", cover:"https://i.scdn.co/image/ab67616d0000b273738b31b28e687392d03bc302", archived:true },
  { title:"Kleine Dinge", date:"2024", url:"https://open.spotify.com/album/4eVZKoCeqqqZzgWlvLjESs", cover:"https://i.scdn.co/image/ab67616d0000b273dac592acb2201020a766858b", archived:true },
  { title:"Mehr Blau als Sonnenlicht", date:"2024", url:"https://open.spotify.com/album/75NZLMXHMgBq0fCuAAjPCK", cover:"https://i.scdn.co/image/ab67616d0000b2730f6a0592fee2dea82e825d09", archived:true },
  { title:"Demons", date:"2024", url:"https://open.spotify.com/album/21h2xggsTXqgpZo7lZMO6n", cover:"https://i.scdn.co/image/ab67616d0000b27385c83fbd996bfb748cb0e270", archived:true },
  { title:"Electronic Catwalk", date:"2020", url:"https://open.spotify.com/album/28mVvpQzvpqicj95ue8Qop", cover:"https://i.scdn.co/image/ab67616d0000b2737b7e94eade9f66ebc2850b4b", archived:true },
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
  // CRT / Röhren-TV
  if(!document.querySelector('.crt')){
    const c=document.createElement('div'); c.className='crt';
    c.innerHTML='<div class="lines"></div><div class="roll"></div><div class="glow"></div>';
    document.body.appendChild(c);
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
    return `
    <a class="release reveal" data-cat="${r.archived ? 'archiv' : 'aktuell'}" ${r.archived ? 'style="display:none;background:'+r.accent+'"' : 'style="background:'+r.accent+'"'} href="${r.url}" target="_blank" rel="noopener">
      <div class="cov">${cov}</div>
      <div class="rinfo">
        <span class="ri-t">${r.title}</span>
        <span class="ri-meta lower"><span>${r.date}</span><span class="ri-play">listen on spotify ↗</span></span>
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

/* ---------- Social-Icons (offizielle Logos) rendern ---------- */
(function social(){
  const SOCIAL=[
    {n:'instagram', u:'https://www.instagram.com/alivemaex', s:'instagram'},
    {n:'tiktok', u:'https://www.tiktok.com/@alivemaex', s:'tiktok'},
    {n:'spotify', u:'https://open.spotify.com/artist/0aiBlkcHQ2Nqta7K7JBS3d', s:'spotify'},
    {n:'youtube', u:'https://www.youtube.com/@ALIVEMAEX', s:'youtube'},
    {n:'soundcloud', u:'https://soundcloud.com/alivemaex', s:'soundcloud'},
  ];
  document.querySelectorAll('#social').forEach(box=>{
    box.innerHTML = SOCIAL.map(x=>`<a href="${x.u}" target="_blank" rel="noopener" aria-label="${x.n}"><img src="https://cdn.simpleicons.org/${x.s}/F4ECDA" width="22" height="22" alt="${x.n}" loading="lazy"></a>`).join('');
  });
})();

/* ---------- Marken-Badge (dein Stern) + Favicon ---------- */
(function badge(){
  const fav=document.createElement('link'); fav.rel='icon'; fav.type='image/png'; fav.href='assets/web/favicon.png'; document.head.appendChild(fav);
  document.querySelectorAll('.brand').forEach(b=>{
    if(b.querySelector('.brandmark')) return;
    const img=document.createElement('img'); img.className='brandmark'; img.src='assets/web/badge.png'; img.alt=''; img.setAttribute('aria-hidden','true');
    b.prepend(img);
  });
})();

/* ---------- YouTube-Facade: Thumbnail sichtbar, Klick spielt inline ---------- */
(function ytfacade(){
  document.querySelectorAll('.ytfacade').forEach(el=>{
    el.style.cursor='pointer';
    const load=()=>{
      const id=el.dataset.yt; if(!id || el.dataset.loaded) return; el.dataset.loaded='1';
      const ifr=document.createElement('iframe');
      ifr.src='https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
      ifr.title='ALIVEMAEX — Betonwüstengrau';
      ifr.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      ifr.setAttribute('allowfullscreen','');
      const img=el.querySelector('img'); const pb=el.querySelector('.playbtn');
      if(img) img.remove(); if(pb) pb.remove();
      el.prepend(ifr);
    };
    el.addEventListener('click',load);
    el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); load(); } });
  });
})();

/* ---------- Haupt-Reiter music / video ---------- */
(function maintabs(){
  const tabs=document.querySelectorAll('.maintab'); if(!tabs.length) return;
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active')); t.classList.add('active');
    const id=t.dataset.panel;
    document.querySelectorAll('.panel').forEach(p=>{ p.hidden = (p.id!==id); });
    document.querySelectorAll('.panel:not([hidden]) .reveal').forEach(el=>el.classList.add('in'));
  }));
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

/* ---------- Interaktion: Wasser-Ripple beim Klick/Tap ---------- */
(function ripple(){
  addEventListener('pointerdown', e=>{
    const r=document.createElement('div'); r.className='ripple';
    r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px';
    document.body.appendChild(r);
    setTimeout(()=>{ if(r.parentNode) r.parentNode.removeChild(r); }, 1500);
  }, {passive:true});
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

/* ---------- Hero-Video: robuster Autoplay-Loop (auch mobil) ---------- */
(function heroVideo(){
  const v=document.querySelector('.hero-media'); if(!v) return;
  v.muted = true; v.defaultMuted = true; v.setAttribute('muted','');
  const rate=()=>{ try{ v.playbackRate=0.6; }catch(e){} };
  const play=()=>{ const p=v.play(); if(p&&p.catch) p.catch(()=>{}); rate(); };
  v.addEventListener('loadedmetadata', play);
  v.addEventListener('canplay', play);
  play();
  // Fallback für Handys (z. B. iOS Energiesparmodus): spätestens bei erster Interaktion starten
  ['touchstart','pointerdown','scroll','click'].forEach(ev=>addEventListener(ev, play, {once:true, passive:true}));
})();

/* ---------- Alle Videos bei erster Interaktion anstoßen (Handy-Fallback) ---------- */
(function playVideos(){
  const go=()=>document.querySelectorAll('video').forEach(v=>{ try{ v.muted=true; const p=v.play(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} });
  ['touchstart','pointerdown','scroll'].forEach(ev=>addEventListener(ev, go, {once:true, passive:true}));
})();

/* ---------- Intro: beim ersten Besuch abtauchen ---------- */
(function intro(){
  try{ if(sessionStorage.getItem('amx_dived')) return; sessionStorage.setItem('amx_dived','1'); }catch(e){}
  const o=document.createElement('div'); o.className='intro';
  let bub=''; for(let i=0;i<16;i++){ const s=4+Math.random()*14,l=Math.random()*100,d=1.4+Math.random()*1.6,dl=Math.random()*1.2; bub+=`<i style="left:${l}%;width:${s}px;height:${s}px;animation-duration:${d}s;animation-delay:${dl}s"></i>`; }
  o.innerHTML='<div class="intro-caust"></div><div class="intro-bubbles">'+bub+'</div><img class="intro-badge" src="assets/web/badge.png" alt=""><div class="intro-word">alivemaex</div><div class="intro-hint">tauch ein</div>';
  document.body.appendChild(o); document.body.style.overflow='hidden';
  const done=()=>{ o.classList.add('dive'); document.body.style.overflow=''; setTimeout(()=>{ if(o.parentNode) o.remove(); },1400); };
  const t=setTimeout(done,2600);
  o.addEventListener('click',()=>{ clearTimeout(t); done(); });
})();

/* ---------- Cookie-Banner ---------- */
(function cookie(){
  try{ if(localStorage.getItem('amx_cookie')) return; }catch(e){}
  const c=document.createElement('div'); c.className='cookie';
  c.innerHTML='<p>Diese Seite verwendet nur technisch notwendige Cookies und anonyme Statistik. Mit der weiteren Nutzung stimmst du zu. <a href="impressum.html">Impressum</a></p><button type="button">Okay</button>';
  document.body.appendChild(c);
  requestAnimationFrame(()=>requestAnimationFrame(()=>c.classList.add('in')));
  c.querySelector('button').addEventListener('click',()=>{ try{ localStorage.setItem('amx_cookie','1'); }catch(e){} c.classList.remove('in'); setTimeout(()=>{ if(c.parentNode) c.parentNode.removeChild(c); },600); });
})();

/* ---------- Jahr im Footer ---------- */
document.querySelectorAll('#yr').forEach(el=>el.textContent=new Date().getFullYear());
